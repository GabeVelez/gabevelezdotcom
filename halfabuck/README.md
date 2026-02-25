# Half-a-Buck

**A 16-bit pure stealth game built with Phaser.js**

You wake up in a compound controlled by the HATE Brigade. Your mission: escape using pure stealth tactics.

**Mission: Critical**

Play at: [gabevelez.com/halfabuck](https://gabevelez.com/halfabuck)

---

## Features

### Current Implementation

- **Pure Stealth Gameplay** — Avoid guard vision cones to progress through rooms
- **Detection System** — Dynamic detection meters that fill when spotted, drain when hidden
- **Guard AI** — Three enemy types with distinct behaviors, A* pathfinding, and coordinated patrols
- **Multi-Room Levels** — Navigate from prison cell → corridor → warehouse
- **Item Collection** — 3-slot inventory system with collectible items
- **Cardboard Box Mechanic** — Find and collect a cardboard box, then hide inside to avoid detection
- **Hole Escape** — Fall through a hole in the cell floor to escape (with landing animation)
- **Game Over Mechanics** — Full detection triggers game over with sound effects
- **Mobile Support** — Landscape-only touch controls with virtual D-pad
- **Sound System** — Intro music, item pickup, box toggle, and ambient sound effects with toggle button
- **Debug Tools** — Collision, vision, and help overlays for development

### In Development & Testing Needed

- **Alert broadcast system** — Guards respond when another guard detects you
- **Guard response behavior** — Different aggression levels based on guard type
- Additional levels with increasing difficulty
- Tuning and balancing detection/alert mechanics

---

## Controls

### Desktop
- **WASD / Arrow Keys** — Move
- **G** — Pick up items (interact)
- **1, 2, 3** — Select/use inventory slots
- **Shift** — Crouch (legacy, may be removed)

### Debug Keys (Desktop)
- **C** — Toggle collision overlay (shows SVG collision rectangles)
- **V** — Toggle vision cone overlay
- **B** — Toggle body debug overlay
- **H** — Toggle help overlay
- **R** — Restart scene
- **ESC** — Skip to ending

### Mobile
- **Virtual D-pad** — Move in 8 directions
- **Button A** — Pick up items
- **Button X** — Use inventory slot 1 (cardboard box)
- **Button Y** — Use inventory slot 2
- **Button B** — Crouch (legacy)

**Note:** Mobile requires landscape orientation.

---

## Installation

### Requirements
- Node.js 18+ recommended

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
halfabuck/
├── public/assets/           # Game assets (sprites, audio, maps)
├── src/
│   ├── main.js              # Entry point
│   ├── config/              # Phaser configuration
│   ├── scenes/              # Game scenes (intro, rooms, endings)
│   │   └── rooms/           # Individual room scenes
│   ├── entities/            # Player and guard classes
│   ├── systems/             # Core systems (vision, AI, input)
│   └── ui/                  # Touch controls and overlays
├── DESIGN.md                # Game design document
├── TECHNICAL.md             # Technical specification
└── DEPLOY.md                # Deployment guide
```

---

## Game Design

### Stealth Mechanics

**Detection System:**
- Guards have cone-shaped vision based on facing direction
- Detection meter fills when player is in view
- Cardboard box mechanic: Find and collect a box, then hide inside (guards ignore stationary boxes)
- Move slowly while boxed (32 px/sec vs 80 px/sec walking)
- Walls block line of sight using ray-casting

**Item System:**
- 3-slot inventory displayed in bottom UI with number indicators (1, 2, 3)
- Press G to pick up items (visual prompt appears when near)
- Number keys (1, 2, 3) to select/use inventory slots
- Cardboard box: Collectible item found in the cell, used for hiding from guards
- Sound effects: Confirm-tap for pickup, paper-slide for box toggle

**Collision System:**
- SVG-based collision designed in Figma
- Collision rectangles defined visually, exported as tiny SVG files (~700 bytes each)
- Automatic caching for instant loading on subsequent plays
- Debug visualization with C key (shows collision boundaries in red)

**Alert System (In Development):**
- When one guard fully detects you, other guards are alerted
- Guards move toward the alert location
- Different guard types respond with different aggression levels

**Enemy Types:**
- **Regular Guard** — Moderate speed and vision
- **Lead Guard** — Faster movement, wider vision cone
- **Overseer** — Slowest but longest vision range, most aggressive detection

**AI States:**
- **Patrol** — Follow waypoint paths
- **Suspicious** — Investigate player (33% detection)
- **Alert** — Player fully detected (100%) → Game Over + Alert broadcast
- **Responding** — Move to alert location (in development)

### Current Levels

1. **The Cell** — Starting prison cell with a hole in the floor covered by a cardboard box. Collect the box to reveal the escape hole, then fall through to the sewer below (with cinematic landing animation). No guards (safe tutorial space).

2. **The Sewer** — Dark transitional space beneath the cell. Player lands here after falling. No guards (safe area). Ladder exit leads to warehouse corridor. Teaches basic navigation.

3. **Warehouse Corridor** — Long corridor with stacked crates. 1 Regular Guard with rectangular patrol loop (down → right → up → left). First real stealth challenge. Guard visible immediately when player enters from sewer.

4. **Warehouse Main** — Large warehouse with 3 guards (Regular, Lead, Overseer) with overlapping patrol routes and coordinated AI. Most challenging level.

### Planned Levels

Additional stealth levels with increasing guard density and patrol complexity to be designed.

---

## Technical Details

- **Engine:** Phaser.js 3.90.0
- **Resolution:** 320×180 (16:9) with integer scaling
- **Tile Size:** 16×16 pixels
- **Sprite Size:** 16×24 pixels (player and guards)
- **Platform:** HTML5 (browser-based)
- **Mobile:** Landscape-only with touch controls

See [TECHNICAL.md](TECHNICAL.md) for complete technical specification.

---

## Design Philosophy

**Pure Stealth** — No combat, no knockouts—only evasion
**Simplified Mechanics** — Walk and hide in boxes, nothing more
**Minimal Scope** — 10-20 minute playtime when complete
**Retro Aesthetic** — 16-bit pixel art inspired by SNES-era stealth games
**Mission-Focused** — Straightforward escape mission with no narrative twists

See [DESIGN.md](DESIGN.md) for complete game design document.

---

## Deployment

The game is configured for GitHub Pages deployment at `/halfabuck/` path.

See [DEPLOY.md](DEPLOY.md) for deployment instructions.

---

## Development Status

### ✅ Complete
- Core stealth loop (detection, vision, movement)
- Multi-room architecture with transitions (Cell → Sewer → Corridor → Warehouse)
- Entry direction system for proper player spawning between scenes
- Guard AI with A* pathfinding and enhanced states
- Rectangular patrol patterns for more strategic gameplay
- Player state machine (walk, crouch, box, detected)
- Item collection system (3-slot inventory with number indicators)
- Cardboard box mechanic (collectible + hiding)
- Hole escape from cell with fall/landing animations
- Sound system with pickup/toggle effects and mobile controls
- Game over and victory conditions
- **SVG-based collision system:**
  - Design collision in Figma
  - Export as SVG (~700 bytes per scene)
  - Automatic parsing and caching
  - Debug visualization (C key toggle)
- Asset reorganization (collision/, scenes/ subdirectories)
- UI improvements (hidden by default, no FOUC)

### 🚧 In Progress
- Alert broadcast system (guards respond to alerts)
- Guard response behaviors based on type
- Balancing and tuning detection mechanics

### 📋 Planned
- Additional stealth levels
- Performance-based rankings
- Speed run mode
- Hard mode with tighter patrols

---

## License

Personal project by Gabe Velez

---

**HALF-A-BUCK**
*Mission: Critical*
