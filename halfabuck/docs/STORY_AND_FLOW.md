# Half a Buck - Story & Game Flow

## Story Overview

**Title:** Half a Buck
**Genre:** Stealth/Escape
**Setting:** Corporate warehouse/facility
**Premise:** The player wakes up imprisoned in a cell and must escape through increasingly secure areas of the facility to reach freedom.

## Narrative Arc

### Act 1: Awakening
**Cell Scene**
- Player wakes up in a prison cell
- No guards, relatively safe starting area
- Tutorial area for basic movement
- Discovers a cardboard box covering a hole in the floor
- Must collect the box to reveal the escape route

### Act 2: Underground Escape
**Sewer Scene**
- Player falls through hole into sewer system
- Dark, transitional space
- First real "outside the cell" environment
- Ladder leads up to warehouse corridor

### Act 3: First Encounter
**Warehouse Corridor Scene**
- **First guard encounter**
- Player must learn stealth mechanics
- Guard patrols in predictable pattern
- Two exits: back to sewer (retreat) or forward to warehouse

### Act 4: Main Warehouse
**Warehouse Main Scene**
- Larger area with multiple routes
- [Guards TBD - placement needed]
- Central hub connecting early and mid-game areas
- Exit leads to Storage Bay

### Act 5: Storage Area
**Storage Bay Scene**
- Contains Smoke Grenade collectible
- [Guards TBD - placement needed]
- Introduces item mechanics
- Exit to Loading Dock

### Act 6: Loading Operations
**Loading Dock Scene**
- Open warehouse loading area
- [Guards TBD - placement needed]
- Transition to security areas
- Exit to Security Office

### Act 7: Security Checkpoint
**Security Office Scene**
- Contains Security Keycard collectible
- Keycard locked behind a door requiring... a keycard (puzzle)
- [Guards TBD - placement needed]
- Keycard required to progress to Maintenance Tunnel
- Return path available to Loading Dock

### Act 8: Infrastructure
**Maintenance Tunnel Scene**
- Narrow underground passage
- [Guards TBD - placement needed]
- Last checkpoint before executive areas
- Exit to Executive Wing (requires Security Keycard)

### Act 9: Executive Access (Not Yet Implemented)
**Executive Wing Scene**
- High security area
- Multiple guards including first Overseer introduction
- Corporate environment
- Exit to Rooftop

### Act 10: Freedom (Not Yet Implemented)
**Rooftop Helipad Scene**
- Final area
- Helicopter escape point
- Maximum security (8 guards total)
- Victory condition: Reach helicopter

## Scene Flow Diagram

```
Cell (one-way)
  ↓ [hole in floor]
Sewer
  ↕ [ladder]
Warehouse Corridor
  ↕
Warehouse Main
  ↕
Storage Bay
  ↕
Loading Dock
  ↕
Security Office
  ↕ [requires keycard]
Maintenance Tunnel
  ↓
Executive Wing (not implemented)
  ↓
Rooftop Helipad (not implemented)
```

## Key Items & Mechanics

### Collectibles

| Item | Location | Purpose |
|------|----------|---------|
| Cardboard Box | Cell | Reveals hole to Sewer; Can be used for hiding |
| Smoke Grenade | Storage Bay | Creates smoke cloud for cover |
| Security Keycard | Security Office | Unlocks exit to Maintenance Tunnel |

### Locked Doors
- Security Office → Maintenance Tunnel (requires Security Keycard)
- Security Office internal door (blocks keycard access, requires another keycard - puzzle)

### Interactive Elements
- Holes (Cell → Sewer, one-way fall)
- Ladders (Sewer ↔ Corridor)
- Locked doors (require keycards)
- Exit zones (scene transitions)

## Difficulty Progression

### Early Game (Cell → Corridor)
- **Difficulty:** Tutorial/Easy
- **Guards:** None → 1
- **Mechanics:** Basic movement, item collection
- **Stakes:** Low (learning phase)

