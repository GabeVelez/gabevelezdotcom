import { BaseRoomScene } from "../BaseRoomScene.js";
import { Guard } from "../../entities/Guard.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Warehouse Corridor - First guard encounter after climbing from sewer
 * Long hallway with 1 patrolling guard
 */
export class WarehouseCorridorScene extends BaseRoomScene {
  constructor() {
    super("WarehouseCorridorScene");
  }

  create() {
    // Corridor is 320x320 (20 tiles × 20 tiles)
    this.corridorWidth = 320;
    this.corridorHeight = 320;

    // Add corridor background image immediately
    const corridorBg = this.add.image(0, 0, "corridor_layout");
    corridorBg.setOrigin(0, 0);
    corridorBg.setDisplaySize(this.corridorWidth, this.corridorHeight);
    corridorBg.setDepth(0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    const { width, height } = this.scale;
    const corridorWidth = this.corridorWidth;
    const corridorHeight = this.corridorHeight;

    // Load collision from SVG file
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/corridor-collision.svg"
    );

    // Store for reference (needed for vision system)
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // Player spawn position depends on entry direction
    let playerX = 191; // To the left of manhole, 2/3 tile right (11px)
    let playerY = 60; // Below the exit zone with clearance

    if (this.entryDirection === "east") {
      // Coming from sewer - spawn to left of manhole
      playerX = 191; // Left of manhole, 2/3 tile right from original (manhole is at X=240)
      playerY = 60; // Below exit with enough clearance
    } else if (this.entryDirection === "north") {
      // Coming back from warehouse main (bottom entrance)
      playerX = 160;
      playerY = 270; // Spawn above exit zone
    }

    this.createPlayer(playerX, playerY);

    // Create one guard patrolling corridor - rectangular loop pattern
    // Starts by walking DOWN when player enters
    this.createGuards();
    const guard1 = new Guard(this, 130, 80, [
      { x: 130, y: 80 },  // Start at top-left
      { x: 130, y: 200 }, // Walk DOWN the left side (first movement)
      { x: 160, y: 200 }, // Walk RIGHT
      { x: 160, y: 160 }, // Walk UP
      { x: 160, y: 80 },  // Continue UP between first and second shelf rows
      { x: 130, y: 80 }   // Turn LEFT back to start (completes loop)
    ]);
    guard1.setDepth(10);
    this.guards.push(guard1);

    // Create a simple tilemap for vision/waypoint systems (walkable everywhere except collisions)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 20,
      height: 20
    });
    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.fill(1, 0, 0, 20, 20); // All walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Exits
    // Top: back to sewer (ladder down through manhole)
    this.createExit(240, 16, 32, 32, "SewerScene", "north");

    // Bottom: to warehouse main
    this.createExit(160, 300, 32, 32, "WarehouseMainScene", "north");

    // Physics - add colliders for all collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
      for (const g of this.guards) {
        this.physics.add.collider(g, body);
      }
    });

    // Camera
    this.cameras.main.setBounds(0, 0, corridorWidth, corridorHeight);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
