import Phaser from "phaser";

export const BASE_W = 320;
export const BASE_H = 180;

/**
 * Integer zoom for crisp pixel scaling.
 * We choose the largest integer scale that fits the viewport.
 */
export function getIntegerZoom() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const raw = Math.min(w / BASE_W, h / BASE_H);
  return Math.max(1, Math.floor(raw));
}

export function createGameConfig(scenes) {
  return {
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#000000",
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.NONE, // manual canvas sizing for integer zoom
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: BASE_W,
      height: BASE_H,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
      },
    },
    scene: scenes,
  };
}
