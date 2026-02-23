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

    // Load collision data from sewercollision.jpg image
    // Pink/Magenta pixels = collision (tile 2), Gray/dark pixels = walkable (tile 1)
    const collisionImage = this.textures.get('sewer_collision').getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = collisionImage.width;
    canvas.height = collisionImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(collisionImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tileWidth = canvas.width / 18;
    const tileHeight = canvas.height / 11;

    // Sample center of each tile to determine type
    for (let tileY = 0; tileY < 11; tileY++) {
      for (let tileX = 0; tileX < 18; tileX++) {
        const pixelX = Math.floor((tileX + 0.5) * tileWidth);
        const pixelY = Math.floor((tileY + 0.5) * tileHeight);
        const index = (pixelY * canvas.width + pixelX) * 4;

        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];

        // Detect gray/dark walkable areas (low RGB values, all similar)
        if (r < 150 && g < 150 && b < 150 && Math.abs(r - g) < 50 && Math.abs(g - b) < 50) {
          ground.putTileAt(1, tileX, tileY); // Walkable
        }
        // Pink/Magenta and everything else = collision
        else {
          ground.putTileAt(2, tileX, tileY); // Collision
        }
      }
    }

    ground.setCollisionByExclusion([1]);
    this.groundLayer = ground;

    this.createBaseSystems();

    // Player spawn on left walkable platform (at X location)
    let playerX = sewerOffsetX + (2.5 * 16);
    let playerY = sewerOffsetY + (4.5 * 16);

    this.createPlayer(playerX, playerY);

    this.createGuards();
    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Exit zone at ladder on the right side (hardcoded for now)
    const exitX = sewerOffsetX + (17 * 16);
    const exitY = sewerOffsetY + (2 * 16);
    this.createExit(exitX, exitY, 16, 64, "WarehouseCorridorScene", "east");

    this.physics.add.collider(this.player, ground);

    this.cameras.main.setBounds(sewerOffsetX, sewerOffsetY, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
