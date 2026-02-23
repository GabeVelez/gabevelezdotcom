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
    // Red pixels = collision (tile 2), Gray/dark pixels = walkable (tile 1), Green pixels = exit walkable (tile 1)
    const collisionImage = this.textures.get('sewer_collision').getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = collisionImage.width;
    canvas.height = collisionImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(collisionImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tileWidth = canvas.width / 18;
    const tileHeight = canvas.height / 11;

    let exitZone = null;

    // Sample center of each tile to determine type
    for (let tileY = 0; tileY < 11; tileY++) {
      for (let tileX = 0; tileX < 18; tileX++) {
        const pixelX = Math.floor((tileX + 0.5) * tileWidth);
        const pixelY = Math.floor((tileY + 0.5) * tileHeight);
        const index = (pixelY * canvas.width + pixelX) * 4;

        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];

        // Detect green exit area (STRICT: green must be very dominant and bright)
        if (g > 200 && g > r * 2 && g > b * 2) {
          ground.putTileAt(1, tileX, tileY); // Walkable
          if (!exitZone) {
            exitZone = { minX: tileX, maxX: tileX, minY: tileY, maxY: tileY };
          } else {
            exitZone.minX = Math.min(exitZone.minX, tileX);
            exitZone.maxX = Math.max(exitZone.maxX, tileX);
            exitZone.minY = Math.min(exitZone.minY, tileY);
            exitZone.maxY = Math.max(exitZone.maxY, tileY);
          }
        }
        // Detect gray/dark walkable areas (low RGB values, all similar, not too bright)
        else if (r < 120 && g < 120 && b < 120 && Math.abs(r - g) < 40 && Math.abs(g - b) < 40) {
          ground.putTileAt(1, tileX, tileY); // Walkable
        }
        // Red areas and everything else = collision
        else {
          ground.putTileAt(2, tileX, tileY); // Collision
        }
      }
    }

    console.log('Exit zone detected:', exitZone);

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

    // Create exit zone based on detected green area from collision image
    if (exitZone) {
      const exitCenterX = (exitZone.minX + exitZone.maxX + 1) / 2;
      const exitCenterY = (exitZone.minY + exitZone.maxY + 1) / 2;
      const exitWidth = (exitZone.maxX - exitZone.minX + 1) * 16;
      const exitHeight = (exitZone.maxY - exitZone.minY + 1) * 16;

      const exitX = sewerOffsetX + (exitCenterX * 16);
      const exitY = sewerOffsetY + (exitCenterY * 16);
      console.log('Creating exit at:', exitX, exitY, 'size:', exitWidth, exitHeight);
      this.createExit(exitX, exitY, exitWidth, exitHeight, "WarehouseCorridorScene", "east");
    } else {
      console.error('No green exit zone detected! Using fallback exit.');
      // Fallback exit in top-right corner
      const exitX = sewerOffsetX + (17 * 16);
      const exitY = sewerOffsetY + (2 * 16);
      this.createExit(exitX, exitY, 32, 64, "WarehouseCorridorScene", "east");
    }

    this.physics.add.collider(this.player, ground);

    this.cameras.main.setBounds(sewerOffsetX, sewerOffsetY, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
