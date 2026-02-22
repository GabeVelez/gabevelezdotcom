import Phaser from "phaser";
import { StateMachine } from "../systems/stateMachine.js";

export const GuardStates = {
  PATROL: "patrol",
  SUSPICIOUS: "suspicious",
  ALERT: "alert",
  RESPONDING: "responding",
  SEARCHING: "searching",
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

    // Full sprite collision box
    const collisionWidth = this.width;
    const collisionHeight = this.height;
    this.body.setSize(collisionWidth, collisionHeight);
    this.body.setOffset(0, 0);

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

    this.stateMachine = new StateMachine(GuardStates.PATROL, {
      [GuardStates.PATROL]: new PatrolState(),
      [GuardStates.SUSPICIOUS]: new SuspiciousState(),
      [GuardStates.ALERT]: new AlertState(),
      [GuardStates.RESPONDING]: new RespondingState(),
      [GuardStates.SEARCHING]: new SearchingState(),
      [GuardStates.RETURNING]: new ReturningState(),
    }, [this]);
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

    this.stateMachine.step(dt);

    // Adjust collision box based on movement direction for consistency
    if (this.body.velocity.y < 0 && Math.abs(this.body.velocity.y) > Math.abs(this.body.velocity.x)) {
      // Moving up - tighter collision to reduce jitter
      this.body.setSize(this.width * 0.85, this.height * 0.85);
      this.body.setOffset(this.width * 0.075, this.height * 0.075);
    } else if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
      // Moving left/right - uniform height
      this.body.setSize(this.width, this.height * 0.94);
      this.body.setOffset(0, this.height * 0.03);
    } else {
      // Moving down or stationary - full collision
      this.body.setSize(this.width, this.height);
      this.body.setOffset(0, 0);
    }
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

    // Aggressive stuck detection - if guard hasn't moved much, skip waypoint quickly
    const movedDist = Math.hypot(guard.x - guard.lastPosition.x, guard.y - guard.lastPosition.y);
    if (movedDist < 0.5) {
      guard.stuckTimer += dt;
      if (guard.stuckTimer > 500) { // Stuck for 0.5 seconds - skip immediately
        // Skip to next waypoint
        guard.pathIndex = (guard.pathIndex + 1) % guard.path.length;
        guard.stuckTimer = 0;
        guard.setVelocity(0, 0); // Stop trying to move
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
      // Horizontal movement
      guard.anims.play(animPrefix + (v.x > 0 ? "right" : "left"), true);
    } else {
      // Vertical movement
      guard.anims.play(animPrefix + (v.y > 0 ? "down" : "up"), true);
    }
  }
}

class SuspiciousState {
  enter(guard, context) {
    const point = context || {};
    guard.lastKnownPlayer = { x: point.x, y: point.y } ?? guard.lastKnownPlayer;

    // Contextual investigation time based on detection % and awareness
    const baseTime = 2500;
    const awarenessMultiplier = 1 + (guard.awarenessLevel * 0.3); // +30% per level
    const detectionMultiplier = (context.percent || 0.33) > 0.6 ? 1.5 : 1.0; // Longer if saw clearly

    // Random variation ±20%
    const totalTime = baseTime * awarenessMultiplier * detectionMultiplier;
    const min = totalTime * 0.8;
    const max = totalTime * 1.2;
    guard.suspicionTimer = Phaser.Math.Between(min, max);

    // Investigation behavior setup
    guard.investigationPhase = 0; // 0 = pause, 1 = look around, 2 = move toward
    guard.investigationStepTimer = 0;
    guard.rotationDirection = Phaser.Math.Between(0, 1) === 0 ? -1 : 1; // Random direction
  }

  execute(guard, dt) {
    guard.suspicionTimer -= dt;
    if (guard.suspicionTimer <= 0) {
      return guard.stateMachine.transition(GuardStates.RETURNING);
    }

    guard.investigationStepTimer += dt;

    // Phase-based investigation (look around, move a bit)
    if (guard.investigationPhase === 0 && guard.investigationStepTimer > 500) {
      // Phase 0: Initial pause (500ms)
      guard.investigationPhase = 1;
      guard.investigationStepTimer = 0;
      guard.setVelocity(0, 0);
    } else if (guard.investigationPhase === 1 && guard.investigationStepTimer > 800) {
      // Phase 1: Look around (rotate vision cone)
      guard.vision.facing += guard.rotationDirection * 0.02; // Slow rotation
      guard.setVelocity(0, 0);

      if (guard.investigationStepTimer > 1500) {
        guard.investigationPhase = 2;
        guard.investigationStepTimer = 0;
      }
    } else if (guard.investigationPhase === 2 && guard.lastKnownPlayer) {
      // Phase 2: Take a few steps toward last known position
      const dx = guard.lastKnownPlayer.x - guard.x;
      const dy = guard.lastKnownPlayer.y - guard.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 10 && guard.investigationStepTimer < 1000) {
        // Use hybrid navigation (slower speed for investigation)
        const moving = guard.navigateToTarget(guard.lastKnownPlayer.x, guard.lastKnownPlayer.y, 0, 80);

        // Slow down investigation movement
        if (moving && guard.body.velocity) {
          guard.setVelocity(guard.body.velocity.x * 0.5, guard.body.velocity.y * 0.5);
        }
      } else {
        guard.setVelocity(0, 0);
      }
    } else {
      guard.setVelocity(0, 0);
    }
  }
}

