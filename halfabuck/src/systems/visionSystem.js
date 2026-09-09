import Phaser from "phaser";
import { GuardStates } from "../entities/Guard.js";

// Helper function for random timing variation (±20%)
function randomTiming(baseMs) {
  const variation = 0.2; // 20% variation
  const min = baseMs * (1 - variation);
  const max = baseMs * (1 + variation);
  return Phaser.Math.Between(min, max);
}

export class VisionSystem {
  constructor(scene, guards, player, wallLayer = null, collisionBodies = null) {
    this.scene = scene;
    this.guards = guards;
    this.player = player;
    this.wallLayer = wallLayer;
    this.collisionBodies = collisionBodies; // SVG collision bodies
    this.meters = new Map();
    this.triggered = new Map();
    this.debugEnabled = true;

    // Alert system
    this.alertRadius = 200; // How far the alert reaches (tune this)
    this.alertActive = false; // Track if an alert is currently active
    this.alertingGuard = null; // Which guard triggered the alert
    this.alertCooldown = 0; // Cooldown timer before alert can reset (ms)
    this.minAlertDuration = 3000; // Minimum alert duration (3 seconds)

    // How long a guard keeps looking after losing sight before he gives up,
    // drops his cone back and goes back on patrol. Long enough to feel like
    // he is searching, short enough that breaking contact is a real option.
    this.giveUpMs = 3500;
  }

  initGuard(guard, config = {}) {
    // Vision distance sizing:
    // Green (normal): base + 20%
    // Yellow (suspicious): base + 25%
    // Red (alert): base + 25% (same as yellow)
    const baseDistance = config.distance ?? 88;
    guard.vision = {
      distance: baseDistance * 1.20,     // Green state: 120% of base
      baseDistance: baseDistance,        // Store original base
      greenDistance: baseDistance * 1.20,   // Green: +20%
      yellowRedDistance: baseDistance * 1.25, // Yellow/Red: +25%
      angleDeg: config.angleDeg ?? 80,
      fillMs: config.fillMs ?? 1200,
      drainMs: config.drainMs ?? 900,
      facing: config.facing ?? 0,
      isAlerted: false, // Track if this guard is in alert state
    };
    this.meters.set(guard, 0);
    this.triggered.set(guard, {
      detected: false,
      suspicious: false,
      investigate: false,
      chase: false,
      alert: false
    });
  }

