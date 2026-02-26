import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";
import { Guard } from "../../entities/Guard.js";
import { LeadGuard } from "../../entities/LeadGuard.js";
import { Officer } from "../../entities/Officer.js";
import { Captain } from "../../entities/Captain.js";

/**
 * Maintenance Tunnel - Narrow underground passage with highest guard density
 * Level 8: Maximum difficulty with 6 guards creating coordinated patrols
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

    // Player spawn position depends on entry direction
    let playerX = tunnelOffsetX + (15 * 16); // Default: center horizontal
    let playerY = tunnelOffsetY + (13 * 16); // Near bottom

    if (this.entryDirection === "south") {
      // Coming from Security Office - spawn near bottom
      playerX = tunnelOffsetX + (15 * 16);
      playerY = tunnelOffsetY + (13 * 16);
      console.log(`Spawning from Security Office at (${playerX}, ${playerY})`);
    }

    this.createPlayer(playerX, playerY);

    // Create 6 guards - highest density (2 Regular, 2 Lead, 2 Overseer)
    this.createGuards();

    // Guard 1: Regular - Left side patrol
    const guard1 = new Guard(this, tunnelOffsetX + (5 * 16), tunnelOffsetY + (8 * 16), [
      { x: tunnelOffsetX + (5 * 16), y: tunnelOffsetY + (6 * 16) },
      { x: tunnelOffsetX + (5 * 16), y: tunnelOffsetY + (12 * 16) }
    ]);
    guard1.setDepth(10);
    this.guards.push(guard1);

    // Guard 2: Regular - Right side patrol
    const guard2 = new Guard(this, tunnelOffsetX + (25 * 16), tunnelOffsetY + (8 * 16), [
      { x: tunnelOffsetX + (25 * 16), y: tunnelOffsetY + (6 * 16) },
      { x: tunnelOffsetX + (25 * 16), y: tunnelOffsetY + (12 * 16) }
    ]);
    guard2.setDepth(10);
    this.guards.push(guard2);

    // Guard 3: Lead - Horizontal crosshair (middle left to middle right)
    const guard3 = new LeadGuard(this, tunnelOffsetX + (10 * 16), tunnelOffsetY + (8 * 16), [
      { x: tunnelOffsetX + (10 * 16), y: tunnelOffsetY + (8 * 16) },
      { x: tunnelOffsetX + (20 * 16), y: tunnelOffsetY + (8 * 16) }
    ]);
    guard3.setDepth(10);
    this.guards.push(guard3);

    // Guard 4: Lead - Vertical crosshair (top to bottom center)
    const guard4 = new LeadGuard(this, tunnelOffsetX + (15 * 16), tunnelOffsetY + (5 * 16), [
      { x: tunnelOffsetX + (15 * 16), y: tunnelOffsetY + (5 * 16) },
      { x: tunnelOffsetX + (15 * 16), y: tunnelOffsetY + (11 * 16) }
    ]);
    guard4.setDepth(10);
    this.guards.push(guard4);

    // Guard 5: Officer - Left junction coverage
    const guard5 = new Officer(this, tunnelOffsetX + (8 * 16), tunnelOffsetY + (10 * 16), [
      { x: tunnelOffsetX + (8 * 16), y: tunnelOffsetY + (10 * 16) },
      { x: tunnelOffsetX + (12 * 16), y: tunnelOffsetY + (10 * 16) }
    ]);
    guard5.setDepth(10);
    this.guards.push(guard5);

    // Guard 6: Captain - Right junction coverage (FIRST CAPTAIN INTRODUCTION)
    const guard6 = new Captain(this, tunnelOffsetX + (18 * 16), tunnelOffsetY + (10 * 16), [
      { x: tunnelOffsetX + (18 * 16), y: tunnelOffsetY + (10 * 16) },
      { x: tunnelOffsetX + (22 * 16), y: tunnelOffsetY + (10 * 16) }
    ]);
    guard6.setDepth(10);
    this.guards.push(guard6);

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Exit at top center (240, 32) leading to Executive Wing
    const exitX = tunnelOffsetX + (15 * 16); // Column 15 = pixel 240
    const exitY = tunnelOffsetY + (2 * 16); // Row 2 = pixel 32
    this.createExit(exitX, exitY, 40, 32, "ExecutiveWingScene", "south");

    // Add colliders for all SVG collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
      this.guards.forEach(guard => {
        this.physics.add.collider(guard, body);
      });
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
