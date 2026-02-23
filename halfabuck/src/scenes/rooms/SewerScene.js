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

    // Setup collision tiles based on sewercollision.jpg red overlay
    // Fill all with walkable first
    ground.fill(1, 0, 0, 18, 11);

    // TOP RED STRIP (rows 0-1, full width except ladder)
    for (let x = 0; x <= 16; x++) {
      ground.putTileAt(2, x, 0);
      ground.putTileAt(2, x, 1);
    }

    // TOP-LEFT RED BLOCK (columns 1-5, rows 2-3)
    for (let x = 1; x <= 5; x++) {
      for (let y = 2; y <= 3; y++) {
        ground.putTileAt(2, x, y);
      }
    }

    // TOP-RIGHT RED BLOCK (columns 11-13, rows 2-3)
    for (let x = 11; x <= 13; x++) {
      for (let y = 2; y <= 3; y++) {
        ground.putTileAt(2, x, y);
      }
    }

    // CENTER LARGE RED RECTANGLE (columns 5-12, rows 4-6)
    for (let x = 5; x <= 12; x++) {
      for (let y = 4; y <= 6; y++) {
        ground.putTileAt(2, x, y);
      }
    }

    // LEFT VERTICAL RED SECTIONS (columns 1-2, rows 4-9)
    for (let x = 1; x <= 2; x++) {
      for (let y = 4; y <= 9; y++) {
        ground.putTileAt(2, x, y);
      }
    }

    // RIGHT VERTICAL RED SECTIONS (columns 14-16, rows 4-9)
    for (let x = 14; x <= 16; x++) {
      for (let y = 4; y <= 9; y++) {
        ground.putTileAt(2, x, y);
      }
    }

    // BOTTOM LEFT RED (columns 0-4, row 10)
    for (let x = 0; x <= 4; x++) {
      ground.putTileAt(2, x, 10);
    }

    // BOTTOM RIGHT RED (columns 8-17, row 10)
    for (let x = 8; x <= 17; x++) {
      ground.putTileAt(2, x, 10);
    }

    // GREEN LADDER AREA - keep as walkable (column 17, rows 0-10)
    for (let y = 0; y <= 10; y++) {
      ground.putTileAt(3, 17, y); // Shadow tile (walkable)
    }

    ground.setCollisionByExclusion([1, 3]);
    this.groundLayer = ground;

    this.createBaseSystems();

    // Player spawn at bottom-center passage (between bottom red areas)
    let playerX = sewerOffsetX + (6 * 16); // Column 6 (center of gap)
    let playerY = sewerOffsetY + (9.5 * 16); // Row 9.5 (near bottom)

    this.createPlayer(playerX, playerY);

    // No guards in sewer - safe transitional space
    this.createGuards();

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Green ladder exit at far right (column 17, full height)
    const ladderX = sewerOffsetX + (17 * 16) + 8; // Center of column 17
    const ladderY = sewerOffsetY + (5.5 * 16); // Center vertically
    this.createExit(ladderX, ladderY, 16, 176, "WarehouseCorridorScene", "south");

    // Physics
    this.physics.add.collider(this.player, ground);

    // Camera
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
