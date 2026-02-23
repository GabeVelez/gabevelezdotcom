import { BaseRoomScene } from "../BaseRoomScene.js";

/**
 * Cell with Bed - Starting room
 * Player wakes up here and must escape to the corridor
 */
export class CellScene extends BaseRoomScene {
  constructor() {
    super("CellScene");
  }

  create() {
    const { width, height } = this.scale;

    // Cell is 224x160 (14 tiles × 10 tiles)
    // Center on 320x180 canvas: offset (48, 10)
    const cellOffsetX = 48;
    const cellOffsetY = 10;

    // Add cell background image (scale to 224×160)
    const cellBg = this.add.image(cellOffsetX, cellOffsetY, "cell_layout");
    cellBg.setOrigin(0, 0);
    cellBg.setDisplaySize(224, 160); // 14 tiles × 10 tiles at 16px each
    cellBg.setDepth(0);

    // Create invisible tilemap for collision only
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 14,
      height: 10
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.x = cellOffsetX;
    ground.y = cellOffsetY;
    ground.setVisible(false); // Invisible - only used for collision

    // Setup collision tiles
    ground.fill(1, 0, 0, 14, 10); // Fill with walkable

    // Top wall - 2 rows deep (rows 0-1)
    for (let x = 0; x < 14; x++) {
      ground.putTileAt(2, x, 0);
      ground.putTileAt(2, x, 1);
    }

    // Bottom wall - half tile height (custom physics body instead of tilemap)
    // Will add custom collision below

    // Left wall - 1 column (column 0)
    for (let y = 0; y < 10; y++) {
      ground.putTileAt(2, 0, y);
    }

    // Right wall - 1 column (column 13)
    for (let y = 0; y < 10; y++) {
      ground.putTileAt(2, 13, y);
    }

    // Cot bed collision - will use custom physics body for 1.5 tile width

    ground.setCollisionByExclusion([1, 3]);
    this.groundLayer = ground;

    // Create base systems
    this.createBaseSystems();

    // Create player in center of walkable floor area
    this.createPlayer(cellOffsetX + 112, cellOffsetY + 80);

    // Create guards array (no guards in cell - it's a prison cell)
    this.createGuards();

    // Setup vision system
    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Create exit zone at hole in bottom-right corner (player falls through)
    // Hole is at bottom-right corner
    const holeX = cellOffsetX + (12 * 16); // Moved right
    const holeY = cellOffsetY + (8.5 * 16);
    this.createExit(holeX, holeY, 28, 28, "CorridorScene", "north");

    // Mark this exit as a "hole" type for special animation
    if (this._exits && this._exits.length > 0) {
      this._exits[0].isHole = true;
    }

    // Setup physics
    this.physics.add.collider(this.player, ground);

    // Bottom wall - custom half-height collision (8 pixels tall)
    const bottomWall = this.add.rectangle(
      cellOffsetX + 112, // Center of cell width
      cellOffsetY + 156, // Bottom of cell (160 - 4 pixels)
      224, // Full width
      8,   // Half tile height
      0x000000,
      0
    );
    this.physics.add.existing(bottomWall, true); // true = static body
    this.physics.add.collider(this.player, bottomWall);

    // Cot bed - custom 1.5 tile width collision (24 pixels wide, 64 pixels tall)
    const cotBed = this.add.rectangle(
      cellOffsetX + 28,  // Column 1.75 center (1.5 tiles wide starting at column 1)
      cellOffsetY + 88,  // Row 5.5 center (rows 4-7)
      24,  // 1.5 tiles wide
      64,  // 4 tiles tall
      0x000000,
      0
    );
    this.physics.add.existing(cotBed, true);
    this.physics.add.collider(this.player, cotBed);

    // Camera - don't follow player, keep view centered on full canvas
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.scrollX = 0;
    this.cameras.main.scrollY = 0;
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
