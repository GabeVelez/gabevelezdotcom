import Phaser from "phaser";
import { StateMachine } from "../systems/stateMachine.js";

export const PlayerStates = {
  IDLE: "idle",
  WALK: "walk",
  CROUCH: "crouch",
  BOX: "box",
  DETECTED: "detected",
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "gabe-front", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Scale to show sprite detail - larger than original 16x24 spec
    this.setScale(0.15); // ~210 * 0.15 ≈ 32 pixels (shows more detail)

    // Anchor at bottom-center (eliminates waddle from earlier)
    this.setOrigin(0.5, 1.0);

    // Full sprite collision box
    const collisionWidth = this.width;
    const collisionHeight = this.height;

    this.body.setSize(collisionWidth, collisionHeight);
    this.body.setOffset(0, 0);

    this.setCollideWorldBounds(true);

    this.walkSpeed = 80;
    this.crouchSpeed = 48;
    this.dragSpeed = 40;
    this.boxSpeed = 32;

    this.facing = "down";

    this.isDragging = false;
    this.dragTarget = null;

    this.isBoxed = false;

    this.stateMachine = new StateMachine(PlayerStates.IDLE, {
      [PlayerStates.IDLE]: new IdleState(),
      [PlayerStates.WALK]: new WalkState(),
      [PlayerStates.CROUCH]: new CrouchState(),
      [PlayerStates.BOX]: new BoxState(),
      [PlayerStates.DETECTED]: new DetectedState(),
    }, [this]);
  }

  update(input) {
    // Toggle box on edge-trigger
    if (input.justBox) {
      this.isBoxed = !this.isBoxed;
      if (this.isBoxed) this.stateMachine.transition(PlayerStates.BOX);
      else this.stateMachine.transition(PlayerStates.IDLE);
    }

    // Dragging cancels box
    if (this.isDragging && this.isBoxed) {
      this.isBoxed = false;
      this.stateMachine.transition(PlayerStates.IDLE);
    }

    this.stateMachine.step(input);

    // Adjust collision box based on facing direction for consistency
    if (this.facing === "up") {
      // Tighter collision for up-facing to reduce jitter
      this.body.setSize(this.width * 0.85, this.height * 0.85);
      this.body.setOffset(this.width * 0.075, this.height * 0.075);
    } else if (this.facing === "left" || this.facing === "right") {
      // Uniform height for left/right to match
      this.body.setSize(this.width, this.height * 0.94);
      this.body.setOffset(0, this.height * 0.03);
    } else {
      // Full collision for down
      this.body.setSize(this.width, this.height);
      this.body.setOffset(0, 0);
    }

    // Keep dragged body attached behind player
    if (this.isDragging && this.dragTarget) {
      const offset = 10;
      let ox = 0, oy = 0;
      if (this.facing === "up") oy = offset;
      if (this.facing === "down") oy = -offset;
      if (this.facing === "left") ox = offset;
      if (this.facing === "right") ox = -offset;

      this.dragTarget.setVelocity(0, 0);
      this.dragTarget.x = this.x + ox;
      this.dragTarget.y = this.y + oy;
    }
  }

  setFacingFromVelocity(vx, vy) {
    if (Math.abs(vx) > Math.abs(vy)) this.facing = vx > 0 ? "right" : "left";
    else if (Math.abs(vy) > 0) this.facing = vy > 0 ? "down" : "up";
  }

  getMoveSpeed(base) {
    return this.isDragging ? this.dragSpeed : base;
  }
}

class IdleState {
  enter(player) {
    player.setVelocity(0, 0);
    if (!player.isBoxed) player.anims.play(`idle_${player.facing}`, true);
  }
  execute(player, input) {
    if (player.isBoxed) return;
    if (input.crouch) return player.stateMachine.transition(PlayerStates.CROUCH);
    const moving = input.up || input.down || input.left || input.right;
    if (moving) return player.stateMachine.transition(PlayerStates.WALK);
  }
}

class WalkState {
  execute(player, input) {
    if (player.isBoxed) return player.stateMachine.transition(PlayerStates.BOX);
    if (input.crouch) return player.stateMachine.transition(PlayerStates.CROUCH);

    const vx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const vy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    if (vx === 0 && vy === 0) return player.stateMachine.transition(PlayerStates.IDLE);

    const speed = player.getMoveSpeed(player.walkSpeed);
    const v = new Phaser.Math.Vector2(vx, vy).normalize().scale(speed);
    player.setVelocity(v.x, v.y);
    player.setFacingFromVelocity(v.x, v.y);
    player.anims.play(`walk_${player.facing}`, true);
  }
}

class CrouchState {
  enter(player) {
    player.setVelocity(0, 0);
    player.anims.play(`crouch_${player.facing}`, true);
  }
  execute(player, input) {
    if (!input.crouch) return player.stateMachine.transition(PlayerStates.IDLE);
    if (player.isBoxed) return player.stateMachine.transition(PlayerStates.BOX);

    const vx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const vy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    const v = new Phaser.Math.Vector2(vx, vy);

    if (v.lengthSq() === 0) {
      player.setVelocity(0, 0);
      player.anims.play(`crouch_${player.facing}`, true);
      return;
    }

    const speed = player.getMoveSpeed(player.crouchSpeed);
    v.normalize().scale(speed);
    player.setVelocity(v.x, v.y);
    player.setFacingFromVelocity(v.x, v.y);
    player.anims.play(`crouchwalk_${player.facing}`, true);
  }
}

class BoxState {
  enter(player) {
    player.setVelocity(0, 0);
    player.setTexture("box", 0);
  }
  execute(player, input) {
    if (!player.isBoxed) {
      player.setTexture("player", 0);
      player.anims.play(`idle_${player.facing}`, true);
      return player.stateMachine.transition(PlayerStates.IDLE);
    }

    const vx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const vy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    const v = new Phaser.Math.Vector2(vx, vy);

    if (v.lengthSq() === 0) {
      player.setVelocity(0, 0);
      return;
    }

    const speed = player.getMoveSpeed(player.boxSpeed);
    v.normalize().scale(speed);
    player.setVelocity(v.x, v.y);
    player.setFacingFromVelocity(v.x, v.y);
  }
}

class DetectedState {
  enter(player) {
    player.setVelocity(0, 0);
  }
  execute(player) {}
}
