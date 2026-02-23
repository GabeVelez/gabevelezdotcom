/**
 * Game UI Overlay Manager
 * Handles HTML-based UI elements (detection meter, help text, sound button)
 */

export class GameUI {
  constructor() {
    this.detectionFill = document.getElementById('detection-meter-fill');
    this.soundToggle = document.getElementById('sound-toggle');
    this.soundIcon = document.getElementById('sound-icon');
    this.helpOverlay = document.getElementById('help-overlay');
    this.helpVisible = false;

    // Interaction prompt
    this.interactionPrompt = document.getElementById('interaction-prompt');

    // Inventory container
    this.inventoryContainer = document.getElementById('inventory-container');
    this.inventoryItems = document.getElementById('inventory-items');

    this.setupSoundButton();
  }

  /**
   * Update detection meter (0-1 range)
   */
  updateDetectionMeter(value) {
    const percent = Math.max(0, Math.min(100, value * 100));
    this.detectionFill.style.width = `${percent}%`;

    // Update color based on level
    this.detectionFill.classList.remove('yellow', 'red');
    if (percent >= 66) {
      this.detectionFill.classList.add('red');
    } else if (percent >= 33) {
      this.detectionFill.classList.add('yellow');
    }
  }

  /**
   * Setup sound toggle button
   */
  setupSoundButton() {
    this.soundToggle.addEventListener('click', () => {
      // Dispatch custom event for Phaser to handle
      const event = new CustomEvent('toggleSound');
      window.dispatchEvent(event);
    });
  }

  /**
   * Update sound button icon
   */
  updateSoundIcon(enabled) {
    if (enabled) {
      this.soundIcon.className = 'bi bi-volume-up-fill';
    } else {
      this.soundIcon.className = 'bi bi-volume-mute-fill';
    }
  }

  /**
   * Toggle help overlay
   */
  toggleHelp() {
    this.helpVisible = !this.helpVisible;
    this.helpOverlay.style.display = this.helpVisible ? 'flex' : 'none';
  }

  /**
   * Hide help overlay
   */
  hideHelp() {
    this.helpVisible = false;
    this.helpOverlay.style.display = 'none';
  }

  /**
   * Show/hide UI (for scene transitions)
   */
  setVisible(visible) {
    const gameUI = document.getElementById('game-ui');
    gameUI.style.display = visible ? 'block' : 'none';

    // Always hide help when hiding UI
    if (!visible) {
      this.hideHelp();
    }
  }

  /**
   * Show interaction prompt
   */
  showInteractionPrompt(itemName) {
    if (!this.interactionPrompt) return;
    this.interactionPrompt.textContent = `Press G to pick up ${itemName}`;
    this.interactionPrompt.style.display = 'block';
  }

  /**
   * Hide interaction prompt
   */
  hideInteractionPrompt() {
    if (!this.interactionPrompt) return;
    this.interactionPrompt.style.display = 'none';
  }

  /**
   * Update inventory display (3-slot system)
   */
  updateInventory(items) {
    if (!this.inventoryItems) return;

    console.log('Updating inventory with items:', items);

    // Get all 3 slots
    const slots = this.inventoryItems.querySelectorAll('.inventory-slot');

    // Clear all slots (but preserve the slot-key number indicators)
    slots.forEach(slot => {
      // Remove only the item icon, keep the slot-key number
      const icon = slot.querySelector('i');
      if (icon) {
        icon.remove();
      }
      slot.classList.remove('filled');
      slot.classList.add('empty');
      slot.removeAttribute('title');
    });

    // Fill slots with collected items
    items.forEach((item, index) => {
      if (index >= 3) return; // Only 3 slots

      const slot = slots[index];
      slot.classList.remove('empty');
      slot.classList.add('filled');
      slot.title = item.description || item.name;

      // Add Bootstrap icon based on item ID (note: inventory uses 'id' not 'itemId')
      if (item.id === 'cardboard_box') {
        const icon = document.createElement('i');
        icon.className = 'bi bi-box-seam-fill';
        slot.appendChild(icon);
      }
    });
  }
}
