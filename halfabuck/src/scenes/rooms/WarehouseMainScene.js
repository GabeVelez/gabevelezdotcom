import { BaseRoomScene } from "../BaseRoomScene.js";
import { Guard } from "../../entities/Guard.js";
import { LeadGuard } from "../../entities/LeadGuard.js";
import { Overseer } from "../../entities/Overseer.js";

/**
 * Warehouse Main - Large bottom area with multiple rooms and guards
 * Final challenge before stairs to wine cellar
 */
export class WarehouseMainScene extends BaseRoomScene {
  constructor() {
    super("WarehouseMainScene");
  }

  create() {
    const { width, height } = this.scale;

    // Create large warehouse floor
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 30,
      height: 18
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);

    // Fill floor
    ground.fill(1, 0, 0, 30, 18);

    // Outer walls
    for (let x = 0; x < 30; x++) {
      ground.putTileAt(2, x, 0);
      ground.putTileAt(2, x, 17);
    }
    for (let y = 0; y < 18; y++) {
      ground.putTileAt(2, 0, y);
      ground.putTileAt(2, 29, y);
    }

    // Exit to corridor (top)
    ground.putTileAt(1, 14, 0);
    ground.putTileAt(1, 15, 0);

    // Create two room divisions (as shown in layout)
    // Left room
    for (let x = 8; x < 20; x++) {
      ground.putTileAt(2, x, 8);
    }
    ground.putTileAt(1, 13, 8); // Door

    // Right room
    for (let y = 8; y < 14; y++) {
      ground.putTileAt(2, 20, y);
    }
    ground.putTileAt(1, 20, 11); // Door

    // Stairs marker to wine cellar (bottom right)
    ground.putTileAt(2, 26, 14);
    ground.putTileAt(2, 27, 14);
    ground.putTileAt(2, 26, 15);
    ground.putTileAt(2, 27, 15);

    // Shadow areas for hiding
    ground.putTileAt(3, 3, 3);
    ground.putTileAt(3, 4, 3);
    ground.putTileAt(3, 24, 10);
    ground.putTileAt(3, 25, 10);

    // Locker zone
    ground.putTileAt(3, 2, 15);
    ground.putTileAt(3, 3, 15);

    ground.setCollisionByExclusion([1, 3]);
    this.groundLayer = ground;

    this.createBaseSystems();

    // Player spawn position depends on entry direction
    // Spawn well away from exit zones to avoid immediate re-triggering
    // Note: player origin is (0.5, 1.0), so y position is at player's feet
    // Player center = y - height, so need extra clearance
    let playerX = 240;
    let playerY = 80; // Coming from Corridor (north entrance) - spawn below exit zone (was 50, too close)
    // TODO: Add spawn logic for wine cellar entrance when that scene is created

    this.createPlayer(playerX, playerY);

    // Create multiple guards (harder encounter)
    this.createGuards();

    // Regular guard in left room
    const guard1 = new Guard(this, 120, 160, [
      { x: 120, y: 160 },
      { x: 180, y: 160 },
      { x: 180, y: 220 },
      { x: 120, y: 220 }
    ]);
    guard1.setDepth(10);
    this.guards.push(guard1);

    // Lead guard in main area
    const guard2 = new LeadGuard(this, 240, 100, [
      { x: 240, y: 100 },
      { x: 320, y: 100 }
    ]);
    guard2.setDepth(10);
    this.guards.push(guard2);

    // Overseer in right room
    const guard3 = new Overseer(this, 380, 180, [
      { x: 380, y: 180 },
      { x: 380, y: 140 }
    ]);
    guard3.setDepth(10);
    this.guards.push(guard3);

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Exits - positioned at center of door tiles
    // Top exit: tiles (14,0) and (15,0) = pixels (224,0) to (256,16), center at (240, 20)
    this.createExit(240, 20, 32, 32, "CorridorScene", "south");
    // TODO: Add exit to wine cellar scene when created

    // Physics
    this.physics.add.collider(this.player, ground);
    for (const g of this.guards) {
      this.physics.add.collider(g, ground);
    }

    // Camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
