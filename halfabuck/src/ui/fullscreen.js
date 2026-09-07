/**
 * Fullscreen handling.
 *
 * Two very different situations:
 *
 * - Android Chrome, desktop, and iPad support the Fullscreen API, so the first
 *   tap can quietly request it and the browser chrome disappears.
 *
 * - iPhone Safari does not implement the Fullscreen API for elements at all
 *   (only `video.webkitEnterFullscreen`). There is no way to hide the tab bar
 *   from inside a page. The only route to a genuinely chrome-less game is Add
 *   to Home Screen, which launches it standalone. So on iPhone we show a small
 *   one-time hint instead of pretending a button will work.
 */

const HINT_DISMISSED_KEY = "hab_fs_hint_dismissed";

export function supportsFullscreen() {
  const el = document.documentElement;
  return !!(el.requestFullscreen || el.webkitRequestFullscreen);
}

export function isStandalone() {
  // navigator.standalone is the iOS signal; display-mode covers the rest.
  return (
    window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches
  );
}

function isFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

async function enterFullscreen() {
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!req) return false;
  try {
    await req.call(el, { navigationUI: "hide" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Ask for fullscreen on the player's first touch, which is the gesture browsers
 * require. Silently does nothing where unsupported.
 */
export function requestFullscreenOnFirstTouch() {
  if (!supportsFullscreen() || isStandalone()) return;

  const tryOnce = async () => {
    if (!isFullscreen()) await enterFullscreen();
    // One attempt only. If the player leaves fullscreen deliberately, respect it.
    window.removeEventListener("pointerdown", tryOnce);
  };

  window.addEventListener("pointerdown", tryOnce, { once: false });
}

/**
 * iPhone Safari only: a dismissible line explaining the Home Screen route.
 * Shown once, then remembered.
 */
export function showHomeScreenHintIfNeeded() {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (!isTouch || isStandalone() || supportsFullscreen()) return;

  let dismissed = false;
  try {
    dismissed = localStorage.getItem(HINT_DISMISSED_KEY) === "1";
  } catch {
    // Private mode can throw on access; treat as not dismissed.
  }
  if (dismissed) return;

  const hint = document.createElement("div");
  hint.id = "fs-hint";
  hint.innerHTML = `
    <span>For fullscreen: tap <strong>Share</strong>, then <strong>Add to Home Screen</strong></span>
    <button type="button" aria-label="Dismiss">✕</button>
  `;
  document.body.appendChild(hint);

  const dismiss = () => {
    hint.remove();
    try {
      localStorage.setItem(HINT_DISMISSED_KEY, "1");
    } catch {
      // Nothing we can do; the hint simply reappears next time.
    }
  };
  hint.querySelector("button").addEventListener("click", dismiss);

  // Get out of the way on its own if the player ignores it.
  setTimeout(dismiss, 12000);
}
