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
import { playMusic } from "../../systems/music.js";

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
    // Phaser reuses the scene instance, so the lift's state outlives its own
    // run. Left set, the next cutscene through here keeps driving objects that
    // were destroyed when this scene restarted.
    this._elev = null;
    this._elevStreaks = [];
  }

  create() {
    const { width, height } = this.scale;

    const gameUI = this.registry.get("gameUI");
    if (gameUI) gameUI.setVisible(false);

    this.cameras.main.setBackgroundColor("#000000");

    // Named tracks carry across the scene change into whatever follows, so a
    // cutscene and the room after it can share one piece of music.
    if (this.config?.music) {
      playMusic(this, this.config.music, { loop: true, volume: 0.5 });
    }

    const layered = this.config?.type === "layered";

    // Only art that actually exists. Missing pieces are skipped rather than
    // rendering Phaser's magenta placeholder.
    this.frames = (this.config?.frames || []).filter((f) =>
      this.textures.exists(f.image)
    );

    const bgExists = layered && this.textures.exists(this.config.background);
    if (!bgExists && this.frames.length === 0 && this.config?.type !== "elevator") {
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

    if (this.config?.type === "elevator") this.playElevator();
    else if (layered) this.playLayered();
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


  // ---------------------------------------------------------------------
  // The lift
  // ---------------------------------------------------------------------

  /**
   * Forty floors up the outside of the building.
   *
   * The car never moves. The wall does - a tile scrolling behind a sprite
   * that holds dead centre - which is the whole trick and the reason this
   * costs one seamless texture instead of a frame per storey.
   *
   * What sells it as machinery rather than a pan is the speed curve. A lift
   * does not travel at a constant rate: it hangs, shoves, runs, then eases
   * off long before it stops. That profile is _distanceAt() below, and every
   * other moving part - counter, streaks, sway, the crown sliding down into
   * place - is driven off the same number, so nothing can drift out of sync
   * with anything else.
   */
  playElevator() {
    const { width, height } = this.scale;
    const cfg = this.config;

    this._ensureElevatorTextures();

    const travel = cfg.travel ?? 2560;
    const duration = cfg.duration ?? 8000;

    // The wall. Tiled rather than one enormous image, so the climb can be as
    // long as it likes without the texture growing.
    const facade = this.add
      .tileSprite(0, 0, width, height, cfg.facade || "elev_facade")
      .setOrigin(0, 0)
      .setDepth(1);
    // Whatever width the art arrives at, it fills the frame. Scrolling is then
    // done in texture space, which is why tilePositionY is divided by the same
    // factor further down.
    const fw = facade.texture.getSourceImage()?.width || width;
    facade.tileScaleX = facade.tileScaleY = width / fw;

    // The top of the tower, waiting above the frame. Its bottom edge is one
    // full travel above the floor of the screen, so it arrives exactly as the
    // car runs out of building.
    const crownKey = cfg.crown || "elev_crown";
    let crown = null;
    if (this.textures.exists(crownKey)) {
      crown = this.add.image(width / 2, height - travel, crownKey).setOrigin(0.5, 1).setDepth(2);
      crown.setScale(width / crown.width); // spans the frame, keeps its aspect
    }

    // Him, in the glass, holding still while the world drops.
    const car = this.add.image(width / 2, height / 2, cfg.car || "elev_car").setDepth(6);
    // Never taller than the window between the letterbox bars, so oversized
    // art is shrunk to fit rather than running off the top of the frame.
    const carMax = (height - LETTERBOX_H * 2) * 0.82;
    if (car.height > carMax) car.setScale(carMax / car.height);
    this._elevCarY = car.y;

    // Three bright lines running down faster than the wall does. Cheap
    // parallax: something has to move at a different speed or the whole frame
    // reads as one flat pan.
    this._elevStreaks = [0, 1, 2].map((i) =>
      this.add
        .rectangle(0, (height / 3) * i, width, 1, 0xbcd4ff, 0.13)
        .setOrigin(0, 0)
        .setDepth(4)
    );

    // The indicator. It is the only text in the scene and the only thing that
    // tells you how far there is left to go.
    const readout = this.add
      .text(width - 6, LETTERBOX_H + 5, "", {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "8px",
        color: "#ffb347",
      })
      .setOrigin(1, 0)
      .setDepth(11);

    this._elev = { facade, crown, car, readout, travel, duration, elapsed: 0, floor: -1, done: false };

    // The shove as it takes up the cable.
    this._elevSound(cfg.startSound, 0.5);
    this.cameras.main.shake(260, 0.004);
    this.tweens.add({
      targets: car,
      y: car.y + 3,
      duration: 220,
      yoyo: true,
      ease: "Quad.easeOut",
    });
  }

  /**
   * Fraction of the climb completed at time fraction t.
   *
   * A trapezoid: the speed ramps up over the first fifth, holds, then bleeds
   * off over the last fifth. Integrating that by hand rather than reaching for
   * an easing curve is what keeps the long flat middle - every stock ease is
   * either accelerating or decelerating the whole way, and a lift that never
   * cruises feels like a swoop.
   */
  _distanceAt(t) {
    const A = 0.2, D = 0.22;          // time spent speeding up, slowing down
    const C = 1 - A - D;              // and running
    const area = A / 2 + C + D / 2;   // total, to normalise by
    let d;
    if (t < A) d = (t * t) / (2 * A);
    else if (t < A + C) d = A / 2 + (t - A);
    else {
      const u = t - A - C;
      d = A / 2 + C + u - (u * u) / (2 * D);
    }
    return Math.min(1, d / area);
  }

  _elevSound(key, volume) {
    if (!key || !this.registry.get("soundEnabled")) return;
    if (this.cache.audio.exists(key)) this.sound.play(key, { volume: volume ?? 0.6 });
  }

  updateElevator(_time, delta) {
    const e = this._elev;
    if (!e || this.finished) return;

    e.elapsed += delta;
    const t = Math.min(1, e.elapsed / e.duration);
    const travelled = this._distanceAt(t) * e.travel;
    // Pixels moved THIS frame. Sampling the curve a fixed slice of scene-time
    // ahead instead gives a number in the wrong unit entirely, and everything
    // driven off it runs at whatever the frame rate happens to be.
    const step = travelled - (e.travelled ?? 0);
    e.travelled = travelled;

    // Everything hangs off `travelled`, so nothing can drift.
    e.facade.tilePositionY = -travelled / e.facade.tileScaleY;
    if (e.crown) e.crown.y = this.scale.height - e.travel + travelled;

    for (let i = 0; i < this._elevStreaks.length; i++) {
      const r = this._elevStreaks[i];
      r.y = (r.y + step * 2.4) % this.scale.height;
      r.alpha = 0.13 * Math.min(1, step / 3);
    }

    // A lift sways. Two out-of-step sines so it never looks like a metronome,
    // scaled by speed so it settles as he arrives.
    const sway = Math.min(1, step / 4);
    e.car.y = this._elevCarY + Math.sin(e.elapsed / 90) * 0.9 * sway;
    e.car.x = this.scale.width / 2 + Math.sin(e.elapsed / 143) * 0.7 * sway;

    const floor = (this.config.startFloor ?? 8) + Math.floor(travelled / (this.config.floorPx ?? 80));
    if (floor !== e.floor) {
      e.floor = floor;
      e.readout.setText(`FLOOR ${String(floor).padStart(2, "0")}`);
    }

    if (t >= 1 && !e.done) {
      e.done = true;
      e.readout.setColor("#8fe388");
      this._elevSound(this.config.arriveSound, 0.7);
      this.cameras.main.shake(180, 0.003);
      // Settle onto the floor, the way a car drops the last inch onto its
      // brakes.
      this.tweens.add({ targets: e.car, y: this._elevCarY + 2, duration: 160, yoyo: true, ease: "Sine.easeInOut" });
      this.time.delayedCall(900, () => this.finish());
    }
  }

  update(time, delta) {
    if (this._elev) this.updateElevator(time, delta);
  }

  /**
   * Stand-ins for art that has not arrived.
   *
   * Drawn once into the texture manager rather than shipped as files, so there
   * is nothing to delete later: the moment a real elev_* texture is loaded in
   * BootScene these stop being generated and the ride uses the real thing.
   */
  _ensureElevatorTextures() {
    const g = this.make.graphics({ add: false });
    const W = this.scale.width;

    if (!this.textures.exists("elev_facade")) {
      const H = 160; // two storeys, so the tile seam lands on a floor line
      g.clear();
      g.fillStyle(0x1a1f2b, 1).fillRect(0, 0, W, H);
      for (let row = 0; row < 2; row++) {
        const top = row * 80;
        g.fillStyle(0x11151d, 1).fillRect(0, top + 68, W, 12); // the floor slab
        for (let col = 0; col < 12; col++) {
          const x = 6 + col * 32;
          // Deterministic, because the tile repeats - a random draw would make
          // the same "random" windows recur and read as wallpaper anyway.
          const lit = (col * 7 + row * 5) % 3 !== 0;
          g.fillStyle(lit ? 0xf0c274 : 0x232a38, lit ? 0.92 : 1).fillRect(x, top + 12, 22, 50);
          if (lit) g.fillStyle(0x000000, 0.35).fillRect(x, top + 40, 22, 22);
        }
      }
      g.generateTexture("elev_facade", W, H);
    }

    if (!this.textures.exists("elev_crown")) {
      const H = 220;
      g.clear();
      g.fillStyle(0x090d16, 1).fillRect(0, 0, W, H);
      for (let i = 0; i < 40; i++) {
        const x = (i * 97) % W, y = (i * 53) % 90;
        g.fillStyle(0xffffff, 0.5).fillRect(x, y, 1, 1);
      }
      // The city, far below and behind.
      for (let i = 0; i < 9; i++) {
        const x = i * 44, h = 18 + ((i * 31) % 40);
        g.fillStyle(0x131a26, 1).fillRect(x, 96 - h, 38, h);
      }
      g.fillStyle(0x2a3446, 1).fillRect(0, 96, W, 10);   // the parapet
      g.fillStyle(0x1a1f2b, 1).fillRect(0, 106, W, H - 106);
      for (let col = 0; col < 12; col++) {
        g.fillStyle(0xf0c274, 0.92).fillRect(6 + col * 32, 118, 22, 50);
      }
      g.generateTexture("elev_crown", W, H);
    }

    if (!this.textures.exists("elev_car")) {
      const CW = 74, CH = 62;
      g.clear();
      g.fillStyle(0x3a3020, 1).fillRect(0, 0, CW, CH);          // brass frame
      g.fillStyle(0xd9a94f, 1).fillRect(0, 0, CW, 4).fillRect(0, CH - 5, CW, 5);
      g.fillStyle(0xf6d9a0, 0.95).fillRect(5, 6, CW - 10, CH - 13); // lit glass
      g.fillStyle(0x2a2118, 1).fillRect(CW / 2 - 7, 20, 14, 30);    // him
      g.fillStyle(0x2a2118, 1).fillRect(CW / 2 - 5, 12, 10, 9);
      g.generateTexture("elev_car", CW, CH);
    }

    g.destroy();
  }

  finish() {
    if (this.finished) return;
    this.finished = true;

    this.time.removeAllEvents();
    this.tweens.killAll();

    this.scene.start(this.nextScene, this.nextData);
  }
}
