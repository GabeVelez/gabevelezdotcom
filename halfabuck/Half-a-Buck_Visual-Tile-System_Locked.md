# HALF-A-BUCK --- Visual + Tile System (LOCKED)

## Web Game (Desktop + Mobile) --- Mobile: Landscape-Only

**Decision locked:** Mobile is **landscape-only** for best stealth
visibility and crisp integer scaling.

------------------------------------------------------------------------

## 1) Core Visual Spec (Locked)

-   **Tile size:** 16×16
-   **Internal game resolution:** 320×180 (16:9)
-   **Gameplay camera view:** 20×11 tiles (320×176) + small UI/padding
    area
-   **Player sprite:** 16×24 (1 tile wide, 1.5 tiles tall)
-   **Enemy sprites:** 16×24
-   **Cardboard box:** 16×16
-   **Rendering:** pixel-perfect (nearest-neighbor), integer zoom,
    letterboxing allowed

------------------------------------------------------------------------

## 2) Mobile Orientation Policy (Locked)

-   Mobile is **landscape-only**.
-   If device is portrait, show an overlay: **"Rotate your phone to
    play."**
-   This keeps:
    -   better playability (more horizontal map visibility)
    -   simpler scaling
    -   consistent UI placement

------------------------------------------------------------------------

## 3) Scaling Rules

-   Use **integer zoom** only (2--6 typical).
-   Choose zoom based on the largest integer scale that fits within the
    viewport:
    -   `zoom = floor(min(width/320, height/180))`
    -   clamp zoom to at least 2 on mobile if possible
-   Use **letterboxing** (black bars) if needed to preserve crisp
    pixels.

------------------------------------------------------------------------

## 4) Phaser Config (Copy/Paste)

> Notes: - `pixelArt: true` and `roundPixels: true` are important. - We
> compute integer `zoom` on resize. - We keep the internal canvas
> 320×180 and scale using zoom.

``` js
// src/config/gameConfig.js
import Phaser from "phaser";

export const BASE_W = 320;
export const BASE_H = 180;

export function getIntegerZoom() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const raw = Math.min(w / BASE_W, h / BASE_H);
  const zoom = Math.max(1, Math.floor(raw)); // integer zoom
  return zoom;
}

export function createGameConfig(scenes) {
  return {
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#000000",
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.NONE,   // we'll manually size canvas
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: BASE_W,
      height: BASE_H,
    },
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
    scene: scenes,
  };
}

// In your main entry:
//
// const game = new Phaser.Game(createGameConfig([IntroScene, WarehouseScene, ...]));
//
// function resize() {
//   const zoom = getIntegerZoom();
//   game.scale.resize(BASE_W, BASE_H);
//   game.canvas.style.width = `${BASE_W * zoom}px`;
//   game.canvas.style.height = `${BASE_H * zoom}px`;
// }
//
// window.addEventListener("resize", resize);
// resize();
```

------------------------------------------------------------------------

## 5) HTML + CSS (GitHub Pages Friendly)

### index.html head essentials

``` html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### CSS for crisp pixels + centered canvas

``` css
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  touch-action: none; /* prevent browser gestures */
  -webkit-user-select: none;
  user-select: none;
}

#game {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Important: keep pixel art crisp */
canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

------------------------------------------------------------------------

## 6) Landscape-Only "Rotate Phone" Overlay

### Behavior

-   If screen is portrait: show overlay
-   If landscape: hide overlay + allow input

``` js
function isPortrait() {
  return window.matchMedia("(orientation: portrait)").matches;
}

function updateOrientationOverlay() {
  const overlay = document.getElementById("rotate-overlay");
  const portrait = isPortrait();
  overlay.style.display = portrait ? "flex" : "none";
}

window.addEventListener("resize", updateOrientationOverlay);
window.addEventListener("orientationchange", updateOrientationOverlay);
updateOrientationOverlay();
```

### Overlay HTML (simple)

``` html
<div id="rotate-overlay">
  <div class="rotate-card">
    <div class="rotate-title">Rotate to Play</div>
    <div class="rotate-sub">Half-a-Buck is landscape-only.</div>
  </div>
</div>
```

### Overlay CSS

``` css
#rotate-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  color: #fff;
  display: none; /* toggled via JS */
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.rotate-card {
  font-family: monospace;
  text-align: center;
  padding: 16px 20px;
  border: 2px solid #fff;
  max-width: 280px;
}

.rotate-title {
  font-size: 18px;
  margin-bottom: 8px;
}
.rotate-sub {
  font-size: 12px;
  opacity: 0.9;
}
```

------------------------------------------------------------------------

## 7) Touch Controls (Landscape Layout Spec)

### Control Zones (Thumb-safe)

-   **Left bottom:** Virtual D-pad / joystick
-   **Right bottom:** 4 action buttons

Recommended sizes (scaled visually, not pixels): - Joystick base: \~20%
of screen height - Buttons: \~10--12% of screen height each - Keep a
safe margin from edges: \~3--4%

### Button Mapping (Mobile)

-   **A:** Interact / Knockout
-   **B:** Crouch
-   **X:** Box
-   **Y:** Item (Molotov / Lighter)

Desktop mapping can be: - WASD / arrows - Space = Interact - Shift =
Crouch - E = Box - Q = Item

------------------------------------------------------------------------

## 8) Tiled Map Specs (Locked)

-   Orthogonal map
-   Tile size: 16×16
-   Layers:
    1.  Ground
    2.  Walls (collision)
    3.  Props (optional collision)
    4.  Overlay (fog/lighting)
    5.  Objects (spawns, triggers, patrol points)

Collision: - Walls layer: collidable tiles - Props layer: mark
collidable tiles as needed - Triggers/spawns in Objects layer

------------------------------------------------------------------------

## 9) Final Locked Summary

-   **16×16** tiles
-   **320×180** internal resolution
-   **16×24** characters
-   **Integer zoom** + crisp pixel scaling
-   **Landscape-only on mobile** with rotate overlay
-   **Tiled** maps with layered collisions + objects

------------------------------------------------------------------------

Next: We can implement the **Phaser project skeleton** (scenes,
entities, systems) and wire up: - resize + letterboxing - rotate
overlay - keyboard + touch input scaffolding
