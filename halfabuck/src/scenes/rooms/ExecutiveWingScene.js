import { BaseRoomScene } from "../BaseRoomScene.js";
import { Guard } from "../../entities/Guard.js";
import { LeadGuard } from "../../entities/LeadGuard.js";
import { Officer } from "../../entities/Officer.js";
import { Captain } from "../../entities/Captain.js";
import { Overseer } from "../../entities/Overseer.js";
import { SecurityKeycard } from "../../entities/SecurityKeycard.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Executive Wing - Level 9
 * Open-plan executive office with glass walls and synchronized guard patrols
 * Size: 544×320 pixels (34×20 tiles)
 */
export class ExecutiveWingScene extends BaseRoomScene {
  constructor() {
    super("ExecutiveWingScene");
  }

  create() {
    // Executive Wing is 544×320 pixels
    this.wingWidth = 544;
    this.wingHeight = 320;

    // Add background image immediately
    const wingBg = this.add.image(0, 0, "executive_wing_layout");
    wingBg.setOrigin(0, 0);
    wingBg.setDisplaySize(this.wingWidth, this.wingHeight);
    wingBg.setDepth(0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    const { width, height } = this.scale;
    const wingWidth = this.wingWidth;
    const wingHeight = this.wingHeight;

    // Load collision from SVG file
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/executive-wing-collision.svg"
    );

    // Store for reference (needed for vision system)
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // Player spawn position - depends on entry direction
    let playerX = 80;
    let playerY = 160; // Center left, entering from Security Office

    if (this.entryDirection === "north") {
      // Coming from Security Office
      playerX = 80;
      playerY = 160;
    }

    this.createPlayer(playerX, playerY);

    // Create guards
    this.createGuards();

    // Executive Wing - Full guard roster (7 guards)
    // Distribution: 1 Regular, 2 Lead, 2 Officer, 1 Captain, 1 Overseer (FIRST OVERSEER)

    // Guard 1: Regular - Front entrance patrol
    const guard1 = new Guard(this, 150, 100, [
      { x: 150, y: 100 },
      { x: 150, y: 200 },
    ]);
    guard1.setDepth(10);
    this.guards.push(guard1);

    // Guard 2: Lead - Left wing patrol
    const guard2 = new LeadGuard(this, 200, 160, [
      { x: 200, y: 100 },
      { x: 200, y: 220 },
    ]);
    guard2.setDepth(10);
    this.guards.push(guard2);

    // Guard 3: Lead - Right wing patrol (synchronized opposite)
    const guard3 = new LeadGuard(this, 400, 220, [
      { x: 400, y: 220 },
      { x: 400, y: 100 },
    ]);
    guard3.setDepth(10);
    this.guards.push(guard3);

    // Guard 4: Officer - Center area patrol
    const guard4 = new Officer(this, 300, 160, [
      { x: 250, y: 160 },
      { x: 350, y: 160 },
    ]);
    guard4.setDepth(10);
    this.guards.push(guard4);

    // Guard 5: Officer - Back corridor patrol
    const guard5 = new Officer(this, 450, 80, [
      { x: 350, y: 80 },
      { x: 480, y: 80 },
    ]);
    guard5.setDepth(10);
    this.guards.push(guard5);

    // Guard 6: Captain - Fast roaming responder
    const guard6 = new Captain(this, 350, 200, [
      { x: 350, y: 160 },
      { x: 450, y: 160 },
      { x: 450, y: 220 },
      { x: 350, y: 220 },
    ]);
    guard6.setDepth(10);
    this.guards.push(guard6);

    // Guard 7: Overseer - Guards exit (FIRST OVERSEER INTRODUCTION)
    const guard7 = new Overseer(this, 512, 96, [
      { x: 496, y: 96 },
      { x: 528, y: 96 },
    ]);
    guard7.setDepth(10);
    this.guards.push(guard7);

    // Create a simple tilemap for vision/waypoint systems (walkable everywhere except collisions)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 34,
      height: 20
    });
    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.fill(1, 0, 0, 34, 20); // All walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Add security keycard for the locked door
    const keycard = new SecurityKeycard(this, 150, 160, {
      keycardId: "executive-exit"
    });
    this.items.push(keycard);

    // Locked door blocking the exit at (512, 96)
    this.createLockedDoor(512, 96, 32, 48, "executive-exit");

    // Exit to Rooftop Helipad at (528, 96)
    this.createExit(528, 96, 32, 32, "RooftopHelipadScene", "south");

    // Physics - add colliders for all collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
      for (const g of this.guards) {
        this.physics.add.collider(g, body);
      }
    });

    // Camera
    this.cameras.main.setBounds(0, 0, wingWidth, wingHeight);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
