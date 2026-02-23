# Cardboard Box Hiding Mechanic - Testing Guide

## Implementation Summary

The iconic Metal Gear Solid cardboard box hiding mechanic has been implemented for Half-a-Buck. Players can now hide under a cardboard box to evade guards.

## What Was Implemented

### 1. Inventory Check ✅
- Box toggle (Q key) only works if player has collected the cardboard box
- Uses `this.scene.registry.get("inventory").hasItem("cardboard_box")`
- Console message shown when trying to use box without having it

### 2. Toggle Box Mode ✅
- Press Q to enter/exit box mode
- Edge-triggered (uses `input.justBox` from input system)
- Sound feedback on toggle (alert sound at different volumes)
- Respects sound settings (`soundEnabled` registry check)

### 3. Visual Changes ✅
- When boxed: Player sprite changes to "cardboardbox" texture
- When not boxed: Player sprite returns to "gabe-front" texture
- Box texture is loaded in BootScene as "cardboardbox"
- Smooth transition via state machine

### 4. Movement Behavior ✅
- When boxed: Uses `this.boxSpeed` (32) - slower than walking
- When not boxed: Uses normal `this.walkSpeed` (80)
- WASD movement still works when boxed
- Smooth speed transition via BoxState

### 5. Guard Detection Integration ✅
- When boxed AND stationary: Guards COMPLETELY IGNORE player
- When boxed AND moving: Detection takes 2.2x longer to fill
- Vision system already integrated (visionSystem.js lines 77-79, 298-299)

### 6. Additional Features ✅
- Dragging a body automatically cancels box mode
- State machine integration (PlayerStates.BOX)
- Proper state transitions between BOX, IDLE, WALK, CROUCH states

## Testing Checklist

### Basic Functionality
- [ ] Start game and enter Cell room
- [ ] Try pressing Q before collecting box (should see console message)
- [ ] Collect cardboard box item
- [ ] Press Q to enter box mode (should hear sound and see box texture)
- [ ] Move with WASD while boxed (should move slower)
- [ ] Press Q again to exit box mode (should hear sound and see player texture)

### Movement Speed
- [ ] Measure movement speed when NOT boxed (should be faster)
- [ ] Measure movement speed WHILE boxed (should be noticeably slower)
- [ ] Verify smooth transition when toggling box mode

### Guard Detection
- [ ] Enter boxed mode and stand still near a guard
- [ ] Verify guard does NOT detect stationary boxed player
- [ ] Move slowly while boxed near guard's vision cone
- [ ] Verify detection meter fills MUCH slower (2.2x slower)
- [ ] Compare to normal walking detection speed

### Visual Feedback
- [ ] Box sprite appears when entering box mode
- [ ] Player sprite returns when exiting box mode
- [ ] No visual glitches or sprite overlap issues
- [ ] Proper scale and positioning of box sprite

### Audio Feedback
- [ ] Sound plays when entering box (volume 0.3)
- [ ] Sound plays when exiting box (volume 0.2)
- [ ] No sound when sound system is disabled
- [ ] No sound when trying to use box without having it

### Edge Cases
- [ ] Dragging a body while boxed cancels box mode
- [ ] Cannot enter box mode while dragging
- [ ] Box mode persists across room transitions
- [ ] Inventory icon shows cardboard box when collected

## Code Files Modified

1. **`/Users/gabevelez/gabevelezdotcom/halfabuck/src/entities/Player.js`**
   - Added inventory check for box toggle (lines 56-81)
   - Added sound feedback with soundEnabled check (lines 67-75)
   - Updated BoxState to use "cardboardbox" texture (line 192)
   - Updated BoxState exit to restore "gabe-front" texture (line 197)

## Integration Points

### Already Implemented
- **Input System** (`src/systems/input.js`): Q key mapped, justBox edge-trigger works
- **Inventory System** (`src/systems/inventorySystem.js`): hasItem() method works
- **Vision System** (`src/systems/visionSystem.js`): Box detection logic already integrated
- **UI System** (`src/ui/gameUI.js`): Cardboard box icon already displays
- **Asset Loading** (`src/scenes/BootScene.js`): Cardboard box texture already loaded

### No Additional Changes Needed
The implementation leverages existing systems and requires no additional setup or configuration.

## Technical Details

### State Machine Flow
```
IDLE --[Q key + has box]--> BOX
BOX --[Q key]--> IDLE
BOX --[start dragging]--> IDLE (auto-cancel)
WALK --[Q key + has box]--> BOX
```

### Speed Values
- `walkSpeed`: 80 (normal)
- `crouchSpeed`: 48 (sneaking)
- `boxSpeed`: 32 (slowest, under box)
- `dragSpeed`: 40 (dragging bodies)

### Detection Multipliers
- Boxed + Stationary: 0x (completely invisible)
- Boxed + Moving: 0.45x detection speed (100% / 2.2 = 45% normal speed)
- Normal: 1x detection speed

## Known Limitations
1. Uses "alert" sound for feedback (could use custom sound later)
2. Box texture is static (no animation)
3. Console message for missing box (could show UI message later)
4. No visual indicator while boxed (could add HUD indicator later)

## Future Enhancements (Optional)
- [ ] Custom box toggle sound effect
- [ ] Box movement animation (shuffle/wobble)
- [ ] UI indicator showing box mode status
- [ ] Toast notification when box not available
- [ ] Different box textures (marked boxes, damaged boxes, etc.)
- [ ] Guards get suspicious of boxes in unusual locations
