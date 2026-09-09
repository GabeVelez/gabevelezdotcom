import Phaser from "phaser";
import { StateMachine } from "../systems/stateMachine.js";

export const PlayerStates = {
  IDLE: "idle",
  WALK: "walk",
  BOX: "box",
  DETECTED: "detected",
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "gabe-front", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Scale to show sprite detail - larger than original 16x24 spec
    this.setScale(0.5); // 64px frames * 0.5 = 32px on screen, a clean 2:1

    // Anchor at bottom-center (eliminates waddle from earlier)
    this.setOrigin(0.5, 1.0);

    // Uniform collision box - sprites are now all aligned the same way
    // Simple percentage-based collision works perfectly with aligned sprites
    const collisionWidth = this.width * 0.9;  // 90% width
    const collisionHeight = this.height * 0.5;  // 50% height (bottom half)
    const offsetY = this.height - collisionHeight;  // Position at bottom (feet)

    this.body.setSize(collisionWidth, collisionHeight);
    this.body.setOffset(0, offsetY);

    // Don't constrain to world bounds - let tilemap walls provide boundaries
    // this.setCollideWorldBounds(true);

    this.walkSpeed = 80;
    this.dragSpeed = 40;
    this.boxSpeed = 32;

    this.facing = "down";

    this.isDragging = false;
    this.dragTarget = null;

    this.isBoxed = false;

    // Create cardboard box sprite (initially hidden)
    // Match the exact size of the collectible item (32x32 pixels)
    this.boxSprite = scene.add.image(x, y, "cardboardbox");
    this.boxSprite.setOrigin(0.5, 1.0); // Match player origin
    this.boxSprite.setDisplaySize(32, 32); // Same as collectible item
    this.boxSprite.setDepth(100); // High depth to ensure it covers player
    this.boxSprite.setVisible(false);

    this.stateMachine = new StateMachine(PlayerStates.IDLE, {
      [PlayerStates.IDLE]: new IdleState(),
      [PlayerStates.WALK]: new WalkState(),
      [PlayerStates.BOX]: new BoxState(),
      [PlayerStates.DETECTED]: new DetectedState(),
    }, [this]);
  }

  update(input) {
    // A room can switch the carried items off. The rooftop does, the moment
    // the monster lands: the box and the smoke stop working there, and this is
    // what makes the dead slots in the HUD tell the truth.
    const itemsUsable = this.scene._itemsUsable ? this.scene._itemsUsable() : true;

    // Toggle box on edge-trigger (only if player has cardboard box in inventory)
    if (input.justSlot1 && itemsUsable) {
      const inventory = this.scene.registry.get("inventory");

      // Only allow boxing if player has the cardboard box
      if (inventory && inventory.hasItem("cardboard_box")) {
        this.isBoxed = !this.isBoxed;

        if (this.isBoxed) {
          // Hide player sprite and show box
          this.setAlpha(0);
          this.stateMachine.transition(PlayerStates.BOX);
          // Play paper slide sound for entering box
          if (this.scene.registry.get("soundEnabled")) {
            this.scene.sound.play("box_toggle", { volume: 0.5 });
          }
        } else {
          // Show player sprite and hide box
          this.setAlpha(1);
          if (this.boxSprite) {
            this.boxSprite.setVisible(false);
          }
          this.stateMachine.transition(PlayerStates.IDLE);
          // Play paper slide sound for exiting box
          if (this.scene.registry.get("soundEnabled")) {
            this.scene.sound.play("box_toggle", { volume: 0.5 });
          }
        }
      } else if (!this.isBoxed) {
        // Optional: Play a different sound or show message that box is not available
        console.log("You don't have a cardboard box!");
      }
    }

    // Deploy smoke grenade on slot2 (only if player has smoke grenade in inventory)
    if (input.justSlot2 && itemsUsable) {
      const inventory = this.scene.registry.get("inventory");

      if (inventory && inventory.hasItem("smoke_grenade")) {
        // Import SmokeGrenade dynamically
        import("./SmokeGrenade.js").then(({ SmokeGrenade }) => {
          // Find the smoke grenade in scene items or create a temporary instance to call deploy
          const tempGrenade = new SmokeGrenade(this.scene, 0, 0);
          tempGrenade.deploy(this, this.scene);

          // Don't remove from inventory - grenades can be used multiple times
          // (adjust this if you want single-use grenades)
        });
      } else {
        console.log("You don't have a smoke grenade!");
      }
    }

    // Dragging cancels box
    if (this.isDragging && this.isBoxed) {
      this.isBoxed = false;
      this.stateMachine.transition(PlayerStates.IDLE);
    }

    this.stateMachine.step(input);

    // Update box sprite position to follow player
    if (this.boxSprite) {
      this.boxSprite.setPosition(this.x, this.y);
    }

    // Maintain collision box at bottom (feet) - sprites are aligned uniformly
    const collisionWidth = this.width * 0.9;
    const collisionHeight = this.height * 0.5;
    const offsetY = this.height - collisionHeight;

    this.body.setSize(collisionWidth, collisionHeight);
    this.body.setOffset(0, offsetY);

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
    const moving = input.up || input.down || input.left || input.right;
    if (moving) return player.stateMachine.transition(PlayerStates.WALK);
  }
}

class WalkState {
  execute(player, input) {
    if (player.isBoxed) return player.stateMachine.transition(PlayerStates.BOX);

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

class BoxState {
  enter(player) {
    player.setVelocity(0, 0);
    // Show box sprite over player
    if (player.boxSprite) {
      player.boxSprite.setVisible(true);
    }
  }
  execute(player, input) {
    if (!player.isBoxed) {
      // Hide box sprite and return to idle
      if (player.boxSprite) {
        player.boxSprite.setVisible(false);
      }
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

    // Use slower box speed for movement
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
