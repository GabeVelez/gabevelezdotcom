import Phaser from "phaser";

export class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  create() {
    const { width, height } = this.scale;

    // Hide HTML UI overlay (not needed on title screen)
    const gameUI = this.registry.get("gameUI");
    if (gameUI) {
      gameUI.setVisible(false);
    }

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
      this.scene.start("AbductionCutscene");
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

    // Start game on SPACE key
    this.input.keyboard.once("keydown-SPACE", () => this.scene.start("AbductionCutscene"));
  }
}
