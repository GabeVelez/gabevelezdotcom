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

    // Executive Wing is 544×320 pixels
    this.wingWidth = 544;
    this.wingHeight = 320;

    // Add background image immediately
    const wingBg = this.add.image(0, 0, "executive_wing_layout");
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

    // Player spawn position - depends on entry direction
    let playerX = 80;
    let playerY = 160; // Center left, entering from Security Office

    if (this.entryDirection === "north") {
      // Coming from Security Office
      playerX = 80;
      playerY = 160;
    }

    this.createPlayer(playerX, playerY);

    // No guards here, but the array and vision system still need to exist:
    // BaseRoomScene's update loop iterates them unconditionally.
    this.createGuards();

    // Create a simple tilemap for vision/waypoint systems (walkable everywhere except collisions)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 34,
      height: 20
    });
    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.fill(1, 0, 0, 34, 20); // All walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // --- The confrontation ------------------------------------------------
    // Run in, grab the water, press it. The throw itself plays as a cutscene
    // (glass in flight, the hit, him screaming) rather than an in-game arc.
    // Control returns here with him down and the way past open.

    const water = new Item(this, 120, 120, {
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

    // Stairs to the roof, past him. Shut until he is down, so he cannot simply
    // be walked around.
    this.createExit(360, 110, 28, 60, "RooftopHelipadScene", "north");
    const roofExit = this._exits[this._exits.length - 1];
    roofExit.triggered = !this.villainDefeated;

    const villain = this.createThrowTarget(250, 110, {
      texture: "villain",
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
      // Back from the throw cutscene: he is down and the stairs are open.
      villain.defeated = true;
      villain.sprite.setAlpha(0.55).setAngle(12);
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
