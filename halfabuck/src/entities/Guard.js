import Phaser from "phaser";
import { StateMachine } from "../systems/stateMachine.js";

export const GuardStates = {
  PATROL: "patrol",
  SUSPICIOUS: "suspicious",
  ALERT: "alert",
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

    // Enable collision
    this.body.setCollideWorldBounds(true);
    this.body.setImmovable(false);

    this.speed = 42;

    this.path = pathPoints;
    this.pathIndex = 0;

    this.lastKnownPlayer = null;

    // Stuck detection
    this.stuckTimer = 0;
    this.lastPosition = { x: this.x, y: this.y };

    // Knockout & hiding
    this.isKnockedOut = false;
    this.isHidden = false;

    this.stateMachine = new StateMachine(GuardStates.PATROL, {
      [GuardStates.PATROL]: new PatrolState(),
      [GuardStates.SUSPICIOUS]: new SuspiciousState(),
      [GuardStates.ALERT]: new AlertState(),
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
  enter(guard, point) {
    guard.lastKnownPlayer = point ?? guard.lastKnownPlayer;
    guard.suspicionTimer = 1200; // ms
  }
  execute(guard, dt) {
    guard.suspicionTimer -= dt;
    if (guard.suspicionTimer <= 0) {
      return guard.stateMachine.transition(GuardStates.RETURNING);
    }
    guard.setVelocity(0,0);
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
    guard.searchTimer = 4000;
  }
  execute(guard, dt) {
    guard.searchTimer -= dt;
    if (guard.searchTimer <= 0) {
      return guard.stateMachine.transition(GuardStates.RETURNING);
    }
    guard.setVelocity(0,0);
  }
}

class ReturningState {
  execute(guard) {
    guard.stateMachine.transition(GuardStates.PATROL);
  }
}
