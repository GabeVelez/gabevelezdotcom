import { BaseRoomScene } from "../BaseRoomScene.js";
import { Guard } from "../../entities/Guard.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Warehouse Main - Large bottom area with multiple rooms
 * Exit north to Warehouse Corridor, exit south to Storage Bay
 */
export class WarehouseMainScene extends BaseRoomScene {
  constructor() {
    super("WarehouseMainScene");
    this.levelLabel = "LVL 4: Warehouse";
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
      exitZone: { scene: "StorageBayScene", direction: "south", entryDirection: "north" }
    });

    this.createPlayer(spawnPos.x, spawnPos.y);

    this.createGuards();

    // Two regular guards, the weakest kind, sweeping the only two lanes that
    // cross the room. The shelving in the middle (x 104-378, y 77-203) is one
    // solid block, so getting from the door at the top-left to the exit at the
    // bottom-right means going round it, and both ways round pass through one
    // of these two. They are the difficulty here, not the count.
    //
    // Sweeps are deliberately different lengths, 320px against 265px, so they
    // drift out of phase instead of pacing in lockstep for the whole level.

    // Top lane, y 26-203... the strip above the shelving. Starts clear of the
    // door so the player is not spawned in front of him.
    const topGuard = new Guard(this, 120, 62, [
      { x: 120, y: 62 },
      { x: 440, y: 62 },
    ]);
    topGuard.setDepth(10);
    this.guards.push(topGuard);

    // Bottom lane, and the one the exit is on. He stops short of the exit
    // alcove at x 398 so there is a pocket to arrive in rather than a guard
    // parked on the way out.
    const bottomGuard = new Guard(this, 130, 250, [
      { x: 130, y: 250 },
      { x: 395, y: 250 },
    ]);
    bottomGuard.setDepth(10);
    this.guards.push(bottomGuard);

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
