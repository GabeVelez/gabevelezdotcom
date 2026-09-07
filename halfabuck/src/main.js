import "./styles.css";
import Phaser from "phaser";

import { createGameConfig, BASE_W, BASE_H, getIntegerZoom } from "./config/gameConfig.js";
import { updateOrientationOverlay, isPortrait } from "./utils/orientation.js";
import { createMobileShell } from "./ui/mobileShell.js";
import { requestFullscreenOnFirstTouch, showHomeScreenHintIfNeeded } from "./ui/fullscreen.js";
import { GameUI } from "./ui/gameUI.js";
import { SceneSelectorOverlay } from "./ui/sceneSelectorOverlay.js";

import { BootScene } from "./scenes/BootScene.js";
import { IntroScene } from "./scenes/IntroScene.js";
import { AbductionCutscene } from "./scenes/cutscenes/AbductionCutscene.js";
import { CutsceneScene } from "./scenes/cutscenes/CutsceneScene.js";
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

/**
 * iOS Safari has ignored user-scalable=no in the viewport meta since iOS 10, so
 * pinch and double-tap zoom have to be blocked directly. Zooming a fixed-size
 * game canvas only ever breaks the layout, and it was firing accidentally while
 * players used the d-pad.
 */
function blockZoomGestures() {
  // Pinch. Only iOS Safari fires these.
  for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
    document.addEventListener(type, (e) => e.preventDefault(), { passive: false });
  }

  // Pinch fallback for browsers without the gesture events.
  document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  // Double-tap to zoom. A single tap is untouched, so inputs still focus.
  let lastTouchEnd = 0;
  document.addEventListener("touchend", (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });
}
blockZoomGestures();

// Where the Fullscreen API exists (Android, iPad, desktop) the first tap takes
// us fullscreen. iPhone Safari has no such API, so it gets a Home Screen hint
// on the title screen instead.
requestFullscreenOnFirstTouch();

// Retro handheld shell (mobile only; inert on desktop)
const shell = createMobileShell();

// Wait for fonts to load before starting game
let game;

/**
 * Hold the game until the dev password gate is dismissed.
 *
 * Phaser binds its keyboard listeners to the document, so a game booted behind
 * the gate was still live: a stray SPACE would start the cutscene and its audio
 * underneath the password screen. Nothing runs until the gate opens.
 *
 * The gate script is inline and runs before this module, so an already
 * authenticated session resolves immediately.
 */
function waitForGate() {
  const gate = document.getElementById("password-gate");
  const alreadyOpen =
    !gate || window.__habGateOpen === true || getComputedStyle(gate).display === "none";
  if (alreadyOpen) return Promise.resolve();
  return new Promise((resolve) =>
    window.addEventListener("hab:unlocked", resolve, { once: true })
  );
}

// Explicitly load required fonts
waitForGate().then(() => Promise.all([
  document.fonts.load("400 10px 'Press Start 2P'"),
  document.fonts.load("700 10px 'Orbitron'"),
  document.fonts.load("900 10px 'Orbitron'")
])).then(() => {
  console.log('Fonts loaded successfully');
  // Create game after fonts are loaded
  game = new Phaser.Game(createGameConfig([
    BootScene,
    IntroScene,
    AbductionCutscene,
    CutsceneScene,
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
  game.registry.set("touchRef", shell);
  game.registry.set("shell", shell);

  // Initialize HTML UI overlay
  const gameUI = new GameUI(shell);
  game.registry.set("gameUI", gameUI);

  // Initialize Scene Selector overlay (for testing)
  const sceneSelector = new SceneSelectorOverlay();
  sceneSelector.create(game);
  game.registry.set("sceneSelector", sceneSelector);

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

  showHomeScreenHintIfNeeded();

  // Do initial resize after game is created
  resize();
});

/**
 * Canvas sizing.
 *
 * Desktop keeps pixel-perfect integer zoom: internal canvas stays 320x180 and
 * only whole multiples are used, centered by the #game flexbox.
 *
 * The handheld fits the canvas to the screen well instead. Integer zoom is
 * wrong there: on a phone the natural fit is around 1.8x, and flooring that to
 * 1x was rendering the game at literal 320x180 in the middle of the display.
 * A fractional scale with image-rendering: pixelated keeps it crisp enough and
 * roughly doubles the play area.
 */
function resize() {
  // If portrait, keep overlay; game can remain running but user can't comfortably play
  enforceLandscape();

  // Only resize if game exists (fonts loaded)
  if (!game) return;

  game.scale.resize(BASE_W, BASE_H);

  const useShell = shell.active && !isPortrait();
  shell.setEnabled(useShell);

  if (useShell) {
    const fit = shell.fitScreen(BASE_W, BASE_H);
    if (fit) {
      game.canvas.style.width = `${fit.w}px`;
      game.canvas.style.height = `${fit.h}px`;

      // Pin the prompt/notification overlay to the screen well so it can't
      // spill onto the chassis plate.
      const ui = document.getElementById("game-ui");
      if (ui) {
        ui.style.inset = "auto";
        ui.style.left = `${fit.x}px`;
        ui.style.top = `${fit.y}px`;
        ui.style.width = `${fit.width}px`;
        ui.style.height = `${fit.height}px`;
      }
    }
    return;
  }

  const zoom = getIntegerZoom();
  game.canvas.style.width = `${BASE_W * zoom}px`;
  game.canvas.style.height = `${BASE_H * zoom}px`;
}

window.addEventListener("resize", resize);

// Safari settles the landscape viewport a beat after the rotation event, and
// again when the URL bar collapses, so re-measure on both.
window.addEventListener("orientationchange", () => {
  resize();
  setTimeout(resize, 250);
});
window.visualViewport?.addEventListener("resize", resize);
