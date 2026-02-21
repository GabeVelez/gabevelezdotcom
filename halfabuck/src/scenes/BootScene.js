import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // --- Title screen ---
    this.load.image("titlescreen", "assets/titlescreen.png");

    // --- Tilemap assets (Tiled JSON + tileset image) ---
    this.load.image("warehouse_tiles", "assets/tiles/warehouse_tiles.png");
    this.load.tilemapTiledJSON("warehouse_map", "assets/maps/warehouse.json");

    // --- Player sprite sheets (5 frames each, separate files per direction) ---
    this.load.spritesheet("gabe-front", "assets/gabe-front.png", {
      frameWidth: 213,
      frameHeight: 265
    });
    this.load.spritesheet("gabe-back", "assets/gabe-back.png", {
      frameWidth: 202,
      frameHeight: 169
    });
    this.load.spritesheet("gabe-left", "assets/gabe-left.png", {
      frameWidth: 208,
      frameHeight: 227
    });
    this.load.spritesheet("gabe-right", "assets/gabe-right.png", {
      frameWidth: 211,
      frameHeight: 213
    });

    // --- Placeholder entity textures ---
    this._makePlaceholderTexture("guard", 16, 24, 0xffffff);
    this._makePlaceholderTexture("box", 16, 16, 0xffffff);
  }

  create() {
    this.scene.start("IntroScene");
  }

  _makePlaceholderTexture(key, w, h, color) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color, 1);
    g.fillRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
