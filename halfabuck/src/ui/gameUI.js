/**
 * Game UI Overlay Manager
 * Handles HTML-based UI elements (detection meter, help text, sound button)
 */

export class GameUI {
  /**
   * @param {object|null} shell Handheld shell, when running on a touch device.
   *   Used to keep the chassis HUD and controls in step with scene visibility,
   *   and to phrase prompts for taps instead of keys.
   */
  constructor(shell = null) {
    this.shell = shell;
    this.isTouch = !!(shell && shell.active);

    this.detectionFill = document.getElementById('detection-meter-fill');
    this.soundToggle = document.getElementById('sound-toggle');
    this.soundIcon = document.getElementById('sound-icon');
    this.helpOverlay = document.getElementById('help-overlay');
    this.helpVisible = false;

    // Item notification
    this.itemNotification = document.getElementById('item-notification');
    this.notificationTimeout = null;

    // Inventory container
    this.inventoryContainer = document.getElementById('inventory-container');
    this.inventoryItems = document.getElementById('inventory-items');

    // Level label (bottom-left)
    this.levelLabel = document.getElementById('level-label');

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
   * Set the level label text (bottom-left).
   */
  setLevelLabel(text) {
    if (!this.levelLabel) return;
    this.levelLabel.textContent = text || '';
  }

  /**
   * Show/hide UI (for scene transitions)
   */
  setVisible(visible) {
    const gameUI = document.getElementById('game-ui');
    gameUI.style.display = visible ? 'block' : 'none';

    // On the handheld the HUD lives in the chassis strip and the d-pad only
    // feeds gameplay scenes, so both follow the same signal. The chassis itself
    // stays put: it is the device the title screen is displayed on.
    if (this.shell) {
      this.shell.setHudVisible(visible);
      this.shell.setControlsActive(visible);
    }

    // Always hide help when hiding UI
    if (!visible) {
      this.hideHelp();
    }
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
    // The slot numbers are the shared vocabulary: the HUD shows 1/2/3 on both
    // platforms, and they are the keyboard keys as well as the tap targets, so
    // these strings need no per-device wording at all.
    let message = '';
    switch(itemId) {
      case 'cardboard_box':
        message = `${itemName.toUpperCase()} ACQUIRED: 1 to hide inside`;
        break;
      case 'smoke_grenade':
        message = `${itemName.toUpperCase()} ACQUIRED: 2 to deploy smoke`;
        break;
      case 'keycard':
      case 'security_keycard':
        message = `${itemName.toUpperCase()} ACQUIRED: unlocks red doors automatically`;
        break;
      case 'easter_egg':
        message = itemName; // Easter eggs show message as-is (no "ACQUIRED")
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
      // Remove the item art, keep the slot-key number
      slot.querySelectorAll('i, img.slot-art').forEach((el) => el.remove());
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

      // Use the same pixel art the world uses, so the slot shows the actual item
      // rather than a generic vector glyph in a pixel-art game.
      const ART = {
        cardboard_box: 'box.png',
        smoke_grenade: 'smoke-bomb.png',
        security_keycard: 'keycard.png',
        keycard: 'keycard.png',
      };
      const file = ART[item.id];
      if (file) {
        const icon = document.createElement('img');
        icon.className = 'slot-art';
        icon.src = `assets/sprites/items/${file}`;
        icon.alt = item.name || item.id;
        slot.appendChild(icon);
      } else {
        const icon = document.createElement('i');
        icon.className = 'bi bi-star-fill'; // Fallback for anything unmapped
        slot.appendChild(icon);
      }
    });
  }
}
