# HALF-A-BUCK — Technical Specification

**Visual System, Tile Architecture, and Platform Support**

---

## Platform Support

### Desktop
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Full keyboard controls
- Debug overlays available

### Mobile
- **Landscape-only enforcement**
- Portrait orientation shows "Rotate to Play" overlay
- Touch controls (virtual D-pad + action buttons)
- Crisp pixel scaling with integer zoom

---

## Core Visual Specification

### Resolution & Tiles
- **Tile size:** 16×16 pixels
- **Internal game resolution:** 320×180 (16:9 aspect ratio)
- **Gameplay camera view:** 20×11 tiles (320×176) + small UI/padding area
- **Rendering:** Pixel-perfect (nearest-neighbor), integer zoom, letterboxing allowed

### Sprite Sizes
- **Player sprite:** 16×24 (1 tile wide, 1.5 tiles tall)
- **Enemy sprites:** 16×24 (same as player)
- **Cardboard box:** 16×16 (1 tile)
- **Props/objects:** Variable (multiples of 16×16)

---

## Scaling System

### Integer Zoom
Uses **integer scaling only** to preserve crisp pixel art (zoom levels: 2x, 3x, 4x, etc.)

**Calculation:**
```javascript
zoom = Math.floor(Math.min(
  window.innerWidth / 320,
  window.innerHeight / 180
))
zoom = Math.max(2, zoom) // Minimum 2x on mobile if possible
```

**Letterboxing:**
Black bars added when needed to preserve exact pixel scaling (no blurring).

---

## Mobile Orientation Policy

### Landscape-Only Enforcement

Mobile devices **must** be in landscape orientation to play.

**Behavior:**
- Portrait mode: Show overlay message "Rotate to Play"
- Landscape mode: Hide overlay, enable input

**Detection:**
```javascript
function isPortrait() {
  return window.matchMedia("(orientation: portrait)").matches;
}
```

**Why landscape-only?**
- Better horizontal map visibility for stealth gameplay
- Simpler touch control layout
- Consistent UI placement across devices
- Crisp integer scaling easier to maintain

---

## Phaser Configuration

### Game Config

```javascript
// src/config/gameConfig.js
import Phaser from "phaser";

export const BASE_W = 320;
export const BASE_H = 180;

export function getIntegerZoom() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const raw = Math.min(w / BASE_W, h / BASE_H);
  const zoom = Math.max(1, Math.floor(raw)); // Integer zoom
  return zoom;
}

export function createGameConfig(scenes) {
  return {
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#000000",
    pixelArt: true,        // Critical for crisp pixels
    roundPixels: true,     // Prevent sub-pixel rendering
    scale: {
      mode: Phaser.Scale.NONE, // Manual canvas sizing
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
```

### Resize Handler

```javascript
function resize() {
  const zoom = getIntegerZoom();
  game.scale.resize(BASE_W, BASE_H);
  game.canvas.style.width = `${BASE_W * zoom}px`;
  game.canvas.style.height = `${BASE_H * zoom}px`;
}

window.addEventListener("resize", resize);
window.addEventListener("orientationchange", resize);
resize(); // Initial call
```

---

## HTML & CSS Setup

### HTML Head (index.html)

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### CSS for Pixel-Perfect Rendering

