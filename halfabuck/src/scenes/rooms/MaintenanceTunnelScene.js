import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Maintenance Tunnel - Narrow underground passage
 * Level 8
 * Exit north to Executive Wing
 */
export class MaintenanceTunnelScene extends BaseRoomScene {
  constructor() {
    super("MaintenanceTunnelScene");
  }

  create() {
    // Maintenance Tunnel is 480x256 (30 tiles × 16 tiles)
    // Center on 320x180 canvas: offset at (-80, -38) to center properly
    this.tunnelOffsetX = -80;
    this.tunnelOffsetY = -38;

    // Add maintenance tunnel background image
    const tunnelBg = this.add.image(this.tunnelOffsetX, this.tunnelOffsetY, "maintenance_tunnel_layout");
    tunnelBg.setOrigin(0, 0);
    tunnelBg.setDisplaySize(480, 256);
    tunnelBg.setDepth(0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    const { width, height } = this.scale;
    const tunnelOffsetX = this.tunnelOffsetX;
    const tunnelOffsetY = this.tunnelOffsetY;

    // Create invisible tilemap for waypoint/vision system
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 30,
      height: 16
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.x = tunnelOffsetX;
    ground.y = tunnelOffsetY;
    ground.fill(1, 0, 0, 30, 16); // Fill all tiles as walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    // Load collision from SVG file with offset applied
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/maintenance-tunnel-collision.svg",
      tunnelOffsetX,
      tunnelOffsetY
    );

    // Store for reference (needed for vision system and player collision)
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // Setup exits from SVG and get spawn position
    const spawnPos = await this.setupExitsFromSVG("assets/exits/maintenance-tunnel-exits.svg", {
      enterZone: { scene: "SecurityOfficeScene", direction: "north", entryDirection: "south" },
      exitZone: { scene: "ExecutiveWingScene", direction: "south", entryDirection: "north" }
    }, tunnelOffsetX, tunnelOffsetY);

    this.createPlayer(spawnPos.x, spawnPos.y);

    // Create guards (guards will be added board by board)
    this.createGuards();

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Add colliders for all SVG collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
    });

    // Bottom UI barrier - prevents player from walking behind UI overlay
    const uiBarrier = this.add.rectangle(
      160,  // Center of canvas width (320 / 2)
      170,  // Bottom 20 pixels (180 - 10)
      320,  // Full canvas width
      20,   // Barrier height
      0x000000,
      0
    );
    this.physics.add.existing(uiBarrier, true);
    this.physics.add.collider(this.player, uiBarrier);

    this.cameras.main.setBounds(tunnelOffsetX, tunnelOffsetY, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
