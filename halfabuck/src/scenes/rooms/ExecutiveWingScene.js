import { BaseRoomScene } from "../BaseRoomScene.js";
import { Item } from "../../entities/Item.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

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

    // No guards here, but the array and vision system still need to exist:
    // BaseRoomScene's update loop iterates them unconditionally.
    this.createGuards();

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

    // Out on the rug, a short step off the line between the door and the desk,
    // so it is something you go and get rather than something you trip over.
    const water = new Item(this, 150, 248, {
      id: "water_glass",
      name: "Glass of Water",
      description: "Ice cold. Somebody is about to wear it.",
      texture: "item_water",
      displaySize: 20,
      depth: 5,
      interactionRange: 40,
    });
    if (!this.villainDefeated) this.items.push(water);
    else water.destroy();

    // The lit alcove behind the desk. Shut until he is down, so he cannot
    // simply be walked around.
    this.createExit(192, 24, 56, 40, "RooftopHelipadScene", "north");
    const roofExit = this._exits[this._exits.length - 1];
    roofExit.triggered = !this.villainDefeated;

    const villain = this.createThrowTarget(184, 82, {
      // At his desk, facing down the room at the door you come through. The
      // desk is solid, so reaching the alcove behind him means going around it.
      texture: "villain-front",
      displaySize: 48,
      requiresItem: "water_glass",
      range: 110,
      instant: true, // the water_throw cutscene shows the throw itself
      onDefeated: () => {
        this.scene.start("CutsceneScene", {
          cutscene: "water_throw",
          next: "ExecutiveWingScene",
          nextData: { ...this.playerData, revealSeen: true, villainDefeated: true },
        });
      },
    });

    if (this.villainDefeated) {
      // Back from the throw cutscene: soaked, screaming, and no longer between
      // the player and the stairs.
      villain.defeated = true;
      villain.sprite.setTexture("villain-agony");
      villain.sprite.setDisplaySize(48, 48);
      villain.sprite.play("villain_agony");
      if (this.gameUI) {
        this.gameUI.showItemNotification("easter_egg", "Go. While he is down.");
      }
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
  }
}
