import Phaser from "phaser";
import { stopMusic } from "../systems/music.js";

/**
 * Pause.
 *
 * Runs on top of the paused room rather than replacing it, so the level is
 * still there behind the dimmer and resuming costs nothing. The room scene is
 * passed in by key so Resume knows what to wake up.
 *
 * Everything is decided from where the tap landed rather than from per-object
 * hit testing, for the same reason the game over screen is: three small labels
 * are poor targets on a phone, and a tap that misses one should not silently
 * do nothing.
 */
const ARM_MS = 220;

export class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
  }

  create(data) {
    const { width, height } = this.scale;
    this.roomKey = data?.roomKey;

    this.add.rectangle(0, 0, width, height, 0x05070a, 0.82)
      .setOrigin(0, 0);

    this.add.text(width / 2, 42, "PAUSED", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#ffffff",
    }).setOrigin(0.5);

    const label = (y, text, colour) => this.add.text(width / 2, y, text, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      color: colour,
      backgroundColor: "#000000",
      padding: { x: 14, y: 9 },
    }).setOrigin(0.5);

    const resume = label(86, "RESUME", "#ffffff");
    const restart = label(120, "RESTART LEVEL", "#ffffff");
    const quit = label(154, "EXIT TO TITLE", "#e0574f");

    let armed = false;
    let taken = false;
    this.time.delayedCall(ARM_MS, () => { armed = true; });

    const hit = (obj, p) => Phaser.Geom.Rectangle.Contains(
      Phaser.Geom.Rectangle.Inflate(obj.getBounds(), 8, 8), p.worldX, p.worldY
    );

    const act = (fn) => {
      if (taken || !armed) return;
      taken = true;
      fn();
    };

    this.input.on("pointerdown", (p) => {
      if (hit(quit, p)) {
        act(() => {
          this.registry.get("shell")?.setPaused?.(false);
          stopMusic(this);
          this.registry.set("inventory", null);
          this.scene.stop(this.roomKey);
          this.scene.stop();
          this.scene.start("IntroScene");
        });
      } else if (hit(restart, p)) {
        act(() => {
          this.registry.get("shell")?.setPaused?.(false);
          this.scene.stop();
          this.scene.start(this.roomKey);
        });
      } else {
        // Resume is the default, so a tap anywhere that is not one of the two
        // deliberate choices puts you back in the game.
        act(() => this._resume());
      }
    });

    this.input.keyboard.once("keydown-ESC", () => act(() => this._resume()));
    this.input.keyboard.once("keydown-SPACE", () => act(() => this._resume()));

    // Marked unused so the label is not dead weight in the layout.
    resume.setAlpha(1);
  }

  _resume() {
    this.registry.get("shell")?.setPaused?.(false);
    this.scene.stop();
    if (this.roomKey) this.scene.resume(this.roomKey);
  }
}