class AlertState {
  enter(guard, point) {
    guard.lastKnownPlayer = point ?? guard.lastKnownPlayer;
    guard.alertTimer = 2000;
  }
  execute(guard, dt) {
    guard.alertTimer -= dt;
    if (guard.alertTimer <= 0) {
      return guard.stateMachine.transition(GuardStates.SEARCHING);
    }
    guard.setVelocity(0,0);
  }
}

class SearchingState {
  enter(guard) {
    // Random search time based on awareness (3-6 seconds base)
    const baseTime = 4000;
    const awarenessMultiplier = 1 + (guard.awarenessLevel * 0.4); // +40% per level
    const totalTime = baseTime * awarenessMultiplier;
    guard.searchTimer = Phaser.Math.Between(totalTime * 0.75, totalTime * 1.25);

    // Set up search pattern (patrol around alert area)
    guard.searchPhase = 0;
    guard.searchStepTimer = 0;
    guard.searchPoints = this._generateSearchPoints(guard);
    guard.currentSearchPoint = 0;
  }

  _generateSearchPoints(guard) {
    // Generate 3-4 points around alert location to check
    const center = guard.alertTarget || guard.lastKnownPlayer || { x: guard.x, y: guard.y };
    const points = [];
    const radius = 40;
    const numPoints = Phaser.Math.Between(3, 4);

    for (let i = 0; i < numPoints; i++) {
      const angle = (Math.PI * 2 * i) / numPoints;
      points.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius
      });
    }

    return points;
  }

  execute(guard, dt) {
    guard.searchTimer -= dt;
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

      if (dist < 10) {
        // Reached point - pause and look around
        guard.setVelocity(0, 0);
        guard.searchStepTimer += dt;

        // Rotate vision cone slowly (looking around)
        guard.vision.facing += 0.015;

        if (guard.searchStepTimer > 800) {
          // Move to next point
          guard.currentSearchPoint = (guard.currentSearchPoint + 1) % guard.searchPoints.length;
          guard.searchStepTimer = 0;
        }
      } else {
        // Use hybrid navigation to move to search point (slower speed)
        const moving = guard.navigateToTarget(targetPoint.x, targetPoint.y, dt, 80);

        // Slow down search movement
        if (moving && guard.body.velocity) {
          guard.setVelocity(guard.body.velocity.x * 0.6, guard.body.velocity.y * 0.6);
        }
      }
    } else {
      // No search points - just rotate and look around
      guard.setVelocity(0, 0);
      guard.vision.facing += 0.02;
    }
  }
}

class RespondingState {
  enter(guard, alertData) {
    guard.alertTarget = alertData?.position ?? guard.lastKnownPlayer;
    guard.responseTimer = 0;

    // Different response timeouts based on guard type + awareness
    const baseTimeout = guard.guardType === "lead" ? 7000 :
                        guard.guardType === "overseer" ? 8000 : 5000;

    // Higher awareness = longer response/search
    const awarenessMultiplier = 1 + (guard.awarenessLevel * 0.2);
    guard.responseTimeout = Phaser.Math.Between(
      baseTimeout * awarenessMultiplier * 0.8,
      baseTimeout * awarenessMultiplier * 1.2
    );

    // Use current speed (already modified by awareness in update())
    guard.responseSpeed = guard.speed;
  }

  execute(guard, dt) {
    guard.responseTimer += dt;

    // Timeout - give up and return to patrol
    if (guard.responseTimer >= guard.responseTimeout) {
      return guard.stateMachine.transition(GuardStates.RETURNING);
    }

    // Move toward alert target using hybrid navigation
    if (guard.alertTarget) {
      const dx = guard.alertTarget.x - guard.x;
      const dy = guard.alertTarget.y - guard.y;
      const dist = Math.hypot(dx, dy);

      // Reached alert location - transition to searching
      if (dist < 20) {
        return guard.stateMachine.transition(GuardStates.SEARCHING);
      }

      // Use hybrid navigation (waypoints for far, direct for near)
      guard.navigateToTarget(guard.alertTarget.x, guard.alertTarget.y, dt, 100);
    } else {
      // No target - return to patrol
      guard.stateMachine.transition(GuardStates.RETURNING);
    }
  }
}

class ReturningState {
  execute(guard) {
    guard.stateMachine.transition(GuardStates.PATROL);
  }
}
