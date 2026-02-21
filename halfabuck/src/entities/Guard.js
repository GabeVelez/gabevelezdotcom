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
    super(scene, x, y, "guard", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setSize(12, 18, true);
    this.setOffset(2, 6);
    this.speed = 42;

    this.path = pathPoints;
    this.pathIndex = 0;

    this.lastKnownPlayer = null;

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
  }
}

class PatrolState {
  execute(guard, dt) {
    if (!guard.path.length) return;
    const target = guard.path[guard.pathIndex];
    const dx = target.x - guard.x;
    const dy = target.y - guard.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 2) {
      guard.pathIndex = (guard.pathIndex + 1) % guard.path.length;
      guard.setVelocity(0,0);
      return;
    }

    const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(guard.speed);
    guard.setVelocity(v.x, v.y);
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
