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
- **A:** Pick up items
- **B:** Crouch (toggle) - legacy, may be removed
- **X:** Inventory slot 1 (cardboard box)
- **Y:** Inventory slot 2

**Desktop:**
- **WASD / Arrow Keys:** Movement
- **G:** Pick up items (interact)
- **Shift:** Crouch (toggle) - legacy, may be removed
- **1, 2, 3:** Select/use inventory slots
- **Space:** Reserved for future use

### Debug Keys (Desktop Only)
- **C:** Toggle collision overlay (shows/hides red collision rectangles from SVG)
- **V:** Toggle vision cone overlay
- **B:** Toggle body debug overlay
- **H:** Toggle help overlay
- **ESC:** Jump to ending scene
- **R:** Restart current scene

**Note:** Collision overlay (C key) shows the SVG collision rectangles in red at 30% opacity when enabled. This is useful for debugging collision boundaries defined in Figma.

---

## SVG Collision System

### Overview

The game uses an **SVG-based collision system** for defining collision boundaries. This approach allows collision to be designed visually in Figma and exported as SVG files, making it easier to iterate on level layouts.

### How It Works

**1. Design in Figma:**
- Create a frame matching the scene dimensions (e.g., 320×320 for corridor)
- Draw rectangles to define collision areas (walls, obstacles, barriers)
- Rectangles can be rotated (system handles `rotate(-90)` transforms)
- Export as SVG

**2. Place in Assets:**
- Save SVG files in `public/assets/collision/`
- Naming convention: `{scene-name}-collision.svg`
- Current files:
  - `cell-collision.svg` (652 bytes)
  - `corridor-collision.svg` (1.6 KB)
  - `sewer-collision.svg` (705 bytes)

**3. Parser Loads Collision:**
```javascript
// In scene's create() method
const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
  this,
  "assets/collision/cell-collision.svg",
  offsetX,  // Scene X offset
  offsetY   // Scene Y offset
);

// Store for collision and vision system
this.collisionBodies = collisionBodies;
```

**4. Automatic Caching:**
- First load: SVG fetched and parsed
- Subsequent loads: Instant retrieval from cache
- Cache persists for entire game session

### SVG Parser Features

**Supported Elements:**
- `<rect>` elements with x, y, width, height attributes
- Rotated rectangles with `transform="rotate(-90 cx cy)"` (Figma export format)
- Multiple rectangles per file (walls, barriers, props)

**Created Physics Bodies:**
- Static physics bodies (immovable)
- Rectangular collision shapes
- Positioned according to scene offsets
- Initially invisible (toggled with C key for debug)

**Performance:**
- Parsing happens once per SVG file (cached)
- Minimal overhead: ~3KB total for all collision files
- No runtime re-parsing

### Debug Visualization

**Toggle with C key:**
- Shows collision rectangles in red at 30% opacity
- Hidden by default during gameplay
- Useful for verifying collision boundaries match visual design

### Implementation Details

```javascript
// SVGCollisionParser.js
export class SVGCollisionParser {
  static _cache = new Map();  // Cache for parsed data

  // Parse SVG and create physics bodies
  static async parseAndCreateBodies(scene, svgPath, offsetX, offsetY) {
    // 1. Fetch SVG file (or use cached data)
    // 2. Parse XML to extract <rect> elements
    // 3. Handle transform rotations
    // 4. Create Phaser.GameObjects.Rectangle with physics
    // 5. Return array of collision bodies
  }
}
```

### Advantages Over Tiled Maps

**Simpler Workflow:**
- Design collision visually in Figma
- No need to learn Tiled map editor
- Instant preview in design tool

**Smaller File Sizes:**
- SVG files are tiny (~700 bytes each)
- No tileset images needed for collision-only scenes
- Faster loading

**Easier Iteration:**
- Modify rectangles in Figma
- Export new SVG
- Refresh game (automatic cache invalidation in dev)

**Flexible Layouts:**
- Not constrained to tile grid
- Precise pixel-perfect positioning
- Rotated collision boxes supported

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

**Scene Backgrounds:**
- `cell_layout` — Cell background image (240×160)
- `sewer_layout` — Sewer background image (288×192)
- `corridor_layout` — Corridor background image (320×320)

