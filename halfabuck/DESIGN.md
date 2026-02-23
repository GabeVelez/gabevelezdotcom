# HALF-A-BUCK: Mission Critical

**16-Bit Pure Stealth Game**

---

## Core Concept

You wake up inside a mysterious compound controlled by the **HATE Brigade**.

**Your mission:** Escape.

**Tone:** Retro 16-bit pure stealth thriller. No tricks, no surprises—just you versus the guards.

---

## Platform & Tech Stack

- **Target Platform:** HTML5 (Browser-based)
- **Framework:** Phaser.js
- **Hosting:** GitHub Pages (via gabevelez.com/halfabuck)
- **Visual Style:** Clean 16-bit top-down stealth aesthetic (SNES-era inspired)
- **Art Style:** Pixel art with 16×16 tiles, 16×24 character sprites

---

## Opening

Simple title screen.

```
HALF-A-BUCK
MISSION: CRITICAL

PRESS START
```

---

## Game Start

Top-down gameplay activates immediately.

Player wakes up in a cell.

```
UNKNOWN LOCATION
CONTROLLED BY: HATE BRIGADE
MISSION: ESCAPE
```

**STATUS: ACTIVE**

---

## Gameplay Design

### Perspective
Top-down stealth view

### Core Mechanics

**Movement:**
- Walk (normal speed: 80 px/sec)
- Crouch (slower: 48 px/sec) - hold Shift
- Cardboard box concealment (slowest: 32 px/sec)

**Item Collection:**
- 3-slot inventory system
- Press E to pick up items (visual prompt appears when near)
- Cardboard box: Must be found and collected before use

**Stealth Tactics:**
- Avoid guard vision cones
- Collect and use cardboard box to hide (guards ignore stationary boxes)
- Navigate patrol patterns and use A* pathfinding-aware guard behavior
- Stay out of sight

**Core Rule:** Pure evasion. No combat, no knockouts—just stealth.

---

## Detection System

### Vision Cones
Each guard has a cone-shaped field of view based on their facing direction.

**Detection Meter:**
- Fills when player is in vision cone
- Fills slower if player is stationary or in a box
- Drains quickly when player exits vision
- Wall blocking uses ray-casting to prevent detection through walls

**Detection Thresholds:**
- **0-33%:** No reaction
- **33%:** Guard becomes SUSPICIOUS (investigates)
- **100%:** Guard reaches ALERT → GAME OVER

### Alert System (To Be Implemented)

When a guard reaches **ALERT** state:
- **Alert broadcast:** Nearby guards receive the alert
- **Response behavior:** Guards move toward the alert location
- **Aggression levels:** Different guard types respond differently:
  - **Regular Guard:** Moderate speed response
  - **Lead Guard:** Fast response, aggressive pursuit
  - **Overseer:** Slower response but maintains position longer

**Design Goals:**
- Create cascading detection risk
- Make guard types feel distinct in their threat level
- Force player to consider escape routes when detected
- Balance needs playtesting and tuning

### Enemy Types

**Regular Guard**
- Speed: 42 px/sec
- Vision: 88 units, 80° angle
- Detection: Moderate (1200ms to fill, 900ms to drain)

**Lead Guard**
- Speed: 52 px/sec
- Vision: 100 units, 100° angle
- Detection: Fast (800ms to fill, 1000ms to drain)
- More aggressive patrol patterns

**Overseer Soldier**
- Speed: 34 px/sec (slowest)
- Vision: 120 units (longest), 60° angle (narrow)
- Detection: Very fast (600ms to fill, 1200ms to drain)
- Most dangerous opponent

---

## Enemy AI States

### Patrol (Default)
Follows predefined waypoint paths. Animates based on direction (up/down/left/right).

### Suspicious
Triggered when detection reaches 33%. Guard investigates briefly (1200ms), then returns to patrol.

### Alert
Triggered at 100% detection. Guard triggers Game Over and broadcasts alert to nearby guards.

### Responding (Planned)
Guards who receive an alert move toward the alert location. Speed and aggression depend on guard type.

### Returning
Transition state back to patrol route after alert timeout.

---

## Level Structure

### Current Implementation

