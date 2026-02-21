import Phaser from "phaser";
import { Player } from "../entities/Player.js";
import { Guard } from "../entities/Guard.js";
import { LeadGuard } from "../entities/LeadGuard.js";
import { Overseer } from "../entities/Overseer.js";
import { VisionSystem } from "../systems/visionSystem.js";
import { createInputManager } from "../systems/input.js";

export class WarehouseScene extends Phaser.Scene {
  constructor() {
    super("WarehouseScene");
  }

  create() {
    const map = this.make.tilemap({ key: "warehouse_map" });
    const tileset = map.addTilesetImage("warehouse_tiles", "warehouse_tiles");
    const ground = map.createLayer("Ground", tileset, 0, 0);

    ground.setCollision([2]);

    const worldW = map.widthInPixels;
    const worldH = map.heightInPixels;
    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setBounds(0, 0, worldW, worldH);

    const objects = map.getObjectLayer("Objects")?.objects ?? [];
    const byName = new Map(objects.map(o => [o.name, o]));
    const spawn = byName.get("player_spawn") ?? { x: 32, y: 32 };

    this.player = new Player(this, spawn.x, spawn.y);
    this.player.setDepth(10); // Above vision cones
    this._createPlaceholderAnims();

    this.guards = [];
    for (const obj of objects) {
      const isGuard = obj.type === "guard" || obj.type === "lead_guard" || obj.type === "overseer";
      if (!isGuard) continue;

      const pathProp = (obj.properties || []).find(p => p.name === "path")?.value || "";
      const pointNames = pathProp.split(",").map(s => s.trim()).filter(Boolean);
      const pathPoints = pointNames
        .map(n => byName.get(n))
        .filter(Boolean)
        .map(p => ({ x: p.x, y: p.y }));

      let g;
      if (obj.type === "lead_guard") g = new LeadGuard(this, obj.x, obj.y, pathPoints);
      else if (obj.type === "overseer") g = new Overseer(this, obj.x, obj.y, pathPoints);
      else g = new Guard(this, obj.x, obj.y, pathPoints);

      g.setDepth(10); // Above vision cones
      this.guards.push(g);
    }

    this.hideZones = [];
    for (const obj of objects) {
      if (obj.type !== "locker" && obj.type !== "hide_zone") continue;
      const zone = this.add.zone(obj.x + (obj.width || 0)/2, obj.y + (obj.height || 0)/2, obj.width || 16, obj.height || 16);
      this.physics.add.existing(zone);
      zone.body.setAllowGravity(false);
      zone.body.setImmovable(true);
      this.hideZones.push(zone);
    }

    this.physics.add.collider(this.player, ground);
    this.guards.forEach(g => this.physics.add.collider(g, ground));

    this.vision = new VisionSystem(this, this.guards, this.player, ground);
    this.guards.forEach(g => {
      if (g.guardType === "lead") {
        this.vision.initGuard(g, { distance: 112, angleDeg: 110, fillMs: 1100, drainMs: 900 });
      } else if (g.guardType === "overseer") {
        this.vision.initGuard(g, { distance: 140, angleDeg: 60, fillMs: 950, drainMs: 850 });
      } else {
        this.vision.initGuard(g, { distance: 92, angleDeg: 80, fillMs: 1200, drainMs: 900 });
      }
    });

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.roundPixels = true;

    this.inputManager = createInputManager(this, this.registry.get("touchRef"));

    this.meterText = this.add.text(8, 8, "DETECTION: 0%", {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#ffffff"
    }).setScrollFactor(0);

    this.add.text(
      8, 22,
      "WASD/Arrows move | Shift crouch | E box(toggle) | Space interact\n" +
      "Interact: KO behind, drag KO'd, drop, hide in locker/shadow\n" +
      "V vision debug | C collision debug | B body debug | ESC ending",
      { fontFamily: "monospace", fontSize: "9px", color: "#ffffff" }
    ).setScrollFactor(0);

    this._collisionDebug = null;
    this._visionDebug = this.add.graphics().setDepth(5).setAlpha(0.9); // Above tilemap, below sprites
    this._visionDebugOn = true;
    this._bodyDebug = this.add.graphics().setDepth(1000);
    this._bodyDebugOn = false;

    this.input.keyboard.on("keydown-C", () => this._toggleCollisionDebug(ground));
    this.input.keyboard.on("keydown-V", () => { this._visionDebugOn = !this._visionDebugOn; });
    this.input.keyboard.on("keydown-B", () => { this._bodyDebugOn = !this._bodyDebugOn; });
    this.input.keyboard.on("keydown-ESC", () => this.scene.start("EndingScene"));

    this.groundLayer = ground;
  }

  update(_, dtMs) {
    const dt = dtMs;
    const input = this.inputManager.get();

    if (input.justInteract) this._handleInteract();

    this.player.update(input);
    this.guards.forEach(g => g.update(dt));
    this.vision.update(dt);

    this._checkBodyDiscovery();

    if (this.guards.length) {
      const meter = this.vision.getMeter(this.guards[0]);
      this.meterText.setText(`DETECTION: ${Math.round(meter * 100)}%`);
    }

    if (this.player.isDragging && this.player.dragTarget) {
      this._tryHideDraggedBody();
    }

    if (this._visionDebugOn) {
      this._visionDebug.clear();
      this.vision.renderDebug(this._visionDebug);
    } else {
      this._visionDebug.clear();
    }

    // F3: Draw player collision box
    if (this._bodyDebugOn) {
      this._bodyDebug.clear();
      this._bodyDebug.lineStyle(2, 0x00ff00, 1);
      this._bodyDebug.strokeRect(
        this.player.body.x,
        this.player.body.y,
        this.player.body.width,
        this.player.body.height
      );
    } else {
      this._bodyDebug.clear();
    }
  }