**Collision Files:**
- `cell-collision.svg` — Cell collision rectangles (652 bytes)
- `corridor-collision.svg` — Corridor collision rectangles (1.6 KB)
- `sewer-collision.svg` — Sewer collision rectangles (705 bytes)

**Maps:**
- Legacy: `warehouse.json` (Tiled tilemap - not currently used)
- Legacy: `warehouse_tiles.png` (16×16 tileset - not currently used)

**Audio:**
- `intro_music` — Title screen music (MP3)
- `gameover_sound` — Game over sound effect (MP3)
- `confirm_tap` — Item pickup sound
- `paper_slide` — Cardboard box toggle sound
- Additional music tracks in `/public/assets/audio/` ready for integration

**UI Assets:**
- Sound toggle icons (muted/unmuted)
- Touch control overlays

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
- Starting prison cell (240×160)
- No guards (safe tutorial space)
- Cardboard box collectible covering hole in floor
- Exit hole in bottom-right leads to sewer (fall animation)
- Uses SVG collision system

**SewerScene:**
- Dark transitional space beneath cell (288×192)
- Player lands here after falling from cell
- No guards (safe area)
- Ladder exit to warehouse corridor
- Uses SVG collision system

**WarehouseCorridorScene:**
- Long corridor with stacked crates (320×320)
- 1 Regular Guard with rectangular patrol loop
- Guard starts at top-left, walks down first (visible to player on entry)
- Patrol pattern: down → right → up → left → repeat
- First real stealth challenge
- Exit leads to warehouse main
- Uses SVG collision system

**WarehouseMainScene:**
- Large warehouse area with room divisions
- 3 Guards (Regular, Lead, Overseer)
- Multiple patrol paths and vision overlaps
- Exit to final escape area (planned)
- Uses legacy tilemap system (will migrate to SVG)

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
│       ├── collision/         # SVG collision files (NEW)
│       │   ├── cell-collision.svg
│       │   ├── corridor-collision.svg
│       │   └── sewer-collision.svg
│       ├── scenes/            # Scene background images
│       │   ├── cell/
│       │   │   └── cell_layout.png
│       │   ├── sewer/
│       │   │   └── sewer_layout.png
│       │   └── corridor/
│       │       └── corridor_layout.png
│       ├── sprites/           # Character spritesheets
│       ├── audio/             # Sound effects and music
│       ├── ui/                # UI assets (buttons, icons)
│       ├── tiles/             # Tileset images (legacy)
│       └── maps/              # Tiled JSON maps (legacy)
├── src/
│   ├── main.js                # Entry point
│   ├── styles.css             # Global styles
│   ├── config/
│   │   └── gameConfig.js      # Phaser config
│   ├── scenes/
│   │   ├── BootScene.js       # Asset preload
│   │   ├── IntroScene.js      # Title screen
│   │   ├── BaseRoomScene.js   # Room base class
│   │   ├── GameOverScene.js   # Failure state
│   │   ├── EndingScene.js     # Victory state
│   │   ├── SurroundedScene.js # Surrounded/caught state
│   │   └── rooms/
│   │       ├── CellScene.js
│   │       ├── SewerScene.js          # NEW
│   │       ├── WarehouseCorridorScene.js
│   │       └── WarehouseMainScene.js
│   ├── entities/
│   │   ├── Player.js          # Player class
│   │   ├── Guard.js           # Base guard class
│   │   ├── LeadGuard.js       # Lead guard variant
│   │   ├── Overseer.js        # Overseer variant
│   │   └── Item.js            # Collectible item class
│   ├── systems/
│   │   ├── stateMachine.js    # State machine
│   │   ├── visionSystem.js    # Vision & detection
│   │   ├── inventorySystem.js # Inventory management
│   │   └── input.js           # Input aggregation
│   ├── ui/
│   │   ├── touchControls.js   # Touch UI overlay
│   │   └── gameUI.js          # HTML UI overlay (NEW)
│   └── utils/
│       ├── orientation.js     # Orientation detection
│       └── SVGCollisionParser.js  # SVG collision parser (NEW)
├── index.html
├── DESIGN.md                  # Game design document
├── TECHNICAL.md               # This file
├── README.md                  # Project readme
├── IMPLEMENTATION_NOTES.md    # Implementation notes
└── DEPLOY.md                  # Deployment guide
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
