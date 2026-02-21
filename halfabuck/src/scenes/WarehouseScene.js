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
      "F2 vision debug | F1 collision debug | ESC ending",
      { fontFamily: "monospace", fontSize: "9px", color: "#ffffff" }
    ).setScrollFactor(0);

    this._collisionDebug = null;
    this._visionDebug = this.add.graphics().setDepth(999).setAlpha(0.9);
    this._visionDebugOn = true;

    this.input.keyboard.on("keydown-F1", () => this._toggleCollisionDebug(ground));
    this.input.keyboard.on("keydown-F2", () => { this._visionDebugOn = !this._visionDebugOn; });
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
    const facings = ["up", "down", "left", "right"];
    for (const f of facings) {
      this.anims.create({ key: `idle_${f}`, frames: [{ key: "player", frame: 0 }], frameRate: 1, repeat: -1 });
      this.anims.create({ key: `walk_${f}`, frames: [{ key: "player", frame: 0 }], frameRate: 6, repeat: -1 });
      this.anims.create({ key: `crouch_${f}`, frames: [{ key: "player", frame: 0 }], frameRate: 1, repeat: -1 });
      this.anims.create({ key: `crouchwalk_${f}`, frames: [{ key: "player", frame: 0 }], frameRate: 6, repeat: -1 });
    }
  }
}
