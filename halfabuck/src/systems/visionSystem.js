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

    let anyDetecting = false;
    let anyAlerted = false;

    for (const g of this.guards) {
      if (!g.active || g.isHidden || g.isKnockedOut) continue;

      const gv = g.body?.velocity;
      if (gv && (Math.abs(gv.x) + Math.abs(gv.y) > 1)) {
        // Snap to cardinal directions (up/down/left/right)
        const angle = Math.atan2(gv.y, gv.x);
        const snapAngle = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);
        g.vision.facing = snapAngle;
      }

      const inside = this._isPlayerInCone(g);
      const meter = this.meters.get(g) ?? 0;

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

      // Track if any guard is detecting or in alert state
      if (next > 0.05) anyDetecting = true;
      if (g.stateMachine) {
        const patrolState = g.stateMachine.possibleStates[GuardStates.PATROL];
        if (g.stateMachine.state !== patrolState) {
          anyAlerted = true;
        }
      }
    }

    // Reset alert when all guards are back to patrol and no one is detecting
    if (this.alertActive && !anyDetecting && !anyAlerted) {
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

      // Draw gradient cone - multiple layers with decreasing opacity
      const gradientSteps = 10;
      for (let i = 0; i < gradientSteps; i++) {
        const ratio = (gradientSteps - i) / gradientSteps; // 1.0 to 0.1
        const radius = guard.vision.distance * ratio;
        const alpha = 0.30 * (1 - ratio); // Slightly more visible gradient

        g.fillStyle(color, alpha);
        g.slice(centerX, centerY, radius, start, end, false);
        g.fillPath();
      }

      // Add clear edge line for precise detection boundary
      g.lineStyle(2, color, 0.4); // Thicker, more visible edge
      g.beginPath();
      g.arc(centerX, centerY, guard.vision.distance, start, end, false);
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
