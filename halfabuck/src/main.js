import "./styles.css";
import Phaser from "phaser";

import { createGameConfig, BASE_W, BASE_H, getIntegerZoom } from "./config/gameConfig.js";
import { updateOrientationOverlay, isPortrait } from "./utils/orientation.js";
import { createTouchControls } from "./ui/touchControls.js";
import { GameUI } from "./ui/gameUI.js";

import { BootScene } from "./scenes/BootScene.js";
import { IntroScene } from "./scenes/IntroScene.js";
import { AbductionCutscene } from "./scenes/cutscenes/AbductionCutscene.js";
import { CellScene } from "./scenes/rooms/CellScene.js";
import { SewerScene } from "./scenes/rooms/SewerScene.js";
import { WarehouseCorridorScene } from "./scenes/rooms/WarehouseCorridorScene.js";
import { WarehouseMainScene } from "./scenes/rooms/WarehouseMainScene.js";
import { StorageBayScene } from "./scenes/rooms/StorageBayScene.js";
import { LoadingDockScene } from "./scenes/rooms/LoadingDockScene.js";
import { SecurityOfficeScene } from "./scenes/rooms/SecurityOfficeScene.js";
import { MaintenanceTunnelScene } from "./scenes/rooms/MaintenanceTunnelScene.js";
import { ExecutiveWingScene } from "./scenes/rooms/ExecutiveWingScene.js";
import { RooftopHelipadScene } from "./scenes/rooms/RooftopHelipadScene.js";
import { SurroundedScene } from "./scenes/SurroundedScene.js";
import { GameOverScene } from "./scenes/GameOverScene.js";
import { EndingScene } from "./scenes/EndingScene.js";

// Landscape-only overlay
function enforceLandscape() {
  updateOrientationOverlay();
}
window.addEventListener("resize", enforceLandscape);
window.addEventListener("orientationchange", enforceLandscape);

// Wait for DOM to be ready before first check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enforceLandscape);
} else {
  // DOM already loaded
  enforceLandscape();
}

// Touch controls (DOM overlay)
const touchRef = createTouchControls();

// Wait for fonts to load before starting game
let game;

// Explicitly load required fonts
Promise.all([
  document.fonts.load("400 10px 'Press Start 2P'"),
  document.fonts.load("700 10px 'Orbitron'"),
  document.fonts.load("900 10px 'Orbitron'")
]).then(() => {
  console.log('Fonts loaded successfully');
  // Create game after fonts are loaded
  game = new Phaser.Game(createGameConfig([
    BootScene,
    IntroScene,
    AbductionCutscene,
    CellScene,
    SewerScene,
    WarehouseCorridorScene,
    WarehouseMainScene,
    StorageBayScene,
    LoadingDockScene,
    SecurityOfficeScene,
    MaintenanceTunnelScene,
    ExecutiveWingScene,
    RooftopHelipadScene,
    SurroundedScene,
    GameOverScene,
    EndingScene
  ]));

  // Share touch state with scenes via registry
  game.registry.set("touchRef", touchRef);

  // Initialize HTML UI overlay
  const gameUI = new GameUI();
  game.registry.set("gameUI", gameUI);

  // Listen for sound toggle events from HTML button
  window.addEventListener('toggleSound', () => {
    const currentState = game.registry.get("soundEnabled");
    game.registry.set("soundEnabled", !currentState);
    gameUI.updateSoundIcon(!currentState);

    // Toggle music
    const music = game.registry.get("intro_music");
    if (music) {
      if (!currentState) {
        if (!music.isPlaying) music.resume();
      } else {
        music.pause();
      }
    }
  });

  // Do initial resize after game is created
  resize();
});

/**
 * Pixel-perfect integer scaling:
 * - Keep internal canvas 320x180
 * - Apply integer zoom via CSS size
 * - Centered by #game flexbox
 */
function resize() {
  // If portrait, keep overlay; game can remain running but user can't comfortably play
  enforceLandscape();

  // Only resize if game exists (fonts loaded)
  if (!game) return;

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
