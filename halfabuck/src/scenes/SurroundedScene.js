import Phaser from "phaser";

export class SurroundedScene extends Phaser.Scene {
  constructor() {
    super("SurroundedScene");
  }

  create() {
    const { width, height } = this.scale;

    // Hide HTML UI overlay
    const gameUI = this.registry.get("gameUI");
    if (gameUI) {
      gameUI.setVisible(false);
    }

    // Display surrounded image
    const bg = this.add.image(width / 2, height / 2, "surrounded");
    bg.setDisplaySize(width, height);

    // Play surrounded sound if enabled
    if (this.registry.get("soundEnabled")) {
      const sound = this.sound.add("surrounded_sound", { volume: 0.8 });
      sound.play();
    }

    // Add "SURROUNDED" text overlay at bottom
    const surroundedText = this.add.text(width / 2, height - 20, "SURROUNDED", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#ff0000",
      stroke: "#000000",
      strokeThickness: 4,
      align: "center"
    });
    surroundedText.setOrigin(0.5);

    // Fade in text
    surroundedText.setAlpha(0);
    this.tweens.add({
      targets: surroundedText,
      alpha: 1,
      duration: 500,
      ease: "Power2"
    });

    // Transition to game over screen after 2.5 seconds
    this.time.delayedCall(2500, () => {
      this.scene.start("GameOverScene");
    });
  }
}
