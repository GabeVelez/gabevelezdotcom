/**
 * Mobile Handheld Shell
 *
 * On coarse-pointer devices in landscape, the game stops being a canvas floating
 * in the middle of a black page and becomes the screen of a retro handheld:
 *
 *   +---------------------------------------------------+
 *   |  LVL 1: Cell                          DETECTION    |
 *   |               +----------------------+ [########]  |
 *   |   +-+         |                      |             |
 *   | +-+ +-+       |     GAME SCREEN      |    [ 1 ]    |
 *   | |  +  |       |     (full height)    |    [ 2 ]    |
 *   | +-+ +-+       |                      |    [ 3 ]    |
 *   |   +-+         +----------------------+             |
 *   |  (sound)                                           |
 *   +---------------------------------------------------+
 *
 * Each column reads top to bottom as "what you look at, then what you press".
 *
 * Everything lives inside one grid, so the HUD and the controls can no longer
 * overlap the play area the way three independently-positioned fixed overlays did.
 * There is no bottom bar: the readout moved into the left column, which hands the
 * screen the chassis's full height.
 *
 * There is no action button either. Items are picked up by walking to them, and
 * the slots on the right are the only things to press: tap to use, tap to revert.
 *
 * Desktop is untouched: the shell simply never activates.
 */

// Minimum hold applied to a tap so a fast press can never be dropped between
// two Phaser frames (input.js reads these as edge triggers).
const TAP_PULSE_MS = 120;

// Fraction of the d-pad half-width that registers as "no direction".
const DPAD_DEADZONE = 0.22;

// Must match the .hh-bezel border-width in styles.css.
const BEZEL_BORDER = 3;

