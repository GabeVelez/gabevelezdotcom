import Phaser from "phaser";
import { StateMachine } from "../systems/stateMachine.js";
import EasyStar from "easystarjs";

export const GuardStates = {
  PATROL: "patrol",
  SUSPICIOUS: "suspicious",
  INVESTIGATE: "investigate",
  CHASE: "chase",
  SEARCH: "search",
  ALERT: "alert",
  RESPONDING: "responding",
  RETURNING: "returning",
};

export class Guard extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, pathPoints = []) {
    super(scene, x, y, "guard-front", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Match player scale and setup
    this.setScale(0.15);
    this.setOrigin(0.5, 1.0);

    // A feet box, like the player's, not the whole sprite. The sprite is
    // 256x339 and stood 38x51 in world units, which is taller than the player
    // is and left 0.1px of clearance in a 51px warehouse lane - a guard put
    // there simply jammed. Top-down movement should collide on the feet.
    const collisionWidth = this.width * 0.9;
    const collisionHeight = this.height * 0.45;
    this.body.setSize(collisionWidth, collisionHeight);
    this.body.setOffset((this.width - collisionWidth) / 2, this.height - collisionHeight);

    // Enable collision - don't constrain to world bounds, let tilemap walls provide boundaries
    // this.body.setCollideWorldBounds(true);
    this.body.setImmovable(false);

    this.baseSpeed = 42; // Store base speed
    this.speed = 42;
    this.guardType = "regular"; // Can be overridden by subclasses

    this.path = pathPoints;
    this.pathIndex = 0;

    this.lastKnownPlayer = null;

    // Stuck detection
    this.stuckTimer = 0;
    this.lastPosition = { x: this.x, y: this.y };

    // Knockout & hiding
    this.isKnockedOut = false;
    this.isHidden = false;

    // Memory & Learning System
    this.detectionCount = 0; // How many times detected player
    this.lastDetectionTime = 0; // Timestamp of last detection
    this.lastDetectionLocation = null; // {x, y} where last saw player
    this.awarenessLevel = 0; // 0-3 scale (normal to extreme alert)
    this.awarenessDecayTimer = 0; // Timer for awareness decay
    this.suspiciousAreas = []; // Areas where player was detected
    this.lastDetectionPercent = 0; // How much % when player escaped

    // A* Pathfinding setup
    this.pathfinder = new EasyStar.js();
    this.pathfinderGrid = null;
    this.currentPath = [];
    this.currentPathIndex = 0;
    this.lastPathCalculation = 0;
    this.pathRecalculationInterval = 500; // Recalculate every 500ms

    // Last known position tracking
    this.lastKnownPlayerPos = null;
    this.timeSinceLastSeen = 0;
    this.searchRadius = 0;
    this.canSeePlayer = false; // Track if player is currently visible

    this.stateMachine = new StateMachine(GuardStates.PATROL, {
      [GuardStates.PATROL]: new PatrolState(),
      [GuardStates.SUSPICIOUS]: new SuspiciousState(),
      [GuardStates.INVESTIGATE]: new InvestigateState(),
      [GuardStates.CHASE]: new ChaseState(),
      [GuardStates.SEARCH]: new SearchState(),
      [GuardStates.ALERT]: new AlertState(),
      [GuardStates.RESPONDING]: new RespondingState(),
      [GuardStates.RETURNING]: new ReturningState(),
    }, [this]);
  }

