# Guard System Documentation

## Guard Types

### 1. Guard (Regular)
**Class:** `Guard`
**Speed:** 42 pixels/frame
**Sprite:** `guard-front`
**Behavior:**
- Basic patrol guard
- Follows patrol waypoints in sequence
- AI States: PATROL → SUSPICIOUS → INVESTIGATE → CHASE → SEARCH → ALERT
- Detection system with memory and learning
- Can be knocked out and hidden

### 2. Lead Guard
**Class:** `LeadGuard`
**Speed:** 52 pixels/frame (faster than regular)
**Sprite:** `guard-front` (same as regular)
**Behavior:**
- Enhanced guard with faster movement
- Same AI states as regular guard
- More difficult to evade due to speed
- Higher threat level

### 3. Overseer
**Class:** `Overseer`
**Speed:** 34 pixels/frame (slower than regular)
**Sprite:** `overseer-front`
**Behavior:**
- Special guard type with unique sprite
- Slower movement speed
- Same AI capabilities as other guards
- Often used as stationary or limited patrol sentries
- First introduced in Executive Wing scene

## Guard AI States

1. **PATROL** - Following waypoint path
2. **SUSPICIOUS** - Detected something unusual
3. **INVESTIGATE** - Moving to investigate a disturbance
4. **CHASE** - Actively pursuing the player
5. **SEARCH** - Lost sight of player, searching area
6. **ALERT** - Calling for backup/raising alarm
7. **RESPONDING** - Responding to another guard's alert
8. **RETURNING** - Returning to patrol route

## Guard Features

### Detection & Vision
- Line-of-sight detection system
- Vision cones with configurable range
- Detection percentage that increases when player is in sight
- Memory system - remembers last known player position
- Awareness levels (0-3): normal → heightened → alert → extreme

### Learning & Adaptation
- Tracks detection count (how many times player was spotted)
- Stores suspicious areas where player was detected
- Awareness decays over time if player isn't seen
- Can share information with other guards (alert system)

### Pathfinding
- A* pathfinding using EasyStar.js
- Dynamic path calculation to chase player
- Obstacle avoidance
- Stuck detection and recovery

## Current Guard Placements

### Warehouse Corridor Scene
**Guard 1** (Regular)
- Spawn: (130, 80)
- Patrol: Rectangular loop
  - (130, 80) → (130, 200) → (160, 200) → (160, 160) → (160, 80) → back to start

### Executive Wing Scene
**Guard 1** (Regular) - Front entrance patrol
- Spawn: (150, 100)
- Patrol: (150, 100) → (150, 200)

**Guard 2** (LeadGuard) - Left wing patrol
- Spawn: (200, 160)
- Patrol: (200, 100) → (200, 220)

**Guard 3** (LeadGuard) - Right wing patrol (synchronized opposite)
- Spawn: (400, 220)
- Patrol: (400, 220) → (400, 100)

**Guard 7** (Overseer) - Guards exit (FIRST OVERSEER INTRODUCTION)
- Spawn: (512, 96)
- Patrol: (496, 96) → (528, 96) (minimal movement, guards exit)

### Rooftop Helipad Scene
**Guard 1** (Regular) - Outer ring patrol (clockwise)
- Spawn: (160, 160) + rooftop offset
- Patrol: Clockwise rectangle around outer perimeter

**Guard 2** (Regular) - Inner ring patrol (counter-clockwise)
- Spawn: (200, 200) + rooftop offset
- Patrol: Counter-clockwise rectangle around inner area

**Guard 3** (LeadGuard) - North perimeter patrol
- Spawn: (120, 80) + rooftop offset
- Patrol: (120, 80) → (360, 80)

**Guard 4** (LeadGuard) - South perimeter patrol
- Spawn: (120, 400) + rooftop offset
- Patrol: (120, 400) → (360, 400)

**Guard 8** (Overseer) - Helicopter overwatch (guards victory point)
- Spawn: (240, 240) + rooftop offset
- Patrol: (220, 240) → (260, 240) (minimal movement, guards helicopter)

## Guard Placement Guide

### Creating Guards in Code
```javascript
import { Guard, LeadGuard, Overseer } from "../../entities/Guard.js";

// Regular guard with patrol path
const guard1 = new Guard(this, x, y, [
  { x: x1, y: y1 },
  { x: x2, y: y2 },
  { x: x3, y: y3 }
]);
guard1.setDepth(10);
this.guards.push(guard1);

// Lead guard (faster)
const guard2 = new LeadGuard(this, x, y, pathPoints);

// Overseer (slower, special sprite)
const guard3 = new Overseer(this, x, y, pathPoints);
```

### Using PNG for Guard Placement (Recommended)
Create a PNG overlay for each scene showing:
- **Red circles** - Guard spawn positions
- **Yellow lines/arrows** - Patrol paths with numbered waypoints
- **Labels** - Guard type (Guard/LeadGuard/Overseer)

Example format:
```
Scene: WarehouseMainScene
Guards:
  [Red circle at (130, 80)] → Guard 1 (Regular)
    [Yellow line with arrows]: (130,80) → (200,100) → (200,200) → (130,80)

  [Red circle at (300, 150)] → Guard 2 (LeadGuard)
    [Yellow line]: (300,150) → (400,150) (back and forth)
```

## Scenes Without Guards (Safe Zones)
- Cell Scene
- Sewer Scene
- Storage Bay Scene (currently)
- Loading Dock Scene (currently)
- Security Office Scene (currently)
- Maintenance Tunnel Scene (currently)

## TODO: Guard Placements Needed
All scenes marked as "(currently)" above need guard placement designs:
- [ ] Storage Bay Scene
- [ ] Loading Dock Scene
- [ ] Security Office Scene
- [ ] Maintenance Tunnel Scene
- [ ] Warehouse Main Scene

Provide PNGs with marked guard positions and patrol routes for implementation.
