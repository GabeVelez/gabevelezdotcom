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

    // Player spawn position depends on entry direction
    let playerX = 64;
    let playerY = 40; // Default: Enter at top-left

    if (this.entryDirection === "north") {
      // Coming from Corridor (direction north) - spawn at Enter (top-left)
      playerX = 64;
      playerY = 40;
    } else if (this.entryDirection === "south") {
      // Coming back from Storage Bay - spawn near Exit (bottom-right)
      playerX = 400;
      playerY = 250;
    }

    this.createPlayer(playerX, playerY);

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

    // Exits
    // Top-left exit: to Warehouse Corridor (Enter gap - going back north/up)
    this.createExit(64, 8, 50, 20, "WarehouseCorridorScene", "north");

    // Bottom-right exit: to Storage Bay (Exit gap - going forward south/down)
    // Gap is from x=389.375 to x=441.5, center at ~415
    this.createExit(415, 276, 50, 16, "StorageBayScene", "south");

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
