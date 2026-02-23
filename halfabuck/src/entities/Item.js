import Phaser from "phaser";

/**
 * Interactable Item
 * Can be picked up by player when in proximity
 */
export class Item extends Phaser.GameObjects.Image {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.texture);

    scene.add.existing(this);

    // Item properties
    this.itemId = config.id;
    this.itemName = config.name;
    this.itemDescription = config.description || "";
    this.interactionRange = config.interactionRange || 40;
    this.collected = false;

    // Visual setup
    this.setOrigin(0.5, 0.5);
    if (config.displaySize) {
      this.setDisplaySize(config.displaySize, config.displaySize);
    }
    this.setDepth(config.depth || 5);

    // Store optional callback for when item is collected
    this.onCollect = config.onCollect || null;
  }

  /**
   * Check if player is in range to interact
   */
  isPlayerInRange(player) {
    if (this.collected) return false;

    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      player.x, player.y
    );

    return distance <= this.interactionRange;
  }

  /**
   * Collect this item
   */
  collect(player, scene) {
    if (this.collected) return false;

    this.collected = true;

    // Play pickup sound if available
    if (scene.registry.get("soundEnabled")) {
      // Use alert sound as pickup sound
      scene.sound.play('alert', { volume: 0.3 });
    }

    // Hide the item (don't destroy in case we need to restore it)
    this.setVisible(false);
    this.setActive(false);

    // Execute custom callback if provided
    if (this.onCollect) {
      this.onCollect(player, scene);
    }

    return true;
  }
}