  /**
   * Initialize pathfinding grid from tilemap layer
   */
  initializePathfinding(tilemapLayer, collisionBodies = null) {
    if (!tilemapLayer) return;

    const map = tilemapLayer.tilemap;
    const grid = [];

    // The grid used to come from the tilemap alone, and every room fills its
    // tilemap entirely walkable because the real walls live in the collision
    // SVG. So A* believed the whole level was open floor and routed guards
    // straight through shelving: they would grind along a wall they had
    // planned to walk through, or arrive from a direction nothing could have
    // walked. Walls from the collision SVG block tiles, as below.
    const rects = [];
    for (const body of collisionBodies || []) {
      const b = body?.getBounds?.();
      if (b) rects.push(b);
    }
    const tw = map.tileWidth, th = map.tileHeight;
    const ox = tilemapLayer.x || 0, oy = tilemapLayer.y || 0;

    // A tile is open if HIS BODY fits with his feet at its centre, not if the
    // tile itself is clear. He is a 35x23 box standing on his feet, and a path
    // threaded through one-tile gaps beside the walls had him grinding on
    // every corner of it. So grow each wall by half his width either side and
    // by his height below (the box sits above his feet), and test the centre.
    // From the source size and his scale: body.width is not scaled until the
    // first physics step, and this runs before it, so it read 230px and
    // blocked the whole room.
    const halfW = this.body.sourceWidth * Math.abs(this.scaleX) / 2;
    const bodyH = this.body.sourceHeight * Math.abs(this.scaleY);

    for (let y = 0; y < map.height; y++) {
      grid[y] = [];
      for (let x = 0; x < map.width; x++) {
        const tile = tilemapLayer.getTileAt(x, y);
        let blocked = !!(tile && tile.collides);
        if (!blocked && rects.length) {
          const cx = ox + x * tw + tw / 2, cy = oy + y * th + th / 2;
          for (const r of rects) {
            if (cx > r.x - halfW && cx < r.x + r.width + halfW &&
                cy > r.y && cy < r.y + r.height + bodyH) { blocked = true; break; }
          }
        }
        grid[y][x] = blocked ? 1 : 0;
      }
    }

    this.pathfinderGrid = grid;
    // Sync, or the path lands a tick after the guard asked for it: every
    // recalculation left him with no path for a frame, so he fell back to
    // walking straight at the target, into whatever was in the way.
    this.pathfinder.enableSync();
    this.pathfinder.setGrid(grid);
    this.pathfinder.setAcceptableTiles([0]); // Only walk on 0 tiles
    this.pathfinder.enableDiagonals();
    this.pathfinder.enableCornerCutting();
  }

  /**
   * Calculate A* path to a world position
   */
  calculatePathTo(targetX, targetY, onPathFound) {
    if (!this.pathfinderGrid || !this.scene.groundLayer) return;

    const layer = this.scene.groundLayer;
    const map = layer.tilemap;

    // Convert world positions to grid coordinates
    const startTile = layer.worldToTileXY(this.x, this.y);
    const endTile = layer.worldToTileXY(targetX, targetY);

    // A tile is blocked if a wall touches any of it, so a guard standing
    // against a wall, or a player crouched against one, is often "on" a blocked
    // tile - and A* refuses to start or end there. That was most of why guards
    // gave up on the spot they were sent to: no path, so they walked straight
    // at it and ground against the shelving. Use the nearest open tile.
    const start = this._nearestOpenTile(startTile);
    const end = this._nearestOpenTile(endTile);
    if (!start || !end) return;

    const half = map.tileWidth / 2;
    this.pathfinder.findPath(start.x, start.y, end.x, end.y, (path) => {
      if (path && path.length > 0) {
        // Tile centres, not corners, or every path hugs the top-left of its
        // tiles and clips the walls it is meant to go round.
        this.currentPath = path.map(node => {
          const p = layer.tileToWorldXY(node.x, node.y);
          return { x: p.x + half, y: p.y + half };
        });
        // Node 0 is the tile he is already on. Heading for it first made him
        // step back to its centre every time the path was recalculated.
        this.currentPathIndex = this.currentPath.length > 1 ? 1 : 0;
        if (onPathFound) onPathFound(this.currentPath);
      } else {
        this.currentPath = [];
      }
    });

    this.pathfinder.calculate();
    this.lastPathCalculation = Date.now();
  }

  _isOpenTile(x, y) {
    return this.pathfinderGrid[y]?.[x] === 0;
  }

