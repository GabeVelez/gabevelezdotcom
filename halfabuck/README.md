# Half a Buck

A stealth-based escape game built with Phaser 3. Wake up imprisoned in a cell and escape through increasingly secure areas of a corporate warehouse facility.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173/halfabuck/

## Documentation

All documentation is organized in the `/docs` folder:

### Core Systems
- **[SVG_SYSTEMS.md](docs/SVG_SYSTEMS.md)** - Collision and exits/spawns systems using SVG files
- **[GUARDS.md](docs/GUARDS.md)** - Guard types, AI, behaviors, and current placements
- **[STORY_AND_FLOW.md](docs/STORY_AND_FLOW.md)** - Game narrative, scene progression, and atmosphere

### Development
- **[TECHNICAL.md](docs/TECHNICAL.md)** - Technical architecture and systems
- **[DESIGN.md](docs/DESIGN.md)** - Game design philosophy and mechanics
- **[IMPLEMENTATION_NOTES.md](docs/IMPLEMENTATION_NOTES.md)** - Implementation details and decisions
- **[GUARD_SYSTEM.md](docs/GUARD_SYSTEM.md)** - Detailed guard AI system documentation

### Features
- **[BOX_MECHANIC_TEST.md](docs/BOX_MECHANIC_TEST.md)** - Box hiding mechanic testing notes
- **[CUTSCENE_DESIGN.md](docs/CUTSCENE_DESIGN.md)** - Cutscene system design
- **[CUTSCENE_GENERATION_GUIDE.md](docs/CUTSCENE_GENERATION_GUIDE.md)** - How to create cutscenes
- **[CUTSCENE_SOUND_MAP.md](docs/CUTSCENE_SOUND_MAP.md)** - Sound effects mapping for cutscenes

### Project
- **[CHANGELOG.md](docs/CHANGELOG.md)** - Version history and changes
- **[CHANGES_v2.0.md](docs/CHANGES_v2.0.md)** - Major v2.0 update details
- **[DEPLOY.md](docs/DEPLOY.md)** - Deployment instructions

## Game Features

### Stealth Mechanics
- Line-of-sight detection system
- Guard AI with patrol routes and investigation behavior
- Hiding in boxes
- Smoke grenades for cover
- Memory/learning system for guards

### Scenes (8 implemented)
1. **Cell** - Starting area, tutorial
2. **Sewer** - Underground transition
3. **Warehouse Corridor** - First guard encounter
4. **Warehouse Main** - Central hub
5. **Storage Bay** - Item collection area
6. **Loading Dock** - Open warehouse area
7. **Security Office** - Keycard puzzle area
8. **Maintenance Tunnel** - Infrastructure area

### Items
- Cardboard Box - Hide from guards
- Smoke Grenade - Create cover
- Security Keycard - Unlock doors

## Tech Stack

- **Engine:** Phaser 3
- **Build Tool:** Vite
- **Physics:** Arcade Physics
- **Pathfinding:** EasyStar.js
- **Assets:** SVG collision/exits, PNG sprites

## SVG-Based Systems

### Collision System
All collision boundaries defined in SVG files for easy editing and precise control.

**Example:**
```bash
public/assets/collision/
  ├── cell-collision.svg
  ├── sewer-collision.svg
  ├── warehouse-main-collision.svg
  └── ...
```

### Exits/Spawns System
Enter/exit zones and spawn points color-coded in SVG:
- Blue rectangles = Enter zones (return to previous scene)
- Blue circles = Enter spawn points
- Black rectangles = Exit zones (progress forward)
- Black circles = Exit spawn points

**Benefits:** Tiny file size (3.3KB for all 8 scenes), easy to edit, git-friendly, precise positioning

See [SVG_SYSTEMS.md](docs/SVG_SYSTEMS.md) for full documentation.

## Project Structure

```
halfabuck/
├── docs/                  # All documentation
├── public/
│   └── assets/
│       ├── collision/     # SVG collision boundaries
│       ├── exits/         # SVG exits and spawn points
│       ├── images/        # Scene backgrounds, sprites
│       ├── cutscenes/     # Cutscene frames
│       └── sounds/        # Audio files
├── src/
│   ├── entities/          # Game objects (Player, Guards, Items)
│   ├── scenes/
│   │   ├── rooms/         # Game scenes
│   │   └── ...            # Menu, cutscene scenes
│   ├── systems/           # Core game systems
│   └── utils/             # SVG parsers, helpers
└── index.html
```

## Controls

- **Arrow Keys / WASD** - Move
- **E** - Interact with items
- **SPACE** - Enter/exit box
- **V** - Toggle vision debug
- **B** - Toggle physics debug
- **H** - Toggle help overlay
- **ESC** - Return to menu

## Development Status

**Current Version:** 2.0+
**Status:** In Development

**Completed:**
- ✅ SVG collision system for all scenes
- ✅ SVG exits/spawns system for all scenes
- ✅ 8 playable scenes
- ✅ Guard AI with detection, chase, search states
- ✅ Item collection (box, smoke grenade, keycard)
- ✅ Locked door system
- ✅ Scene testing menu

**In Progress:**
- 🔄 Guard placement for mid-game scenes
- 🔄 Executive Wing scene
- 🔄 Rooftop Helipad scene (final level)

**TODO:**
- ⬜ Failure states and respawn system
- ⬜ Victory cutscene
- ⬜ Sound design for all scenes
- ⬜ Narrative text/dialogue
- ⬜ Additional items and mechanics

## Contributing

This is a personal project, but documentation improvements are welcome!

## License

[Add license information]

## Credits

- **Game Engine:** Phaser 3
- **Developer:** [Your name]
- **Pathfinding:** EasyStar.js
