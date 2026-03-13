# Half-a-Buck Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

### In Progress
- Alert broadcast system (guards respond to other guards)
- Performance-based rankings and stats
- Additional levels beyond warehouse

---

## [0.3.0] - 2026-02-24

### Added - SVG Collision System
- **SVGCollisionParser** utility for loading collision from SVG files
- Collision designed in Figma, exported as lightweight SVG (~700 bytes per scene)
- Automatic caching system for instant subsequent loads
- Rotation transform support (handles Figma's `rotate(-90)` exports)
- Debug visualization toggle (C key shows/hides collision rectangles in red)
- Complete technical documentation in `SVG_COLLISION_SYSTEM.md`

### Added - Sewer Scene
- New transitional level between cell and corridor (288×192)
- Player lands here after falling through hole in cell
- Safe area with no guards
- Ladder exit to warehouse corridor
- Uses SVG collision system

### Added - Asset Organization
- New directory structure: `public/assets/collision/`, `scenes/`, `audio/`
- Scene-specific subdirectories for better organization
- Collision files: `cell-collision.svg`, `sewer-collision.svg`, `corridor-collision.svg`
- Background images organized by scene

### Changed - Controls
- Item pickup key changed from **E** to **G**
- Added number key indicators for inventory (1, 2, 3)
- Inventory slots now clearly labeled in UI

### Changed - Guard Patrols
- Corridor guard now uses rectangular loop pattern (down → right → up → left)
- Guard starts at top-left position, walks down first (visible to player on entry)
- More strategic patrol pattern with clear timing windows

### Changed - Scene Dimensions
- Cell: Updated to 15×10 tiles (240×160), offset (40, 10)
- Sewer: Updated to 18×12 tiles (288×192), offset (16, -6)
- More accurate scene measurements documented

### Added - Entry Direction System
- Scenes now handle entry direction (north, south, east, west)
- Player spawns at appropriate entrance based on which exit was used
- Smoother transitions between scenes

### Fixed - UI Loading
- UI hidden by default with inline styles (prevents FOUC)
- Async scene initialization prevents white flash on load
- Proper orientation detection timing
- UI only shown during gameplay scenes (not title/game over)

### Fixed - Cardboard Box Positioning
- Box positioned 0.5 tiles right to properly cover hole in cell
- Exit zone aligned directly under cardboard box
- Collision properly prevents player from reaching hole until box is collected

### Performance
- SVG collision files cached after first load (~3KB total for all scenes)
- Instant loading on subsequent scene visits
- No re-fetching or re-parsing of collision data

### Documentation
- Updated `DESIGN.md` with current level flow and SVG collision info
- Updated `TECHNICAL.md` with SVG system architecture and controls
- Updated `README.md` with current features and controls
- Updated `IMPLEMENTATION_NOTES.md` with progress tracking
- Added `SVG_COLLISION_SYSTEM.md` for complete technical specification
- Added this `CHANGELOG.md` for tracking changes

---

## [0.2.0] - 2026-02-21

### Added - Inventory System
- 3-slot inventory with visual display in bottom UI
- Item collection with G key (visual prompt appears when near items)
- Number keys (1, 2, 3) to select/use inventory slots
- Cardboard box as collectible item (not automatic ability)

### Added - Sound Effects
- Item pickup sound (`confirm-tap.mp3`)
- Cardboard box toggle sound (`paper-slide.mp3`)
- Sound system with toggle button in UI

### Added - Cell Escape Mechanic
- Hole in floor covered by cardboard box prop
- Collect box to reveal escape hole
- Fall-through animation with shrink, fade, delay, and landing effects
- Cinematic transition to corridor scene

### Changed - Game Flow
- Cell → Corridor → Warehouse (multi-room progression)
- Exit zones with scene transitions
- Entry/exit positioning system

### Fixed - Collision Issues
- Standardized player collision box across all directions
- Added narrow right wall collision in corridor
- Pink collision map for sewer scene
- Cardboard box collision in cell

---

## [0.1.0] - 2026-02-20

### Initial Implementation
- Core stealth gameplay loop
- Guard AI with A* pathfinding (easystarjs)
- Vision cone system with ray-casting
- Detection meter (fills when spotted, drains when hidden)
- Three guard types: Regular, Lead, Overseer
- Player movement states: walk, crouch, box
- Game over on full detection
- Victory ending scene
- Touch controls for mobile (landscape-only)
- Debug overlays: collision (C), vision (V), help (H)
- Intro scene with title screen
- Warehouse scene with multiple guards

### Guard AI States
- PATROL — Follow waypoint paths
- SUSPICIOUS — Investigate at 33% detection
- ALERT — Full detection at 100% → Game Over
- Enhanced states: INVESTIGATE, CHASE, SEARCH

### Technical
- Phaser 3.90.0
- 320×180 resolution (16:9)
- Integer scaling for pixel-perfect rendering
- Landscape-only mobile support
- Retro 16-bit aesthetic

---

## Version Numbering

This project uses [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API/gameplay changes
- **MINOR** version for new features (backwards-compatible)
- **PATCH** version for bug fixes (backwards-compatible)

Current version: **0.3.0** (pre-release, in development)

---

**Project:** Half-a-Buck
**Last Updated:** 2026-02-24
**Author:** Gabe Velez
