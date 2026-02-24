export function isPortrait() {
  // Check both CSS media query and actual window dimensions
  const mediaQueryPortrait = window.matchMedia("(orientation: portrait)").matches;
  const dimensionPortrait = window.innerHeight > window.innerWidth;

  // Use dimension check as primary (more reliable)
  return dimensionPortrait;
}

export function updateOrientationOverlay() {
  const overlay = document.getElementById("rotate-overlay");
  if (!overlay) return;
  overlay.style.display = isPortrait() ? "flex" : "none";
}
