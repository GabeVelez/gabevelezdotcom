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

    // Setup collision tiles (matching background layout)
    ground.fill(1, 0, 0, 18, 11); // Fill with walkable

    // Top wall - triple height (rows 0, 1, 2)
    for (let x = 0; x < 18; x++) {
      ground.putTileAt(2, x, 0);
      ground.putTileAt(2, x, 1);
      ground.putTileAt(2, x, 2);
    }

    // Bottom wall - reduced by 60% (only 40% width = ~7 tiles on left side)
    for (let x = 0; x < 7; x++) {
      ground.putTileAt(2, x, 10);
    }

    // Left wall - full height
    for (let y = 0; y < 11; y++) {
      ground.putTileAt(2, 0, y);
    }

    // Right wall - reduced by 70% (only 30% height = ~3 tiles at top)
    for (let y = 0; y < 3; y++) {
      ground.putTileAt(2, 17, y);
    }

    // Ladder exit area at top-right (tiles 15-16, rows 0-2) - lined up next to right wall
    // Clear tiles for ladder passage through triple-height top wall
    for (let row = 0; row < 3; row++) {
      ground.putTileAt(1, 15, row);
      ground.putTileAt(1, 16, row);
    }

    // Central pipe obstacles (adjust based on actual background layout)
    // These can be refined once we see the generated image
    ground.putTileAt(2, 8, 5);
    ground.putTileAt(2, 9, 5);

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

    // Exit at top-right: ladder leading up to warehouse corridor
    // Position at tiles (15-16, rows 0-2) center, accounting for offset
    const ladderX = sewerOffsetX + (15.5 * 16); // Center of tiles 15-16
    const ladderY = sewerOffsetY + (1.5 * 16); // Center of 3-row ladder area (rows 0-2)
    this.createExit(ladderX, ladderY, 32, 48, "WarehouseCorridorScene", "south"); // Taller exit (48px = 3 tiles)

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
