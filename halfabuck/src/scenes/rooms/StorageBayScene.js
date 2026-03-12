import { BaseRoomScene } from "../BaseRoomScene.js";
import { SmokeGrenade } from "../../entities/SmokeGrenade.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Storage Bay - Level 5
 * Size: 400×320 pixels
 * Contains: Smoke Grenade collectible at (360,280)
 * Exit: To LoadingDockScene at (200,300)
 */
export class StorageBayScene extends BaseRoomScene {
  constructor() {
    super("StorageBayScene");
  }

  create() {
    // Storage Bay is 400x320 (25 tiles × 20 tiles)
    this.storageBayWidth = 400;
    this.storageBayHeight = 320;

    // Add storage bay background image immediately
    const storageBayBg = this.add.image(0, 0, "storage_bay_layout");
    storageBayBg.setOrigin(0, 0);
    storageBayBg.setDisplaySize(this.storageBayWidth, this.storageBayHeight);
    storageBayBg.setDepth(0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    const { width, height } = this.scale;
    const storageBayWidth = this.storageBayWidth;
    const storageBayHeight = this.storageBayHeight;

    // Load collision from SVG file
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/storage-bay-collision.svg"
    );

    // Store for reference (needed for vision system)
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // Player spawn position depends on entry direction
    let playerX = 335; // Top-right "Enter" area
    let playerY = 20; // Coming from WarehouseMain (enters from top-right)

    if (this.entryDirection === "south") {
      // Coming from WarehouseMain (exit direction south) - spawn at top-right Enter area
      playerX = 335;
      playerY = 20;
    } else if (this.entryDirection === "north") {
      // Coming back from LoadingDock - spawn near exit at bottom-left Exit area
      playerX = 55;
      playerY = 310;
    }

    this.createPlayer(playerX, playerY);

    // Create guards (guards will be added board by board)
    this.createGuards();

    // Create a simple tilemap for vision/waypoint systems (walkable everywhere except collisions)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 25,
      height: 20
    });
    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.fill(1, 0, 0, 25, 20); // All walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Add Smoke Grenade collectible at (360,280)
    const smokeGrenade = new SmokeGrenade(this, 360, 280, {
      throwDistance: 150,
      smokeRadius: 80,
      smokeDuration: 5000
    });
    this.items.push(smokeGrenade);

    // Exits
    // Top: back to WarehouseMain
    // Note: WarehouseMain exit is at (410, 272), so we spawn at top-right
    // This is not a real exit - player enters from north, no return exit needed

    // Bottom-left: to LoadingDock at Exit area (55,310)
    this.createExit(55, 310, 32, 32, "LoadingDockScene", "north");

    // Physics - add colliders for all collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
    });

    // Camera
    this.cameras.main.setBounds(0, 0, storageBayWidth, storageBayHeight);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
