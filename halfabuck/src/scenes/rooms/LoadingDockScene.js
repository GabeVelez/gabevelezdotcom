import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Loading Dock - Level 6: Open warehouse loading area
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
    let playerX = 80; // Top-left area
    let playerY = 50; // Near top

    if (this.entryDirection === "north") {
      // Coming from Storage Bay (bottom-left exit at 60,300) - spawn at top-left
      playerX = 80;
      playerY = 50; // Spawn near top-left
    }

    this.createPlayer(playerX, playerY);

    // Create guards (guards will be added board by board)
    this.createGuards();

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
    });

    // Camera
    this.cameras.main.setBounds(0, 0, dockWidth, dockHeight);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