  _checkBodyDiscovery() {
    const bodies = this.guards.filter(g => g.isKnockedOut && !g.isHidden);
    if (!bodies.length) return;

    for (const watcher of this.guards) {
      if (watcher.isKnockedOut || watcher.isHidden) continue;

      for (const body of bodies) {
        if (body === watcher) continue;

        if (this.vision.canSeePoint(watcher, body.x, body.y)) {
          watcher.stateMachine?.transition?.("alert", { x: body.x, y: body.y });
          break;
        }
      }
    }
  }

  _handleInteract() {
    if (this.player.isDragging) {
      this.player.isDragging = false;
      this.player.dragTarget = null;
      return;
    }

    const range = 22;
    let nearest = null;
    let best = Infinity;

    for (const g of this.guards) {
      if (!g.active || g.isHidden) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, g.x, g.y);
      if (d < range && d < best) {
        nearest = g;
        best = d;
      }
    }
    if (!nearest) return;

    if (nearest.isKnockedOut) {
      this.player.isDragging = true;
      this.player.dragTarget = nearest;
      return;
    }

    if (this._isBehind(this.player, nearest)) {
      nearest.knockOut(8000);
      this.vision.resetMeter(nearest);
    }
  }

  _isBehind(player, guard) {
    const v = guard.body?.velocity;
    const facing = (v && (Math.abs(v.x) + Math.abs(v.y) > 1)) ? Math.atan2(v.y, v.x) : 0;
    const behindDir = Phaser.Math.Angle.Wrap(facing + Math.PI);
    const angleToPlayer = Math.atan2(player.y - guard.y, player.x - guard.x);
    const delta = Phaser.Math.Angle.Wrap(angleToPlayer - behindDir);
    return Math.abs(delta) < Phaser.Math.DegToRad(60);
  }

  _tryHideDraggedBody() {
    const body = this.player.dragTarget;
    if (!body || body.isHidden) return;

    for (const zone of this.hideZones) {
      if (this.physics.overlap(body, zone)) {
        body.hide();
        this.player.isDragging = false;
        this.player.dragTarget = null;
        return;
      }
    }

    const tile = this.groundLayer.getTileAtWorldXY(body.x, body.y, true);
    if (tile && tile.index === 3) {
      body.hide();
      this.player.isDragging = false;
      this.player.dragTarget = null;
    }
  }

  _toggleCollisionDebug(ground) {
    if (this._collisionDebug) {
      this._collisionDebug.clear();
      this._collisionDebug.destroy();
      this._collisionDebug = null;
    } else {
      this._collisionDebug = this.add.graphics().setAlpha(0.75);
      ground.renderDebug(this._collisionDebug, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(255, 0, 0, 150),
        faceColor: new Phaser.Display.Color(0, 255, 0, 150),
      });
    }
  }

  _createPlaceholderAnims() {
    // Separate sprite sheets, each with 5 frames (0-4)

    // Player animations (Gabe)
    // Down animations (front-facing)
    this.anims.create({ key: "idle_down", frames: [{ key: "gabe-front", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_down", frames: this.anims.generateFrameNumbers("gabe-front", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "crouch_down", frames: [{ key: "gabe-front", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "crouchwalk_down", frames: this.anims.generateFrameNumbers("gabe-front", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });

    // Up animations (back-facing)
    this.anims.create({ key: "idle_up", frames: [{ key: "gabe-back", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_up", frames: this.anims.generateFrameNumbers("gabe-back", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "crouch_up", frames: [{ key: "gabe-back", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "crouchwalk_up", frames: this.anims.generateFrameNumbers("gabe-back", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });

    // Left animations
    this.anims.create({ key: "idle_left", frames: [{ key: "gabe-left", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_left", frames: this.anims.generateFrameNumbers("gabe-left", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "crouch_left", frames: [{ key: "gabe-left", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "crouchwalk_left", frames: this.anims.generateFrameNumbers("gabe-left", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });

    // Right animations
    this.anims.create({ key: "idle_right", frames: [{ key: "gabe-right", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_right", frames: this.anims.generateFrameNumbers("gabe-right", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "crouch_right", frames: [{ key: "gabe-right", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "crouchwalk_right", frames: this.anims.generateFrameNumbers("gabe-right", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });

    // Guard animations (soldier1)
    this.anims.create({ key: "guard_walk_down", frames: this.anims.generateFrameNumbers("guard-front", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "guard_walk_up", frames: this.anims.generateFrameNumbers("guard-back", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "guard_walk_left", frames: this.anims.generateFrameNumbers("guard-left", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "guard_walk_right", frames: this.anims.generateFrameNumbers("guard-right", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });

    // Overseer animations
    this.anims.create({ key: "overseer_walk_down", frames: this.anims.generateFrameNumbers("overseer-front", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "overseer_walk_up", frames: this.anims.generateFrameNumbers("overseer-back", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "overseer_walk_left", frames: this.anims.generateFrameNumbers("overseer-left", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "overseer_walk_right", frames: this.anims.generateFrameNumbers("overseer-right", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
  }
}
