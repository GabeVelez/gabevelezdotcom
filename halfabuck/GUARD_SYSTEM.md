# Half-a-Buck: Guard System & Level Design Documentation

## Guard Type Hierarchy

The game features a **5-tier guard system** with gradual introduction across levels:

| Rank | Vision Range | Vision Angle | Speed | Color Tint | Introduction Level |
|------|--------------|--------------|-------|------------|-------------------|
| **Regular Guard** | 88px | 80° | Base (52) | Default | Level 3 |
| **Lead Guard** | 100px | 100° | Base (52) | Default | Level 4 |
| **Officer** | 110px | 90° | Base (52) | Blue (0x3399ff) | Level 6 |
| **Captain** | 115px | 85° | Fast (60) | Orange (0xff6600) | Level 8 |
| **Overseer** | 120px | 60° | Slow (45) | Default | Level 9 |

## Level-by-Level Guard Distribution

### Level 1: Cell (240×160 pixels)
- **Guards**: 0
- **Purpose**: Tutorial level
- **Collectibles**: Cardboard Box
- **New Mechanics**: Player movement, interaction

### Level 2: Sewer (288×192 pixels)
- **Guards**: 0
- **Purpose**: Safe transition zone
- **New Mechanics**: Scene transitions

### Level 3: Warehouse Corridor (320×320 pixels)
- **Guards**: 1 Regular
- **Distribution**:
  - 1× Regular Guard (first introduction)
- **New Mechanics**: First enemy encounter, vision cones, detection meter

### Level 4: Warehouse Main (480×288 pixels)
- **Guards**: 3
- **Distribution**:
  - 2× Regular Guard
  - 1× Lead Guard (first introduction)
- **New Mechanics**: Multi-guard coordination, increased difficulty
- **Changes from Original**: Removed Overseer (too early)

### Level 5: Storage Bay (400×320 pixels)
- **Guards**: 4
- **Distribution**:
  - 2× Regular Guard (synchronized vertical patrols)
  - 2× Lead Guard
- **Collectibles**: **Smoke Grenade** 💨 (first collectible item)
- **New Mechanics**: Smoke grenade collection (deployed with key '2')
- **Changes from Original**: Removed Overseer, added second Lead Guard

### Level 6: Loading Dock (512×288 pixels)
- **Guards**: 5
- **Distribution**:
  - 2× Regular Guard
  - 2× Lead Guard
  - 1× Officer (first introduction)
- **New Mechanics**: Officer introduction, smoke grenade usage test
- **Environment**: Open warehouse space with vehicle obstacles
- **Changes from Original**: Replaced Overseer with Officer

### Level 7: Security Office (400×352 pixels)
- **Guards**: 4 (1 starts inactive)
- **Distribution**:
  - 1× Regular Guard
  - 2× Lead Guard
  - 1× Officer (activates when keycard collected)
- **Collectibles**: **Security Keycard** 🔑 (unlocks red doors)
- **New Mechanics**: Locked doors, dynamic guard activation
- **Changes from Original**: Replaced Overseer with Officer

### Level 8: Maintenance Tunnel (480×256 pixels)
- **Guards**: 6 (highest density)
- **Distribution**:
  - 2× Regular Guard
  - 2× Lead Guard
  - 1× Officer
  - 1× Captain (first introduction)
- **New Mechanics**: Captain introduction (faster movement), narrow corridors
- **Difficulty**: Crosshair patrol patterns, junction coverage
- **Changes from Original**: Replaced 2 Overseers with Officer + Captain

### Level 9: Executive Wing (544×320 pixels)
- **Guards**: 7
- **Distribution**:
  - 1× Regular Guard
  - 2× Lead Guard (synchronized opposite patrols)
  - 2× Officer
  - 1× Captain (fast roaming responder)
  - 1× Overseer (first introduction)
- **New Mechanics**: Overseer introduction (longest range), open-plan office
- **Environment**: Glass walls (vision blocking), locked exit
- **Changes from Original**: Complete guard roster rework, added variety

### Level 10: Rooftop Helipad (480×480 pixels - LARGEST LEVEL)
- **Guards**: 8 (final boss challenge)
- **Distribution**:
  - 2× Regular Guard (concentric ring patrols)
  - 2× Lead Guard (north/south perimeter)
  - 2× Officer (east/west perimeter)
  - 1× Captain (fast diagonal patrol)
  - 1× Overseer (guards helicopter/victory point)
- **New Mechanics**: All guard types working together, helicopter escape
- **Victory Condition**: Reach helicopter at center
- **Changes from Original**: Rebalanced to include all guard types

---

## Board Sizes (Levels 4-10)