  update(dt) {
    // Update alert cooldown
    if (this.alertCooldown > 0) {
      this.alertCooldown -= dt;
    }

    // Update smoke clouds
    if (this.scene.smokeClouds) {
      for (const cloud of this.scene.smokeClouds) {
        if (cloud.active) {
          cloud.update(dt);
        }
      }
    }

    let anyDetecting = false;
    let anyAlerted = false;

    for (const g of this.guards) {
      if (!g.active || g.isHidden || g.isKnockedOut) continue;

      // Check if guard is inside smoke cloud - if so, set vision to 0
      let insideSmoke = false;
      if (this.scene.smokeClouds) {
        for (const cloud of this.scene.smokeClouds) {
          if (cloud.active && cloud.containsGuard(g)) {
            insideSmoke = true;
            break;
          }
        }
      }

      // Store original vision distance and temporarily override if in smoke
      const originalDistance = g.vision.distance;
      if (insideSmoke) {
        g.vision.distance = 0; // Blind inside smoke
      }

      const gv = g.body?.velocity;
      if (gv && (Math.abs(gv.x) + Math.abs(gv.y) > 1)) {
        // Snap to cardinal directions (up/down/left/right)
        const angle = Math.atan2(gv.y, gv.x);
        const snapAngle = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);
        g.vision.facing = snapAngle;
      }

      const inside = this._isPlayerInCone(g);
      const meter = this.meters.get(g) ?? 0;

      // How long since THIS guard last had eyes on you. Reset below when he
      // does; it is what lets him give up.
      if (!inside) g.timeSinceLastSeen = (g.timeSinceLastSeen ?? 0) + dt;

      const p = this.player;
      const pv = p.body?.velocity;
      const pMoving = pv && (Math.abs(pv.x) + Math.abs(pv.y) > 1);
      const boxedMoving = p.isBoxed && pMoving;

      const fillMs = boxedMoving ? (g.vision.fillMs * 2.2) : g.vision.fillMs;

      const next = inside
        ? Math.min(1, meter + dt / fillMs)
        : Math.max(0, meter - dt / g.vision.drainMs);

      this.meters.set(g, next);

      const trig = this.triggered.get(g) ?? { detected: false, suspicious: false, alert: false };

      // Track if guard can see player
      g.canSeePlayer = inside;

      if (inside) g.timeSinceLastSeen = 0;

      // Update last known position when player is visible
      if (inside && next > 0.05) {
        g.lastKnownPlayerPos = { x: p.x, y: p.y };
        g.timeSinceLastSeen = 0;
      }

      // Detection just started - immediate alert broadcast
      if (!trig.detected && next > 0.05 && meter <= 0.05) {
        trig.detected = true;

        // Record detection in guard's memory
        g.recordDetection(p.x, p.y, next);

        // Play alert sound only if no alert is currently active
        if (!this.alertActive && this.scene.registry.get("soundEnabled")) {
          const alertSound = this.scene.sound.add("alert", { volume: 0.7 });
          alertSound.play();
          this.alertActive = true;
          this.alertingGuard = g;
          this.alertCooldown = randomTiming(this.minAlertDuration);
        }

        // Expand vision cone to yellow/red state (125%)
        g.vision.isAlerted = true;
        g.vision.distance = g.vision.yellowRedDistance;

        // Show exclamation mark above guard
        this._showExclamation(g);

        // Broadcast alert to nearby guards immediately
        this.broadcastAlert(g, { x: p.x, y: p.y });
      }

      // Only reset triggers if detection drops very low
      if (next < 0.05) {
        trig.detected = false;
      }

      // Reset alert flag only when meter is completely drained
      if (next < 0.01) {
        trig.suspicious = false;
        trig.investigate = false;
        trig.chase = false;
        trig.alert = false;
      }

      // Give up. Without this a guard who has lost you keeps a cone widened to
      // 125% and a state machine still walking to where you were, so he
      // re-acquires the moment you move and there is no way to break contact.
      // Losing a guard has to be possible or the stealth is theatre.
      if (!inside && next < 0.01 && g.timeSinceLastSeen >= this.giveUpMs) {
        if (g.vision.isAlerted) {
          g.vision.isAlerted = false;
          g.vision.distance = g.vision.greenDistance;
        }
        const patrolState = g.stateMachine?.possibleStates?.[GuardStates.PATROL];
        if (g.stateMachine && g.stateMachine.state !== patrolState) {
          g.stateMachine.transition?.(GuardStates.PATROL);
        }
        g.lastKnownPlayerPos = null;
      }

      // State transitions based on detection level
      // 0.1-0.3: SUSPICIOUS (heard noise)
      if (!trig.suspicious && next >= 0.1 && next < 0.3) {
        trig.suspicious = true;
        const patrolState = g.stateMachine.possibleStates[GuardStates.PATROL];
        if (g.stateMachine.state === patrolState) {
          g.stateMachine?.transition?.(GuardStates.SUSPICIOUS, {
            x: p.x,
            y: p.y,
            percent: next
          });
        }
      }

      // 0.3-0.6: INVESTIGATE (saw movement)
      if (!trig.investigate && next >= 0.3 && next < 0.6) {
        trig.investigate = true;
        g.stateMachine?.transition?.(GuardStates.INVESTIGATE, {
          x: p.x,
          y: p.y,
          percent: next
        });
      }

      // 0.6-1.0: CHASE (clear sighting)
      if (!trig.chase && next >= 0.6 && next < 1.0) {
        trig.chase = true;
        g.stateMachine?.transition?.(GuardStates.CHASE, {
          x: p.x,
          y: p.y,
          percent: next
        });
      }

      // 1.0: ALERT (game over)
      if (!trig.alert && next >= 1.0) {
        trig.alert = true;
        g.stateMachine?.transition?.(GuardStates.ALERT, { x: p.x, y: p.y });
      }

      this.triggered.set(g, trig);

      // Restore original vision distance if it was modified by smoke
      if (insideSmoke) {
        g.vision.distance = originalDistance;
      }

      // Track if any guard is detecting or in alert state
      if (next > 0.05) anyDetecting = true;
      if (g.stateMachine) {
        const patrolState = g.stateMachine.possibleStates[GuardStates.PATROL];
        if (g.stateMachine.state !== patrolState) {
          anyAlerted = true;
        }
      }
    }

