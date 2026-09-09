import Phaser from "phaser";

/**
 * The moment you lose, before the game over screen.
 *
 * Two versions, because being spotted by a patrol and being picked up off the
 * deck by the thing on the roof are not the same defeat and should not get the
 * same card. Which one plays is decided by the reason passed to
 * BaseRoomScene.playerCaught.
 */
const CARDS = {
  surrounded: { texture: "surrounded", word: "SURROUNDED", colour: "#ff0000", sound: "surrounded_sound" },
  defeated:   { texture: "defeated",   word: "DEFEATED",   colour: "#e0574f", sound: "surrounded_sound" },
};

export class SurroundedScene extends Phaser.Scene {
  constructor() {
    super("SurroundedScene");
  }

  create(data) {
    const { width, height } = this.scale;
    const card = CARDS[data?.card] || CARDS.surrounded;

    const gameUI = this.registry.get("gameUI");
    if (gameUI) gameUI.setVisible(false);

    // Cover-fit rather than stretch, matching the other full-screen scenes, so
    // the wider 384x180 canvas does not distort it.
    const bg = this.add.image(width / 2, height / 2, card.texture);
    bg.setScale(Math.max(width / bg.width, height / bg.height));

    if (this.registry.get("soundEnabled")) {
      this.sound.add(card.sound, { volume: 0.8 }).play();
    }

    const label = this.add.text(width / 2, height - 20, card.word, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: card.colour,
      stroke: "#000000",
      strokeThickness: 4,
      align: "center",
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: label, alpha: 1, duration: 500, ease: "Power2" });

    this.time.delayedCall(2500, () => this.scene.start("GameOverScene"));
  }
}