  /** The tile itself if open, else the closest open one within 4 tiles. */
  _nearestOpenTile(tile) {
    if (!tile) return null;
    for (let r = 0; r <= 4; r++) {
      let best = null, bestD = Infinity;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const x = tile.x + dx, y = tile.y + dy;
          const d = dx * dx + dy * dy;
          if (d < bestD && this._isOpenTile(x, y)) { best = { x, y }; bestD = d; }
        }
      }
      if (best) return best;
    }
    return null;
  }

  /**
   * Follow the current A* path
   */
  followPath() {
    if (!this.currentPath || this.currentPath.length === 0) {
      return false;
    }

    const target = this.currentPath[this.currentPathIndex];
    if (!target) {
      this.currentPath = [];
      return false;
    }

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);

    // Reached current waypoint
    if (dist < 8) {
      this.currentPathIndex++;

      // Reached end of path
      if (this.currentPathIndex >= this.currentPath.length) {
        this.currentPath = [];
        this.setVelocity(0, 0);
        return false;
      }
    }

    // Move toward current waypoint
    const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(this.speed);
    this.setVelocity(v.x, v.y);

    // Play walk animation
    const animPrefix = this.guardType === "overseer" ? "overseer_walk_" : "guard_walk_";
    if (Math.abs(v.x) > Math.abs(v.y)) {
      this.anims.play(animPrefix + (v.x > 0 ? "right" : "left"), true);
    } else {
      this.anims.play(animPrefix + (v.y > 0 ? "down" : "up"), true);
    }

    return true;
  }

  /**
   * Check if there's a clear path ahead (for obstacle avoidance)
   */
  checkClearPath(fromX, fromY, toX, toY) {
    if (!this.scene.groundLayer || !this.pathfinderGrid) return true;

    // Against the pathfinding grid, which knows about the SVG walls. Checking
    // the tilemap said every line was clear, because every room fills its
    // tilemap walkable, so a guard heading back to patrol from the far side of
    // the shelving walked straight into it.
    const layer = this.scene.groundLayer;
    const steps = 10;

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = Phaser.Math.Linear(fromX, toX, t);
      const y = Phaser.Math.Linear(fromY, toY, t);
      const tile = layer.worldToTileXY(x, y);
      if (tile && this.pathfinderGrid[tile.y]?.[tile.x] === 1) return false;
    }

    return true;
  }

  knockOut(ms = 7000) {
    this.isKnockedOut = true;
    this.setVelocity(0, 0);
    this.setTint(0x777777);
    this.body.enable = true;
    this.knockoutTimer = ms;
  }

  hide() {
    this.isHidden = true;
    this.isKnockedOut = true; // treat as KO'd
    this.setVelocity(0, 0);
    this.setVisible(false);
    this.body.enable = false;
  }

  unhide() {
    this.isHidden = false;
    this.setVisible(true);
    this.body.enable = true;
  }

  update(dt) {
    if (this.isHidden) return;

    if (this.isKnockedOut) {
      this.setVelocity(0, 0);
      this.knockoutTimer -= dt;
      if (this.knockoutTimer <= 0) {
        // Wake up (for MVP)
        this.isKnockedOut = false;
        this.clearTint();
      }
      return;
    }

    // Update awareness decay
    this._updateAwareness(dt);

    // Update speed based on awareness level
    this._updateSpeedFromAwareness();

    // The body stays the feet box set in the constructor. This used to reset
    // it to the whole sprite every frame, which undid the feet box entirely.
    this.stateMachine.step(dt);
  }

  _updateAwareness(dt) {
    // Decay awareness over time if no recent detections
    const timeSinceDetection = Date.now() - this.lastDetectionTime;

    if (this.awarenessLevel > 0) {
      this.awarenessDecayTimer += dt;

      // Awareness decay thresholds (level-specific)
      const decayTime = this.awarenessLevel === 3 ? 90000 : // Level 3→2: 90s
                        this.awarenessLevel === 2 ? 60000 : // Level 2→1: 60s
                        45000; // Level 1→0: 45s

      if (this.awarenessDecayTimer >= decayTime) {
        this.awarenessLevel--;
        this.awarenessDecayTimer = 0;
      }
    }
  }

  _updateSpeedFromAwareness() {
    // Adjust speed based on awareness level
    const speedMultiplier = 1 + (this.awarenessLevel * 0.1); // +10% per level
    this.speed = this.baseSpeed * speedMultiplier;
  }

  recordDetection(playerX, playerY, detectionPercent) {
    // Record detection event
    this.detectionCount++;
    this.lastDetectionTime = Date.now();
    this.lastDetectionLocation = { x: playerX, y: playerY };
    this.lastDetectionPercent = detectionPercent;

    // Update awareness based on detection count
    // More detections = higher awareness
    if (this.detectionCount >= 3) {
      this.awarenessLevel = Math.min(3, this.awarenessLevel + 1);
    } else if (this.detectionCount >= 2) {
      this.awarenessLevel = Math.min(3, this.awarenessLevel + 1);
    } else {
      this.awarenessLevel = Math.min(3, this.awarenessLevel + 1);
    }
    this.awarenessDecayTimer = 0; // Reset decay timer

    // Add to suspicious areas
    this.suspiciousAreas.push({
      x: playerX,
      y: playerY,
      timestamp: Date.now()
    });

    // Keep only recent suspicious areas (last 5)
    if (this.suspiciousAreas.length > 5) {
      this.suspiciousAreas.shift();
    }
  }

  /**
   * Find nearest waypoint to given position
   * Returns waypoint index, or null if network not available
   */
  findNearestWaypoint(x, y) {
    if (!this.waypointNetwork) return null;

    let nearestIndex = null;
    let nearestDist = Infinity;

    for (let i = 0; i < this.waypointNetwork.waypoints.length; i++) {
      const wp = this.waypointNetwork.waypoints[i];
      const dist = Math.hypot(wp.x - x, wp.y - y);

      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIndex = i;
      }
    }

    return nearestIndex;
  }

  /**
   * Find path through waypoint network using breadth-first search
   * Returns array of waypoint positions [{x, y}, ...], or null if no path
   */
  findPath(startWaypointIndex, endWaypointIndex) {
    if (!this.waypointNetwork) return null;
    if (startWaypointIndex === endWaypointIndex) return [];

    const network = this.waypointNetwork;
    const queue = [[startWaypointIndex]]; // Queue of paths
    const visited = new Set([startWaypointIndex]);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      // Found the target
      if (current === endWaypointIndex) {
        // Convert waypoint indices to positions
        return path.map(idx => network.waypoints[idx]);
      }

      // Explore neighbors
      const neighbors = network.connections.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return null; // No path found
  }

  /**
   * Hybrid navigation: use waypoints for far targets, direct movement for near
   * Returns true if moving, false if reached target
   */
  navigateToTarget(targetX, targetY, dt, threshold = 100) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);

    // Already at target
    if (dist < 10) {
      this.setVelocity(0, 0);
      this.currentNavigationPath = null;
      return false;
    }

    // Near target - use direct movement
    if (dist < threshold) {
      const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(this.speed);
      this.setVelocity(v.x, v.y);
      this.currentNavigationPath = null;

      // Play walk animation
      const animPrefix = this.guardType === "overseer" ? "overseer_walk_" : "guard_walk_";
      if (Math.abs(v.x) > Math.abs(v.y)) {
        this.anims.play(animPrefix + (v.x > 0 ? "right" : "left"), true);
      } else {
        this.anims.play(animPrefix + (v.y > 0 ? "down" : "up"), true);
      }

      return true;
    }

    // Far target - use waypoint pathfinding
    if (!this.waypointNetwork) {
      // Fallback to direct movement if no network
      const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(this.speed);
      this.setVelocity(v.x, v.y);
      return true;
    }

    // Build or reuse path
    if (!this.currentNavigationPath || this.navigationTarget?.x !== targetX || this.navigationTarget?.y !== targetY) {
      const startWP = this.findNearestWaypoint(this.x, this.y);
      const endWP = this.findNearestWaypoint(targetX, targetY);

      if (startWP !== null && endWP !== null) {
        this.currentNavigationPath = this.findPath(startWP, endWP);
        this.navigationPathIndex = 0;
        this.navigationTarget = { x: targetX, y: targetY };
      } else {
        // No waypoints found - fallback to direct
        const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(this.speed);
        this.setVelocity(v.x, v.y);
        return true;
      }
    }

    // Follow waypoint path
    if (this.currentNavigationPath && this.currentNavigationPath.length > 0) {
      const currentWaypoint = this.currentNavigationPath[this.navigationPathIndex];
      const wpDx = currentWaypoint.x - this.x;
      const wpDy = currentWaypoint.y - this.y;
      const wpDist = Math.hypot(wpDx, wpDy);

      // Reached current waypoint - advance to next
      if (wpDist < 10) {
        this.navigationPathIndex++;

        // Reached end of path - switch to direct movement
        if (this.navigationPathIndex >= this.currentNavigationPath.length) {
          this.currentNavigationPath = null;
          const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(this.speed);
          this.setVelocity(v.x, v.y);
        } else {
          // Move to next waypoint
          const nextWP = this.currentNavigationPath[this.navigationPathIndex];
          const nextDx = nextWP.x - this.x;
          const nextDy = nextWP.y - this.y;
          const v = new Phaser.Math.Vector2(nextDx, nextDy).normalize().scale(this.speed);
          this.setVelocity(v.x, v.y);
        }
      } else {
        // Move toward current waypoint
        const v = new Phaser.Math.Vector2(wpDx, wpDy).normalize().scale(this.speed);
        this.setVelocity(v.x, v.y);
      }

      // Play walk animation
      const vel = this.body.velocity;
      const animPrefix = this.guardType === "overseer" ? "overseer_walk_" : "guard_walk_";
      if (Math.abs(vel.x) > Math.abs(vel.y)) {
        this.anims.play(animPrefix + (vel.x > 0 ? "right" : "left"), true);
      } else {
        this.anims.play(animPrefix + (vel.y > 0 ? "down" : "up"), true);
      }

      return true;
    }

    // Fallback to direct movement
    const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(this.speed);
    this.setVelocity(v.x, v.y);
    return true;
  }
}

