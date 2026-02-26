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

    // Item notification
    this.itemNotification = document.getElementById('item-notification');
    this.notificationTimeout = null;

    // Inventory container
    this.inventoryContainer = document.getElementById('inventory-container');
    this.inventoryItems = document.getElementById('inventory-items');

    this.setupSoundButton();

    // Hide UI by default - will be shown by gameplay scenes only
    this.setVisible(false);
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
   * Show item collection notification
   */
  showItemNotification(itemId, itemName) {
    if (!this.itemNotification) return;

    // Clear any existing timeout
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    // Get the notification message based on item type
    let message = '';
    switch(itemId) {
      case 'cardboard_box':
        message = `${itemName.toUpperCase()} ACQUIRED — Press 1 to hide inside`;
        break;
      case 'smoke_grenade':
        message = `${itemName.toUpperCase()} ACQUIRED — Press 2 to deploy smoke`;
        break;
      case 'security_keycard':
        message = `${itemName.toUpperCase()} ACQUIRED — Unlocks red doors automatically`;
        break;
      default:
        message = `${itemName.toUpperCase()} ACQUIRED`;
    }

    this.itemNotification.textContent = message;
    this.itemNotification.style.display = 'block';

    // Auto-hide after 3 seconds (matches animation duration)
    this.notificationTimeout = setTimeout(() => {
      this.itemNotification.style.display = 'none';
    }, 3000);
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
      const icon = document.createElement('i');
      if (item.id === 'cardboard_box') {
        icon.className = 'bi bi-box-seam-fill';
      } else if (item.id === 'smoke_grenade') {
        icon.className = 'bi bi-cloud-fill';
      } else if (item.id === 'security_keycard') {
        icon.className = 'bi bi-sd-card-fill';
      } else {
        icon.className = 'bi bi-star-fill'; // Default icon
      }
      slot.appendChild(icon);
    });
  }
}
