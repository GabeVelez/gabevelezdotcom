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
- **Guard AI** — Three enemy types with distinct behaviors and patrol patterns
- **Multi-Room Levels** — Navigate from prison cell → corridor → warehouse
- **Cardboard Box** — Hide in a box to avoid detection
- **Game Over Mechanics** — Full detection triggers game over with sound effects
- **Mobile Support** — Landscape-only touch controls with virtual D-pad
- **Sound System** — Intro music and sound effects with toggle button
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
- **E** — Toggle cardboard box
- **Space** — Interact (reserved for future use)

### Debug Keys (Desktop)
- **C** — Toggle collision overlay
- **V** — Toggle vision cone overlay
- **B** — Toggle body debug overlay
- **H** — Toggle help overlay
- **R** — Restart scene
- **ESC** — Skip to ending

### Mobile
- **Virtual D-pad** — Move in 8 directions
- **Button X** — Toggle box
- **Buttons A, B, Y** — Reserved for future use

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
- Box mechanic: Guards ignore stationary boxes (move slowly while boxed)
- Walls block line of sight using ray-casting

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

1. **The Cell** — Tutorial room with no guards
2. **Corridor** — First stealth challenge with 1 guard
3. **Warehouse Main** — 3 guards with overlapping patrol routes

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
- Multi-room architecture with transitions
- Guard AI with patrol behaviors
- Player state machine (walk, box)
- Sound system and mobile controls
- Game over and victory conditions

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