class PatrolState {
  execute(guard, dt) {
    if (!guard.path.length) return;

    // Reset player visibility tracking
    guard.canSeePlayer = false;

    const target = guard.path[guard.pathIndex];
    const dx = target.x - guard.x;
    const dy = target.y - guard.y;
    const dist = Math.hypot(dx, dy);

    // Reached waypoint - larger threshold to stop earlier
    if (dist < 8) {
      guard.pathIndex = (guard.pathIndex + 1) % guard.path.length;
      guard.setVelocity(0,0);
      guard.stuckTimer = 0;
      guard.lastPosition = { x: guard.x, y: guard.y };
      return;
    }

    // Check if path is clear, if not use A* pathfinding
    const pathClear = guard.checkClearPath(guard.x, guard.y, target.x, target.y);

    if (!pathClear && guard.pathfinderGrid && !guard.currentPath?.length) {
      guard.calculatePathTo(target.x, target.y);
    }

    // Use A* to navigate around obstacle. If there is no route at all (a room
    // tighter than the grid's idea of his body), fall through and walk the
    // line as patrols always did, rather than skip every waypoint.
    if (!pathClear && guard.currentPath?.length) {
      if (!guard.followPath()) {
        // Path following failed, skip to next waypoint
        guard.pathIndex = (guard.pathIndex + 1) % guard.path.length;
        guard.stuckTimer = 0;
      }
      return;
    }

    // Aggressive stuck detection - if guard hasn't moved much, skip waypoint quickly
    const movedDist = Math.hypot(guard.x - guard.lastPosition.x, guard.y - guard.lastPosition.y);
    if (movedDist < 0.5) {
      guard.stuckTimer += dt;
      if (guard.stuckTimer > 500) {
        guard.pathIndex = (guard.pathIndex + 1) % guard.path.length;
        guard.stuckTimer = 0;
        guard.setVelocity(0, 0);
        return;
      }
    } else {
      guard.stuckTimer = 0;
      guard.lastPosition = { x: guard.x, y: guard.y };
    }

    const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(guard.speed);
    guard.setVelocity(v.x, v.y);

    // Play appropriate walk animation based on direction and guard type
    const animPrefix = guard.guardType === "overseer" ? "overseer_walk_" : "guard_walk_";
    if (Math.abs(v.x) > Math.abs(v.y)) {
      guard.anims.play(animPrefix + (v.x > 0 ? "right" : "left"), true);
    } else {
      guard.anims.play(animPrefix + (v.y > 0 ? "down" : "up"), true);
    }
  }
}

