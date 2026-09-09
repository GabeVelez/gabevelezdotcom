import Phaser from "phaser";
import { Player } from "../entities/Player.js";
import { Guard } from "../entities/Guard.js";
import { LeadGuard } from "../entities/LeadGuard.js";
import { Overseer } from "../entities/Overseer.js";
import { VisionSystem } from "../systems/visionSystem.js";
import { createInputManager } from "../systems/input.js";
import { InventorySystem } from "../systems/inventorySystem.js";
import { SVGExitParser } from "../utils/SVGExitParser.js";
import { playMusic, stopMusic } from "../systems/music.js";

/** Fed to the update loop while a scripted sequence has the controls. */
const EMPTY_INPUT = Object.freeze({
  up: false, down: false, left: false, right: false,
  slot1: false, slot2: false, slot3: false,
  justSlot1: false, justSlot2: false, justSlot3: false,
});

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

    // When entering via a hole fall, keep the camera blacked out until
    // _playLandingAnimation() fades it back in. Otherwise the new scene
    // flashes visible during async asset loads before createPlayer() fires.
    if (this.playerData.isFalling && this.cameras && this.cameras.main) {
      this.cameras.main.fadeOut(0, 0, 0, 0);
    }
  }

  /**
   * Create common systems (input, vision, etc.)
   */
  createBaseSystems() {
    // Phaser reuses scene instances, so this latch survives a restart unless
    // it is cleared on the way in.
    this._playerCaught = false;
    this._scripted = false;
    this.inventoryFrozen = false;

    const { width, height } = this.scale;

    // Initialize inventory system (shared across scenes via registry)
    if (!this.registry.get("inventory")) {
      this.registry.set("inventory", new InventorySystem());
    }
    this.inventory = this.registry.get("inventory");

    // Initialize items array for this scene
    this.items = [];

    // Initialize locked doors array for this scene
    this.lockedDoors = [];

    // Targets that a carried item can be thrown at (villain, monster)
    this.throwTargets = [];

    // Each room can name its own track via this.sceneMusic; everything else
    // gets the default. playMusic is a no-op if that track is already going, so
    // music carries across a scene change instead of restarting.
    playMusic(this, this.sceneMusic || "intro_music", { loop: true, volume: 0.5 });

    // Create animations if not already created
    this._ensureAnimationsExist();

    // Input manager
    this.inputManager = createInputManager(this, this.registry.get("touchRef"));

    // Get HTML UI overlay reference
    this.gameUI = this.registry.get("gameUI");
    // The HUD outlives the scene. The rooftop relabels the meter and kills two
    // slots; without this, dying up there would carry both back to the cell.
    this.gameUI?.setMeterMode?.("detection");
    this.gameUI?.setSlotsDisabled?.([]);
    if (this.gameUI) {
      this.gameUI.setVisible(true);
      // Update sound icon to match current state
      this.gameUI.updateSoundIcon(this.registry.get("soundEnabled"));
      // Set the bottom-left level label (each scene declares this.levelLabel in its constructor)
      this.gameUI.setLevelLabel(this.levelLabel || "");
    }

    // Debug graphics
    this._visionDebug = this.add.graphics().setDepth(5).setAlpha(0.9);
    this._visionDebugOn = true;
    this._bodyDebug = this.add.graphics().setDepth(1000);
    this._bodyDebugOn = false;


    // Debug controls
    this.input.keyboard.on("keydown-V", () => { this._visionDebugOn = !this._visionDebugOn; });
    this.input.keyboard.on("keydown-B", () => { this._bodyDebugOn = !this._bodyDebugOn; });
    this.input.keyboard.on("keydown-H", () => {
      if (this.gameUI) {
        this.gameUI.toggleHelp();
      }
    });
    // ESC used to jump straight to MISSION COMPLETE, so one keypress skipped
    // all ten levels. It pauses now, which is what a player expects it to do.
    this.input.keyboard.on("keydown-ESC", () => this.pauseGame());

    // Same for the chassis button, so pausing does not need a keyboard.
    const shell = this.registry.get("shell");
    if (shell?.state) shell.state.onPause = () => this.pauseGame();

    // Add delay before exits become active (prevent immediate triggering on scene load)
    this.time.delayedCall(300, () => {
      this._exitActiveTime = true;
    });
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
    // Remember the real scale before shrinking. This used to tween back to a
    // hardcoded 0.15, so changing the player's scale left them permanently
    // undersized (and with a shrunken collision body) after any hole fall.
    const restoreScale = this.player.scaleX;

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
        scaleX: restoreScale,
        scaleY: restoreScale,
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
    // Pass both tilemap walls (legacy) and SVG collision bodies (new system)
    this.vision = new VisionSystem(this, this.guards, this.player, wallLayer, this.collisionBodies);

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
    if (guardType === "villain") {
      // Wide and quick to react. He is not trying to catch you unawares, he is
      // trying to keep you off his desk, so he should commit almost at once.
      return { distance: 96, angleDeg: 96, fillMs: 500, drainMs: 700 };
    }
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
   * Create a locked door that requires a keycard to unlock
   */
  createLockedDoor(x, y, width, height, doorId = "default") {
    // Create visual representation (red door sprite)
    const doorSprite = this.add.image(x, y, "locked-red");
    doorSprite.setDisplaySize(width, height);
    doorSprite.setDepth(5);

    // Create collision body for the door
    const doorBody = this.physics.add.staticImage(x, y);
    doorBody.setDisplaySize(width, height);
    doorBody.body.updateFromGameObject();
    doorBody.setVisible(false); // Hide physics body, only show sprite

    // Add collision with player
    this.physics.add.collider(this.player, doorBody);

    // Store door data
    const door = {
      id: doorId,
      sprite: doorSprite,
      body: doorBody,
      x, y, width, height,
      unlocked: false,
      unlockRange: 50 // Distance within which door unlocks
    };

    this.lockedDoors.push(door);

    console.log(`Locked door created at (${x}, ${y}) size ${width}x${height}, ID: ${doorId}`);
    return door;
  }

  /**
   * Create exit zone that transitions to another scene
   */
  createExit(x, y, width, height, targetScene, entryDirection, options = {}) {
    // Store exit info for manual checking in update loop
    if (!this._exits) this._exits = [];

    const exitData = {
      bounds: { x: x - width/2, y: y - height/2, width, height },
      targetScene,
      entryDirection,
      // A door can play a cutscene on the way through. Handing over between
      // rooms is the natural place for a story beat: it is the one moment the
      // player is already between two places and expecting a change.
      cutscene: options.cutscene || null,
      triggered: false
    };

    this._exits.push(exitData);

    // Debug visualization (green rectangle)
    const debugRect = this.add.rectangle(x, y, width, height, 0x00ff00, 0.3);
    debugRect.setDepth(100);

    console.log(`Exit created at (${x}, ${y}) size ${width}x${height} -> ${targetScene}`);
  }

  /**
   * Setup exits from SVG file - handles all scenes uniformly
   * @param {string} svgPath - Path to the exits SVG file
   * @param {object} exitConfig - Configuration for exit destinations
   *   Example: {
   *     enterZone: { scene: "WarehouseMainScene", direction: "north", entryDirection: "south" },
   *     exitZone: { scene: "LoadingDockScene", direction: "south", entryDirection: "north" }
   *   }
   *   - direction: what direction to pass to the target scene when exiting
   *   - entryDirection: when THIS scene has this entryDirection, use this zone's spawn point
   * @param {number} offsetX - Optional X offset for scenes that use offsets
   * @param {number} offsetY - Optional Y offset for scenes that use offsets
   * @returns {Promise<{x: number, y: number}>} Spawn position based on entryDirection
   */
  async setupExitsFromSVG(svgPath, exitConfig, offsetX = 0, offsetY = 0) {
    // Load exit/enter data from SVG file with offsets
    const exitData = await SVGExitParser.parseSVGFile(svgPath, offsetX, offsetY);

    if (!exitData) {
      console.error(`Failed to load exit data from SVG: ${svgPath}`);
      return { x: 200, y: 160 }; // Default center spawn
    }

    console.log(`Loaded exit data from ${svgPath}:`, exitData);

    // Determine spawn position based on entry direction
    let spawnX = 200;
    let spawnY = 160;

    // Check which spawn point to use based on entryDirection
    if (exitConfig.enterZone && this.entryDirection === exitConfig.enterZone.entryDirection && exitData.enterSpawn) {
      // Use enter spawn (blue circle)
      spawnX = exitData.enterSpawn.x;
      spawnY = exitData.enterSpawn.y;
      console.log(`Spawning at enter spawn (entryDirection: ${this.entryDirection}): (${spawnX}, ${spawnY})`);
    } else if (exitConfig.exitZone && this.entryDirection === exitConfig.exitZone.entryDirection && exitData.exitSpawn) {
      // Use exit spawn (black circle)
      spawnX = exitData.exitSpawn.x;
      spawnY = exitData.exitSpawn.y;
      console.log(`Spawning at exit spawn (entryDirection: ${this.entryDirection}): (${spawnX}, ${spawnY})`);
    } else if (exitData.enterSpawn) {
      // No entryDirection match — fall back to enterSpawn.
      // If we got here with a non-null entryDirection, the scene's exit config
      // doesn't agree with the previous scene's transition direction.
      if (this.entryDirection) {
        const expected = [
          exitConfig.enterZone?.entryDirection,
          exitConfig.exitZone?.entryDirection,
        ].filter(Boolean).join(" or ") || "(none)";
        console.warn(
          `[${this.scene.key}] entryDirection "${this.entryDirection}" matched no zone (expected ${expected}); spawning at enterSpawn as fallback.`
        );
      }
      spawnX = exitData.enterSpawn.x;
      spawnY = exitData.enterSpawn.y;
      console.log(`Spawning at enter spawn (default/testing): (${spawnX}, ${spawnY})`);
    }

    // Create enter zone (blue - can return to previous scene)
    if (exitData.enterZone && exitConfig.enterZone) {
      const ez = exitData.enterZone;
      const centerX = ez.x + ez.width / 2;
      const centerY = ez.y + ez.height / 2;
      this.createExit(centerX, centerY, ez.width, ez.height, exitConfig.enterZone.scene, exitConfig.enterZone.direction);
      console.log(`Enter zone: SVG=(${ez.x}, ${ez.y}), center=(${centerX}, ${centerY}), ${ez.width}×${ez.height}) → ${exitConfig.enterZone.scene}`);
    }

    // Create exit zone (black - progress to next scene)
    if (exitData.exitZone && exitConfig.exitZone) {
      const xz = exitData.exitZone;
      const centerX = xz.x + xz.width / 2;
      const centerY = xz.y + xz.height / 2;
      this.createExit(centerX, centerY, xz.width, xz.height, exitConfig.exitZone.scene, exitConfig.exitZone.direction);
      console.log(`Exit zone: SVG=(${xz.x}, ${xz.y}), center=(${centerX}, ${centerY}), ${xz.width}×${xz.height}) → ${exitConfig.exitZone.scene}`);
    }

    return { x: spawnX, y: spawnY };
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
  transitionThroughHole(targetScene, entryDirection, exit) {
    // Prevent player movement during animation
    this.player.body.setVelocity(0, 0);
    this.player.body.enable = false;

    // Calculate center of the hole exit
    const holeCenterX = exit.bounds.x + exit.bounds.width / 2;
    const holeCenterY = exit.bounds.y + exit.bounds.height / 2;

    // First: Quick slide to center of hole (looks more realistic)
    this.tweens.add({
      targets: this.player,
      x: holeCenterX,
      y: holeCenterY,
      duration: 200,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        // Brief pause (player realizes they're falling)
        this.time.delayedCall(100, () => {
          // Camera shake as player starts falling
          this.cameras.main.shake(200, 0.006);

          // Now: Player shrinks and drops into hole (Legend of Zelda 16-bit style fall)
          this.tweens.add({
            targets: this.player,
            scaleX: 0.01,
            scaleY: 0.01,
            y: this.player.y + 50, // Drop down 50 pixels into hole
            alpha: 0.2, // Fade out as falling
            duration: 600, // Slower, more dramatic fall
            ease: 'Cubic.easeIn', // Accelerating fall
            onComplete: () => {
              // Quick fade to black
              this.cameras.main.fadeOut(150, 0, 0, 0);

              this.cameras.main.once('camerafadeoutcomplete', () => {
                // Slight delay before transition (adds to the fall feeling)
                this.time.delayedCall(200, () => {
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
              });
            }
          });
        });
      }
    });
  }

  /**
   * Common update loop logic
   */
  updateBase(_, dtMs) {
    // Don't update until scene is fully initialized (async loading complete)
    if (!this.inputManager || !this.player || !this.player.body) {
      return;
    }

    const dt = dtMs;
    // During a scripted exit the character is acting, not the player. Feed the
    // update loop empty input so nothing the thumb does reaches him.
    const input = this._scripted ? EMPTY_INPUT : this.inputManager.get();

    // Update player
    if (!this._scripted) this.player.update(input);

    // Pick up anything the player has walked up to
    this._checkItemPickup();

    // Check for locked doors to unlock
    this._checkLockedDoors();

    // Check for a throwable being used on a target
    this._checkThrowTargets(input);

    // Check exits manually (with delay to prevent immediate triggering on load)
    if (this._exits) {
      // Add delay before exits become active (set in createBaseSystems)
      if (!this._exitActiveTime) {
        return; // Exits not yet active
      }

      for (const exit of this._exits) {
        if (!exit.triggered) {
          // Use player's center position (origin is 0.5, 1.0)
          const px = this.player.x;
          const py = this.player.y - (this.player.displayHeight / 2); // Adjust for bottom-center origin

          const inBounds = px >= exit.bounds.x &&
                          px <= exit.bounds.x + exit.bounds.width &&
                          py >= exit.bounds.y &&
                          py <= exit.bounds.y + exit.bounds.height;

          if (inBounds) {
            exit.triggered = true;

            // Use special hole transition if this is a hole exit
            if (exit.isHole) {
              this.transitionThroughHole(exit.targetScene, exit.entryDirection, exit);
            } else if (exit.cutscene) {
              // No stopMusic here on purpose: a cutscene with no music of its
              // own leaves the track alone, so spooky runs unbroken from the
              // reveal through the confrontation and up the stairs.
              this.scene.start("CutsceneScene", {
                cutscene: exit.cutscene,
                next: exit.targetScene,
                nextData: {
                  isDragging: this.player.isDragging,
                  isBoxed: this.player.isBoxed,
                  entryDirection: exit.entryDirection,
                },
              });
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
    let maxMeter = 0;       // what the HUD shows
    let capturingMeter = 0; // what can actually end the run
    for (const g of this.guards) {
      const m = this.vision?.getMeter(g) ?? 0;
      if (m > maxMeter) maxMeter = m;
      if (g.capturesOnDetection !== false && m > capturingMeter) capturingMeter = m;
    }

    // Update HTML UI meter
    if (this.gameUI) {
      this.gameUI.updateDetectionMeter(maxMeter);
    }

    // Game over when detection reaches 100%. Some pursuers are exempt: the
    // villain's meter is a warning that he is coming, and it is the grab that
    // ends the run, so a full meter alone must not.
    if (capturingMeter >= 1.0) {
      this.playerCaught("seen");
    }
  }

  /**
   * Take the controls and walk the player along a fixed path, then hand over.
   *
   * For scripted exits, where the character acts and the player watches. The
   * body is disabled so nothing collides mid-run and the tween cannot be
   * fought; the walk animation is driven per leg from the direction of travel
   * so he still moves like himself rather than sliding.
   *
   * @param {{x:number,y:number}[]} points  legs to walk, in order
   * @param {object} [opts]                 speed (px/sec), delay before starting
   * @param {Function} [onArrive]           called once the last leg lands
   */
  autoWalk(points, opts = {}, onArrive = null) {
    if (!this.player || !points?.length) return;

    const speed = opts.speed ?? 110;
    this._scripted = true;
    this.player.body.setVelocity(0, 0);
    this.player.body.enable = false;

    const legs = [...points];
    const step = () => {
      const next = legs.shift();
      if (!next) {
        this.player.anims.stop();
        if (onArrive) onArrive();
        return;
      }
      const dx = next.x - this.player.x;
      const dy = next.y - this.player.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return step();

      const dir = Math.abs(dx) > Math.abs(dy)
        ? (dx < 0 ? "left" : "right")
        : (dy < 0 ? "up" : "down");
      this.player.anims.play(`walk_${dir}`, true);

      this.tweens.add({
        targets: this.player,
        x: next.x,
        y: next.y,
        duration: (dist / speed) * 1000,
        ease: "Linear",
        onComplete: step,
      });
    };

    if (opts.delay) this.time.delayedCall(opts.delay, step);
    else step();
  }

  /**
   * Pause. The room is paused rather than stopped, so PauseScene draws over a
   * level that is still there and resuming costs nothing.
   */
  pauseGame() {
    if (this.scene.isPaused(this.scene.key)) return;
    // The shell's button fires through a callback set in createBaseSystems.

    this.registry.get("shell")?.setPaused?.(true);
    this.scene.pause();
    this.scene.launch("PauseScene", { roomKey: this.scene.key });
  }

  /**
   * The one way the player loses a room. Guarded so that a grab and a full
   * detection meter landing on the same frame cannot start the scene twice.
   */
  playerCaught() {
    if (this._playerCaught) return;
    this._playerCaught = true;
    stopMusic(this);
    this.scene.start("SurroundedScene");
  }

  /**
   * Ensure animations exist (only create once across all scenes)
   */
  _ensureAnimationsExist() {
    // Check if animations already created
    if (this.anims.exists("walk_down")) return;

    // Player animations (Gabe)
    this.anims.create({ key: "idle_down", frames: [{ key: "gabe-front", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_down", frames: this.anims.generateFrameNumbers("gabe-front", { start: 0, end: 4 }), frameRate: 14, repeat: -1 });

    this.anims.create({ key: "idle_up", frames: [{ key: "gabe-back", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_up", frames: this.anims.generateFrameNumbers("gabe-back", { start: 0, end: 4 }), frameRate: 14, repeat: -1 });

    this.anims.create({ key: "idle_left", frames: [{ key: "gabe-left", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_left", frames: this.anims.generateFrameNumbers("gabe-left", { start: 0, end: 4 }), frameRate: 14, repeat: -1 });

    this.anims.create({ key: "idle_right", frames: [{ key: "gabe-right", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: "walk_right", frames: this.anims.generateFrameNumbers("gabe-right", { start: 0, end: 4 }), frameRate: 14, repeat: -1 });

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

    // The monster. Rows are walk right/left/down/up then rush right/left/down/up,
    // five frames each, so row r is frames r*5 to r*5+4. The rush runs faster
    // than the walk because he is committing, not travelling.
    ["right", "left", "down", "up"].forEach((dir, i) => {
      this.anims.create({
        key: `monster_walk_${dir}`,
        frames: this.anims.generateFrameNumbers("villain-big", { start: i * 5, end: i * 5 + 4 }),
        frameRate: 9, repeat: -1,
      });
      this.anims.create({
        key: `monster_rush_${dir}`,
        frames: this.anims.generateFrameNumbers("villain-big", { start: (i + 4) * 5, end: (i + 4) * 5 + 4 }),
        frameRate: 16, repeat: -1,
      });
    });

    // Villain, soaked and screaming. Slow enough to read as convulsing rather
    // than flickering, since each frame was drawn independently.
    this.anims.create({ key: "villain_walk_down", frames: this.anims.generateFrameNumbers("villain-front", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "villain_walk_up", frames: this.anims.generateFrameNumbers("villain-back", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "villain_walk_left", frames: this.anims.generateFrameNumbers("villain-left", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "villain_walk_right", frames: this.anims.generateFrameNumbers("villain-right", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });

    this.anims.create({ key: "villain_agony", frames: this.anims.generateFrameNumbers("villain-agony", { start: 0, end: 9 }), frameRate: 8, repeat: -1 });
  }

  /**
   * Pick up any item the player walks up to.
   *
   * There is no pick-up button. With only three items in the game and no reason
   * to ever refuse one, a button was a control to teach for no decision to make,
   * so walking within an item's interactionRange collects it.
   */
  _checkItemPickup() {
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

    if (nearestItem) {
      this._collectItem(nearestItem);
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
        const items = this.inventory.getAll();
        this.gameUI.updateInventory(items);

        // Tell the player the slot it actually landed in. Slots are filled in
        // pickup order and free up when an item is spent, so the number is not
        // fixed per item.
        const slot = items.findIndex((i) => i.id === item.itemId) + 1;
        this.gameUI.showItemNotification(item.itemId, item.itemName, slot);
      }

  
    }
  }

  /**
   * A target that is defeated by throwing a carried item at it.
   *
   * Both boss beats are the same shape: pick the item up, get close, use its
   * slot, watch it land. One hit is all it takes, so there is no health, no
   * projectile physics and no combat state, just a tween and a callback.
   */
  createThrowTarget(x, y, config = {}) {
    // A target can be a still sprite this creates, or an entity that already
    // exists and moves under its own power (the villain). In the second case
    // x/y have to be read live or the range check tests where he used to be.
    const sprite = config.sprite ?? this.add.sprite(x, y, config.texture);
    if (!config.sprite) {
      if (config.displaySize) {
        sprite.setDisplaySize(config.displaySize, config.displaySize);
      }
      sprite.setDepth(config.depth ?? 9);
    }

    const target = {
      sprite,
      get x() { return sprite.x; },
      get y() { return sprite.y; },
      requiresItem: config.requiresItem,
      range: config.range ?? 90,
      // Lob it (a thrown glass) or send it flat and fast (a rocket).
      arc: config.arc !== false,
      // When a cutscene shows the throw, playing it in-game first just shows
      // the same beat twice.
      instant: config.instant === true,
      onDefeated: config.onDefeated || null,
      defeated: false,
      busy: false,
    };

    this.throwTargets.push(target);
    return target;
  }

  /**
   * Fires when the player uses the slot holding the required item while close
   * enough to a target. The slot index is looked up rather than hardcoded,
   * since it depends on pickup order.
   */
  /** Rooms can switch the carried items off; the rooftop does. */
  _itemsUsable() {
    return !this.inventoryFrozen;
  }

  _checkThrowTargets(input) {
    if (!this.throwTargets || this.throwTargets.length === 0) return;
    if (!this._itemsUsable()) return;

    const items = this.inventory.getAll();

    for (const target of this.throwTargets) {
      if (target.defeated || target.busy) continue;

      const slotIndex = items.findIndex((i) => i.id === target.requiresItem);
      if (slotIndex === -1) continue;
      if (!input[`justSlot${slotIndex + 1}`]) continue;

      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, target.x, target.y
      );
      if (distance > target.range) continue;

      this._throwAtTarget(target, items[slotIndex]);
    }
  }

  /**
   * Player throws, the item travels, it lands. Then hand off to whatever comes
   * next (a cutscene, usually).
   */
  _throwAtTarget(target, item) {
    target.busy = true;

    // Spend the item so it cannot be thrown twice
    this.inventory.removeItem(item.id);
    if (this.gameUI) this.gameUI.updateInventory(this.inventory.getAll());

    // Player stops to throw
    this.player.body.setVelocity(0, 0);
    this.player.body.enable = false;

    if (target.instant) {
      // A cutscene is about to show the throw; skip straight to the outcome.
      if (target.onDefeated) target.onDefeated();
      return;
    }

    const projectile = this.add.image(this.player.x, this.player.y - 16, item.texture);
    projectile.setDisplaySize(16, 16);
    projectile.setDepth(20);

    if (this.registry.get("soundEnabled")) {
      this.sound.play("box_toggle", { volume: 0.4 });
    }

    if (!target.arc) {
      // Flat, fast, no lob.
      projectile.setAngle(target.x < this.player.x ? 180 : 0);
      this.tweens.add({
        targets: projectile,
        x: target.x,
        y: target.y,
        duration: 220,
        ease: "Quad.easeIn",
        onComplete: () => this._resolveThrowHit(target, projectile),
      });
      return;
    }

    // Arc it in: rise on the way out, drop onto the target.
    const midX = (this.player.x + target.x) / 2;
    const peakY = Math.min(this.player.y, target.y) - 28;

    this.tweens.add({
      targets: projectile,
      x: midX,
      y: peakY,
      angle: 180,
      duration: 180,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.tweens.add({
          targets: projectile,
          x: target.x,
          y: target.y,
          angle: 360,
          duration: 180,
          ease: "Sine.easeIn",
          onComplete: () => this._resolveThrowHit(target, projectile),
        });
      },
    });
  }

  _resolveThrowHit(target, projectile) {
    projectile.destroy();
    target.defeated = true;

    this.cameras.main.shake(220, 0.008);
    if (this.registry.get("soundEnabled")) {
      this.sound.play("ground_impact", { volume: 0.6 });
    }

    // Hit reaction: flash and reel
    this.tweens.add({
      targets: target.sprite,
      alpha: 0.2,
      duration: 90,
      yoyo: true,
      repeat: 2,
    });

    this.time.delayedCall(900, () => {
      if (target.onDefeated) target.onDefeated();
    });
  }

  /**
   * Check locked doors and unlock if player has keycard and is in range
   */
  _checkLockedDoors() {
    if (!this.lockedDoors || this.lockedDoors.length === 0) return;

    // The inventory stores plain objects, not Item instances, so this used to
    // test item.itemId (undefined) and constructor.name (always "Object") and
    // therefore found nothing. No door in the game could ever be unlocked.
    const keycards = this.inventory.getAll().filter(
      (item) => item.id === "keycard" || item.id === "security_keycard"
    );

    if (keycards.length === 0) return;

    // Check each locked door
    for (const door of this.lockedDoors) {
      if (door.unlocked) continue;

      // Check if player is in range
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        door.x, door.y
      );

      if (distance <= door.unlockRange) {
        // Check if player has the right keycard
        const matching = keycards.find(keycard =>
          keycard.keycardId === door.id || keycard.keycardId === "default" || door.id === "default"
        );

        if (matching) {
          this._unlockDoor(door, matching);
        }
      }
    }
  }

  /**
   * Unlock a door
   */
  _unlockDoor(door, keycard = null) {
    door.unlocked = true;

    // The card is spent on the door it opens, so it leaves the inventory and
    // the slot frees up for whatever is picked up next.
    if (keycard) {
      this.inventory.removeItem(keycard.id);
      if (this.gameUI) {
        this.gameUI.updateInventory(this.inventory.getAll());
        this.gameUI.showItemNotification("easter_egg", "KEYCARD USED");
      }
    }

    // Change sprite to green (unlocked)
    door.sprite.setTexture("unlocked-green");

    // Remove collision
    door.body.destroy();

    // Play unlock sound
    if (this.registry.get("soundEnabled")) {
      this.sound.play("door_unlock", { volume: 0.5 });
    }

    // Visual feedback - brief flash
    this.tweens.add({
      targets: door.sprite,
      alpha: 0.3,
      duration: 150,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        door.sprite.setAlpha(1);
      }
    });

    console.log(`Door ${door.id} unlocked!`);
  }

}
