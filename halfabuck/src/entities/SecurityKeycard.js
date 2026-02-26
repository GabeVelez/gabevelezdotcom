import { Item } from "./Item.js";

/**
 * Security Keycard - collectible item that unlocks doors
 * Extends Item class with keycard-specific properties
 */
export class SecurityKeycard extends Item {
  constructor(scene, x, y, config = {}) {
    // Default config for security keycard
    const keycardConfig = {
      texture: config.texture || "security-keycard",
      id: config.id || "keycard",
      name: config.name || "Security Keycard",
      description: config.description || "A keycard that unlocks secured doors",
      interactionRange: config.interactionRange || 40,
      displaySize: config.displaySize || 32,
      depth: config.depth || 5,
      hasCollision: false, // Keycards don't block movement
      ...config
    };

    super(scene, x, y, keycardConfig);

    // Keycard-specific properties
    this.keycardId = config.keycardId || "default"; // Which doors this keycard unlocks
  }

  /**
   * Override collect to add keycard-specific behavior
   */
  collect(player, scene) {
    const success = super.collect(player, scene);

    if (success) {
      // Could add visual feedback here (glow effect, etc.)
      console.log(`Collected keycard: ${this.keycardId}`);
    }

    return success;
  }
}