| Level | Name | Size (pixels) | Size (tiles) | Notes |
|-------|------|---------------|--------------|-------|
| **4** | Warehouse Main | 480×288 | 30×18 | Multi-room layout |
| **5** | Storage Bay | 400×320 | 25×20 | Narrow corridors with shelving |
| **6** | Loading Dock | 512×288 | 32×18 | Widest level, open space |
| **7** | Security Office | 400×352 | 25×22 | Tallest standard level |
| **8** | Maintenance Tunnel | 480×256 | 30×16 | Long narrow tunnels |
| **9** | Executive Wing | 544×320 | 34×20 | Second widest level |
| **10** | Rooftop Helipad | 480×480 | 30×30 | **Largest overall** (square) |

---

## Total Guard Count Across Game

| Guard Type | Total Instances | Percentage | First Appearance |
|------------|-----------------|------------|------------------|
| Regular Guard | 11 | 28.9% | Level 3 |
| Lead Guard | 14 | 36.8% | Level 4 |
| Officer | 7 | 18.4% | Level 6 |
| Captain | 4 | 10.5% | Level 8 |
| Overseer | 2 | 5.3% | Level 9 |
| **TOTAL** | **38 guards** | 100% | - |

---

## Design Philosophy

### Gradual Introduction
Each new guard type is introduced in a controlled environment:
- **Level 3**: First enemy (Regular) - teaches basic stealth
- **Level 4**: Lead Guard - teaches improved enemy awareness
- **Level 6**: Officer - mid-game power spike
- **Level 8**: Captain - introduces speed threat
- **Level 9**: Overseer - final challenge type (longest range)

### Visual Distinction
- **Officer**: Blue tint (0x3399ff) - water/calm authority
- **Captain**: Orange tint (0xff6600) - fire/urgency
- **Regular/Lead/Overseer**: Default sprite (distinguished by behavior)

### Difficulty Curve
```
Guards per level: 0 → 0 → 1 → 3 → 4 → 5 → 4 → 6 → 7 → 8
```
Progressive increase with strategic dips (Level 7 has fewer but dynamic guards)

---

## Implementation Details

### Guard Class Files
- `/src/entities/Guard.js` - Base Regular Guard class
- `/src/entities/LeadGuard.js` - Lead Guard (extends Guard)
- `/src/entities/Officer.js` - Officer (extends Guard) ✨ NEW
- `/src/entities/Captain.js` - Captain (extends Guard) ✨ NEW
- `/src/entities/Overseer.js` - Overseer (extends Guard)

### Vision System
All guards use the same vision system (`visionSystem.js`) with parameters:
- `visionDistance`: How far they can see
- `visionAngle`: Width of vision cone (degrees)
- Line-of-sight blocking via SVG collision bodies
- Smoke cloud vision blocking

### AI States
All guards share the same state machine:
- **PATROL**: Following waypoint paths
- **SUSPICIOUS**: Detection meter 10-30%
- **INVESTIGATE**: Detection meter 30-60%
- **CHASE**: Detection meter 60-100%
- **ALERT**: Detection meter 100% (player caught)

---

## Testing Checklist

### Per-Level Verification
- [ ] Guard counts match specification
- [ ] Guard types are correct (check class names)
- [ ] Tint colors display correctly (Officer=blue, Captain=orange)
- [ ] Patrol paths don't intersect with collision
- [ ] Vision cones respect collision/smoke blocking
- [ ] Guards introduced in correct order

### Gameplay Balance
- [ ] Level 6: Officer is noticeably stronger than Lead Guard
- [ ] Level 8: Captain moves faster than other guards
- [ ] Level 9: Overseer has longest range but narrow cone
- [ ] Level 10: All guard types work together effectively

### Visual Polish
- [ ] Officer guards display blue tint
- [ ] Captain guards display orange tint
- [ ] Vision cone colors match guard types (if implemented)
- [ ] Guard sprites render correctly at all zoom levels

---

## Future Expansion Ideas

### Additional Guard Types (Not Implemented)
- **Sniper**: 180px range, 30° angle, stationary only
- **Patrol Captain**: Changes routes randomly every 30s
- **Investigator**: Longer investigation duration (15s vs 8s)
- **Guard Dog**: Faster movement, sound-based detection

### Guard Coordination
- **Paired Patrols**: Two guards moving in sync
- **Alert Chains**: Specific guards alert specific others
- **Shift Changes**: Guards rotate positions at intervals

### Dynamic Difficulty
- Add/remove guards based on player alert count
- Increase guard speeds after multiple detections
- Change patrol routes after player uses smoke grenade

---

## Version History

### v2.0 (Current) - Guard Hierarchy Update
- ✨ Added Officer guard type (blue tint, 110px range)
- ✨ Added Captain guard type (orange tint, 115px range, fast)
- 🔄 Moved Overseer introduction from Level 4 → Level 9
- 🎯 Gradual guard type introduction system
- 📊 Rebalanced all levels 4-10 with new distribution
- 📈 Total guards increased from 36 → 38

### v1.0 - Initial Implementation
- Basic 3-tier system (Regular, Lead, Overseer)
- 10 complete levels
- 36 total guards

---

**Last Updated**: February 25, 2026
**Document Version**: 2.0
**Game Version**: Half-a-Buck v0.1.0
