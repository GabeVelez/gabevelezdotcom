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
  }

  initGuard(guard, config = {}) {
    guard.vision = {
      distance: config.distance ?? 88,
      angleDeg: config.angleDeg ?? 80,
      fillMs: config.fillMs ?? 1200,
      drainMs: config.drainMs ?? 900,
      facing: config.facing ?? 0,
    };
    this.meters.set(guard, 0);
    this.triggered.set(guard, { suspicious: false, alert: false });
  }

  update(dt) {
    for (const g of this.guards) {
      if (!g.active || g.isHidden || g.isKnockedOut) continue;

      const gv = g.body?.velocity;
      if (gv && (Math.abs(gv.x) + Math.abs(gv.y) > 1)) {
        g.vision.facing = Math.atan2(gv.y, gv.x);
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

      const trig = this.triggered.get(g) ?? { suspicious: false, alert: false };

      if (next < 0.15) {
        trig.suspicious = false;
        trig.alert = false;
      }

      if (!trig.suspicious && next >= 0.33) {
        trig.suspicious = true;
        g.stateMachine?.transition?.(GuardStates.SUSPICIOUS, { x: p.x, y: p.y });
      }

      if (!trig.alert && next >= 1.0) {
        trig.alert = true;
        g.stateMachine?.transition?.(GuardStates.ALERT, { x: p.x, y: p.y });
      }

      this.triggered.set(g, trig);
    }
  }

  getMeter(guard) {
    return this.meters.get(guard) ?? 0;
  }

  resetMeter(guard) {
    this.meters.set(guard, 0);
    this.triggered.set(guard, { suspicious: false, alert: false });
  }

  canSeePoint(guard, x, y) {
    if (!guard.active || guard.isHidden || guard.isKnockedOut) return false;
    if (!this._pointInCone(guard, x, y)) return false;
    if (this.wallLayer && this._rayHitsWall(guard.x, guard.y, x, y)) return false;
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
    const dx = x - guard.x;
    const dy = y - guard.y;
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
      const color =
        meter >= 0.66 ? 0xff3333 :
        meter >= 0.33 ? 0xffcc33 :
        0x33ff66;

      const a = Phaser.Math.DegToRad(guard.vision.angleDeg);
      const half = a / 2;
      const start = guard.vision.facing - half;
      const end = guard.vision.facing + half;

      g.lineStyle(1, color, 0.85);
      g.beginPath();
      g.arc(guard.x, guard.y, guard.vision.distance, start, end, false);
      g.strokePath();

      const x1 = guard.x + Math.cos(start) * guard.vision.distance;
      const y1 = guard.y + Math.sin(start) * guard.vision.distance;
      const x2 = guard.x + Math.cos(end) * guard.vision.distance;
      const y2 = guard.y + Math.sin(end) * guard.vision.distance;

      g.lineBetween(guard.x, guard.y, x1, y1);
      g.lineBetween(guard.x, guard.y, x2, y2);

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
