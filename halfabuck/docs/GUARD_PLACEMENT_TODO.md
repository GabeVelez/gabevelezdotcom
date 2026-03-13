# Guard Placement TODO

This document tracks guard placement work for all scenes.

## How to Provide Guard Placements

Create PNG images showing:
1. **Scene background** as base layer
2. **Red circles** for guard spawn positions
3. **Yellow lines/arrows** for patrol routes with numbered waypoints
4. **Text labels** indicating guard type and patrol notes

### Example Layout
```
[Scene: WarehouseMainScene]

[Red circle] Guard 1 (Regular)
  [Yellow path with arrows and numbers]:
  1. (130, 80) → 2. (200, 100) → 3. (200, 200) → back to 1

[Red circle] Guard 2 (LeadGuard)
  [Yellow path]: 1. (300, 150) → 2. (400, 150) → back to 1
  Note: "Guards main corridor"
```

## Guard Types Reference

- **Guard (Regular)** - Speed: 42, basic patrol
- **LeadGuard** - Speed: 52, faster, harder to evade
- **Overseer** - Speed: 34, slower, special sprite, often stationary

## Scenes Needing Guard Placement

### ✅ Completed

- [x] **Warehouse Corridor** - 1 Regular guard, rectangular patrol
- [x] **Executive Wing** - 3 Regular, 3 LeadGuard, 1 Overseer
- [x] **Rooftop Helipad** - Multiple guards with complex patterns

### 🔄 In Progress / TODO

Priority scenes for guard placement:

#### High Priority
- [ ] **Warehouse Main Scene** (480×288)
  - Central hub, connects Corridor ↔ Storage Bay
  - Suggest: 2-3 guards, strategic patrol routes
  - Should introduce multi-guard coordination

- [ ] **Storage Bay Scene** (400×320)
  - Contains Smoke Grenade collectible
  - Suggest: 1-2 guards, item is guarded
  - Test smoke grenade usefulness

- [ ] **Loading Dock Scene** (512×288)
  - Open area, potentially exposed
  - Suggest: 2 guards with long patrol routes
  - Test detection in open spaces

#### Medium Priority
- [ ] **Security Office Scene** (400×352)
  - Contains Security Keycard (behind locked door)
  - Suggest: 1-2 guards, one patrolling keycard area
  - Puzzle: Need keycard to unlock door to get keycard (requires backtracking or finding another keycard)

- [ ] **Maintenance Tunnel Scene** (480×256)
  - Narrow passage, limited hiding spots
  - Suggest: 1 guard, back-and-forth patrol
  - Should be challenging due to narrow space

#### Low Priority (Not Yet Implemented)
- [ ] **Executive Wing Scene** - Already has guards defined, needs testing
- [ ] **Rooftop Helipad Scene** - Already has guards defined, needs testing

## Guard Placement Guidelines

### Density
- **Early game (Corridor):** 1 guard (tutorial)
- **Mid game (Warehouse/Storage):** 2-3 guards per scene
- **Late game (Security/Tunnel):** 2-4 guards per scene
- **End game (Executive/Helipad):** 5-8 guards

### Patrol Patterns
- **Rectangular loops** - Standard patrol
- **Back-and-forth** - Corridor/hallway patrol
- **Circular** - Area coverage
- **Stationary with small movement** - Guarding specific point
- **Synchronized opposite** - Two guards mirroring each other

### Strategic Placement
- Guard chokepoints (exits, narrow passages)
- Guard valuable items (smoke grenade, keycard)
- Create multiple routes (allow player choice)
- Force stealth usage (can't just run past)
- Test smoke grenade effectiveness

### Difficulty Curve
Each scene should be slightly harder than the previous:
1. **Corridor** - Learn guard detection (1 guard, simple pattern)
2. **Warehouse Main** - Multiple guards, coordination (2-3 guards)
3. **Storage Bay** - Use items tactically (2 guards + item)
4. **Loading Dock** - Open space challenge (2 guards, long routes)
5. **Security Office** - Puzzle + stealth (2 guards + locked door)
6. **Maintenance Tunnel** - Narrow space, limited options (1-2 guards)

## Scene Analysis

### Warehouse Main (480×288)
**Layout:** Multiple rooms, corridors
**Exits:** Top-left (to Corridor), Bottom-right (to Storage Bay)
**Suggested Guards:**
- 1 Regular in main area (rectangular patrol)
- 1 LeadGuard in corridor (faster, harder to avoid)
- Optional: 1 Regular near Storage Bay exit

### Storage Bay (400×320)
**Layout:** Open storage area with crates
**Item:** Smoke Grenade at (360, 280)
**Exits:** Top-right (to Warehouse Main), Bottom-left (to Loading Dock)
**Suggested Guards:**
- 1 Regular patrolling near smoke grenade
- 1 Regular patrolling between exits
- Should require using environment for cover

### Loading Dock (512×288)
**Layout:** Large open area
**Exits:** Top-left (to Storage Bay), Bottom-right (to Security Office)
**Suggested Guards:**
- 2 Regular guards with long patrol routes
- Wide open spaces test player's stealth timing
- Should feel exposed

### Security Office (400×352)
**Layout:** Office area with locked room
**Item:** Security Keycard inside locked room
**Exits:** Bottom-left (to Loading Dock), Top-left (to Maintenance Tunnel - locked)
**Suggested Guards:**
- 1 Regular patrolling main office
- 1 Regular near locked keycard room
- Keycard puzzle: Needs keycard to unlock door to keycard room (must find alternate keycard or backtrack)

### Maintenance Tunnel (480×256)
**Layout:** Long narrow tunnel
**Exits:** Top-left (to Security Office), Bottom-left (to Executive Wing)
**Suggested Guards:**
- 1-2 Regular guards
- Back-and-forth patrol in narrow space
- Limited hiding options = stealth timing critical

## Testing Checklist

When guards are placed, test:
- [ ] Can complete scene without being detected
- [ ] Detection triggers correctly
- [ ] Chase behavior works in scene layout
- [ ] Patrol paths don't get stuck on collision
- [ ] Items are accessible but challenging to get
- [ ] Multiple routes exist (player has choices)
- [ ] Smoke grenade provides tactical advantage
- [ ] Difficulty feels appropriate for progression

## Notes

- PNGs are preferred for simplicity when providing guard placements
- Guards will be implemented in code based on PNG markings
- Test each scene individually and in full game flow
- Balance between challenging and frustrating
- Player should feel smart for successfully sneaking, not lucky

## Next Steps

1. ✅ Set up documentation structure
2. ⬜ Create PNG layouts for high-priority scenes (Warehouse Main, Storage Bay, Loading Dock)
3. ⬜ Implement guard placements in code
4. ⬜ Playtest and adjust
5. ⬜ Create PNGs for medium-priority scenes
6. ⬜ Implement and test
7. ⬜ Full game flow playtest
