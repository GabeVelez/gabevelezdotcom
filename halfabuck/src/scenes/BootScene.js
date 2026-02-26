import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // --- UI Screens ---
    this.load.image("titlescreen", "assets/ui/titlescreen.png");
    this.load.image("surrounded", "assets/ui/surrounded.png");
    this.load.image("gameover", "assets/ui/gameover.png");

    // --- Audio ---
    this.load.audio("intro_music", "assets/audio/music/moodmode-that-8-bit-music-322062.mp3");
    this.load.audio("gameover_sound", "assets/audio/sfx/universfield-game-over-deep-male-voice-clip-352695.mp3");
    this.load.audio("surrounded_sound", "assets/audio/sfx/among-us-role-reveal-sound.mp3");
    this.load.audio("alert", "assets/audio/sfx/alert.mp3");
    this.load.audio("ground_impact", "assets/audio/sfx/universfield-ground-impact-352053.mp3");
    this.load.audio("item_pickup", "assets/audio/sfx/existentialtaco-confirm-tap-394001.mp3");
    this.load.audio("box_toggle", "assets/audio/sfx/oxidvideos-paper-slide-short-478835.mp3");
    this.load.audio("door_unlock", "assets/audio/sfx/existentialtaco-confirm-tap-394001.mp3"); // Reuse confirm sound for door unlock
    this.load.audio("toilet_flush", "assets/audio/sfx/toilet_flush.mp3"); // Easter egg sound

    // --- Tilemap assets (Tiled JSON + tileset image) ---
    this.load.image("warehouse_tiles", "assets/tiles/warehouse_tiles.png");
    this.load.tilemapTiledJSON("warehouse_map", "assets/maps/warehouse.json");

    // --- Scene backgrounds ---
    this.load.image("cell_layout", "assets/scenes/cell/cell-layout.png");
    this.load.image("sewer_layout", "assets/scenes/sewer/sewer-layout.png");
    this.load.image("corridor_layout", "assets/scenes/corridor/corridor-layout.png");
    this.load.image("storage_bay_layout", "assets/scenes/storage-bay/storage-bay-layout.png");
    this.load.image("loading_dock_layout", "assets/scenes/loading-dock/loading-dock-layout.png");
    this.load.image("security_office_layout", "assets/scenes/security-office/security-office-layout.png");
    this.load.image("maintenance_tunnel_layout", "assets/scenes/maintenance-tunnel/maintenance-tunnel-layout.png");
    this.load.image("rooftop_helipad_layout", "assets/scenes/rooftop-helipad/rooftop-helipad-layout.png");

    // --- Collision is loaded directly via SVGCollisionParser (no preloading needed) ---

    // --- Player sprite sheets (5 frames each, all uniformly 1050×210 = 5×210) ---
    this.load.spritesheet("gabe-front", "assets/sprites/player/gabe-front.png", {
      frameWidth: 210,
      frameHeight: 210
    });
    this.load.spritesheet("gabe-back", "assets/sprites/player/gabe-back.png", {
      frameWidth: 210,
      frameHeight: 210
    });
    this.load.spritesheet("gabe-left", "assets/sprites/player/gabe-left.png", {
      frameWidth: 210,
      frameHeight: 210
    });
    this.load.spritesheet("gabe-right", "assets/sprites/player/gabe-right.png", {
      frameWidth: 210,
      frameHeight: 210
    });

    // --- Guard sprite sheets (soldier1, 5 frames each) ---
    this.load.spritesheet("guard-front", "assets/sprites/guards/soldier1-front.png", {
      frameWidth: 256,
      frameHeight: 339
    });
    this.load.spritesheet("guard-back", "assets/sprites/guards/soldier1-back.png", {
      frameWidth: 256,
      frameHeight: 333
    });
    this.load.spritesheet("guard-left", "assets/sprites/guards/soldier1-left.png", {
      frameWidth: 249,
      frameHeight: 305
    });
    this.load.spritesheet("guard-right", "assets/sprites/guards/soldier1-right.png", {
      frameWidth: 249,
      frameHeight: 305
    });

    // --- Overseer sprite sheets (5 frames each) ---
    this.load.spritesheet("overseer-front", "assets/sprites/overseer/overseer-front.png", {
      frameWidth: 252,
      frameHeight: 332
    });
    this.load.spritesheet("overseer-back", "assets/sprites/overseer/overseer-back.png", {
      frameWidth: 250,
      frameHeight: 275
    });
    this.load.spritesheet("overseer-left", "assets/sprites/overseer/overseer-left.png", {
      frameWidth: 250,
      frameHeight: 319
    });
    this.load.spritesheet("overseer-right", "assets/sprites/overseer/overseer-right.png", {
      frameWidth: 250,
      frameHeight: 319
    });

    // --- Cell props ---
    this.load.image("cardboardbox", "assets/scenes/cell/cardboardbox.png");

    // --- Item sprites ---
    this.load.image("smoke_grenade", "assets/sprites/items/smoke-grenade.png");

    // --- Vehicle sprites ---
    this.load.image("helicopter", "assets/sprites/helicopter.png");

    // --- Effect sprites ---
    this.load.spritesheet("smoke_cloud", "assets/sprites/effects/smoke-cloud.png", {
      frameWidth: 80,
      frameHeight: 80
    });

    // --- Placeholder entity textures ---
    this._makePlaceholderTexture("lead_guard", 16, 24, 0xff8800);
    this._makePlaceholderTexture("box", 16, 16, 0xffffff);

    // --- Security Keycard and Door placeholders ---
    this._makePlaceholderTexture("security-keycard", 20, 32, 0xffff00); // Yellow keycard
    this._makePlaceholderTexture("locked-red", 16, 16, 0xff0000); // Red locked door
    this._makePlaceholderTexture("unlocked-green", 16, 16, 0x00ff00); // Green unlocked door

    // --- Cell placeholder tiles for layout ---
    this._makePlaceholderTexture("cell_floor", 16, 16, 0xadd8e6); // light blue
    this._makePlaceholderTexture("cell_wall_bottom", 16, 16, 0xff8800); // orange
    this._makePlaceholderTexture("cell_wall_left", 16, 16, 0xd2b48c); // tan
    this._makePlaceholderTexture("cell_wall_right", 16, 16, 0xffc0cb); // pink
    this._makePlaceholderTexture("cell_wall_top", 16, 16, 0xb8860b); // dark yellow
  }

  create() {
    // Create smoke cloud animation
    this.anims.create({
      key: "smoke_expand",
      frames: this.anims.generateFrameNumbers("smoke_cloud", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1 // Loop indefinitely
    });

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