export function isCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function createMobileShell() {
  const state = {
    up: false, down: false, left: false, right: false,
    slot1: false, slot2: false, slot3: false,
    enabled: false,
  };

  // ?handheld=1 forces the shell on so the mobile layout can be checked from a
  // desktop browser, where pointer:coarse never matches.
  const forced = new URLSearchParams(window.location.search).has("handheld");
  const active = forced || isCoarsePointer();

  // Desktop: hand back an inert shell so callers don't have to branch everywhere.
  if (!active) {
    return {
      active: false,
      state,
      setEnabled() {},
      setControlsActive() {},
      setHudVisible() {},
      fitScreen: () => null,
      root: null,
    };
  }

  // ---------------------------------------------------------------- structure

  const root = document.createElement("div");
  root.id = "handheld";
  root.innerHTML = `
    <div class="hh-body">
      <div class="hh-left">
        <div class="hh-readout"></div>
        <div class="hh-control">
        <div class="hh-dpad" aria-label="Direction pad">
          <span class="hh-pad hh-pad-corner"></span>
          <span class="hh-pad hh-pad-up">▲</span>
          <span class="hh-pad hh-pad-corner"></span>
          <span class="hh-pad hh-pad-left">◀</span>
          <span class="hh-pad hh-pad-mid"></span>
          <span class="hh-pad hh-pad-right">▶</span>
          <span class="hh-pad hh-pad-corner"></span>
          <span class="hh-pad hh-pad-down">▼</span>
          <span class="hh-pad hh-pad-corner"></span>
        </div>
        </div>
        <div class="hh-sound"></div>
      </div>

      <div class="hh-screen">
        <div class="hh-bezel"></div>
      </div>

      <div class="hh-right">
        <div class="hh-meter"></div>
        <div class="hh-control"><div class="hh-slots"></div></div>
        <div class="hh-foot"></div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const screenEl = root.querySelector(".hh-screen");
  const bezelEl = root.querySelector(".hh-bezel");
  const readoutEl = root.querySelector(".hh-readout");
  const meterEl = root.querySelector(".hh-meter");
  const soundWrapEl = root.querySelector(".hh-sound");
  const slotsWrapEl = root.querySelector(".hh-slots");
  const leftEl = root.querySelector(".hh-left");
  const rightEl = root.querySelector(".hh-right");
  const dpadEl = root.querySelector(".hh-dpad");

  // Redistribute the desktop HUD bar into the chassis instead of keeping it as
  // a strip across the bottom. Each column reads top to bottom as "what you are
  // looking at, then what you press": level name over the d-pad on the left,
  // detection meter over the item slots on the right. #bottom-ui itself is
  // dropped. Every element keeps its id, so GameUI's getElementById lookups
  // still resolve.
  const gameEl = document.getElementById("game");
  if (gameEl) bezelEl.appendChild(gameEl);

  const levelLabel = document.getElementById("level-label");
  const detection = document.getElementById("detection-container");
  const soundToggle = document.getElementById("sound-toggle");
  const inventory = document.getElementById("inventory-container");

  if (levelLabel) readoutEl.appendChild(levelLabel);
  if (detection) meterEl.appendChild(detection);
  if (soundToggle) soundWrapEl.appendChild(soundToggle);
  if (inventory) slotsWrapEl.appendChild(inventory);

  // Whatever is left (the "Press H for help" keyboard hint) has no place on a
  // phone, and the empty bar would otherwise still reserve layout space.
  document.getElementById("bottom-ui")?.remove();

  // ------------------------------------------------------------------- d-pad
  // Tracked at the container level rather than per-cell so a thumb can slide
  // between directions without lifting, and so corners give free diagonals.

  let padPointerId = null;

  // Gates every control surface. False on menus and cutscenes so a stray thumb
  // on the dimmed chassis can't feed input into a scene that isn't gameplay.
  let controlsActive = false;
  const canPress = () => state.enabled && controlsActive;

  function clearDirections() {
    state.up = state.down = state.left = state.right = false;
    dpadEl.querySelectorAll(".hh-pad").forEach((p) => p.classList.remove("is-down"));
  }

  function readPad(e) {
    const r = dpadEl.getBoundingClientRect();
    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);

    state.left = nx < -DPAD_DEADZONE;
    state.right = nx > DPAD_DEADZONE;
    state.up = ny < -DPAD_DEADZONE;
    state.down = ny > DPAD_DEADZONE;

    dpadEl.querySelector(".hh-pad-up").classList.toggle("is-down", state.up);
    dpadEl.querySelector(".hh-pad-down").classList.toggle("is-down", state.down);
    dpadEl.querySelector(".hh-pad-left").classList.toggle("is-down", state.left);
    dpadEl.querySelector(".hh-pad-right").classList.toggle("is-down", state.right);
  }

  dpadEl.addEventListener("pointerdown", (e) => {
    if (!canPress()) return;
    e.preventDefault();
    padPointerId = e.pointerId;
    // Capture keeps a sliding thumb bound to the pad. Not fatal if it fails.
    try { dpadEl.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    readPad(e);
  });

  dpadEl.addEventListener("pointermove", (e) => {
    if (padPointerId !== e.pointerId) return;
    e.preventDefault();
    readPad(e);
  });

  const endPad = (e) => {
    if (padPointerId !== e.pointerId) return;
    padPointerId = null;
    clearDirections();
  };
  dpadEl.addEventListener("pointerup", endPad);
  dpadEl.addEventListener("pointercancel", endPad);

  // -------------------------------------------------------- tappable slots
  // The inventory slots are the item buttons. Stacked under the right thumb,
  // tapping slot 1 hides in the box and slot 2 throws smoke. The number on the
  // slot is the same number the desktop keyboard uses, so there is one shared
  // vocabulary instead of console lettering that matched nothing.

  function bindSlotTap(el, key) {
    let pulseTimer = null;

    el.addEventListener("pointerdown", (e) => {
      if (!canPress()) return;
      e.preventDefault();
      state[key] = true;
      el.classList.add("is-down");

      // Guarantee the press survives at least one game frame.
      clearTimeout(pulseTimer);
      pulseTimer = setTimeout(() => {
        state[key] = false;
        el.classList.remove("is-down");
      }, TAP_PULSE_MS);
    });
  }

  const slotEls = slotsWrapEl.querySelectorAll(".inventory-slot");
  ["slot1", "slot2", "slot3"].forEach((key, i) => {
    if (slotEls[i]) {
      slotEls[i].classList.add("hh-tappable");
      bindSlotTap(slotEls[i], key);
    }
  });

  // ------------------------------------------------------------------ layout

  /**
   * Size the screen well to the largest 16:9 box that fits the centre column,
   * then report the canvas size and the well's viewport rect.
   *
   * The bezel is sized to the canvas rather than the other way round, so the
   * "screen" always hugs the game instead of leaving dead black bands inside
   * the rim when the chassis and the 320x180 canvas disagree on aspect.
   *
   * Returns null when the shell is hidden (portrait, or desktop).
   */
  function fitScreen(baseW, baseH) {
    if (!state.enabled) return null;

    const availW = screenEl.clientWidth - BEZEL_BORDER * 2;
    const availH = screenEl.clientHeight - BEZEL_BORDER * 2;
    if (availW < 1 || availH < 1) return null;

    const scale = Math.min(availW / baseW, availH / baseH);
    const w = Math.max(1, Math.round(baseW * scale));
    const h = Math.max(1, Math.round(baseH * scale));

    bezelEl.style.width = `${w + BEZEL_BORDER * 2}px`;
    bezelEl.style.height = `${h + BEZEL_BORDER * 2}px`;

    const r = bezelEl.getBoundingClientRect();
    return { w, h, x: r.left, y: r.top, width: r.width, height: r.height };
  }

  function setEnabled(v) {
    state.enabled = v;
    root.style.display = v ? "block" : "none";
    document.body.classList.toggle("has-handheld", v);
    if (!v) {
      clearDirections();
      state.slot1 = state.slot2 = state.slot3 = false;
    }
  }

  /**
   * The d-pad and item slots appear only once a gameplay scene is
   * running. The title screen and the cutscene show the bare chassis with the
   * screen lit and nothing else, so there is no dead furniture around the art.
   *
   * The sound toggle is deliberately exempt: it is a device control, and it has
   * to be reachable while the title music is playing.
   */
  function setControlsActive(v) {
    controlsActive = v;
    leftEl.classList.toggle("is-idle", !v);
    rightEl.classList.toggle("is-idle", !v);
    if (!v) {
      clearDirections();
      state.slot1 = state.slot2 = state.slot3 = false;
    }
  }

  function setHudVisible(v) {
    readoutEl.classList.toggle("is-hidden", !v);
    meterEl.classList.toggle("is-hidden", !v);
  }

  setEnabled(false);
  setControlsActive(false);
  setHudVisible(false);

  return {
    active: true,
    state,
    setEnabled,
    setControlsActive,
    setHudVisible,
    fitScreen,
    root,
  };
}
