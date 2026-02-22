import Phaser from "phaser";
import { Player } from "../entities/Player.js";
import { Guard } from "../entities/Guard.js";
import { LeadGuard } from "../entities/LeadGuard.js";
import { Overseer } from "../entities/Overseer.js";
import { VisionSystem } from "../systems/visionSystem.js";
import { createInputManager } from "../systems/input.js";

/**
 * Base class for all room scenes in the game.
 * Handles common functionality like player setup, guards, vision system, etc.
 */
export class BaseRoomScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  /**
   * Initialize room with player spawn and optional entry direction
   */
  init(data) {
    this.playerData = data || {};
    this.entryDirection = data.entryDirection || null; // 'north', 'south', 'east', 'west'
  }

  /**
   * Create common systems (input, vision, etc.)
   */
  createBaseSystems() {
    const { width, height } = this.scale;

    // Start intro music during gameplay if sound is enabled
    if (!this.registry.get("intro_music")) {
      const music = this.sound.add("intro_music", { loop: true, volume: 0.5 });
      this.game.sound.pauseOnBlur = false; // Keep playing when window loses focus
      this.registry.set("intro_music", music);

      if (this.registry.get("soundEnabled")) {
        music.play();
      }
    } else {
      const music = this.registry.get("intro_music");
      if (this.registry.get("soundEnabled") && !music.isPlaying) {
        music.play();
      }
    }

    // Create animations if not already created
    this._ensureAnimationsExist();

    // Input manager
    this.inputManager = createInputManager(this, this.registry.get("touchRef"));

    // UI - Detection meter with background overlay
    this.detectionMeter = this.add.graphics().setScrollFactor(0).setDepth(100);

    // Black overlay for detection text (more opaque for readability)
    const detectionBg = this.add.rectangle(8, 8, 80, 24, 0x000000, 0.6);
    detectionBg.setOrigin(0, 0);
    detectionBg.setScrollFactor(0);
    detectionBg.setDepth(99);

    this.add.text(8, 8, "Detection:", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      fontStyle: "bold",
      color: "#ffffff"
    }).setScrollFactor(0).setDepth(100);

    // Controls - toggleable with H key, hidden by default
    this._controlsText = this.add.text(
      8, height - 35,
      "WASD/Arrows to move | Avoid guard vision cones\n" +
      "Detection meter fills = GAME OVER\n" +
      "V vision debug | C collision debug | B body debug",
      { fontFamily: "Arial, sans-serif", fontSize: "10px", fontStyle: "bold", color: "#ffffff" }
    ).setScrollFactor(0).setDepth(100).setVisible(false);

    // Black overlay behind controls (more opaque for readability)
    const controlsBounds = this._controlsText.getBounds();
    this._controlsBg = this.add.rectangle(
      controlsBounds.x - 2,
      controlsBounds.y - 2,
      controlsBounds.width + 4,
      controlsBounds.height + 4,
      0x000000,
      0.6
    );
    this._controlsBg.setOrigin(0, 0);
    this._controlsBg.setScrollFactor(0);
    this._controlsBg.setDepth(99).setVisible(false);

    // Help indicator (always visible)
    this.add.text(
      width - 85, height - 12,
      "Press H for help",
      { fontFamily: "Arial, sans-serif", fontSize: "10px", fontStyle: "bold", color: "#ffffff", backgroundColor: "#000000", padding: { x: 4, y: 2 } }
    ).setScrollFactor(0).setDepth(100);

    // Sound toggle button (top-right corner)
    this._createSoundToggle(width - 10, 10);

    // Debug graphics
    this._collisionDebug = null;
    this._visionDebug = this.add.graphics().setDepth(5).setAlpha(0.9);
    this._visionDebugOn = true;
    this._bodyDebug = this.add.graphics().setDepth(1000);
    this._bodyDebugOn = false;

    // Debug controls
    this.input.keyboard.on("keydown-C", () => this._toggleCollisionDebug());
    this.input.keyboard.on("keydown-V", () => { this._visionDebugOn = !this._visionDebugOn; });
    this.input.keyboard.on("keydown-B", () => { this._bodyDebugOn = !this._bodyDebugOn; });
    this.input.keyboard.on("keydown-H", () => {
      const visible = !this._controlsText.visible;
      this._controlsText.setVisible(visible);
      this._controlsBg.setVisible(visible);
    });
    this.input.keyboard.on("keydown-ESC", () => this.scene.start("EndingScene"));
  }

  /**
   * Create player at specified spawn point
   */
  createPlayer(x, y) {
    this.player = new Player(this, x, y);
    this.player.setDepth(10);

    // Restore player state if continuing from another room
    if (this.playerData.isDragging) {
      this.player.isDragging = this.playerData.isDragging;
    }
    if (this.playerData.isBoxed) {
      this.player.isBoxed = this.playerData.isBoxed;
    }

    return this.player;
  }

  /**
   * Create guards array
   */
  createGuards() {
    this.guards = [];
    return this.guards;
  }

  /**
   * Setup vision system
   */
  setupVisionSystem(wallLayer = null) {
    this.vision = new VisionSystem(this, this.guards, this.player, wallLayer);

    // Initialize vision for all guards
    for (const guard of this.guards) {
      const visionConfig = this._getVisionConfig(guard.guardType);
      this.vision.initGuard(guard, visionConfig);
    }
  }

  /**
   * Build waypoint network from all guard patrol paths
   * Creates a shared navigation graph for intelligent pathfinding
   */
  buildWaypointNetwork(wallLayer = null) {
    const waypoints = [];
    const waypointConnections = new Map(); // waypoint index -> connected waypoint indices

    // Collect all unique waypoints from all guards
    for (const guard of this.guards) {
      for (const point of guard.path) {
        // Check if this waypoint already exists (within 5px tolerance)
        const existing = waypoints.find(wp =>
          Math.hypot(wp.x - point.x, wp.y - point.y) < 5
        );

        if (!existing) {
          waypoints.push({ x: point.x, y: point.y });
        }
      }
    }

    // Build connections between nearby waypoints (within 150px)
    for (let i = 0; i < waypoints.length; i++) {
      waypointConnections.set(i, []);

      for (let j = 0; j < waypoints.length; j++) {
        if (i === j) continue;

        const dist = Math.hypot(
          waypoints[i].x - waypoints[j].x,
          waypoints[i].y - waypoints[j].y
        );

        // Connect if within range and no wall blocking
        if (dist <= 150) {
          // Check for wall obstruction if wallLayer provided
          if (wallLayer) {
            if (!this._rayHitsWall(
              waypoints[i].x, waypoints[i].y,
              waypoints[j].x, waypoints[j].y,
              wallLayer
            )) {
              waypointConnections.get(i).push(j);
            }
          } else {
            waypointConnections.get(i).push(j);
          }
        }
      }
    }

    // Store network for guards to use
    this.waypointNetwork = {
      waypoints,
      connections: waypointConnections
    };

    // Give each guard reference to the network
    for (const guard of this.guards) {
      guard.waypointNetwork = this.waypointNetwork;
    }

    console.log(`Waypoint network built: ${waypoints.length} waypoints, ${Array.from(waypointConnections.values()).reduce((sum, arr) => sum + arr.length, 0)} connections`);
  }

  /**
   * Check if ray between two points hits a wall
   */
  _rayHitsWall(x0, y0, x1, y1, wallLayer) {
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = Phaser.Math.Linear(x0, x1, t);
      const y = Phaser.Math.Linear(y0, y1, t);
      const tile = wallLayer.getTileAtWorldXY(x, y, true);
      if (tile && tile.collides) return true;
    }
    return false;
  }

  /**
   * Get vision config based on guard type
   * Faster fillMs = more aggressive detection
   */
  _getVisionConfig(guardType) {
    if (guardType === "lead") {
      // Lead guard - more aggressive detection
      return { distance: 100, angleDeg: 100, fillMs: 800, drainMs: 1000 };
    } else if (guardType === "overseer") {
      // Overseer - most aggressive detection
      return { distance: 120, angleDeg: 60, fillMs: 600, drainMs: 1200 };
    }
    // Regular guard - baseline detection
    return { distance: 88, angleDeg: 80, fillMs: 1200, drainMs: 900 };
  }

  /**
   * Create exit zone that transitions to another scene
   */
  createExit(x, y, width, height, targetScene, entryDirection) {
    // Store exit info for manual checking in update loop
    if (!this._exits) this._exits = [];

    const exitData = {
      bounds: { x: x - width/2, y: y - height/2, width, height },
      targetScene,
      entryDirection,
      triggered: false
    };

    this._exits.push(exitData);

    // Debug visualization (green rectangle)
    const debugRect = this.add.rectangle(x, y, width, height, 0x00ff00, 0.3);
    debugRect.setDepth(100);

    console.log(`Exit created at (${x}, ${y}) size ${width}x${height} -> ${targetScene}`);
  }

  /**
   * Transition to another room scene
   */
  transitionToRoom(targetScene, entryDirection) {
    // Save player state
    const playerState = {
      isDragging: this.player.isDragging,
      isBoxed: this.player.isBoxed,
      entryDirection: entryDirection
    };

    // Transition to new scene
    this.scene.start(targetScene, playerState);
  }

  /**
   * Common update loop logic
   */
  updateBase(_, dtMs) {
    const dt = dtMs;
    const input = this.inputManager.get();

    // Update player
    this.player.update(input);

    // Check exits manually
    if (this._exits) {
      for (const exit of this._exits) {
        if (!exit.triggered) {
          const px = this.player.x;
          const py = this.player.y;
          const inBounds = px >= exit.bounds.x &&
                          px <= exit.bounds.x + exit.bounds.width &&
                          py >= exit.bounds.y &&
                          py <= exit.bounds.y + exit.bounds.height;

          if (inBounds) {
            console.log(`Player in exit zone! Transitioning to ${exit.targetScene}`);
            exit.triggered = true;
            this.transitionToRoom(exit.targetScene, exit.entryDirection);
            return;
          }
        }
      }
    }

    // Update guards
    for (const g of this.guards) {
      g.update(dt);
    }

    // Update vision system
    this.vision?.update(dt);

    // Render detection meter
    this._renderDetectionMeter();

    // Vision debug
    if (this._visionDebugOn) {
      this._visionDebug.clear();
      this.vision?.renderDebug(this._visionDebug);
    } else {
      this._visionDebug.clear();
    }

    // Body debug
    if (this._bodyDebugOn) {
      this._bodyDebug.clear();
      this._bodyDebug.lineStyle(2, 0x00ff00, 1);
      this._bodyDebug.strokeRect(
        this.player.body.x,
        this.player.body.y,
        this.player.body.width,
        this.player.body.height
      );
    } else {
      this._bodyDebug.clear();
    }
  }

  /**
   * Render detection meter and check for game over
   */
  _renderDetectionMeter() {
    this.detectionMeter.clear();
    let maxMeter = 0;
    for (const g of this.guards) {
      const m = this.vision?.getMeter(g) ?? 0;
      if (m > maxMeter) maxMeter = m;
    }

    // Game over when detection reaches 100%
    if (maxMeter >= 1.0) {
      // Stop intro music
      const music = this.registry.get("intro_music");
      if (music && music.isPlaying) {
        music.stop();
      }
      this.scene.start("SurroundedScene");
      return;
    }

    const w = 60, h = 6;
    const x = 8, y = 18;
    const color = maxMeter >= 0.66 ? 0xff3333 : maxMeter >= 0.33 ? 0xffcc33 : 0x33ff66;
    this.detectionMeter.fillStyle(0x000000, 0.7);
    this.detectionMeter.fillRect(x - 1, y - 1, w + 2, h + 2);
    this.detectionMeter.fillStyle(color, 0.9);
    this.detectionMeter.fillRect(x, y, w * maxMeter, h);
  }

  /**
   * Toggle collision debug
   */
  _toggleCollisionDebug() {
    if (this._collisionDebug) {
      this._collisionDebug.destroy();
      this._collisionDebug = null;
    } else {
      this._collisionDebug = this.add.graphics().setDepth(1000);
      if (this.groundLayer) {
        this.groundLayer.renderDebug(this._collisionDebug, {
          tileColor: null,
          collidingTileColor: new Phaser.Display.Color(255, 0, 0, 100),
          faceColor: new Phaser.Display.Color(0, 255, 0, 50)
        });
      }
    }
  }

  /**
   * Create sound toggle button
   */
  _createSoundToggle(x, y) {
    const soundEnabled = this.registry.get("soundEnabled");

    // Container for sound toggle
    this._soundToggle = this.add.container(x, y);

    // Background
    const bg = this.add.rectangle(0, 0, 24, 24, 0x000000, 0.7);
    this._soundToggle.add(bg);

    // Sound icon
    this._soundIcon = this.add.graphics();
    this._updateSoundIcon();
    this._soundToggle.add(this._soundIcon);

    // Make interactive
    bg.setInteractive({ useHandCursor: true });
    bg.on("pointerdown", () => {
      const currentState = this.registry.get("soundEnabled");
      this.registry.set("soundEnabled", !currentState);
      this._updateSoundIcon();

      // Toggle music
      const music = this.registry.get("intro_music");
      if (music) {
        if (this.registry.get("soundEnabled")) {
          if (!music.isPlaying) music.resume();
        } else {
          music.pause();
        }
      }
    });

    this._soundToggle.setScrollFactor(0).setDepth(200);
  }

  /**
   * Update sound icon based on current state
   */
  _updateSoundIcon() {
    this._soundIcon.clear();

    if (this.registry.get("soundEnabled")) {
      // Speaker ON - filled speaker with waves
      this._soundIcon.fillStyle(0xffffff, 1);
      this._soundIcon.fillRect(-8, -3, 4, 6); // Speaker body
      this._soundIcon.fillTriangle(-4, -5, -4, 5, 0, 3); // Speaker cone
      this._soundIcon.fillTriangle(-4, -5, -4, 5, 0, -3); // Speaker cone

      // Sound waves (arcs)
      this._soundIcon.lineStyle(2, 0xffffff, 1);
      this._soundIcon.beginPath();
      this._soundIcon.arc(0, 0, 4, -Math.PI/4, Math.PI/4, false);
      this._soundIcon.strokePath();
      this._soundIcon.beginPath();
      this._soundIcon.arc(0, 0, 7, -Math.PI/4, Math.PI/4, false);
      this._soundIcon.strokePath();
    } else {
      // Speaker OFF - filled speaker with X
      this._soundIcon.fillStyle(0xff0000, 1);
      this._soundIcon.fillRect(-8, -3, 4, 6); // Speaker body
      this._soundIcon.fillTriangle(-4, -5, -4, 5, 0, 3); // Speaker cone
      this._soundIcon.fillTriangle(-4, -5, -4, 5, 0, -3); // Speaker cone

      // Red X
      this._soundIcon.lineStyle(2, 0xff0000, 1);
      this._soundIcon.strokeLineShape(new Phaser.Geom.Line(2, -4, 6, 0));
      this._soundIcon.strokeLineShape(new Phaser.Geom.Line(6, -4, 2, 0));
    }
  }

  /**
   * Ensure animations exist (only create once across all scenes)
   */
  _ensureAnimationsExist() {
    // Check if animations already created
    if (this.anims.exists("walk_down")) return;

    // Player animations (Gabe)
    this.anims.create({ key: "idle_down", frames: [{ key: "gabe-front", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_down", frames: this.anims.generateFrameNumbers("gabe-front", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "crouch_down", frames: [{ key: "gabe-front", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "crouchwalk_down", frames: this.anims.generateFrameNumbers("gabe-front", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });

    this.anims.create({ key: "idle_up", frames: [{ key: "gabe-back", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_up", frames: this.anims.generateFrameNumbers("gabe-back", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "crouch_up", frames: [{ key: "gabe-back", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "crouchwalk_up", frames: this.anims.generateFrameNumbers("gabe-back", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });

    this.anims.create({ key: "idle_left", frames: [{ key: "gabe-left", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_left", frames: this.anims.generateFrameNumbers("gabe-left", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "crouch_left", frames: [{ key: "gabe-left", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "crouchwalk_left", frames: this.anims.generateFrameNumbers("gabe-left", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });

    this.anims.create({ key: "idle_right", frames: [{ key: "gabe-right", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_right", frames: this.anims.generateFrameNumbers("gabe-right", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "crouch_right", frames: [{ key: "gabe-right", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "crouchwalk_right", frames: this.anims.generateFrameNumbers("gabe-right", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });

    // Guard animations (soldier1)
    this.anims.create({ key: "guard_walk_down", frames: this.anims.generateFrameNumbers("guard-front", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "guard_walk_up", frames: this.anims.generateFrameNumbers("guard-back", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "guard_walk_left", frames: this.anims.generateFrameNumbers("guard-left", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "guard_walk_right", frames: this.anims.generateFrameNumbers("guard-right", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });

    // Overseer animations
    this.anims.create({ key: "overseer_walk_down", frames: this.anims.generateFrameNumbers("overseer-front", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "overseer_walk_up", frames: this.anims.generateFrameNumbers("overseer-back", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "overseer_walk_left", frames: this.anims.generateFrameNumbers("overseer-left", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "overseer_walk_right", frames: this.anims.generateFrameNumbers("overseer-right", { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
  }
}