**Level 1: The Cell**
- Starting prison cell with single background image
- Hole in floor covered by a cardboard box collectible
- Tutorial for movement and item collection
- Collect the cardboard box to reveal the escape hole
- Fall through hole with cinematic animation (shrink, fade, delay, pop-up landing)
- No guards - safe tutorial space

**Level 2: Corridor**
- Long hallway connecting cell to warehouse
- 1 Regular Guard with A* pathfinding patrol
- First stealth challenge
- Teaches cardboard box hiding mechanic

**Level 3: Warehouse Main**
- Large warehouse area with room divisions
- 3 Guards (Regular, Lead, Overseer) with enhanced AI
- A* pathfinding with obstacle avoidance
- Waypoint network navigation
- Multiple patrol paths and vision overlaps
- Guards coordinate and track last known player position
- Exit leads to wine cellar (planned)

### Planned Levels

**Additional levels to be designed based on core stealth mechanics.**

Possibilities:
- Wine cellar or storage areas
- Industrial corridors with more complex layouts
- Multi-floor facilities
- Outdoor escape routes

Focus: Pure stealth challenge with increasing guard density and patrol complexity.

---

## Final Scene

Player reaches the exit.

Text:

```
MISSION COMPLETE

ESCAPE SUCCESSFUL
```

**Final Stats Screen:**
- TIME
- DETECTIONS
- ALERTS TRIGGERED
- STATUS: [Based on performance]

Simple, clean victory.

---

## Current Implementation Status

### ✅ Implemented
- Multi-room level architecture with transitions
- Guard AI with A* pathfinding (easystarjs library)
- Enhanced guard states: PATROL, SUSPICIOUS, INVESTIGATE, CHASE, SEARCH, ALERT
- Obstacle avoidance and waypoint network navigation
- Last known position tracking and guard coordination
- Detection meter system (visual + text feedback)
- Vision cone system with wall ray-casting
- Multiple guard types with distinct behaviors
- Player movement states (walk, crouch, box, detected)
- 3-slot inventory system with item collection
- Cardboard box mechanic (collectible item + hiding)
- Hole escape from cell with fall/landing animations
- Sound effects: item pickup (confirm-tap), box toggle (paper-slide)
- Sound system with toggle control
- Touch controls for mobile (landscape-only)
- Game over condition on full detection
- Victory ending scene
- Debug overlays (collision, vision, help)

### 🧪 Needs Implementation & Testing
- **Alert broadcast system:** Guards respond to alerts from other guards (partially implemented)
- **Guard response behavior:** Different movement patterns based on guard type
- **Alert aggression tuning:** Balance response speed and behavior
- Cardboard box detection tuning (guards should ignore stationary boxes)
- Additional inventory items and interactive objects

### ❌ Removed from Scope
- Knockout mechanics (not part of pure stealth vision)
- Body dragging (removed)
- Birthday narrative (simplified to pure escape mission)
- Environmental puzzles (Molotov, lighter mechanics)

---

## MVP Scope

**Minimum Viable Version Includes:**
- 3-5 playable stealth rooms
- Full detection and vision system
- Guard AI with patrol patterns and alert response
- Player stealth mechanics (walk, box)
- Simple intro screen
- Game over and victory scenes
- Mobile touch controls
- Basic sound effects and music

**Target Playtime:** 10-20 minutes

---

## Future Expansion Ideas

- **Hard Mode:** Tighter patrols, faster detection, more aggressive alerts
- **Speed Run Timer:** Leaderboard integration
- **Additional Levels:** More complex compounds with varied layouts
- **New Game+:** Harder difficulty with different guard placements

---

## Art Direction

**Character Sprite:**
- Simple pixel Gabe
- Slightly exaggerated head
- Dark clothing for stealth theme
- 16×24 sprite size
- 4 directions with walk animations

**Guards:**
- Generic soldier silhouettes
- Vision cone indicators
- Distinct sprites for guard types
- Flashlight or vision cone visual

**Environment:**
- Dark industrial floors
- Metal/concrete walls
- Shadow corners
- 16×16 tiles
- Minimal but atmospheric

**Keep asset count minimal.**

---

**Project Name:**
HALF-A-BUCK
Mission: Critical
