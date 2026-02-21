import Phaser from "phaser";

export class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  create() {
    const { width, height } = this.scale;

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

    // "MISSION: BROOKLYN" text (static, orange color from the design)
    // Positioned closer to bottom edge, away from face
    this.add.text(width / 2, height - 15, "MISSION: BROOKLYN", {
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

    // Classic arcade flashing effect - fade between visible and slightly dim
    this.tweens.add({
      targets: pressStart,
      alpha: 0.4,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Start game on SPACE or tap/click - now starts in Cell
    this.input.keyboard.once("keydown-SPACE", () => this.scene.start("CellScene"));
    this.input.once("pointerdown", () => this.scene.start("CellScene"));
  }
}
