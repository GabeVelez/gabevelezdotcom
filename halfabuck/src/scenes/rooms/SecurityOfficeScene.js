import { BaseRoomScene } from "../BaseRoomScene.js";
import { SecurityKeycard } from "../../entities/SecurityKeycard.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Security Office - Level 7
 * 400×352 pixels
 * Security Keycard at (336,176) inside locked room
 * Enter at bottom-left (35,330)
 * Exit at top-left (35,17) to MaintenanceTunnelScene (requires keycard)
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

    // Setup exits from SVG and get spawn position
    const spawnPos = await this.setupExitsFromSVG("assets/exits/security-office-exits.svg", {
      enterZone: { scene: "LoadingDockScene", direction: "north", entryDirection: "south" },
      exitZone: { scene: "MaintenanceTunnelScene", direction: "south", entryDirection: "north" }
    }, officeOffsetX, officeOffsetY);

    this.createPlayer(spawnPos.x, spawnPos.y);

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
