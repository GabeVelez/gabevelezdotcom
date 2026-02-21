/**
 * Touch Controls (Landscape-only)
 * Lightweight DOM overlay scaffold (so it's easy to iterate).
 *
 * Emits an object each frame:
 * {
 *   up, down, left, right,
 *   a, b, x, y
 * }
 */
export function createTouchControls() {
  const state = {
    up: false, down: false, left: false, right: false,
    a: false, b: false, x: false, y: false,
    enabled: false,
  };

  // Root overlay container
  const root = document.createElement("div");
  root.id = "touch-ui";
  root.style.position = "fixed";
  root.style.inset = "0";
  root.style.pointerEvents = "none"; // only buttons capture events
  root.style.zIndex = "9000";

  // Helpers
  function makeBtn(label, onDown, onUp) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.pointerEvents = "auto";
    btn.style.border = "2px solid rgba(255,255,255,0.7)";
    btn.style.background = "rgba(0,0,0,0.35)";
    btn.style.color = "#fff";
    btn.style.fontFamily = "monospace";
    btn.style.fontSize = "12px";
    btn.style.borderRadius = "999px";
    btn.style.width = "52px";
    btn.style.height = "52px";
    btn.style.touchAction = "none";

    const down = (e) => { e.preventDefault(); onDown(); };
    const up = (e) => { e.preventDefault(); onUp(); };

    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);
    btn.addEventListener("pointerout", up);
    return btn;
  }

  // Left cluster: D-pad (simple 4 buttons, easy MVP)
  const left = document.createElement("div");
  left.style.position = "absolute";
  left.style.left = "3%";
  left.style.bottom = "6%";
  left.style.display = "grid";
  left.style.gridTemplateColumns = "52px 52px 52px";
  left.style.gridTemplateRows = "52px 52px 52px";
  left.style.gap = "8px";
  left.style.pointerEvents = "none";

  const spacer = () => {
    const s = document.createElement("div");
    s.style.width = "52px";
    s.style.height = "52px";
    return s;
  };

  const upBtn = makeBtn("↑", () => state.up = true, () => state.up = false);
  const leftBtn = makeBtn("←", () => state.left = true, () => state.left = false);
  const rightBtn = makeBtn("→", () => state.right = true, () => state.right = false);
  const downBtn = makeBtn("↓", () => state.down = true, () => state.down = false);

  // Allow events on the buttons only
  [upBtn, leftBtn, rightBtn, downBtn].forEach(b => b.style.pointerEvents = "auto");

  left.appendChild(spacer());
  left.appendChild(upBtn);
  left.appendChild(spacer());
  left.appendChild(leftBtn);
  left.appendChild(spacer());
  left.appendChild(rightBtn);
  left.appendChild(spacer());
  left.appendChild(downBtn);
  left.appendChild(spacer());

  // Right cluster: A/B/X/Y
  const right = document.createElement("div");
  right.style.position = "absolute";
  right.style.right = "3%";
  right.style.bottom = "6%";
  right.style.display = "grid";
  right.style.gridTemplateColumns = "52px 52px";
  right.style.gridTemplateRows = "52px 52px";
  right.style.gap = "10px";
  right.style.pointerEvents = "none";

  const aBtn = makeBtn("A", () => state.a = true, () => state.a = false);
  const bBtn = makeBtn("B", () => state.b = true, () => state.b = false);
  const xBtn = makeBtn("X", () => state.x = true, () => state.x = false);
  const yBtn = makeBtn("Y", () => state.y = true, () => state.y = false);

  [aBtn, bBtn, xBtn, yBtn].forEach(b => b.style.pointerEvents = "auto");

  right.appendChild(xBtn);
  right.appendChild(yBtn);
  right.appendChild(aBtn);
  right.appendChild(bBtn);

  root.appendChild(left);
  root.appendChild(right);
  document.body.appendChild(root);

  function setEnabled(v) {
    state.enabled = v;
    root.style.display = v ? "block" : "none";
  }

  // default enabled only for touch devices
  const isTouch = matchMedia("(pointer: coarse)").matches;
  setEnabled(isTouch);

  return { state, setEnabled, root };
}