class SuspiciousState {
  enter(guard, context) {
    const point = context || {};
    guard.lastKnownPlayerPos = { x: point.x, y: point.y } ?? guard.lastKnownPlayerPos;
    guard.suspicionTimer = 1500; // Short pause to look around
  }

  execute(guard, dt) {
    guard.suspicionTimer -= dt;

    // Stop and look at what caught his eye. He used to spin his cone in a
    // random direction, which pointed it away from you half the time.
    guard.setVelocity(0, 0);
    const p = guard.lastKnownPlayerPos;
    if (guard.vision && p?.x != null) {
      guard.vision.facing = Math.atan2(p.y - (guard.y - 16), p.x - guard.x);
    }

    // If detection increases (player still visible), move to INVESTIGATE
    // This is handled by visionSystem, but we check timer for timeout
    if (guard.suspicionTimer <= 0) {
      return guard.stateMachine.transition(GuardStates.RETURNING);
    }
  }
}

class InvestigateState {
  enter(guard, context) {
    const point = context || {};
    guard.lastKnownPlayerPos = { x: point.x, y: point.y };
    guard.investigateTimer = 3000; // 3 seconds to investigate
    guard.timeSinceLastSeen = 0;
    guard.currentPath = [];
  }

  execute(guard, dt) {
    guard.investigateTimer -= dt;
    guard.timeSinceLastSeen += dt;

    // Move to last known position
    if (guard.lastKnownPlayerPos) {
      const dx = guard.lastKnownPlayerPos.x - guard.x;
      const dy = guard.lastKnownPlayerPos.y - guard.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 15) {
        // Use A* pathfinding to reach last known position
        const shouldRecalculate = Date.now() - guard.lastPathCalculation > guard.pathRecalculationInterval;

        if (shouldRecalculate || !guard.currentPath || guard.currentPath.length === 0) {
          guard.calculatePathTo(guard.lastKnownPlayerPos.x, guard.lastKnownPlayerPos.y);
        }

        if (!guard.followPath()) {
          // Can't reach, try navigating to target
          guard.navigateToTarget(guard.lastKnownPlayerPos.x, guard.lastKnownPlayerPos.y, dt, 100);
        }
      } else {
        // Reached last known position, transition to SEARCH
        return guard.stateMachine.transition(GuardStates.SEARCH);
      }
    }

