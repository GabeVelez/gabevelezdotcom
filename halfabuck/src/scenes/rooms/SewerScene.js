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

    // Sewer is 288x176 (18 tiles × 11 tiles)
    // Center on 320x180 canvas: offset (16, 2)
    const sewerOffsetX = 16;
    const sewerOffsetY = 2;

    // Add sewer background image (scale to 288×176)
    const sewerBg = this.add.image(sewerOffsetX, sewerOffsetY, "sewer_layout");
    sewerBg.setOrigin(0, 0);
    sewerBg.setDisplaySize(288, 176); // 18 tiles × 11 tiles at 16px each
    sewerBg.setDepth(0);

    // Create invisible tilemap for collision only
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 18,
      height: 11
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.x = sewerOffsetX;
    ground.y = sewerOffsetY;
    ground.setVisible(false); // Invisible - only used for collision

    // Setup collision tiles (matching background layout from image)
    ground.fill(1, 0, 0, 18, 11); // Fill with walkable

    // Top-left pipe block (columns 0-5, rows 0-3)
    for (let x = 0; x <= 5; x++) {
      for (let y = 0; y <= 3; y++) {
        ground.putTileAt(2, x, y);
      }
    }

    // Top-right pipe block (columns 12-17, rows 0-3)
    for (let x = 12; x <= 17; x++) {
      for (let y = 0; y <= 3; y++) {
        ground.putTileAt(2, x, y);
      }
    }

    // Left wall pipes (columns 0-2, rows 4-9)
    for (let x = 0; x <= 2; x++) {
      for (let y = 4; y <= 9; y++) {
        ground.putTileAt(2, x, y);
      }
    }

    // Right wall pipes - top segment (columns 15-17, rows 4-6)
    for (let x = 15; x <= 17; x++) {
      for (let y = 4; y <= 6; y++) {
        ground.putTileAt(2, x, y);
      }
    }

    // Right wall pipes - bottom segment (columns 15-17, rows 7-10)
    for (let x = 15; x <= 17; x++) {
      for (let y = 7; y <= 10; y++) {
        ground.putTileAt(2, x, y);
      }
    }

    // Bottom-left pipes (columns 0-6, row 10)
    for (let x = 0; x <= 6; x++) {
      ground.putTileAt(2, x, 10);
    }

    // Bottom-right pipes (columns 11-17, row 10)
    for (let x = 11; x <= 17; x++) {
      ground.putTileAt(2, x, 10);
    }

    // Green ladder exit area (column 17, full height)
    // Clear the rightmost column for ladder passage
    for (let y = 0; y <= 10; y++) {
      ground.putTileAt(3, 17, y); // Use tile 3 (shadow/walkable) for ladder
    }

    ground.setCollisionByExclusion([1, 3]);
    this.groundLayer = ground;

    this.createBaseSystems();

    // Player spawn at bottom-center (falling from cell above)
    // Account for offset
    let playerX = sewerOffsetX + (9 * 16); // Center of 18-tile width
    let playerY = sewerOffsetY + (9 * 16); // Near bottom

    this.createPlayer(playerX, playerY);

    // No guards in sewer - safe transitional space
    this.createGuards(); // Initialize empty guards array

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Exit at right edge: green ladder leading up to warehouse corridor
    // Position at column 17 (rightmost), full height
    const ladderX = sewerOffsetX + (17 * 16) + 8; // Center of column 17
    const ladderY = sewerOffsetY + (5.5 * 16); // Center vertically (middle of 11 rows)
    this.createExit(ladderX, ladderY, 16, 176, "WarehouseCorridorScene", "south"); // Full height (11 tiles = 176px)

    // Physics
    this.physics.add.collider(this.player, ground);

    // Camera - bounds match tilemap size with offset
    this.cameras.main.setBounds(
      sewerOffsetX,
      sewerOffsetY,
      map.widthInPixels,
      map.heightInPixels
    );
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
