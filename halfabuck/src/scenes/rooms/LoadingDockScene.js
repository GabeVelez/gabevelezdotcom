import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Loading Dock - Level 6: Open warehouse loading area
 * Exit to Security Office
 */
export class LoadingDockScene extends BaseRoomScene {
  constructor() {
    super("LoadingDockScene");
    this.levelLabel = "LVL 6: Loading Dock";
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

    // Setup exits from SVG and get spawn position
    const spawnPos = await this.setupExitsFromSVG("assets/exits/loading-dock-exits.svg", {
      enterZone: { scene: "StorageBayScene", direction: "north", entryDirection: "south" },
      exitZone: { scene: "SecurityOfficeScene", direction: "south", entryDirection: "north" }
    });

    this.createPlayer(spawnPos.x, spawnPos.y);

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