    // Timeout or if player becomes visible again
    if (guard.investigateTimer <= 0) {
      return guard.stateMachine.transition(GuardStates.SEARCH);
    }
  }
}

class ChaseState {
  enter(guard) {
    guard.chaseTimer = 0;
    guard.lastChaseUpdate = Date.now();
    guard.currentPath = [];
  }

  execute(guard, dt) {
    guard.chaseTimer += dt;

    // Get player position from scene
    const player = guard.scene.player;
    if (!player) {
      return guard.stateMachine.transition(GuardStates.SEARCH);
    }

    // Update last known position
    guard.lastKnownPlayerPos = { x: player.x, y: player.y };
    guard.timeSinceLastSeen = 0;

    // Calculate path to player using A*
    const shouldRecalculate = Date.now() - guard.lastPathCalculation > guard.pathRecalculationInterval;

    if (shouldRecalculate || !guard.currentPath || guard.currentPath.length === 0) {
      guard.calculatePathTo(player.x, player.y);
    }

    // Follow the path or use direct navigation as fallback
    if (!guard.followPath()) {
      // Fallback to waypoint navigation
      guard.navigateToTarget(player.x, player.y, dt, 100);
    }

    // If player is no longer visible (handled by visionSystem transitioning state)
    // we'll transition to SEARCH
    if (!guard.canSeePlayer && guard.chaseTimer > 500) {
      return guard.stateMachine.transition(GuardStates.SEARCH);
    }
  }
}

