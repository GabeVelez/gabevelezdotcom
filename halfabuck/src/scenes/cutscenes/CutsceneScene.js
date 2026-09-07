import Phaser from "phaser";

/**
 * A data-driven cutscene.
 *
 * The abduction sequence is a bespoke 600-line scene with its own frame list,
 * timings and sound cues welded together. Copying that for each new cutscene
 * would mean four copies drifting apart, so this one takes its frames as data
 * and every cutscene becomes a config entry instead of a file.
 *
 * Started with:
 *   this.scene.start("CutsceneScene", {
 *     cutscene: "water_throw",          // key into cutscenes.js
 *     next: "ExecutiveWingScene",       // scene to hand off to
 *     nextData: { villainDefeated: true }
 *   });
 *
 * Frames whose texture has not been loaded are skipped, and if none of them
 * exist the scene hands straight over to `next`. That means the story wiring
 * can be built and played through before the art arrives, and each cutscene
 * starts working the moment its frames land.
 */

import { CUTSCENES } from "./cutscenes.js";

// Cinematic bars, and the window the art is fitted into. Matches the abduction
// scene so the two look like the same film.
const LETTERBOX_H = 14;

// Long enough to outlast the synthetic mouse event iOS fires after a touch, so
// the tap that triggered the cutscene cannot also skip it.
const SKIP_ARM_MS = 800;

export class CutsceneScene extends Phaser.Scene {
  constructor() {
    super("CutsceneScene");
  }

  init(data) {
    this.config = CUTSCENES[data?.cutscene] || null;
    this.nextScene = data?.next || "IntroScene";
    this.nextData = data?.nextData || {};
    this.frameIndex = 0;
    this.finished = false;
    this.frameObjects = [];
  }

  create() {
    const { width, height } = this.scale;

    const gameUI = this.registry.get("gameUI");
    if (gameUI) gameUI.setVisible(false);

    this.cameras.main.setBackgroundColor("#000000");

    const layered = this.config?.type === "layered";

    // Only art that actually exists. Missing pieces are skipped rather than
    // rendering Phaser's magenta placeholder.
    this.frames = (this.config?.frames || []).filter((f) =>
      this.textures.exists(f.image)
    );

    const bgExists = layered && this.textures.exists(this.config.background);
    if (!bgExists && this.frames.length === 0) {
      this.finish();
      return;
    }

    this.topBar = this.add
      .rectangle(0, 0, width, LETTERBOX_H, 0x000000)
      .setOrigin(0, 0)
      .setDepth(10);
    this.bottomBar = this.add
      .rectangle(0, height - LETTERBOX_H, width, LETTERBOX_H, 0x000000)
      .setOrigin(0, 0)
      .setDepth(10);

    const isTouch = !!this.registry.get("shell")?.active;
    this.skipText = this.add
      .text(width - 5, 4, isTouch ? "TAP TO SKIP" : "PRESS SPACE TO SKIP", {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "6px",
        color: "#888888",
      })
      .setOrigin(1, 0)
      .setDepth(11);

    this.skipArmed = false;
    this.time.delayedCall(SKIP_ARM_MS, () => {
      this.skipArmed = true;
    });

    const trySkip = () => {
      if (this.finished || !this.skipArmed) return;
      this.finish();
    };
    this.input.keyboard.on("keydown-SPACE", trySkip);
    this.input.on("pointerdown", trySkip);

    if (layered) this.playLayered();
    else this.showFrame(0);
  }

  /**
   * A composited scene rather than a sequence: a background plus character
   * layers that slide in. The layers are exported aligned at full frame size
   * with transparent backgrounds, so they share the background's transform and
   * only need an x offset animated to zero.
   */
  playLayered() {
    const { width, height } = this.scale;
    const cfg = this.config;

    const bg = this.add.image(width / 2, height / 2, cfg.background).setDepth(1);
    const usableHeight = height - LETTERBOX_H * 2;
    const scale = Math.min(width / bg.width, usableHeight / bg.height);
    bg.setScale(scale);

    // How far a layer must travel to start fully off screen
    const travel = bg.displayWidth;

    (cfg.layers || []).forEach((layer, i) => {
      if (!this.textures.exists(layer.image)) return;

      const dir = layer.from === "right" ? 1 : -1;
      const sprite = this.add
        .image(width / 2 + dir * travel, height / 2, layer.image)
        .setScale(scale)
        .setDepth(2 + i);

      this.tweens.add({
        targets: sprite,
        x: width / 2,
        delay: layer.delay ?? 0,
        duration: layer.duration ?? 700,
        ease: layer.ease || "Cubic.easeOut",
      });
    });

    (cfg.captions || []).forEach((cap) => {
      this.time.delayedCall(cap.at ?? 0, () => {
        if (this.finished) return;
        const objects = this.drawCaption(cap.text);
        if (cap.until) {
          this.time.delayedCall(cap.until - (cap.at ?? 0), () =>
            objects.forEach((o) => o.destroy())
          );
        }
      });
    });

    this.time.delayedCall(cfg.duration ?? 5000, () => this.finish());
  }

  showFrame(index) {
    if (this.finished) return;

    if (index >= this.frames.length) {
      this.finish();
      return;
    }

    const { width, height } = this.scale;
    const frame = this.frames[index];

    this.frameObjects.forEach((o) => o.destroy());
    this.frameObjects = [];

    const image = this.add.image(width / 2, height / 2, frame.image).setDepth(1);

    // Contain, never crop. Art that matches the window aspect fills it exactly;
    // anything else sits smaller rather than losing the subject.
    const usableHeight = height - LETTERBOX_H * 2;
    image.setScale(
      Math.min(width / image.width, usableHeight / image.height)
    );
    this.frameObjects.push(image);

    if (frame.text) {
      this.frameObjects.push(...this.drawCaption(frame.text));
    }

    if (frame.sound && this.registry.get("soundEnabled")) {
      if (this.cache.audio.exists(frame.sound)) {
        this.sound.play(frame.sound, { volume: frame.volume ?? 0.6 });
      }
    }

    if (frame.shake) {
      this.cameras.main.shake(frame.shake, 0.006);
    }

    this.time.delayedCall(frame.duration ?? 2000, () => {
      if (!this.finished) this.showFrame(index + 1);
    });
  }

  /**
   * Caption sitting just above the bottom bar, wrapped and on a dark backing so
   * a long line stays readable over bright artwork. Returns the objects so the
   * caller can clear them.
   */
  drawCaption(text) {
    const { width, height } = this.scale;
    const maxWidth = width - 32;

    const label = this.add
      .text(width / 2, 0, text, {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "10px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: maxWidth, useAdvancedWrap: true },
      })
      .setOrigin(0.5, 1)
      .setDepth(12);

    label.y = height - LETTERBOX_H - 4;

    const backing = this.add
      .rectangle(
        width / 2,
        label.y - label.height / 2,
        label.width + 12,
        label.height + 6,
        0x000000,
        0.66
      )
      .setDepth(11);

    return [backing, label];
  }

  finish() {
    if (this.finished) return;
    this.finished = true;

    this.time.removeAllEvents();
    this.tweens.killAll();

    this.scene.start(this.nextScene, this.nextData);
  }
}
