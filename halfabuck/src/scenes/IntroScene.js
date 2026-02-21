import Phaser from "phaser";

export class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  create() {
    const { width, height } = this.scale;

    // Initialize sound state in registry if not set
    if (!this.registry.has("soundEnabled")) {
      this.registry.set("soundEnabled", true);
    }

    // Stop intro music if playing (music plays during gameplay, not on intro screen)
    if (this.registry.get("intro_music")) {
      const music = this.registry.get("intro_music");
      if (music.isPlaying) {
        music.stop();
      }
    }

    // Background image - scale to fit the 320x180 canvas
    const bg = this.add.image(0, 0, "titlescreen").setOrigin(0, 0);

    // Scale the background to cover the game canvas
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);

    // Center the background
    bg.x = (width - bg.width * scale) / 2;
    bg.y = (height - bg.height * scale) / 2;

    // "MISSION: CRITICAL" text (static, orange color from the design)
    // Positioned closer to bottom edge, away from face
    this.add.text(width / 2, height - 15, "MISSION: CRITICAL", {
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "10px",
      color: "#ff8800",
      fontStyle: "900"
    }).setOrigin(0.5);

    // "PRESS START" text with flashing effect (arcade style)
    // Positioned closer to bottom edge, away from face
    const pressStart = this.add.text(width / 2, height - 30, "PRESS START", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      color: "#ffffff"
    }).setOrigin(0.5);

    // Make PRESS START clickable
    pressStart.setInteractive({ useHandCursor: true });
    pressStart.on("pointerdown", () => {
      this.scene.start("CellScene");
    });

    // Classic arcade flashing effect - fade between visible and slightly dim
    this.tweens.add({
      targets: pressStart,
      alpha: 0.4,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Sound toggle button (top-right corner)
    this._createSoundToggle(width - 20, 10);

    // Start game on SPACE key
    this.input.keyboard.once("keydown-SPACE", () => this.scene.start("CellScene"));
  }

  _createSoundToggle(x, y) {
    const soundEnabled = this.registry.get("soundEnabled");

    // Container for sound toggle
    this._soundToggle = this.add.container(x, y);

    // Background
    const bg = this.add.rectangle(0, 0, 24, 24, 0x000000, 0.7);
    this._soundToggle.add(bg);

    // Sound icon
    this._soundIcon = this.add.graphics();
    this._updateSoundIcon();
    this._soundToggle.add(this._soundIcon);

    // Make interactive
    bg.setInteractive({ useHandCursor: true });
    bg.on("pointerdown", (pointer, localX, localY, event) => {
      // Stop event propagation so this doesn't trigger scene start
      event.stopPropagation();

      const currentState = this.registry.get("soundEnabled");
      this.registry.set("soundEnabled", !currentState);
      this._updateSoundIcon();

      // Note: Music plays during gameplay, not on intro screen
      // Sound toggle only affects game sounds when playing
    });

    this._soundToggle.setDepth(200);
  }

  _updateSoundIcon() {
    this._soundIcon.clear();

    if (this.registry.get("soundEnabled")) {
      // Speaker ON - filled speaker with waves
      this._soundIcon.fillStyle(0xffffff, 1);
      this._soundIcon.fillRect(-8, -3, 4, 6); // Speaker body
      this._soundIcon.fillTriangle(-4, -5, -4, 5, 0, 3); // Speaker cone (pointing right)
      this._soundIcon.fillTriangle(-4, -5, -4, 5, 0, -3); // Speaker cone (pointing right)

      // Sound waves (arcs)
      this._soundIcon.lineStyle(2, 0xffffff, 1);
      this._soundIcon.beginPath();
      this._soundIcon.arc(0, 0, 4, -Math.PI/4, Math.PI/4, false);
      this._soundIcon.strokePath();
      this._soundIcon.beginPath();
      this._soundIcon.arc(0, 0, 7, -Math.PI/4, Math.PI/4, false);
      this._soundIcon.strokePath();
    } else {
      // Speaker OFF - filled speaker with X
      this._soundIcon.fillStyle(0xff0000, 1);
      this._soundIcon.fillRect(-8, -3, 4, 6); // Speaker body
      this._soundIcon.fillTriangle(-4, -5, -4, 5, 0, 3); // Speaker cone
      this._soundIcon.fillTriangle(-4, -5, -4, 5, 0, -3); // Speaker cone

      // Red X
      this._soundIcon.lineStyle(2, 0xff0000, 1);
      this._soundIcon.strokeLineShape(new Phaser.Geom.Line(2, -4, 6, 0));
      this._soundIcon.strokeLineShape(new Phaser.Geom.Line(6, -4, 2, 0));
    }
  }
}
