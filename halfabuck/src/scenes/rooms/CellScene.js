import { BaseRoomScene } from "../BaseRoomScene.js";

/**
 * Cell with Bed - Starting room
 * Player wakes up here and must escape to the corridor
 */
export class CellScene extends BaseRoomScene {
  constructor() {
    super("CellScene");
  }

  create() {
    const { width, height } = this.scale;

    // Create 14x10 cell (including walls)
    // Interior: 12x8 tiles = 6x4 floor panels (each panel is 2x2 tiles/32x32px)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 14,
      height: 10
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);

    // Center the tilemap on canvas (320x180)
    // Cell is 224x160, so offset by (320-224)/2 = 48 horizontal, (180-160)/2 = 10 vertical
    ground.x = 48;
    ground.y = 10;

    // Fill floor with tile 1 (walkable)
    ground.fill(1, 0, 0, 14, 10);

    // Create walls (tile 2) around perimeter
    for (let x = 0; x < 14; x++) {
      ground.putTileAt(2, x, 0); // Top wall
      ground.putTileAt(2, x, 9); // Bottom wall
    }
    for (let y = 0; y < 10; y++) {
      ground.putTileAt(2, 0, y); // Left wall
      ground.putTileAt(2, 13, y); // Right wall
    }

    // Create exit door on bottom wall (center)
    ground.putTileAt(1, 6, 9); // Door opening at center
    ground.putTileAt(1, 7, 9); // Door opening (2 tiles wide)

    // Set collision on walls
    ground.setCollisionByExclusion([1, 3]); // Everything except floor(1) and shadows(3)
    this.groundLayer = ground;

    // Overlay concrete floor panels (6x4 panels, each 32x32px)
    this._addConcreteFloor(ground);

    // Create base systems
    this.createBaseSystems();

    // Create player in center of cell (tile 7,5 = center of 14x10)
    this.createPlayer(48 + 112, 10 + 80);

    // Create guards array (no guards in cell - it's a prison cell)
    this.createGuards();

    // Setup vision system
    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Create exit zone at bottom door
    this.createExit(160, 154, 32, 16, "CorridorScene", "north");

    // Setup physics
    this.physics.add.collider(this.player, ground);

    // Camera - don't follow player, keep view centered on full canvas
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.scrollX = 0;
    this.cameras.main.scrollY = 0;
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }

  /**
   * Add concrete floor tiles as sprites over walkable areas
   */
  _addConcreteFloor(layer) {
    // Place 6x4 floor panels (each panel is 32x32 pixels = 2x2 game tiles)
    const offsetX = layer.x;
    const offsetY = layer.y;

    // Start at tile (1,1) to skip walls, place 6 panels across by 4 down
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        // Each panel starts at: tile (1 + col*2, 1 + row*2)
        const tileX = 1 + (col * 2);
        const tileY = 1 + (row * 2);

        // Convert to world pixels (center of 2x2 tile area)
        const worldX = offsetX + (tileX * 16) + 16;
        const worldY = offsetY + (tileY * 16) + 16;

        const sprite = this.add.image(worldX, worldY, "concrete-floor");
        sprite.setOrigin(0.5, 0.5);
        sprite.setDisplaySize(32, 32); // Each panel is 32x32 pixels
        sprite.setDepth(0); // Below player and guards
      }
    }
  }
}
