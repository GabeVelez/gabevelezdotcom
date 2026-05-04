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
    this.levelLabel = "LVL 5: Storage Bay";
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

    // Setup exits from SVG and get spawn position
    const spawnPos = await this.setupExitsFromSVG("assets/exits/storage-bay-exits.svg", {
      enterZone: { scene: "WarehouseMainScene", direction: "north", entryDirection: "south" },
      exitZone: { scene: "LoadingDockScene", direction: "south", entryDirection: "north" }
    });

    this.createPlayer(spawnPos.x, spawnPos.y);

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