```css
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  touch-action: none; /* Prevent browser gestures */
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

/* Critical: Keep pixel art crisp */
canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

---

## Touch Controls

### Layout (Landscape Mode)

**Left side (bottom):**
- Virtual D-pad / joystick
- Size: ~20% of screen height

**Right side (bottom):**
- 4 action buttons (A, B, X, Y)
- Size: ~10-12% of screen height each
- Safe margin from edges: ~3-4%

### Button Mapping

**Mobile:**
- **A:** Interact / Knockout
- **B:** Crouch (toggle)
- **X:** Box (toggle)
- **Y:** Item (Molotov / Lighter - planned)

**Desktop:**
- **WASD / Arrow Keys:** Movement
- **Space:** Interact
- **Shift:** Crouch
- **E:** Box
- **Q:** Item (planned)

### Debug Keys (Desktop Only)
- **C:** Toggle collision overlay
- **V:** Toggle vision cone overlay
- **B:** Toggle body debug overlay
- **H:** Toggle help overlay
- **ESC:** Jump to ending scene
- **R:** Restart current scene

---

## Map & Tile System

### Current Implementation (Code-based)

The current game uses **code-based room construction** rather than Tiled JSON maps.

**Room Structure:**
- `BaseRoomScene` provides common functionality
- Individual room scenes extend BaseRoomScene
- Guards and spawn points defined in code
- Collisions handled via Phaser collision groups

### Legacy Tiled Support (Not Currently Used)

The project includes legacy support for Tiled maps:

**Tiled Map Specs:**
- Orthogonal map
- Tile size: 16×16
- Map format: JSON export

**Layer Structure:**
1. **Ground** - Base floor tiles
2. **Walls** - Collision layer
3. **Props** - Optional collision objects
4. **Overlay** - Fog/lighting effects
5. **Objects** - Spawns, triggers, patrol points

**Object Layer Conventions:**
- `player_spawn` (type: spawn)
- `guards` (type: guard) with `path` property
- `patrol` (type: patrol) named waypoints
- `locker` / `hide_zone` (type: locker/hide_zone)

**Collision:**
- Walls layer: All tiles collidable
- Props layer: Per-tile collision properties
- Triggers/spawns in Objects layer (non-collidable)

---

## Asset Loading

### Current Assets (BootScene)

**Sprites:**
- `gabe_front` — Player facing forward (32px sprites)
- `gabe_back` — Player facing back
- `gabe_left` — Player facing left
- `gabe_right` — Player facing right
- `gabe_box` — Player in cardboard box
- `soldier1_front/back/left/right` — Guard sprites (32px)
- `overseer_front/back/left/right` — Overseer guard sprites

**Maps:**
- Legacy: `warehouse.json` (Tiled tilemap - not currently used)
- Legacy: `warehouse_tiles.png` (16×16 tileset - not currently used)

**Audio:**
- `intro_music` — Title screen music (MP3)
- `gameover_sound` — Game over sound effect (MP3)
- Additional music tracks in `/public/assets/` ready for integration

---

## Room Architecture

### BaseRoomScene

All room scenes extend `BaseRoomScene` which provides:
- Vision system integration
- Input handling (keyboard + touch)
- Exit zone detection and transitions
- Common UI (detection meter, debug overlays)
- Guard spawning helpers

### Individual Room Scenes

**CellScene:**
- Starting room
- No guards
- Single exit to corridor

**CorridorScene:**
- 1 Regular Guard
- Narrow hallway layout
- Exits to cell (back) and warehouse (forward)

**WarehouseMainScene:**
- 3 Guards (Regular, Lead, Overseer)
- Large open area with room divisions
- Multiple patrol paths
- Exit to wine cellar (planned)

---

## Performance Considerations

### Optimization Strategies

**Vision System:**
- Ray-casting limited to 18 steps per guard
- Vision calculations only when player is near
- Graphics clearing and redrawing each frame (minimal overhead at 320×180)

**Physics:**
- Arcade physics (lightweight)
- Collision checks only on active entities
- Guard collision disabled when knocked out

**Rendering:**
- Low resolution (320×180) keeps draw calls minimal
- Pixel art requires no anti-aliasing
- Integer scaling prevents subpixel calculations

**Mobile:**
- Touch control overlay is DOM-based (outside canvas)
- Landscape-only reduces layout complexity
- Integer zoom prevents scaling artifacts

---

## Debug System

### Overlay Toggles

**C — Collision Overlay:**
Shows physics collision boxes for player, guards, walls.

**V — Vision Overlay:**
Shows guard vision cones and detection meters.

**B — Body Overlay:**
Shows knocked-out guard status (when implemented).

**H — Help Overlay:**
Shows control scheme and debug key reference.

---

## File Structure

```
halfabuck/
├── public/
│   └── assets/
│       ├── sprites/           # Character spritesheets
│       ├── tiles/             # Tileset images (legacy)
│       ├── maps/              # Tiled JSON maps (legacy)
│       └── *.mp3              # Audio files
├── src/
│   ├── main.js                # Entry point
│   ├── config/
│   │   └── gameConfig.js      # Phaser config
│   ├── scenes/
│   │   ├── BootScene.js       # Asset preload
│   │   ├── IntroScene.js      # Title screen
│   │   ├── BaseRoomScene.js   # Room base class
│   │   ├── GameOverScene.js   # Failure state
│   │   ├── EndingScene.js     # Victory state
│   │   └── rooms/
│   │       ├── CellScene.js
│   │       ├── CorridorScene.js
│   │       └── WarehouseMainScene.js
│   ├── entities/
│   │   ├── Player.js          # Player class
│   │   ├── Guard.js           # Base guard class
│   │   ├── LeadGuard.js       # Lead guard variant
│   │   └── Overseer.js        # Overseer variant
│   ├── systems/
│   │   ├── stateMachine.js    # State machine
│   │   ├── visionSystem.js    # Vision & detection
│   │   └── input.js           # Input aggregation
│   ├── ui/
│   │   └── touchControls.js   # Touch UI overlay
│   └── utils/
│       └── orientation.js     # Orientation detection
└── index.html
```

---

## Build & Deploy

See `DEPLOY.md` for deployment instructions.

**Build Command:**
```bash
npm run build
```

**Local Development:**
```bash
npm run dev
```

**Preview Production Build:**
```bash
npm run preview
```

---

**Technical Spec Version:** 1.0
**Last Updated:** Based on current implementation
**Framework:** Phaser 3.90.0