    // Reset the shared alert when nobody can currently see the player. It used
    // to also require every guard to be back on patrol, which meant one guard
    // stuck mid-search held every cone in the level at 125% indefinitely - so
    // walking away from one guard made every other guard sharper.
    if (this.alertActive && !anyDetecting) {
      this.resetAlert();
    }
  }

  getMeter(guard) {
    return this.meters.get(guard) ?? 0;
  }

  resetMeter(guard) {
    this.meters.set(guard, 0);
    this.triggered.set(guard, {
      detected: false,
      suspicious: false,
      investigate: false,
      chase: false,
      alert: false
    });
  }

  broadcastAlert(sourceGuard, playerPosition) {
    // Broadcast alert to all guards within radius
    for (const guard of this.guards) {
      // Skip source guard, inactive guards, and knocked out guards
      if (guard === sourceGuard || !guard.active || guard.isKnockedOut || guard.isHidden) {
        continue;
      }

      // Check if guard is within alert radius
      const distance = Phaser.Math.Distance.Between(
        sourceGuard.x, sourceGuard.y,
        guard.x, guard.y
      );

      if (distance <= this.alertRadius) {
        // Expand vision cone to yellow/red state (125%)
        guard.vision.isAlerted = true;
        guard.vision.distance = guard.vision.yellowRedDistance;

        // Only regular guards and lead guards respond by moving
        // Overseers stay in place (they're stationary)
        if (guard.guardType !== "overseer") {
          // Check if guard is in PATROL state by comparing state object
          const patrolState = guard.stateMachine.possibleStates[GuardStates.PATROL];
          if (guard.stateMachine.state === patrolState) {
            // Record the alert position as last known player position
            guard.lastKnownPlayerPos = playerPosition;

            guard.stateMachine.transition(GuardStates.RESPONDING, {
              position: playerPosition,
              sourceGuard: sourceGuard.id
            });
          }
        }
      }
    }
  }

  resetAlert() {
    // Reset alert system when guards return to normal
    this.alertActive = false;
    this.alertingGuard = null;

    // Reset all guards' vision cones to green state (120%)
    for (const guard of this.guards) {
      if (guard.vision.isAlerted) {
        guard.vision.isAlerted = false;
        guard.vision.distance = guard.vision.greenDistance; // Back to green (120%)
      }
    }
  }

  _showExclamation(guard) {
    // Create exclamation mark sprite above guard's head
    if (guard.exclamationMark) {
      guard.exclamationMark.destroy();
    }

    // Create larger, more visible exclamation mark
    // Guard sprite origin is at (0.5, 1.0) - bottom center
    // Guard sprite is scaled 0.15, original ~300px height = ~45px displayed
    // Place exclamation well above guard's head
    const exclamation = this.scene.add.text(guard.x, guard.y - 55, "!", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "20px",
      color: "#ff0000",
      stroke: "#ffffff",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(10000); // Always on top

    guard.exclamationMark = exclamation;

    // Bounce animation (above sprite)
    this.scene.tweens.add({
      targets: exclamation,
      y: guard.y - 60,
      duration: 150,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Fade out after bounce
        this.scene.tweens.add({
          targets: exclamation,
          alpha: 0,
          duration: 500,
          delay: 500,
          onComplete: () => {
            exclamation.destroy();
            guard.exclamationMark = null;
          }
        });
      }
    });

    // Update exclamation position as guard moves
    const updateExclamation = () => {
      if (exclamation.active && guard.active) {
        exclamation.x = guard.x;
      }
    };

    this.scene.events.on('update', updateExclamation);
    exclamation.once('destroy', () => {
      this.scene.events.off('update', updateExclamation);
    });
  }

  canSeePoint(guard, x, y) {
    if (!guard.active || guard.isHidden || guard.isKnockedOut) return false;
    if (!this._pointInCone(guard, x, y)) return false;

    // Ray from guard's center (fixed offset)
    const guardCenterX = guard.x;
    const guardCenterY = guard.y - 16;

    // Check tilemap walls (legacy system)
    if (this.wallLayer && this._rayHitsWall(guardCenterX, guardCenterY, x, y)) return false;

    // Check SVG collision bodies (new system)
    if (this.collisionBodies && this._rayHitsCollisionBody(guardCenterX, guardCenterY, x, y)) return false;

    // Check smoke clouds - vision blocked if ray passes through smoke
    if (this._rayHitsSmokeCloud(guardCenterX, guardCenterY, x, y)) return false;

    return true;
  }

  _isPlayerInCone(guard) {
    const p = this.player;
    const pv = p.body?.velocity;
    const moving = pv && (Math.abs(pv.x) + Math.abs(pv.y) > 1);

    // Box + stationary => ignored
    if (p.isBoxed && !moving) return false;

    if (!this._pointInCone(guard, p.x, p.y)) return false;

    // Check tilemap walls (legacy system)
    if (this.wallLayer && this._rayHitsWall(guard.x, guard.y, p.x, p.y)) return false;

    // Check SVG collision bodies (new system)
    if (this.collisionBodies && this._rayHitsCollisionBody(guard.x, guard.y, p.x, p.y)) return false;

    // Check smoke clouds - vision blocked if ray passes through smoke
    if (this._rayHitsSmokeCloud(guard.x, guard.y, p.x, p.y)) return false;

    return true;
  }

  _pointInCone(guard, x, y) {
    // Vision cone originates from guard's center (fixed offset)
    const guardCenterX = guard.x;
    const guardCenterY = guard.y - 16;

    const dx = x - guardCenterX;
    const dy = y - guardCenterY;
    const dist = Math.hypot(dx, dy);
    if (dist > guard.vision.distance) return false;

    const angleToPoint = Math.atan2(dy, dx);
    const delta = Phaser.Math.Angle.Wrap(angleToPoint - guard.vision.facing);
    const half = Phaser.Math.DegToRad(guard.vision.angleDeg / 2);
    return Math.abs(delta) <= half;
  }

  _rayHitsWall(x0, y0, x1, y1) {
    const steps = 18;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = Phaser.Math.Linear(x0, x1, t);
      const y = Phaser.Math.Linear(y0, y1, t);
      const tile = this.wallLayer.getTileAtWorldXY(x, y, true);
      if (tile && tile.collides) return true;
    }
    return false;
  }

  _rayHitsCollisionBody(x0, y0, x1, y1) {
    // Ray-cast against SVG collision bodies (rectangles)
    const steps = 18; // Same precision as tilemap checking

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = Phaser.Math.Linear(x0, x1, t);
      const y = Phaser.Math.Linear(y0, y1, t);

      // Check if this point is inside any collision body
      if (!this.collisionBodies || !Array.isArray(this.collisionBodies)) {
        return false;
      }

      for (const body of this.collisionBodies) {
        if (!body || !body.body) continue;

        const bounds = body.getBounds();
        if (x >= bounds.x && x <= bounds.x + bounds.width &&
            y >= bounds.y && y <= bounds.y + bounds.height) {
          return true; // Ray hit a collision body
        }
      }
    }
    return false;
  }

  _rayHitsSmokeCloud(x0, y0, x1, y1) {
    // Ray-cast against smoke clouds (circular areas)
    if (!this.scene.smokeClouds) return false;

    const steps = 18; // Same precision as other ray-casting

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = Phaser.Math.Linear(x0, x1, t);
      const y = Phaser.Math.Linear(y0, y1, t);

      // Check if this point is inside any active smoke cloud
      for (const cloud of this.scene.smokeClouds) {
        if (!cloud.active) continue;

        if (cloud.containsPoint(x, y)) {
          return true; // Ray hit a smoke cloud
        }
      }
    }
    return false;
  }

  /**
   * Cast a ray and find where it hits a collision or max distance
   * Returns the distance to the hit point
   */
  _castVisionRay(centerX, centerY, angle, maxDistance) {
    const endX = centerX + Math.cos(angle) * maxDistance;
    const endY = centerY + Math.sin(angle) * maxDistance;

    // Check collision bodies
    if (this._rayHitsCollisionBody(centerX, centerY, endX, endY)) {
      // Binary search to find exact hit point
      let minDist = 0;
      let maxDist = maxDistance;
      const precision = 2; // Pixels

      while (maxDist - minDist > precision) {
        const midDist = (minDist + maxDist) / 2;
        const testX = centerX + Math.cos(angle) * midDist;
        const testY = centerY + Math.sin(angle) * midDist;

        if (this._rayHitsCollisionBody(centerX, centerY, testX, testY)) {
          maxDist = midDist;
        } else {
          minDist = midDist;
        }
      }
      return minDist;
    }

    // Check smoke clouds
    if (this._rayHitsSmokeCloud(centerX, centerY, endX, endY)) {
      // Binary search for smoke cloud intersection
      let minDist = 0;
      let maxDist = maxDistance;
      const precision = 2;

      while (maxDist - minDist > precision) {
        const midDist = (minDist + maxDist) / 2;
        const testX = centerX + Math.cos(angle) * midDist;
        const testY = centerY + Math.sin(angle) * midDist;

        if (this._rayHitsSmokeCloud(centerX, centerY, testX, testY)) {
          maxDist = midDist;
        } else {
          minDist = midDist;
        }
      }
      return minDist;
    }

    return maxDistance; // No hit, full distance
  }

  renderDebug(g) {
    if (!this.debugEnabled) return;

    for (const guard of this.guards) {
      if (!guard.active || guard.isHidden) continue;

      const meter = this.getMeter(guard);
      // Color based on detection level:
      // Green = normal patrol (< 33%)
      // Yellow = suspicious/investigating (33% - 66%)
      // Red = high alert/pursuit (>= 66%)
      const color =
        meter >= 0.66 ? 0xff3333 :  // Red
        meter >= 0.33 ? 0xffcc33 :  // Yellow
        0x33ff66;                    // Green

      const a = Phaser.Math.DegToRad(guard.vision.angleDeg);
      const half = a / 2;
      const start = guard.vision.facing - half;
      const end = guard.vision.facing + half;

      // Position cone at guard's center (fixed offset from bottom)
      const centerX = guard.x;
      const centerY = guard.y - 16; // Fixed offset upward to torso area

      // Cast rays to build collision-aware vision polygon
      const rayCount = Math.max(20, Math.ceil(guard.vision.angleDeg / 3)); // More rays for wider cones
      const angleStep = (end - start) / rayCount;
      const rayPoints = [];

      for (let i = 0; i <= rayCount; i++) {
        const angle = start + (angleStep * i);
        const distance = this._castVisionRay(centerX, centerY, angle, guard.vision.distance);
        rayPoints.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance
        });
      }

      // Draw gradient cone using collision-aware polygon
      const gradientSteps = 10;
      for (let i = 0; i < gradientSteps; i++) {
        const ratio = (gradientSteps - i) / gradientSteps; // 1.0 to 0.1
        const alpha = 0.30 * (1 - ratio);

        g.fillStyle(color, alpha);
        g.beginPath();
        g.moveTo(centerX, centerY);

        // Draw polygon using scaled ray points
        for (const point of rayPoints) {
          const dx = point.x - centerX;
          const dy = point.y - centerY;
          g.lineTo(centerX + dx * ratio, centerY + dy * ratio);
        }

        g.closePath();
        g.fillPath();
      }

      // Draw edge line showing exact vision boundary
      g.lineStyle(2, color, 0.4);
      g.beginPath();
      g.moveTo(centerX, centerY);
      for (const point of rayPoints) {
        g.lineTo(point.x, point.y);
      }
      g.closePath();
      g.strokePath();

      // Detection meter bar (keep as is)
      const w = 18, h = 3;
      const bx = guard.x - w / 2;
      const by = guard.y - 18;
      g.fillStyle(0x000000, 0.6);
      g.fillRect(bx - 1, by - 1, w + 2, h + 2);
      g.fillStyle(color, 0.9);
      g.fillRect(bx, by, w * meter, h);
    }
  }
}
