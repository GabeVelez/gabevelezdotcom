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
    this.soundIcon.textContent = enabled ? '🔊' : '🔇';
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
    this.interactionPrompt.textContent = `Press E to pick up ${itemName}`;
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
   * Update inventory display
   */
  updateInventory(items) {
    if (!this.inventoryItems) return;

    // Clear current items
    this.inventoryItems.innerHTML = '';

    // Show inventory container if there are items
    if (items.length > 0) {
      this.inventoryContainer.style.display = 'block';

      // Add each item
      items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.textContent = item.name;
        itemDiv.title = item.description || item.name;
        this.inventoryItems.appendChild(itemDiv);
      });
    } else {
      this.inventoryContainer.style.display = 'none';
    }
  }
}
