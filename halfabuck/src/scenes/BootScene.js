import Phaser from "phaser";
import { ALL_CUTSCENE_FRAMES } from "./cutscenes/cutscenes.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this._buildLoadingScreen();

    // A silent failure here looks identical to a slow connection otherwise.
    // Cutscene frames are expected to be missing until their art is made, so
    // those are noted rather than shouted about.
    this.load.on("loaderror", (file) => {
      if (ALL_CUTSCENE_FRAMES.includes(file.key)) {
        console.info(`[BootScene] cutscene frame "${file.key}" not present yet; it will be skipped`);
      } else {
        console.error(`[BootScene] failed to load "${file.key}" from ${file.src}`);
      }
    });

    // Story cutscene frames. These are attempted rather than required: a
    // missing file logs and its frame is skipped, so the story can be wired up
    // before the art exists. Drop a PNG in and it starts playing.
    ALL_CUTSCENE_FRAMES.forEach((key) => {
      this.load.image(key, `assets/cutscenes/story/${key}.png`);
    });

    // --- UI Screens ---
    this.load.image("titlescreen", "assets/ui/titlescreen.png");
    this.load.image("surrounded", "assets/ui/surrounded.png");
    this.load.image("gameover", "assets/ui/gameover.png");

    // --- Audio ---
    this.load.audio("intro_music", "assets/audio/music/moodmode-that-8-bit-music-322062.mp3");
    this.load.audio("spooky", "assets/audio/music/spooky.mp3");
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
    this.load.image("corridor_layout", "assets/scenes/corridor/corridor-layoutB.png");
    this.load.image("warehouse_main_layout", "assets/scenes/warehouse/warehouse.png");
    this.load.image("storage_bay_layout", "assets/layouts/storage_bay_layout.png");
    this.load.image("loading_dock_layout", "assets/layouts/loading_dock_layout.png");
    this.load.image("security_office_layout", "assets/layouts/security_office_layout.png");
    this.load.image("maintenance_tunnel_layout", "assets/layouts/maintenance_tunnel_layout.png");
    this.load.image("executive_wing_layout", "assets/scenes/executive-wing/executive-wing-layout.png");
    this.load.image("rooftop_helipad_layout", "assets/scenes/rooftop-helipad/rooftop-helipad-layout.png");

    // --- Collision is loaded directly via SVGCollisionParser (no preloading needed) ---

    // --- Player sprite sheets (5 frames each, 320x64 = 5 x 64px cells) ---
    // Cut from gabe-new.png: every direction normalised to one scale, feet on a
    // shared baseline, frames aligned on the head centre so the body does not
    // wobble as the legs swing. 64px is close to the ~32px display size, so the
    // nearest-neighbour downscale is a clean 2:1 instead of throwing away 5 of
    // every 6 pixels the way the old 210px art did.
    this.load.spritesheet("gabe-front", "assets/sprites/player/gabe-front.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("gabe-back", "assets/sprites/player/gabe-back.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("gabe-left", "assets/sprites/player/gabe-left.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("gabe-right", "assets/sprites/player/gabe-right.png", {
      frameWidth: 64,
      frameHeight: 64
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

    // --- Item sprites (shared by the world and the HUD inventory slots) ---
    this.load.image("item_box", "assets/sprites/items/box.png");
    this.load.image("item_smoke", "assets/sprites/items/smoke-bomb.png");
    this.load.image("item_keycard", "assets/sprites/items/keycard.png");
    this.load.image("item_water", "assets/sprites/items/water.png");
    this.load.image("item_bazooka", "assets/sprites/items/bazooka.png");
    this.load.image("smoke_grenade", "assets/sprites/items/smoke-bomb.png");

    // --- Vehicle sprites ---
    this.load.image("helicopter", "assets/sprites/helicopter.png");

    // --- Effect sprites ---
    this.load.spritesheet("smoke_cloud", "assets/sprites/effects/smoke-cloud.png", {
      frameWidth: 80,
      frameHeight: 80
    });

    // --- Boss placeholders still awaiting art ---
    this._makePlaceholderTexture("villain", 24, 40, 0x8e24aa);  // executive villain
    this._makePlaceholderTexture("monster", 40, 56, 0x2e7d32);  // hulked-out villain

    // --- Placeholder entity textures ---
    this._makePlaceholderTexture("lead_guard", 16, 24, 0xff8800);
    this._makePlaceholderTexture("box", 16, 16, 0xffffff);

    // --- Door placeholders (the keycard now has real art) ---
    this._makePlaceholderTexture("locked-red", 16, 16, 0xff0000); // Red locked door
    this._makePlaceholderTexture("unlocked-green", 16, 16, 0x00ff00); // Green unlocked door

    // --- Cell placeholder tiles for layout ---
    this._makePlaceholderTexture("cell_floor", 16, 16, 0xadd8e6); // light blue
    this._makePlaceholderTexture("cell_wall_bottom", 16, 16, 0xff8800); // orange
    this._makePlaceholderTexture("cell_wall_left", 16, 16, 0xd2b48c); // tan
    this._makePlaceholderTexture("cell_wall_right", 16, 16, 0xffc0cb); // pink
    this._makePlaceholderTexture("cell_wall_top", 16, 16, 0xb8860b); // dark yellow
  }

  /**
   * Minimal progress bar drawn with primitives, so it is on screen before any
   * asset has arrived. Roughly 15MB of audio and sprites load here; without
   * this the player stares at an unexplained black screen.
   */
  _buildLoadingScreen() {
    const { width, height } = this.scale;

    const barW = 160;
    const barH = 8;
    const barX = (width - barW) / 2;
    const barY = height / 2 + 6;

    this.add.text(width / 2, height / 2 - 12, "LOADING", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.add.rectangle(barX, barY, barW, barH, 0x000000)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0xffffff, 0.5);

    const fill = this.add.rectangle(barX + 1, barY + 1, 0, barH - 2, 0xff8a1f)
      .setOrigin(0, 0);

    this.load.on("progress", (value) => {
      fill.width = Math.max(0, (barW - 2) * value);
    });
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