class SearchState {
  enter(guard) {
    const baseTime = 4000;
    const awarenessMultiplier = 1 + (guard.awarenessLevel * 0.4);
    const totalTime = baseTime * awarenessMultiplier;
    guard.searchTimer = Phaser.Math.Between(totalTime * 0.75, totalTime * 1.25);

    guard.searchPhase = 0;
    guard.searchStepTimer = 0;
    // Radius before the points: it was set after, so the first ring used
    // whatever the last search had grown to, or 0 on his first.
    guard.searchRadius = 60; // Expanding search radius
    guard.searchPoints = this._generateSearchPoints(guard);
    guard.currentSearchPoint = 0;
    guard.currentPath = []; // not the path to wherever he was going before
  }

  _generateSearchPoints(guard) {
    // Generate search points in expanding circle around last known position
    const center = guard.lastKnownPlayerPos || { x: guard.x, y: guard.y };
    const raw = [];
    const numPoints = 4;

    // The spot itself first. The ring used to be all there was, so he circled
    // where you were seen without ever standing on it.
    if (guard.searchRadius === 60) raw.push(center);
    for (let i = 0; i < numPoints; i++) {
      const angle = (Math.PI * 2 * i) / numPoints;
      raw.push({
        x: center.x + Math.cos(angle) * guard.searchRadius,
        y: center.y + Math.sin(angle) * guard.searchRadius
      });
    }

    // Points land inside shelving or off the map, and he can never get within
    // 15px of those, so he stood at the nearest wall until the timer ran out.
    // Move each to the nearest floor he can actually reach, or drop it.
    const layer = guard.scene.groundLayer;
    if (!layer || !guard.pathfinderGrid) return raw;
    const half = layer.tilemap.tileWidth / 2;
    const points = [];
    for (const pt of raw) {
      const t = guard._nearestOpenTile(layer.worldToTileXY(pt.x, pt.y));
      if (!t) continue;
      const w = layer.tileToWorldXY(t.x, t.y);
      points.push({ x: w.x + half, y: w.y + half });
    }
    return points.length ? points : [center];
  }

