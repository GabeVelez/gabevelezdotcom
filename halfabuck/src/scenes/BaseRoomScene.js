import Phaser from "phaser";
import { Player } from "../entities/Player.js";
import { Guard } from "../entities/Guard.js";
import { LeadGuard } from "../entities/LeadGuard.js";
import { Overseer } from "../entities/Overseer.js";
import { VisionSystem } from "../systems/visionSystem.js";
import { createInputManager } from "../systems/input.js";
import { InventorySystem } from "../systems/inventorySystem.js";

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

    // Initialize inventory system (shared across scenes via registry)
    if (!this.registry.get("inventory")) {
      this.registry.set("inventory", new InventorySystem());
    }
    this.inventory = this.registry.get("inventory");

    // Initialize items array for this scene
    this.items = [];

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

    // Get HTML UI overlay reference
    this.gameUI = this.registry.get("gameUI");
    if (this.gameUI) {
      this.gameUI.setVisible(true);
      // Update sound icon to match current state
      this.gameUI.updateSoundIcon(this.registry.get("soundEnabled"));
    }

    // Debug graphics
    this._collisionDebug = null;
    this._visionDebug = this.add.graphics().setDepth(5).setAlpha(0.9);
    this._visionDebugOn = true;
    this._bodyDebug = this.add.graphics().setDepth(1000);
    this._bodyDebugOn = false;

    // Interaction tooltip graphics
    this._tooltipGraphics = this.add.graphics().setDepth(1001);
    this._nearbyItem = null;

    // Debug controls
    this.input.keyboard.on("keydown-C", () => this._toggleCollisionDebug());
    this.input.keyboard.on("keydown-V", () => { this._visionDebugOn = !this._visionDebugOn; });
    this.input.keyboard.on("keydown-B", () => { this._bodyDebugOn = !this._bodyDebugOn; });
    this.input.keyboard.on("keydown-H", () => {
      if (this.gameUI) {
        this.gameUI.toggleHelp();
      }
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

    // Play landing animation if player fell through a hole
    if (this.playerData.isFalling) {
      this._playLandingAnimation();
    }

    return this.player;
  }

  /**
   * Play landing animation after falling through hole
   */
  _playLandingAnimation() {
    // Start small (like coming up from hole)
    this.player.setScale(0.01);
    this.player.setAlpha(1); // Reset alpha
    this.player.body.enable = false;

    // Slower fade in from black
    this.cameras.main.fadeIn(250, 0, 0, 0);

    // Wait longer before pop-up (player stays small momentarily)
    this.time.delayedCall(350, () => {
      // Camera shake on landing
      this.cameras.main.shake(150, 0.004);

      // Slower, more pronounced pop-up with elastic bounce
      this.tweens.add({
        targets: this.player,
        scaleX: 0.15,
        scaleY: 0.15,
        duration: 450,
        ease: 'Elastic.easeOut',
        onComplete: () => {
          // Re-enable player movement
          this.player.body.enable = true;
        }
      });

      // Dust particle effect
      const particles = this.add.particles(this.player.x, this.player.y, 'warehouse_tiles', {
        frame: 1,
        lifespan: 400,
        speed: { min: 20, max: 40 },
        scale: { start: 0.3, end: 0 },
        gravityY: 50,
        quantity: 8,
        alpha: { start: 0.6, end: 0 },
        emitting: false
      });
      particles.explode();

      // Play ground impact sound
      if (this.registry.get("soundEnabled")) {
        this.sound.play('ground_impact', { volume: 0.4 });
      }
    });
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

    // Initialize vision and pathfinding for all guards
    for (const guard of this.guards) {
      const visionConfig = this._getVisionConfig(guard.guardType);
      this.vision.initGuard(guard, visionConfig);

      // Initialize pathfinding grid from tilemap
      if (wallLayer) {
        guard.initializePathfinding(wallLayer);
      }
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
   * Special transition for falling through a hole
   */
  transitionThroughHole(targetScene, entryDirection) {
    // Prevent player movement during animation
    this.player.body.setVelocity(0, 0);
    this.player.body.enable = false;

    // Camera shake
    this.cameras.main.shake(150, 0.005);

    // Player shrinks and drops vertically into hole (from 0.15 to invisible)
    this.tweens.add({
      targets: this.player,
      scaleX: 0.01,
      scaleY: 0.01,
      y: this.player.y + 40, // Drop down 40 pixels into hole
      alpha: 0.3, // Fade out as falling
      duration: 250,
      ease: 'Cubic.easeIn', // Accelerating fall
      onComplete: () => {
        // Quick fade to black
        this.cameras.main.fadeOut(150, 0, 0, 0);

        this.cameras.main.once('camerafadeoutcomplete', () => {
          // Save player state with fall flag
          const playerState = {
            isDragging: this.player.isDragging,
            isBoxed: this.player.isBoxed,
            entryDirection: entryDirection,
            isFalling: true // Flag to trigger landing animation
          };

          // Transition to new scene
          this.scene.start(targetScene, playerState);
        });
      }
    });
  }

  /**
   * Common update loop logic
   */
  updateBase(_, dtMs) {
    const dt = dtMs;
    const input = this.inputManager.get();

    // Update player
    this.player.update(input);

    // Check for nearby items
    this._checkItemInteraction(input);

    // Check exits manually
    if (this._exits) {
      for (const exit of this._exits) {
        if (!exit.triggered) {
          // Use player's center position (origin is 0.5, 1.0)
          const px = this.player.x;
          const py = this.player.y - (this.player.displayHeight / 2); // Adjust for bottom-center origin

          const inBounds = px >= exit.bounds.x &&
                          px <= exit.bounds.x + exit.bounds.width &&
                          py >= exit.bounds.y &&
                          py <= exit.bounds.y + exit.bounds.height;

          // Debug logging
          if (Math.abs(px - (exit.bounds.x + exit.bounds.width/2)) < 50 &&
              Math.abs(py - (exit.bounds.y + exit.bounds.height/2)) < 50) {
            console.log(`Near exit: px=${px.toFixed(0)}, py=${py.toFixed(0)}, exit x=${exit.bounds.x.toFixed(0)}-${(exit.bounds.x + exit.bounds.width).toFixed(0)}, y=${exit.bounds.y.toFixed(0)}-${(exit.bounds.y + exit.bounds.height).toFixed(0)}`);
          }

          if (inBounds) {
            console.log(`Player in exit zone! Transitioning to ${exit.targetScene}`);
            exit.triggered = true;

            // Use special hole transition if this is a hole exit
            if (exit.isHole) {
              this.transitionThroughHole(exit.targetScene, exit.entryDirection);
            } else {
              this.transitionToRoom(exit.targetScene, exit.entryDirection);
            }
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
    let maxMeter = 0;
    for (const g of this.guards) {
      const m = this.vision?.getMeter(g) ?? 0;
      if (m > maxMeter) maxMeter = m;
    }

    // Update HTML UI meter
    if (this.gameUI) {
      this.gameUI.updateDetectionMeter(maxMeter);
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

  /**
   * Check for item interaction
   */
  _checkItemInteraction(input) {
    // Find nearest item in range
    let nearestItem = null;
    let nearestDistance = Infinity;

    for (const item of this.items) {
      if (item.isPlayerInRange(this.player)) {
        const distance = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          item.x, item.y
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestItem = item;
        }
      }
    }

    this._nearbyItem = nearestItem;

    // Update tooltip display (HTML overlay only, no in-game label)
    if (this._nearbyItem) {
      // Update UI to show interaction prompt
      if (this.gameUI) {
        this.gameUI.showInteractionPrompt(this._nearbyItem.itemName);
      }

      // Handle interaction input
      if (input.justInteract) {
        this._collectItem(this._nearbyItem);
      }
    } else {
      // Hide UI interaction prompt
      if (this.gameUI) {
        this.gameUI.hideInteractionPrompt();
      }
    }
  }

  /**
   * Collect an item
   */
  _collectItem(item) {
    const success = item.collect(this.player, this);

    if (success) {
      // Play pickup sound
      if (this.registry.get("soundEnabled")) {
        this.sound.play("item_pickup", { volume: 0.4 });
      }

      // Add to inventory
      this.inventory.addItem(item);

      // Update UI
      if (this.gameUI) {
        this.gameUI.updateInventory(this.inventory.getAll());
        this.gameUI.hideInteractionPrompt();
      }

      // Clear nearby item reference
      this._nearbyItem = null;
    }
  }

}
