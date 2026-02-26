import { BaseRoomScene } from "../BaseRoomScene.js";
import { Guard } from "../../entities/Guard.js";
import { LeadGuard } from "../../entities/LeadGuard.js";
import { Officer } from "../../entities/Officer.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Loading Dock - Level 6: Open warehouse loading area
 * First level testing smoke grenade usage in open space
 * Exit to Security Office
 */
export class LoadingDockScene extends BaseRoomScene {
  constructor() {
    super("LoadingDockScene");
  }

  create() {
    // Loading dock is 512×288 pixels
    this.dockWidth = 512;
    this.dockHeight = 288;

    // Add loading dock background image immediately
    const dockBg = this.add.image(0, 0, "loading_dock_layout");
    dockBg.setOrigin(0, 0);
    dockBg.setDisplaySize(this.dockWidth, this.dockHeight);
    dockBg.setDepth(0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    const { width, height } = this.scale;
    const dockWidth = this.dockWidth;
    const dockHeight = this.dockHeight;

    // Load collision from SVG file
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/loading-dock-collision.svg"
    );

    // Store for reference (needed for vision system)
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // Player spawn position depends on entry direction
    let playerX = 256; // Center horizontally
    let playerY = 144; // Center vertically

    if (this.entryDirection === "north") {
      // Coming from Storage Bay (previous level)
      playerX = 256;
      playerY = 32; // Spawn near top
    }

    this.createPlayer(playerX, playerY);

    // Create 5 guards: 2 Regular, 2 Lead, 1 Overseer
    this.createGuards();

    // Guard 1 (Regular) - Crosses at top-left corner
    const guard1 = new Guard(this, 96, 64, [
      { x: 96, y: 64 },
      { x: 160, y: 64 },
      { x: 160, y: 112 },
      { x: 96, y: 112 }
    ]);
    guard1.setDepth(10);
    this.guards.push(guard1);

    // Guard 2 (Lead) - Patrols center-left area
    const guard2 = new LeadGuard(this, 128, 144, [
      { x: 128, y: 144 },
      { x: 176, y: 144 },
      { x: 176, y: 192 },
      { x: 128, y: 192 }
    ]);
    guard2.setDepth(10);
    this.guards.push(guard2);

    // Guard 3 (Regular) - Crosses at bottom-right corner
    const guard3 = new Guard(this, 288, 224, [
      { x: 288, y: 224 },
      { x: 336, y: 224 },
      { x: 336, y: 176 },
      { x: 288, y: 176 }
    ]);
    guard3.setDepth(10);
    this.guards.push(guard3);

    // Guard 4 (Lead) - Blocks center area
    const guard4 = new LeadGuard(this, 256, 144, [
      { x: 256, y: 112 },
      { x: 304, y: 112 },
      { x: 304, y: 176 },
      { x: 256, y: 176 }
    ]);
    guard4.setDepth(10);
    this.guards.push(guard4);

    // Guard 5 (Officer) - Oversees exit area (FIRST OFFICER INTRODUCTION)
    const guard5 = new Officer(this, 400, 144, [
      { x: 400, y: 112 },
      { x: 400, y: 176 },
      { x: 464, y: 176 },
      { x: 464, y: 112 }
    ]);
    guard5.setDepth(10);
    this.guards.push(guard5);

    // Create a simple tilemap for vision/waypoint systems (walkable everywhere except collisions)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 32, // 512 / 16
      height: 18  // 288 / 16
    });
    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.fill(1, 0, 0, 32, 18); // All walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Exit to Security Office at (496, 144)
    this.createExit(496, 144, 32, 32, "SecurityOfficeScene", "west");

    // Physics - add colliders for all collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
      for (const g of this.guards) {
        this.physics.add.collider(g, body);
      }
    });

    // Camera
    this.cameras.main.setBounds(0, 0, dockWidth, dockHeight);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
