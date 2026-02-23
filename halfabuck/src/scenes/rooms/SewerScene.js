import { BaseRoomScene } from "../BaseRoomScene.js";

/**
 * Sewer - Dark transitional space beneath the cell
 * Small safe area with ladder exit to warehouse corridor
 */
export class SewerScene extends BaseRoomScene {
  constructor() {
    super("SewerScene");
  }

  create() {
    const { width, height } = this.scale;

    // Create sewer layout - wider than cell, short transitional space
    // 18 tiles wide × 12 tiles tall (288×192 pixels)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 18,
      height: 12
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);

    // Fill floor with darker tile (temporary - will be replaced with background image)
    ground.fill(1, 0, 0, 18, 12);

    // Create walls for sewer boundaries
    for (let x = 0; x < 18; x++) {
      ground.putTileAt(2, x, 0); // Top wall
      ground.putTileAt(2, x, 11); // Bottom wall
    }
    for (let y = 0; y < 12; y++) {
      ground.putTileAt(2, 0, y); // Left wall
      ground.putTileAt(2, 17, y); // Right wall
    }

    // Ladder exit area at top-right (tiles 15-16, row 0)
    // Clear tiles for ladder passage
    ground.putTileAt(1, 15, 0);
    ground.putTileAt(1, 16, 0);

    // Add some pipe obstacles in center (placeholder until background image)
    ground.putTileAt(2, 8, 5);
    ground.putTileAt(2, 9, 5);
    ground.putTileAt(2, 8, 6);
    ground.putTileAt(2, 9, 6);

    ground.setCollisionByExclusion([1, 3]);
    this.groundLayer = ground;

    this.createBaseSystems();

    // Player spawn at bottom-center (falling from cell above)
    // Center horizontally, near bottom
    let playerX = 144; // Center of 18-tile width (9 * 16)
    let playerY = 160; // Near bottom, spawn from fall

    this.createPlayer(playerX, playerY);

    // No guards in sewer - safe transitional space
    this.createGuards(); // Initialize empty guards array

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Exit at top-right: ladder leading up to warehouse corridor
    // Position at tiles (15-16, 0) center = (248, 8)
    this.createExit(248, 20, 32, 32, "WarehouseCorridorScene", "south");

    // Physics
    this.physics.add.collider(this.player, ground);

    // Camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
