import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Warehouse Main - Large bottom area with multiple rooms
 * Exit north to Warehouse Corridor, exit south to Storage Bay
 */
export class WarehouseMainScene extends BaseRoomScene {
  constructor() {
    super("WarehouseMainScene");
  }

  create() {
    // Warehouse Main is 480×288 (30 tiles × 18 tiles)
    this.warehouseWidth = 480;
    this.warehouseHeight = 288;

    // Use the temp layout PNG as background
    const bg = this.add.image(0, 0, "warehouse_main_layout");
    bg.setOrigin(0, 0);
    bg.setDisplaySize(this.warehouseWidth, this.warehouseHeight);
    bg.setDepth(0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    const { width, height } = this.scale;
    const warehouseWidth = this.warehouseWidth;
    const warehouseHeight = this.warehouseHeight;

    // Load collision from SVG file
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/warehouse-main-collision.svg"
    );

    // Store for reference (needed for vision system)
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // Setup exits from SVG and get spawn position
    const spawnPos = await this.setupExitsFromSVG("assets/exits/warehouse-main-exits.svg", {
      enterZone: { scene: "WarehouseCorridorScene", direction: "south", entryDirection: "north" },
      exitZone: { scene: "StorageBayScene", direction: "south", entryDirection: "south" }
    });

    this.createPlayer(spawnPos.x, spawnPos.y);

    // Create guards (guards will be added board by board)
    this.createGuards();

    // Create simple tilemap for vision/waypoint systems (walkable everywhere except collisions)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 30,
      height: 18
    });
    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.fill(1, 0, 0, 30, 18); // All walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Physics - add colliders for all collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
    });

    // Camera
    this.cameras.main.setBounds(0, 0, warehouseWidth, warehouseHeight);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
