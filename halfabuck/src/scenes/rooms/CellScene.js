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

    // Create simple room layout
    // For now, using basic tiles - you'll replace with your assets later
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 20,
      height: 11
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);

    // Fill floor with tile 1 (walkable)
    ground.fill(1, 0, 0, 20, 11);

    // Create walls (tile 2) around perimeter
    for (let x = 0; x < 20; x++) {
      ground.putTileAt(2, x, 0); // Top wall
      ground.putTileAt(2, x, 10); // Bottom wall
    }
    for (let y = 0; y < 11; y++) {
      ground.putTileAt(2, 0, y); // Left wall
      ground.putTileAt(2, 19, y); // Right wall
    }

    // Create exit door on bottom wall (leads to corridor)
    ground.putTileAt(1, 9, 10); // Door opening
    ground.putTileAt(1, 10, 10); // Door opening

    // Set collision on walls
    ground.setCollisionByExclusion([1, 3]); // Everything except floor(1) and shadows(3)
    this.groundLayer = ground;

    // Create base systems
    this.createBaseSystems();

    // Create player in center of cell
    this.createPlayer(160, 80);

    // Create guards array (no guards in cell - it's a prison cell)
    this.createGuards();

    // Setup vision system
    this.setupVisionSystem(ground);

    // Create exit zone at bottom door (aligned with door tiles)
    // Door tiles are at (9,10) and (10,10) = pixels (144,160) to (176,176)
    this.createExit(160, 165, 40, 20, "CorridorScene", "north");

    // Setup physics
    this.physics.add.collider(this.player, ground);

    // Camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