  execute(guard, dt) {
    guard.searchTimer -= dt;
    guard.timeSinceLastSeen += dt;

    if (guard.searchTimer <= 0) {
      return guard.stateMachine.transition(GuardStates.RETURNING);
    }

    guard.searchStepTimer += dt;

    // Patrol around search points
    if (guard.searchPoints && guard.searchPoints.length > 0) {
      const targetPoint = guard.searchPoints[guard.currentSearchPoint];
      const dx = targetPoint.x - guard.x;
      const dy = targetPoint.y - guard.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 15) {
        // Reached point - pause and look around
        guard.setVelocity(0, 0);

        // Rotate vision cone slowly
        if (guard.vision) {
          guard.vision.facing += 0.015;
        }

        if (guard.searchStepTimer > 800) {
          guard.currentSearchPoint = (guard.currentSearchPoint + 1) % guard.searchPoints.length;
          guard.searchStepTimer = 0;
          guard.currentPath = [];

          // Expand search radius after each cycle
          if (guard.currentSearchPoint === 0) {
            guard.searchRadius += 20;
            guard.searchPoints = this._generateSearchPoints(guard);
          }
        }
      } else {
        // Use A* to move to search point
        if (!guard.currentPath || guard.currentPath.length === 0) {
          guard.calculatePathTo(targetPoint.x, targetPoint.y);
        }

        if (!guard.followPath()) {
          // Fallback navigation
          const moving = guard.navigateToTarget(targetPoint.x, targetPoint.y, dt, 80);
          if (moving && guard.body.velocity) {
            guard.setVelocity(guard.body.velocity.x * 0.6, guard.body.velocity.y * 0.6);
          }
        } else {
          // Slow down search movement if using path
          if (guard.body.velocity) {
            guard.setVelocity(guard.body.velocity.x * 0.7, guard.body.velocity.y * 0.7);
          }
        }
      }
    } else {
      guard.setVelocity(0, 0);
      if (guard.vision) {
        guard.vision.facing += 0.02;
      }
    }
  }
}

class AlertState {
  enter(guard, point) {
    guard.lastKnownPlayerPos = point ?? guard.lastKnownPlayerPos;
    guard.alertTimer = 2000;
  }
  execute(guard, dt) {
    guard.alertTimer -= dt;
    if (guard.alertTimer <= 0) {
      return guard.stateMachine.transition(GuardStates.SEARCH);
    }
    guard.setVelocity(0,0);
  }
}


class RespondingState {
  enter(guard, alertData) {
    guard.alertTarget = alertData?.position ?? guard.lastKnownPlayerPos;
    guard.lastKnownPlayerPos = guard.alertTarget;
    guard.responseTimer = 0;

    const baseTimeout = guard.guardType === "lead" ? 7000 :
                        guard.guardType === "overseer" ? 8000 : 5000;

    const awarenessMultiplier = 1 + (guard.awarenessLevel * 0.2);
    guard.responseTimeout = Phaser.Math.Between(
      baseTimeout * awarenessMultiplier * 0.8,
      baseTimeout * awarenessMultiplier * 1.2
    );

    // Plus the walk. A flat 4-6s ran out halfway across the Warehouse, so he
    // turned back before ever reaching the spot he was called to. Straight
    // line x1.5 for going round things.
    if (guard.alertTarget) {
      const d = Math.hypot(guard.alertTarget.x - guard.x, guard.alertTarget.y - guard.y);
      guard.responseTimeout += (d * 1.5 / guard.speed) * 1000;
    }
    guard.currentPath = [];
  }

  execute(guard, dt) {
    guard.responseTimer += dt;

    if (guard.responseTimer >= guard.responseTimeout) {
      return guard.stateMachine.transition(GuardStates.RETURNING);
    }

    if (guard.alertTarget) {
      const dx = guard.alertTarget.x - guard.x;
      const dy = guard.alertTarget.y - guard.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 20) {
        return guard.stateMachine.transition(GuardStates.SEARCH);
      }

      // Use A* pathfinding for smarter navigation
      const shouldRecalculate = Date.now() - guard.lastPathCalculation > guard.pathRecalculationInterval;

      if (shouldRecalculate || !guard.currentPath || guard.currentPath.length === 0) {
        guard.calculatePathTo(guard.alertTarget.x, guard.alertTarget.y);
      }

      if (!guard.followPath()) {
        // Fallback to waypoint navigation
        guard.navigateToTarget(guard.alertTarget.x, guard.alertTarget.y, dt, 100);
      }
    } else {
      guard.stateMachine.transition(GuardStates.RETURNING);
    }
  }
}

class ReturningState {
  execute(guard) {
    guard.currentPath = []; // the chase's path, not one back to his patrol
    guard.stateMachine.transition(GuardStates.PATROL);
  }
}
