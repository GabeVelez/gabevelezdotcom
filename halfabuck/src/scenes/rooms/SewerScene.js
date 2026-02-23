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

    // Add sewer background image
    const sewerBg = this.add.image(sewerOffsetX, sewerOffsetY, "sewer_layout");
    sewerBg.setOrigin(0, 0);
    sewerBg.setDisplaySize(288, 176);
    sewerBg.setDepth(0);

    // Create invisible tilemap for collision
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
    ground.setVisible(false);

    // FILL EVERYTHING WITH COLLISION (red background)
    ground.fill(2, 0, 0, 18, 11);

    // CARVE OUT GRAY WALKABLE AREAS from sewercollision.jpg:

    // Top-left gray walkable block (columns 1-5, rows 2-3)
    for (let x = 1; x <= 5; x++) {
      for (let y = 2; y <= 3; y++) {
        ground.putTileAt(1, x, y);
      }
    }

    // Top-center gray walkable area (columns 6-10, rows 2-3)
    for (let x = 6; x <= 10; x++) {
      for (let y = 2; y <= 3; y++) {
        ground.putTileAt(1, x, y);
      }
    }

    // Top-right gray walkable block (columns 11-13, rows 2-3)
    for (let x = 11; x <= 13; x++) {
      for (let y = 2; y <= 3; y++) {
        ground.putTileAt(1, x, y);
      }
    }

    // Left-middle gray walkable area (columns 1-2, rows 4-7)
    for (let x = 1; x <= 2; x++) {
      for (let y = 4; y <= 7; y++) {
        ground.putTileAt(1, x, y);
      }
    }

    // Center large gray walkable area (columns 3-13, rows 4-7)
    for (let x = 3; x <= 13; x++) {
      for (let y = 4; y <= 7; y++) {
        ground.putTileAt(1, x, y);
      }
    }

    // Right-middle gray walkable area (columns 14-16, rows 4-7)
    for (let x = 14; x <= 16; x++) {
      for (let y = 4; y <= 7; y++) {
        ground.putTileAt(1, x, y);
      }
    }

    // Bottom-left gray walkable (columns 1-5, rows 8-9)
    for (let x = 1; x <= 5; x++) {
      for (let y = 8; y <= 9; y++) {
        ground.putTileAt(1, x, y);
      }
    }

    // Bottom-center gray walkable passage (columns 6-11, rows 8-9)
    for (let x = 6; x <= 11; x++) {
      for (let y = 8; y <= 9; y++) {
        ground.putTileAt(1, x, y);
      }
    }

    // Bottom-right gray walkable (columns 12-16, rows 8-9)
    for (let x = 12; x <= 16; x++) {
      for (let y = 8; y <= 9; y++) {
        ground.putTileAt(1, x, y);
      }
    }

    // Bottom passage gap (columns 5-7, row 10)
    for (let x = 5; x <= 7; x++) {
      ground.putTileAt(1, x, 10);
    }

    // GREEN LADDER - walkable exit (column 17, all rows)
    for (let y = 0; y <= 10; y++) {
      ground.putTileAt(1, 17, y);
    }

    ground.setCollisionByExclusion([1]);
    this.groundLayer = ground;

    this.createBaseSystems();

    // Player spawn in center walkable area
    let playerX = sewerOffsetX + (8 * 16);
    let playerY = sewerOffsetY + (6 * 16);

    this.createPlayer(playerX, playerY);

    this.createGuards();
    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Green ladder exit (column 17, full height)
    const ladderX = sewerOffsetX + (17 * 16) + 8;
    const ladderY = sewerOffsetY + (5.5 * 16);
    this.createExit(ladderX, ladderY, 16, 176, "WarehouseCorridorScene", "south");

    this.physics.add.collider(this.player, ground);

    this.cameras.main.setBounds(sewerOffsetX, sewerOffsetY, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
