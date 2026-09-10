import { BaseRoomScene } from "../BaseRoomScene.js";
import { SecurityKeycard } from "../../entities/SecurityKeycard.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Security Office - Level 8
 * 400×352 pixels
 * Security Keycard at (336,176), out in the open
 * In at the head of the room (44,49) from the Maintenance Tunnel
 * Out at the foot of it (44,318) to the Executive Wing, through the door the
 * keycard opens - the last room before the confrontation.
 */
export class SecurityOfficeScene extends BaseRoomScene {
  constructor() {
    super("SecurityOfficeScene");
    this.levelLabel = "LVL 8: Security Office";
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
      enterZone: { scene: "MaintenanceTunnelScene", direction: "north", entryDirection: "south" },
      exitZone: { scene: "ExecutiveWingScene", direction: "south", entryDirection: "north" }
    }, officeOffsetX, officeOffsetY);

    this.createPlayer(spawnPos.x, spawnPos.y);

    // Create guards (guards will be added board by board)
    this.createGuards();

    // The keycard, free to walk up to. It used to sit behind a locked door
    // that this very keycard was the key to, so the room could not be solved.
    // The lock it belongs to is on the Executive Wing door, one level on.
    const keycard = new SecurityKeycard(this, 336, 176, {
      keycardId: "executive-wing"
    });
    this.items.push(keycard);

    // The door into the Executive Wing. It sits on the exit zone - the black
    // rect at (17.5, 330.62) 52x21 - and holds you in the room until the
    // keycard is spent on it.
    this.createLockedDoor(43.6, 341.3, 52, 18, "executive-wing");

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
