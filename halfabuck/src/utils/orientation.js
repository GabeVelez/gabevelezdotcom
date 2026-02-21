export function isPortrait() {
  return window.matchMedia("(orientation: portrait)").matches;
}

export function updateOrientationOverlay() {
  const overlay = document.getElementById("rotate-overlay");
  if (!overlay) return;
  overlay.style.display = isPortrait() ? "flex" : "none";
}
