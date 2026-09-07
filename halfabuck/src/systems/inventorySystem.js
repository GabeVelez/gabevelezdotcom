/**
 * Inventory System
 * Manages player's collected items
 */
export class InventorySystem {
  constructor() {
    this.items = [];
  }

  /**
   * Add item to inventory
   */
  addItem(item) {
    // Check if item already exists
    const existing = this.items.find(i => i.id === item.itemId);
    if (existing) {
      console.warn(`Item ${item.itemId} already in inventory`);
      return false;
    }

    this.items.push({
      id: item.itemId,
      name: item.itemName,
      description: item.itemDescription,
      texture: item.texture.key,
      // Which door this opens. Dropped previously, which made per-door
      // matching impossible even once the lookup below was corrected.
      keycardId: item.keycardId ?? null
    });

    console.log(`Added ${item.itemName} to inventory`);
    return true;
  }

  /**
   * Check if inventory contains item
   */
  hasItem(itemId) {
    return this.items.some(i => i.id === itemId);
  }

  /**
   * Get item by id
   */
  getItem(itemId) {
    return this.items.find(i => i.id === itemId);
  }

  /**
   * Remove item from inventory
   */
  removeItem(itemId) {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get all items
   */
  getAll() {
    return [...this.items];
  }

  /**
   * Clear inventory
   */
  clear() {
    this.items = [];
  }
}