### Mid Game (Warehouse Main → Loading Dock)
- **Difficulty:** Medium
- **Guards:** TBD (need placement designs)
- **Mechanics:** Stealth, item usage
- **Stakes:** Medium (guards can detect and chase)

### Late Game (Security Office → Maintenance Tunnel)
- **Difficulty:** Hard
- **Guards:** TBD + keycard puzzles
- **Mechanics:** Advanced stealth, puzzle-solving
- **Stakes:** High (backtracking limited, keycard required)

### End Game (Executive Wing → Helipad)
- **Difficulty:** Very Hard
- **Guards:** 7+ including Overseers
- **Mechanics:** All mechanics required
- **Stakes:** Maximum (final escape)

## Narrative Themes

1. **Imprisonment to Freedom** - Journey from locked cell to open sky
2. **Increasing Security** - From empty cell to heavily guarded helipad
3. **Resource Scarcity** - Limited items must be used wisely
4. **Vertical Progression** - Moving up through facility (underground → rooftop)

## Player Abilities

### Movement
- Walk in 4 directions
- Variable speed based on state

### Stealth
- Hide in boxes
- Crouch/crawl (if implemented)
- Use smoke grenades for cover

### Interaction
- Collect items
- Open doors (with keycards)
- Enter/exit zones

### States
- Normal walking
- Dragging (in box)
- Boxed (hiding)
- Detected (being chased)

## Victory Condition

Reach the helicopter on the rooftop helipad and trigger the escape sequence.

## Failure Conditions

Currently none implemented (no game over state). Guards detect and chase but don't capture permanently.

**Potential future failure states:**
- Caught by guard → restart level
- Knocked out → restart level
- Alert level too high → lockdown

## Easter Eggs

### Toilet Easter Egg (Cell Scene)
- Sit on toilet for 20 seconds
- Plays flush sound
- Shows message: "Don't forget to wipe..."

## TODO: Story Elements

- [ ] Add guard placements for mid-game scenes (Warehouse Main → Maintenance Tunnel)
- [ ] Implement Executive Wing scene
- [ ] Implement Rooftop Helipad scene
- [ ] Add narrative text/dialogue (currently none)
- [ ] Add cutscenes between major acts
- [ ] Define failure states and respawn mechanics
- [ ] Add sound design for story beats
- [ ] Create victory cutscene (helicopter escape)

## Scene Atmosphere Notes

| Scene | Atmosphere | Lighting | Mood |
|-------|-----------|----------|------|
| Cell | Confined, oppressive | Dim | Trapped, beginning |
| Sewer | Dark, industrial | Very dim | Transitional, uncertain |
| Corridor | Tense, first danger | Moderate | Alert, first challenge |
| Warehouse Main | Open but watched | Moderate | Strategic |
| Storage Bay | Cluttered, hiding spots | Moderate | Resourceful |
| Loading Dock | Open, exposed | Bright | Vulnerable |
| Security Office | Monitored, official | Bright | Puzzle-focused |
| Maintenance Tunnel | Cramped, service area | Dim | Infiltration |
| Executive Wing | Corporate, high-class | Bright | Elite security |
| Rooftop Helipad | Open air, final stand | Outdoor bright | Freedom awaits |

## Sound Design Themes

- **Early scenes:** Dripping water, distant machinery
- **Mid scenes:** Warehouse sounds, forklift beeps, guard radios
- **Late scenes:** Computer terminals, air conditioning, corporate ambience
- **Final scene:** Helicopter rotors, wind, outdoor ambience

## Visual Progression

- **Underground:** Dark blues, greys, industrial
- **Warehouse:** Neutral tones, shipping crates, fluorescent lighting
- **Security/Office:** Clean whites, blues, professional
- **Executive:** Polished, glass, high-end finishes
- **Rooftop:** Sky, clouds, freedom
