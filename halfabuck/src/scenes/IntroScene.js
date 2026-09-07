import Phaser from "phaser";
import { stopMusic } from "../systems/music.js";

// Outlasts the synthetic mouse event iOS fires after a touch (~300ms).
const START_ARM_MS = 500;

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

    // The title screen is silent; music starts with gameplay.
    stopMusic(this);

    // Background image - scale to fit the 320x180 canvas
    const bg = this.add.image(0, 0, "titlescreen").setOrigin(0, 0);

    // Scale the background to cover the game canvas
    // Contain rather than cover, so the logo and PRESS START are never cropped
    // by the wider canvas. Backed off 3% so the logo at the top and the text at
    // the bottom are not flush against the screen edges.
    const TITLE_INSET = 0.97;
    const scale = Math.min(width / bg.width, height / bg.height) * TITLE_INSET;
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

    // Start on a tap anywhere on the screen, not just on the label. The label is
    // ~10px tall; on a phone it is close to impossible to hit deliberately.
    //
    // Armed on a delay for the same reason the cutscene's skip is: arriving here
    // from the game over or ending screen, that screen's tap echoes into this
    // one as a synthetic mouse event and would start the game unbidden.
    this._started = false;
    this._armed = false;
    this.time.delayedCall(START_ARM_MS, () => { this._armed = true; });

    const start = () => {
      if (this._started || !this._armed) return;
      this._started = true;
      this.scene.start("AbductionCutscene");
    };

    pressStart.setInteractive({ useHandCursor: true });
    this.input.on("pointerdown", start);

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
    this.input.keyboard.once("keydown-SPACE", start);

    // DEBUG/TESTING: Press T to open Scene Selector (for testing individual boards)
    this.input.keyboard.once("keydown-T", () => {
      const sceneSelector = this.registry.get("sceneSelector");
      if (sceneSelector) {
        sceneSelector.show();
      }
    });
  }
}
