import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // --- Title screen ---
    this.load.image("titlescreen", "assets/titlescreen.png");

    // --- Game over screen ---
    this.load.image("gameover", "assets/gameover.png");

    // --- Audio ---
    this.load.audio("intro_music", "assets/moodmode-that-8-bit-music-322062.mp3");
    this.load.audio("gameover_sound", "assets/universfield-game-over-deep-male-voice-clip-352695.mp3");
    this.load.audio("alert", "assets/alert.mp3");

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

    // --- Guard sprite sheets (soldier1, 5 frames each) ---
    this.load.spritesheet("guard-front", "assets/soldier1-front.png", {
      frameWidth: 256,
      frameHeight: 339
    });
    this.load.spritesheet("guard-back", "assets/soldier1-back.png", {
      frameWidth: 256,
      frameHeight: 333
    });
    this.load.spritesheet("guard-left", "assets/soldier1-left.png", {
      frameWidth: 249,
      frameHeight: 305
    });
    this.load.spritesheet("guard-right", "assets/soldier1-right.png", {
      frameWidth: 249,
      frameHeight: 305
    });

    // --- Overseer sprite sheets (5 frames each) ---
    this.load.spritesheet("overseer-front", "assets/overseer-front.png", {
      frameWidth: 252,
      frameHeight: 332
    });
    this.load.spritesheet("overseer-back", "assets/overseer-back.png", {
      frameWidth: 250,
      frameHeight: 275
    });
    this.load.spritesheet("overseer-left", "assets/overseer-left.png", {
      frameWidth: 250,
      frameHeight: 319
    });
    this.load.spritesheet("overseer-right", "assets/overseer-right.png", {
      frameWidth: 250,
      frameHeight: 319
    });

    // --- Placeholder entity textures ---
    this._makePlaceholderTexture("lead_guard", 16, 24, 0xff8800);
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
