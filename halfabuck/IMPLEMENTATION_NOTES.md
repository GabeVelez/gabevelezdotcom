# Implementation Notes: Simplified Pure Stealth

**Updated:** 2026-02-21

This document outlines code changes needed to match the simplified game design.

---

## Design Changes Summary

### Removed Mechanics
- ❌ Knockout system
- ❌ Body dragging
- ❌ Crouching
- ❌ Birthday narrative/surprise ending
- ❌ Environmental puzzles (Molotov, lighter)

### Kept/Refined Mechanics
- ✅ Walking (normal movement)
- ✅ Cardboard box hiding
- ✅ Detection system
- ✅ Guard AI patrol and vision
- ✅ Multi-room progression

### New Features to Implement
- 🆕 Alert broadcast system (guards respond to other guards' alerts)
- 🆕 Guard response behavior based on type (aggression levels)

---

## Code Changes Needed

### 1. Player Class (`src/entities/Player.js`)

**Remove:**
- Crouch state and animations
- Crouch speed modifier
- Shift key handling for crouch
- `isDragging` and `dragTarget` properties (no body dragging)
- Space key interaction for knockouts

**Keep:**
- Walk state
- Box state (E key toggle)
- Basic movement (WASD/arrows)

**States After Cleanup:**
- `IDLE` — Standing still
- `WALK` — Normal movement
- `BOX` — In cardboard box (slower movement)

---

### 2. Guard Classes (`src/entities/Guard.js`, `LeadGuard.js`, `Overseer.js`)

**Remove:**
- `knockOut()` method (no knockouts)
- `hide()` / `unhide()` methods (no hiding bodies)
- Body discovery logic

**Keep:**
- Patrol state and waypoint following
- Suspicious state (33% detection)
- Alert state (100% detection)
- Vision cone system

**Add (New Feature):**
- `receiveAlert(location)` method
- `RESPONDING` state — move toward alert location
- Response behavior tuning per guard type:
  - **Regular Guard:** Moderate response speed
  - **Lead Guard:** Fast/aggressive response
  - **Overseer:** Slower response, longer investigation

---

### 3. Vision System (`src/systems/visionSystem.js`)

**No major changes needed** — keep current detection system.

**Add:**
- Alert broadcast function: `broadcastAlert(guardPosition, allGuards)`
- When guard reaches 100% detection:
  1. Trigger Game Over
  2. Broadcast alert to nearby guards (within range)
  3. Guards transition to RESPONDING state

**Tuning Parameters to Add:**
- Alert radius (how far the alert reaches)
- Guard response speeds by type
- Alert timeout duration

---

### 4. Room Scenes (`src/scenes/rooms/*.js`)

**Remove:**
- Knockout interaction logic
- Body dragging logic
- Locker/hide zone code (if any)

**Keep:**
- Exit zone transitions
- Guard spawning and patrol setup
- Player spawn point

**Update:**
- Remove "Press Space to Knockout" UI elements
- Simplify interaction prompts

---

### 5. IntroScene (`src/scenes/IntroScene.js`)

**Update Text:**
- Change subtitle from "MISSION: BROOKLYN" to "MISSION: CRITICAL"
- Remove any birthday-related text
- Keep simple "PRESS START" flow

---

### 6. EndingScene (`src/scenes/EndingScene.js`)

**Simplify:**
- Remove birthday surprise narrative
- Replace with simple victory message:
  ```
  MISSION COMPLETE
  ESCAPE SUCCESSFUL
  ```
- Stats to show:
  - Time
  - Detections
  - Alerts Triggered
  - Final Rank (based on performance)

**Remove:**
- Birthday cake references
- Family sprites
- "Happy 50th Birthday" text
- "Status: Legend" flavor text (replace with performance rank)

---

### 7. Input System (`src/systems/input.js`)

**Remove:**
- Shift key handling (crouch removed)
- Q key handling (no items)
- Space key for knockouts

**Keep:**
- WASD/Arrow movement
- E key for box toggle
- Debug keys (C, V, B, H, R, ESC)

---

### 8. Touch Controls (`src/ui/touchControls.js`)

**Simplify:**
- Keep D-pad for movement
- Keep X button for box toggle
- Remove functionality from A, B, Y buttons (or hide them)
- Consider showing only box button + movement

---

### 9. BaseRoomScene (`src/scenes/BaseRoomScene.js`)

**Update:**
- Remove crouch-related UI indicators
- Remove knockout prompt logic
- Keep detection meter display
- Keep vision system integration

**Add (New Feature):**
- Alert visualization (when implemented)
- Guard response state indicators (optional debug)

---

## New Feature: Alert Broadcast System

### Implementation Steps

**Step 1: Add Alert Data Structure**
```javascript
// In Guard.js or visionSystem.js
class AlertData {
  constructor(position, guardId, timestamp) {
    this.position = position;      // Where alert originated
    this.guardId = guardId;        // Which guard triggered it
    this.timestamp = timestamp;    // When it happened
    this.radius = 200;             // How far it reaches (tune this)
  }
}
```

**Step 2: Broadcast Function**
```javascript
// In visionSystem.js
broadcastAlert(alertPosition, allGuards, sourceGuard) {
  allGuards.forEach(guard => {
    if (guard === sourceGuard) return; // Skip self

    const distance = Phaser.Math.Distance.Between(
      alertPosition.x, alertPosition.y,
      guard.x, guard.y
    );

    if (distance <= ALERT_RADIUS) {
      guard.receiveAlert(alertPosition);
    }
  });
}
```

**Step 3: Guard Response Behavior**
```javascript
// In Guard.js
receiveAlert(alertPosition) {
  if (this.currentState === 'PATROL') {
    this.alertTarget = alertPosition;
    this.stateMachine.transition('RESPONDING');
  }
}

// Add RESPONDING state
states: {
  // ... existing states
  RESPONDING: {
    enter: () => {
      // Stop patrol, face alert direction
      this.setVelocity(0, 0);
    },
    execute: (delta) => {
      // Move toward alertTarget at guard-type-specific speed
      // Lead Guards: fast
      // Regular: moderate
      // Overseer: slow
      this.moveToward(this.alertTarget, this.responseSpeed);

      // Timeout after duration
      this.responseTimer += delta;
      if (this.responseTimer > this.responseTimeout) {
        this.stateMachine.transition('RETURNING');
      }
    }
  }
}
```

**Step 4: Tuning Parameters**
```javascript
// Guard type configurations
GUARD_TYPES = {
  REGULAR: {
    responseSpeed: 60,      // px/sec when responding
    responseTimeout: 5000,  // ms before giving up
  },
  LEAD: {
    responseSpeed: 90,      // Aggressive!
    responseTimeout: 7000,
  },
  OVERSEER: {
    responseSpeed: 45,      // Methodical
    responseTimeout: 8000,  // Persistent
  }
}
```

---

## Testing Checklist

### Basic Functionality
- [ ] Player can walk normally
- [ ] Player can toggle box with E key
- [ ] Box slows movement speed
- [ ] Guards ignore stationary box
- [ ] Detection meter works correctly
- [ ] Game over triggers at 100% detection

### Alert System (Once Implemented)
- [ ] Alert broadcasts when guard reaches 100%
- [ ] Nearby guards receive alert
- [ ] Guards move toward alert location
- [ ] Different guard types respond at different speeds
- [ ] Guards return to patrol after timeout
- [ ] Alert radius feels balanced (not too large/small)

### Removed Features Cleanup
- [ ] No crouch state available
- [ ] No knockout interactions
- [ ] No body dragging
- [ ] Simplified ending (no birthday narrative)
- [ ] Updated intro text (Mission: Critical)

### Polish
- [ ] Touch controls simplified (only needed buttons)
- [ ] UI clean and minimal
- [ ] Sound effects appropriate for actions
- [ ] Debug overlays still work

---

## Balancing Notes (To Be Tuned)

**Alert Radius:**
- Start with: 200 pixels
- Too large → all guards swarm player
- Too small → no meaningful response

**Response Speeds:**
- Should feel distinct per guard type
- Lead guards should feel threatening
- Overseers should feel calculated/methodical

**Response Duration:**
- Long enough to create tension
- Short enough to allow recovery

**Detection Fill Rates:**
- May need adjustment if removing crouch
- Box should still provide meaningful protection

---

## Priority Order

1. **Remove deprecated code** (crouch, knockout, dragging)
2. **Update text/narrative** (Mission: Critical, simplified ending)
3. **Simplify UI/controls** (remove unused buttons)
4. **Implement alert broadcast** (new feature)
5. **Tune and balance** (alert radius, response speeds)
6. **Test and iterate** (playtest alert system)

---

**Notes:**
- Keep it simple—pure stealth evasion
- Focus on making the alert system feel good
- Balance needs playtesting with real levels
