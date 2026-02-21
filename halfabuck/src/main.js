import "./styles.css";
import Phaser from "phaser";

import { createGameConfig, BASE_W, BASE_H, getIntegerZoom } from "./config/gameConfig.js";
import { updateOrientationOverlay, isPortrait } from "./utils/orientation.js";
import { createTouchControls } from "./ui/touchControls.js";

import { BootScene } from "./scenes/BootScene.js";
import { IntroScene } from "./scenes/IntroScene.js";
import { WarehouseScene } from "./scenes/WarehouseScene.js";
import { EndingScene } from "./scenes/EndingScene.js";

// Landscape-only overlay
function enforceLandscape() {
  updateOrientationOverlay();
}
window.addEventListener("resize", enforceLandscape);
window.addEventListener("orientationchange", enforceLandscape);
enforceLandscape();

// Touch controls (DOM overlay)
const touchRef = createTouchControls();

// Create game
const game = new Phaser.Game(createGameConfig([BootScene, IntroScene, WarehouseScene, EndingScene]));

// Share touch state with scenes via registry
game.registry.set("touchRef", touchRef);

/**
 * Pixel-perfect integer scaling:
 * - Keep internal canvas 320x180
 * - Apply integer zoom via CSS size
 * - Centered by #game flexbox
 */
function resize() {
  // If portrait, keep overlay; game can remain running but user can't comfortably play
  enforceLandscape();

  const zoom = getIntegerZoom();
  game.scale.resize(BASE_W, BASE_H);
  game.canvas.style.width = `${BASE_W * zoom}px`;
  game.canvas.style.height = `${BASE_H * zoom}px`;

  // Touch UI: enable on coarse pointer devices only, and only in landscape
  const isTouch = matchMedia("(pointer: coarse)").matches;
  const enableTouch = isTouch && !isPortrait();
  touchRef.setEnabled(enableTouch);
}

window.addEventListener("resize", resize);
resize();
