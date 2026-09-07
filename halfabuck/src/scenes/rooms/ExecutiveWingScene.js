import Phaser from "phaser";
import { BaseRoomScene } from "../BaseRoomScene.js";
import { Item } from "../../entities/Item.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";
import { Villain } from "../../entities/Villain.js";

/**
 * Executive Wing - Level 9
 * The confrontation, not a stealth level. No guards: the player walks in, picks
 * up the glass of water and throws it at the villain.
 *
 * Being redrawn as a single screen at 384x180, so no camera scrolling. The
 * dimensions below still describe the old art.
 */
export class ExecutiveWingScene extends BaseRoomScene {
  constructor() {
    super("ExecutiveWingScene");
    this.levelLabel = "LVL 9: Executive Wing";
    // Continues from the reveal cutscene rather than restarting.
    this.sceneMusic = "spooky";
  }

  init(data) {
    super.init(data);
    // Set by the cutscenes as they hand control back
    this.revealSeen = data?.revealSeen === true;
    this.villainDefeated = data?.villainDefeated === true;
  }

  create() {
    // The reveal plays once, on first arrival, before the player has control.
    if (!this.revealSeen) {
      this.scene.start("CutsceneScene", {
        cutscene: "villain_reveal",
        next: "ExecutiveWingScene",
        nextData: { ...this.playerData, revealSeen: true },
      });
      return;
    }

    // One square room, matching executive-bg.png. The canvas is 384x180, so
    // the camera scrolls vertically and shows a little under half the room at
    // a time: you enter at the door, and he looms in behind his desk as you
    // walk up to him.
    this.wingWidth = 384;
    this.wingHeight = 384;

    // Add background image immediately
    const wingBg = this.add.image(0, 0, "executive_wing_bg");
    wingBg.setOrigin(0, 0);
    wingBg.setDisplaySize(this.wingWidth, this.wingHeight);
    wingBg.setDepth(0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    // Phaser reuses scene instances, so both of these still point at objects
    // the previous run destroyed. Coming back from the throw cutscene would
    // otherwise try to draw a cone for a dead villain.
    this.villain = null;
    this._coneG = null;

    const { width, height } = this.scale;
    const wingWidth = this.wingWidth;
    const wingHeight = this.wingHeight;

    // Load collision from SVG file
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/executive-wing-collision.svg"
    );

    // Store for reference (needed for vision system)
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // In through the door at the foot of the room, from Security Office.
    const playerX = 184;
    const playerY = 332;

    this.createPlayer(playerX, playerY);

    // The villain is the only thing in this room that sees, and he has to
    // exist before setupVisionSystem so it can hand him a cone.
    this.createGuards();
    if (!this.villainDefeated) {
      // His post: in front of the desk, between the player and the water.
      this.villain = new Villain(this, 192, 158);
      this.guards.push(this.villain);
    }

    // Create a simple tilemap for vision/waypoint systems (walkable everywhere except collisions)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 24,
      height: 24
    });
    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.fill(1, 0, 0, 24, 24); // All walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // --- The confrontation ------------------------------------------------
    // Run in, grab the water, press it. The throw itself plays as a cutscene
    // (glass in flight, the hit, him screaming) rather than an in-game arc.
    // Control returns here with him down and the way past open.

    // On the desk, which is the whole problem: he is standing in front of it.
    // The desk is solid, so it is picked up by reaching over the near edge
    // rather than by walking onto it.
    const water = new Item(this, 192, 124, {
      id: "water_glass",
      name: "Glass of Water",
      description: "Ice cold. Somebody is about to wear it.",
      texture: "item_water",
      displaySize: 20,
      depth: 5,
      interactionRange: 36,
    });
    if (!this.villainDefeated) this.items.push(water);
    else water.destroy();

    // The lit alcove behind the desk. Shut until he is down, so he cannot
    // simply be walked around.
    this.createExit(192, 24, 56, 40, "RooftopHelipadScene", "north");
    const roofExit = this._exits[this._exits.length - 1];
    roofExit.triggered = !this.villainDefeated;

    if (this.villainDefeated) {
      // Back from the throw cutscene: soaked, screaming, out of the way. A
      // still sprite, not the entity, because there is nothing left to chase.
      const downed = this.add.sprite(192, 100, "villain-agony");
      downed.setDisplaySize(48, 48).setDepth(9).play("villain_agony");
      if (this.gameUI) {
        this.gameUI.showItemNotification("easter_egg", "Go. While he is down.");
      }
    } else {
      // He is the throw target as well as the threat, so the range check reads
      // his live position rather than where he started.
      this.createThrowTarget(this.villain.x, this.villain.y, {
        sprite: this.villain,
        requiresItem: "water_glass",
        range: 110,
        instant: true, // the water_throw cutscene shows the throw itself
        onDefeated: () => {
          this.villain.defeat();
          this.scene.start("CutsceneScene", {
            cutscene: "water_throw",
            next: "ExecutiveWingScene",
            nextData: { ...this.playerData, revealSeen: true, villainDefeated: true },
          });
        },
      });

      // His cone is drawn, unlike a guard's. A boss you have to dodge has to
      // be readable: you can see the arc to stay out of, and see it go red
      // the moment he commits.
      this._coneG = this.add.graphics().setDepth(4);
    }

    // Physics - add colliders for all collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
      for (const g of this.guards) {
        this.physics.add.collider(g, body);
      }
    });

    // Camera
    this.cameras.main.setBounds(0, 0, wingWidth, wingHeight);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
    this._drawVillainCone();
  }

  _drawVillainCone() {
    const g = this._coneG;
    const v = this.villain;
    if (!g) return;

    g.clear();
    if (!v || v.defeated || !v.vision) return;

    // Cone is cast from his eyeline, not his feet, so it sits where he looks.
    const originY = v.y - v.displayHeight * 0.55;
    const half = Phaser.Math.DegToRad(v.vision.angleDeg) / 2;
    const charging = v.isCharging;

    g.fillStyle(charging ? 0xe0574f : 0xf0c040, charging ? 0.22 : 0.11);
    g.beginPath();
    g.moveTo(v.x, originY);
    g.arc(v.x, originY, v.vision.distance, v.vision.facing - half, v.vision.facing + half, false);
    g.closePath();
    g.fillPath();
  }
}
