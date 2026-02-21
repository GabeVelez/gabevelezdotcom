import Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create() {
    const { width, height } = this.scale;

    // Play game over sound
    const gameoverSound = this.sound.add("gameover_sound", { volume: 0.7 });
    gameoverSound.play();

    // Game over image - scale to fit the 320x180 canvas
    const gameoverImg = this.add.image(0, 0, "gameover").setOrigin(0, 0);

    // Scale the image to cover the game canvas
    const scaleX = width / gameoverImg.width;
    const scaleY = height / gameoverImg.height;
    const scale = Math.max(scaleX, scaleY);
    gameoverImg.setScale(scale);

    // Center the image
    gameoverImg.x = (width - gameoverImg.width * scale) / 2;
    gameoverImg.y = (height - gameoverImg.height * scale) / 2;

    // "CONTINUE" and "END" buttons underneath
    const continueText = this.add.text(width / 2 - 40, height - 20, "CONTINUE", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5);

    const endText = this.add.text(width / 2 + 40, height - 20, "END", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5);

    // Make CONTINUE clickable - restart from cell
    continueText.setInteractive({ useHandCursor: true });
    continueText.on("pointerdown", () => {
      this.scene.start("CellScene");
    });

    // Make END clickable - go back to intro screen
    endText.setInteractive({ useHandCursor: true });
    endText.on("pointerdown", () => {
      this.scene.start("IntroScene");
    });

    // Restart on SPACE key
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("CellScene");
    });

    // Go to intro on ESC key
    this.input.keyboard.once("keydown-ESC", () => {
      this.scene.start("IntroScene");
    });
  }
}
