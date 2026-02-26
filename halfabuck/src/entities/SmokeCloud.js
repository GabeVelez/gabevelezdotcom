import Phaser from "phaser";

/**
 * Smoke Cloud Effect
 * Blocks guard vision and creates visual particle effect
 */
export class SmokeCloud extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    scene.add.existing(this);

    // Smoke cloud properties
    this.radius = 80; // 80px radius
    this.duration = 6000; // 6 seconds
    this.timeAlive = 0;
    this.active = true;

    this.setDepth(15); // Above player and guards

    // Create animated sprite for smoke effect
    this.smokeSprite = scene.add.sprite(0, 0, "smoke_cloud", 0);
    this.smokeSprite.setOrigin(0.5, 0.5);
    this.smokeSprite.setDisplaySize(this.radius * 2, this.radius * 2);
    this.smokeSprite.setAlpha(0.7);
    this.add(this.smokeSprite);

    // Play smoke animation if it exists
    if (scene.anims.exists("smoke_expand")) {
      this.smokeSprite.play("smoke_expand");
    }

    // Create physics body for collision detection (circle)
    scene.physics.add.existing(this);
    if (this.body) {
      this.body.setCircle(this.radius);
      this.body.setAllowGravity(false);
      this.body.setImmovable(true);
    }

    // Fade in effect
    scene.tweens.add({
      targets: this.smokeSprite,
      alpha: 0.8,
      duration: 500,
      ease: "Sine.easeOut"
    });

    // Start timer for auto-cleanup
    this.dissipateTimer = scene.time.delayedCall(this.duration, () => {
      this.dissipate();
    });
  }

  update(dt) {
    if (!this.active) return;

    this.timeAlive += dt;

    // Start fading out in the last 1.5 seconds
    if (this.timeAlive > this.duration - 1500) {
      const remainingTime = this.duration - this.timeAlive;
      const fadeProgress = remainingTime / 1500;
      this.smokeSprite.setAlpha(0.8 * fadeProgress);
    }
  }

  /**
   * Check if a point is inside the smoke cloud
   */
  containsPoint(x, y) {
    if (!this.active) return false;

    const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
    return distance <= this.radius;
  }

  /**
   * Check if a guard is inside the smoke cloud
   */
  containsGuard(guard) {
    return this.containsPoint(guard.x, guard.y);
  }

  /**
   * Begin dissipation process
   */
  dissipate() {
    this.active = false;

    // Fade out and destroy
    this.scene.tweens.add({
      targets: this.smokeSprite,
      alpha: 0,
      duration: 500,
      ease: "Sine.easeIn",
      onComplete: () => {
        this.destroy();
      }
    });
  }

  /**
   * Clean up on destroy
   */
  destroy(fromScene) {
    // Cancel timer if still active
    if (this.dissipateTimer) {
      this.dissipateTimer.remove();
    }

    // Remove from scene's smoke cloud array
    if (this.scene.smokeClouds) {
      const index = this.scene.smokeClouds.indexOf(this);
      if (index !== -1) {
        this.scene.smokeClouds.splice(index, 1);
      }
    }

    super.destroy(fromScene);
  }
}
