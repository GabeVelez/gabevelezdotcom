import Phaser from "phaser";
import { GuardStates } from "../entities/Guard.js";

export class VisionSystem {
  constructor(scene, guards, player, wallLayer = null) {
    this.scene = scene;
    this.guards = guards;
    this.player = player;
    this.wallLayer = wallLayer;
    this.meters = new Map();
    this.triggered = new Map();
    this.debugEnabled = true;

    // Alert system
    this.alertRadius = 200; // How far the alert reaches (tune this)
    this.alertActive = false; // Track if an alert is currently active
    this.alertingGuard = null; // Which guard triggered the alert
  }

  initGuard(guard, config = {}) {
    // Vision distance: default is 70% of specified size (normal patrol)
    // Expands to 100% when alerted
    const baseDistance = config.distance ?? 88;
    guard.vision = {
      distance: baseDistance * 0.7, // Start at 70% (normal patrol)
      baseDistance: baseDistance,    // Store full distance for alert state
      angleDeg: config.angleDeg ?? 80,
      fillMs: config.fillMs ?? 1200,
      drainMs: config.drainMs ?? 900,
      facing: config.facing ?? 0,
      isAlerted: false, // Track if this guard is in alert state
    };
    this.meters.set(guard, 0);
    this.triggered.set(guard, { detected: false, suspicious: false, alert: false });
  }

  update(dt) {
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

      // Detection just started (GREEN alert) - immediate alert broadcast
      if (!trig.detected && next > 0.05 && meter <= 0.05) {
        trig.detected = true;

        // Play alert sound immediately when detection starts
        if (!this.alertPlayed && this.scene.registry.get("soundEnabled")) {
          const alertSound = this.scene.sound.add("alert", { volume: 0.7 });
          alertSound.play();
          this.alertPlayed = true;
        }

        // Broadcast alert to nearby guards immediately
        this.broadcastAlert(g, { x: p.x, y: p.y });
      }

      if (next < 0.15) {
        trig.detected = false;
        trig.suspicious = false;
        trig.alert = false;
      }

      // YELLOW alert - guard investigates
      if (!trig.suspicious && next >= 0.33) {
        trig.suspicious = true;
        g.stateMachine?.transition?.(GuardStates.SUSPICIOUS, { x: p.x, y: p.y });
      }

      // RED alert - full detection, game over
      if (!trig.alert && next >= 1.0) {
        trig.alert = true;
        g.stateMachine?.transition?.(GuardStates.ALERT, { x: p.x, y: p.y });
      }

      this.triggered.set(g, trig);

      // Track if any guard is detecting or in alert state
      if (next > 0.05) anyDetecting = true;
      if (g.stateMachine && g.stateMachine.currentState !== GuardStates.PATROL) {
        anyAlerted = true;
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
    this.triggered.set(guard, { detected: false, suspicious: false, alert: false });
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
        // Expand vision cone to alert state
        guard.vision.isAlerted = true;
        guard.vision.distance = guard.vision.baseDistance;

        // Only regular guards and lead guards respond by moving
        // Overseers stay in place (they're stationary)
        if (guard.guardType !== "overseer") {
          // Only transition to RESPONDING if currently in PATROL state
          if (guard.stateMachine.currentState === GuardStates.PATROL) {
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

    // Reset all guards' vision cones to normal size
    for (const guard of this.guards) {
      if (guard.vision.isAlerted) {
        guard.vision.isAlerted = false;
        guard.vision.distance = guard.vision.baseDistance * 0.7; // Back to 70%
      }
    }
  }

  _showExclamation(guard) {
    // Create exclamation mark sprite above guard's head
    if (guard.exclamationMark) {
      guard.exclamationMark.destroy();
    }

    // Create text exclamation mark
    const exclamation = this.scene.add.text(guard.x, guard.y - 35, "!", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#ff0000",
      stroke: "#000000",
      strokeThickness: 3
    }).setOrigin(0.5);

    guard.exclamationMark = exclamation;

    // Bounce animation
    this.scene.tweens.add({
      targets: exclamation,
      y: guard.y - 40,
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
    if (this.wallLayer && this._rayHitsWall(guardCenterX, guardCenterY, x, y)) return false;
    return true;
  }

  _isPlayerInCone(guard) {
    const p = this.player;
    const pv = p.body?.velocity;
    const moving = pv && (Math.abs(pv.x) + Math.abs(pv.y) > 1);

    // Box + stationary => ignored
    if (p.isBoxed && !moving) return false;

    if (!this._pointInCone(guard, p.x, p.y)) return false;
    if (this.wallLayer && this._rayHitsWall(guard.x, guard.y, p.x, p.y)) return false;
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
        const alpha = 0.25 * (1 - ratio); // Subtle gradient from center to edge

        g.fillStyle(color, alpha);
        g.slice(centerX, centerY, radius, start, end, false);
        g.fillPath();
      }

      // Optional: Add subtle edge line for definition
      g.lineStyle(1, color, 0.15);
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
