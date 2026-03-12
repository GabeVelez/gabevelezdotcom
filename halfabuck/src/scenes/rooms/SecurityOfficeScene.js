import { BaseRoomScene } from "../BaseRoomScene.js";
import { SecurityKeycard } from "../../entities/SecurityKeycard.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Security Office - Level 7
 * 400×352 pixels
 * Security Keycard at (336,176) inside locked room
 * Exit at (240,32) to MaintenanceTunnelScene (requires keycard)
 */
export class SecurityOfficeScene extends BaseRoomScene {
  constructor() {
    super("SecurityOfficeScene");
  }

  create() {
    // Security Office is 400×352 pixels
    // No centering needed - fits within canvas
    this.officeOffsetX = 0;
    this.officeOffsetY = 0;

    // Add security office background image
    const officeBg = this.add.image(this.officeOffsetX, this.officeOffsetY, "security_office_layout");
    officeBg.setOrigin(0, 0);
    officeBg.setDisplaySize(400, 352);
    officeBg.setDepth(0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    const { width, height } = this.scale;
    const officeOffsetX = this.officeOffsetX;
    const officeOffsetY = this.officeOffsetY;

    // Create invisible tilemap for waypoint/vision system (all walkable)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 25,  // 400 / 16
      height: 22  // 352 / 16
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.x = officeOffsetX;
    ground.y = officeOffsetY;
    ground.fill(1, 0, 0, 25, 22); // Fill all tiles as walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    // Load collision from SVG file
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/security-office-collision.svg",
      officeOffsetX,
      officeOffsetY
    );

    // Store for reference (needed for vision system and player collision)
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // Player spawn position depends on entry direction
    let playerX = 200;
    let playerY = 300; // Default spawn near bottom

    if (this.entryDirection === "west") {
      // Coming from Loading Dock (right exit) - spawn at bottom
      playerX = 200;
      playerY = 300; // Spawn near bottom
      console.log(`Spawning from Loading Dock at (${playerX}, ${playerY})`);
    } else if (this.entryDirection === "north") {
      // Coming from Maintenance Tunnel (top exit)
      playerX = 240;
      playerY = 60; // Below the exit
      console.log(`Spawning from Maintenance Tunnel at (${playerX}, ${playerY})`);
    }

    this.createPlayer(playerX, playerY);

    // Create guards (guards will be added board by board)
    this.createGuards();

    // Create Security Keycard at (336,176) inside locked room
    const keycard = new SecurityKeycard(this, 336, 176, {
      keycardId: "security-office"
    });
    this.items.push(keycard);

    // Create locked door blocking access to keycard room
    // Position it to block the entrance to the room containing the keycard
    this.createLockedDoor(320, 160, 16, 48, "security-office");

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Exit at (240,32) to MaintenanceTunnelScene - requires keycard to unlock
    this.createExit(240, 32, 48, 32, "MaintenanceTunnelScene", "south");

    // Add colliders for all SVG collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
    });

    // Camera
    this.cameras.main.setBounds(officeOffsetX, officeOffsetY, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
