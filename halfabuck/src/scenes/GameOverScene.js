import Phaser from "phaser";

/** Long enough that the tap that got you killed cannot carry into this screen.
 *  iOS synthesises a mouse event about 300ms after a touch, so anything
 *  shorter than that lets the previous scene's tap press a button here. */
const ARM_MS = 500;

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create() {
    const { width, height } = this.scale;

    // Hide HTML UI overlay
    const gameUI = this.registry.get("gameUI");
    if (gameUI) {
      gameUI.setVisible(false);
    }

    // Play game over sound
    const gameoverSound = this.sound.add("gameover_sound", { volume: 0.7 });
    gameoverSound.play();

    // Game over image, cover-fitted to the canvas
    const gameoverImg = this.add.image(0, 0, "gameover").setOrigin(0, 0);
    const scale = Math.max(width / gameoverImg.width, height / gameoverImg.height);
    gameoverImg.setScale(scale);
    gameoverImg.x = (width - gameoverImg.width * scale) / 2;
    gameoverImg.y = (height - gameoverImg.height * scale) / 2;

    const label = (x, text) => this.add.text(x, height - 22, text, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      color: "#ffffff",
      backgroundColor: "#000000",
      // Roomy enough to be hit with a thumb on a phone rather than a mouse.
      padding: { x: 12, y: 8 },
    }).setOrigin(0.5);

    const continueText = label(width / 2 - 62, "CONTINUE");
    const exitText = label(width / 2 + 62, "EXIT");

    // One handler for the whole screen, deciding from where the tap landed,
    // rather than per-object interactivity. Two 10px labels are small targets
    // on a phone, and this way a tap that misses them still continues instead
    // of doing nothing at all, which is what it did before.
    let armed = false;
    let taken = false;
    this.time.delayedCall(ARM_MS, () => { armed = true; });

    const go = (scene) => {
      if (taken || !armed) return;
      taken = true;
      if (scene === "CellScene") {
        // A fresh run starts empty. Carrying the keycard and the grenade back
        // to the cell let you walk through locks you had not earned yet.
        this.registry.set("inventory", null);
      }
      this.scene.start(scene);
    };

    // A little slack around EXIT so a near miss does not restart the game.
    const exitBounds = Phaser.Geom.Rectangle.Inflate(exitText.getBounds(), 10, 10);

    this.input.on("pointerdown", (p) => {
      go(Phaser.Geom.Rectangle.Contains(exitBounds, p.worldX, p.worldY)
        ? "IntroScene"
        : "CellScene");
    });

    this.input.keyboard.once("keydown-SPACE", () => go("CellScene"));
    this.input.keyboard.once("keydown-ENTER", () => go("CellScene"));
    this.input.keyboard.once("keydown-ESC", () => go("IntroScene"));

    // Nudge, in case the labels read as decoration rather than controls.
    const hint = this.add.text(width / 2, height - 40, "TAP TO CONTINUE", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "6px",
      color: "#9aa0aa",
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: hint, alpha: 1, delay: ARM_MS, duration: 400 });

    // Nothing below this point should keep a reference to the old room.
    this.events.once("shutdown", () => this.input.removeAllListeners());
  }
}
