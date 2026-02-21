import { BaseRoomScene } from "../BaseRoomScene.js";
import { Guard } from "../../entities/Guard.js";

/**
 * Corridor - Long hallway connecting cell to warehouse rooms
 * First guard encounter
 */
export class CorridorScene extends BaseRoomScene {
  constructor() {
    super("CorridorScene");
  }

  create() {
    const { width, height } = this.scale;

    // Create long corridor layout
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 20,
      height: 20
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);

    // Fill floor
    ground.fill(1, 0, 0, 20, 20);

    // Create walls
    for (let x = 0; x < 20; x++) {
      ground.putTileAt(2, x, 0); // Top wall
      ground.putTileAt(2, x, 19); // Bottom wall
    }
    for (let y = 0; y < 20; y++) {
      ground.putTileAt(2, 0, y); // Left wall
      ground.putTileAt(2, 19, y); // Right wall
    }

    // Exit to cell (top)
    ground.putTileAt(1, 9, 0);
    ground.putTileAt(1, 10, 0);

    // Exit to warehouse rooms (bottom)
    ground.putTileAt(1, 9, 19);
    ground.putTileAt(1, 10, 19);

    // Add some obstacles (boxes/crates) for cover
    ground.putTileAt(2, 5, 5);
    ground.putTileAt(2, 6, 5);
    ground.putTileAt(2, 14, 10);
    ground.putTileAt(2, 15, 10);

    // Add shadow tiles for hiding spots
    ground.putTileAt(3, 3, 8);
    ground.putTileAt(3, 4, 8);

    ground.setCollisionByExclusion([1, 3]);
    this.groundLayer = ground;

    this.createBaseSystems();

    // Player spawn position depends on entry direction
    let playerX = 160;
    let playerY = 32;
    if (this.entryDirection === "south") {
      playerY = 288; // Coming from bottom
    }
    this.createPlayer(playerX, playerY);

    // Create one guard patrolling corridor
    this.createGuards();
    const guard1 = new Guard(this, 160, 100, [
      { x: 160, y: 100 },
      { x: 160, y: 250 }
    ]);
    guard1.setDepth(10);
    this.guards.push(guard1);

    this.setupVisionSystem(ground);

    // Exits
    this.createExit(144, 0, 32, 16, "CellScene", "south");
    this.createExit(144, 304, 32, 16, "WarehouseMainScene", "north");

    // Physics
    this.physics.add.collider(this.player, ground);
    for (const g of this.guards) {
      this.physics.add.collider(g, ground);
    }

    // Camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
