import { BaseRoomScene } from "../BaseRoomScene.js";
import { Guard } from "../../entities/Guard.js";
import { LeadGuard } from "../../entities/LeadGuard.js";
import { SmokeGrenade } from "../../entities/SmokeGrenade.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Storage Bay - Level 5
 * Size: 400×320 pixels
 * Guards: 2 Regular (synchronized vertical patrols), 1 Lead (horizontal), 1 Overseer (center rotating)
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
    let playerX = 200; // Center
    let playerY = 40; // Coming from WarehouseMain (north entrance)

    if (this.entryDirection === "north") {
      // Coming from WarehouseMain - spawn at top center
      playerX = 200;
      playerY = 40;
    } else if (this.entryDirection === "south") {
      // Coming back from LoadingDock - spawn near exit
      playerX = 200;
      playerY = 270;
    }

    this.createPlayer(playerX, playerY);

    // Create guards
    this.createGuards();

    // Guard 1: Regular - synchronized vertical patrol (left side)
    const guard1 = new Guard(this, 60, 60, [
      { x: 60, y: 60 },
      { x: 60, y: 200 },
      { x: 60, y: 60 }
    ]);
    guard1.setDepth(10);
    this.guards.push(guard1);

    // Guard 2: Regular - synchronized vertical patrol (right side, same timing)
    const guard2 = new Guard(this, 340, 60, [
      { x: 340, y: 60 },
      { x: 340, y: 200 },
      { x: 340, y: 60 }
    ]);
    guard2.setDepth(10);
    this.guards.push(guard2);

    // Guard 3: Lead Guard #1 - horizontal patrol (top)
    const guard3 = new LeadGuard(this, 150, 50, [
      { x: 150, y: 50 },
      { x: 250, y: 50 }
    ]);
    guard3.setDepth(10);
    this.guards.push(guard3);

    // Guard 4: Lead Guard #2 - center rotating patrol
    const guard4 = new LeadGuard(this, 200, 160, [
      { x: 200, y: 160 },
      { x: 200, y: 120 }
    ]);
    guard4.setDepth(10);
    this.guards.push(guard4);

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
    // Note: WarehouseMain exit is at (432, 240), so we spawn at top
    // This is not a real exit - player enters from north, no return exit needed

    // Bottom: to LoadingDock at (200,300)
    this.createExit(200, 300, 32, 32, "LoadingDockScene", "north");

    // Physics - add colliders for all collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
      for (const g of this.guards) {
        this.physics.add.collider(g, body);
      }
    });

    // Camera
    this.cameras.main.setBounds(0, 0, storageBayWidth, storageBayHeight);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
