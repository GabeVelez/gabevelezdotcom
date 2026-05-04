import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";
import { Guard } from "../../entities/Guard.js";
import { LeadGuard } from "../../entities/LeadGuard.js";
import { Officer } from "../../entities/Officer.js";
import { Captain } from "../../entities/Captain.js";
import { Overseer } from "../../entities/Overseer.js";

/**
 * Rooftop Helipad - Final level (Level 10)
 * 480×480 pixels with maximum challenge
 * 7 guards with concentric patrol rings
 * Helicopter at center, locked gate, victory condition
 */
export class RooftopHelipadScene extends BaseRoomScene {
  constructor() {
    super("RooftopHelipadScene");
    this.levelLabel = "LVL 10: Rooftop Helipad";
  }

  create() {
    // Rooftop is 480x480
    // Center on 320x180 canvas would overflow - keep at (0,0) or use camera bounds
    this.rooftopOffsetX = -80; // Center horizontally: (320 - 480) / 2
    this.rooftopOffsetY = -150; // Keep player visible in bottom area

    // Add rooftop background image
    const rooftopBg = this.add.image(this.rooftopOffsetX, this.rooftopOffsetY, "rooftop_helipad_layout");
    rooftopBg.setOrigin(0, 0);
    rooftopBg.setDisplaySize(480, 480);
    rooftopBg.setDepth(0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    const rooftopOffsetX = this.rooftopOffsetX;
    const rooftopOffsetY = this.rooftopOffsetY;

    // Create invisible tilemap for waypoint/vision system (all walkable)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 30, // 480 / 16
      height: 30
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.x = rooftopOffsetX;
    ground.y = rooftopOffsetY;
    ground.fill(1, 0, 0, 30, 30); // Fill all tiles as walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    // Load collision from SVG file with offset applied
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/rooftop-helipad-collision.svg",
      rooftopOffsetX,
      rooftopOffsetY
    );

    // Store for reference (needed for vision system and player collision)
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // Player spawn position - enter from south (bottom)
    let playerX = rooftopOffsetX + 240; // Center horizontally
    let playerY = rooftopOffsetY + 440; // Near bottom

    if (this.entryDirection === "north") {
      // Coming from Executive Wing (stairs/elevator) - spawn at bottom
      playerX = rooftopOffsetX + 240;
      playerY = rooftopOffsetY + 440;
      console.log(`Spawning from Executive Wing at (${playerX}, ${playerY})`);
    }

    this.createPlayer(playerX, playerY);

    // Create 7 guards with maximum challenge
    this.createGuards();

    // Final Boss Level - Full guard roster (8 guards)
    // Distribution: 2 Regular, 2 Lead, 2 Officer, 1 Captain, 1 Overseer

    // Guard 1: Regular - Outer ring patrol (clockwise)
    const guard1 = new Guard(this, rooftopOffsetX + 160, rooftopOffsetY + 160, [
      { x: rooftopOffsetX + 160, y: rooftopOffsetY + 160 },
      { x: rooftopOffsetX + 320, y: rooftopOffsetY + 160 },
      { x: rooftopOffsetX + 320, y: rooftopOffsetY + 320 },
      { x: rooftopOffsetX + 160, y: rooftopOffsetY + 320 }
    ]);
    guard1.setDepth(10);
    this.guards.push(guard1);

    // Guard 2: Regular - Inner ring patrol (counter-clockwise)
    const guard2 = new Guard(this, rooftopOffsetX + 200, rooftopOffsetY + 200, [
      { x: rooftopOffsetX + 200, y: rooftopOffsetY + 200 },
      { x: rooftopOffsetX + 200, y: rooftopOffsetY + 280 },
      { x: rooftopOffsetX + 280, y: rooftopOffsetY + 280 },
      { x: rooftopOffsetX + 280, y: rooftopOffsetY + 200 }
    ]);
    guard2.setDepth(10);
    this.guards.push(guard2);

    // Guard 3: Lead - North perimeter patrol
    const guard3 = new LeadGuard(this, rooftopOffsetX + 120, rooftopOffsetY + 80, [
      { x: rooftopOffsetX + 120, y: rooftopOffsetY + 80 },
      { x: rooftopOffsetX + 360, y: rooftopOffsetY + 80 }
    ]);
    guard3.setDepth(10);
    this.guards.push(guard3);

    // Guard 4: Lead - South perimeter patrol
    const guard4 = new LeadGuard(this, rooftopOffsetX + 120, rooftopOffsetY + 400, [
      { x: rooftopOffsetX + 120, y: rooftopOffsetY + 400 },
      { x: rooftopOffsetX + 360, y: rooftopOffsetY + 400 }
    ]);
    guard4.setDepth(10);
    this.guards.push(guard4);

    // Guard 5: Officer - East perimeter patrol
    const guard5 = new Officer(this, rooftopOffsetX + 400, rooftopOffsetY + 120, [
      { x: rooftopOffsetX + 400, y: rooftopOffsetY + 120 },
      { x: rooftopOffsetX + 400, y: rooftopOffsetY + 360 }
    ]);
    guard5.setDepth(10);
    this.guards.push(guard5);

    // Guard 6: Officer - West perimeter patrol
    const guard6 = new Officer(this, rooftopOffsetX + 80, rooftopOffsetY + 120, [
      { x: rooftopOffsetX + 80, y: rooftopOffsetY + 120 },
      { x: rooftopOffsetX + 80, y: rooftopOffsetY + 360 }
    ]);
    guard6.setDepth(10);
    this.guards.push(guard6);

    // Guard 7: Captain - Fast roaming diagonal patrol
    const guard7 = new Captain(this, rooftopOffsetX + 300, rooftopOffsetY + 300, [
      { x: rooftopOffsetX + 150, y: rooftopOffsetY + 150 },
      { x: rooftopOffsetX + 330, y: rooftopOffsetY + 150 },
      { x: rooftopOffsetX + 330, y: rooftopOffsetY + 330 },
      { x: rooftopOffsetX + 150, y: rooftopOffsetY + 330 }
    ]);
    guard7.setDepth(10);
    this.guards.push(guard7);

    // Guard 8: Overseer - Helicopter overwatch (guards victory point)
    const guard8 = new Overseer(this, rooftopOffsetX + 240, rooftopOffsetY + 240, [
      { x: rooftopOffsetX + 220, y: rooftopOffsetY + 240 },
      { x: rooftopOffsetX + 260, y: rooftopOffsetY + 240 }
    ]);
    guard8.setDepth(10);
    this.guards.push(guard8);

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Create locked gate at helipad entrance
    const gate = this.createLockedDoor(
      rooftopOffsetX + 256,
      rooftopOffsetY + 208,
      32,
      16,
      "helipad_gate"
    );

    // Create helicopter sprite at center with rotor animation
    const helicopter = this.add.sprite(
      rooftopOffsetX + 240,
      rooftopOffsetY + 240,
      "helicopter"
    );
    helicopter.setDisplaySize(96, 96);
    helicopter.setDepth(5);

    // Create simple rotor rotation animation
    this.tweens.add({
      targets: helicopter,
      angle: 360,
      duration: 1000,
      repeat: -1,
      ease: 'Linear'
    });

    // Victory exit zone at helicopter (triggers EndingScene)
    const exitX = rooftopOffsetX + 240;
    const exitY = rooftopOffsetY + 240;
    this.createExit(exitX, exitY, 64, 64, "EndingScene", "victory");

    // Add colliders for all SVG collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
    });

    // Add guard colliders
    for (const g of this.guards) {
      this.physics.add.collider(g, ground);
      collisionBodies.forEach(body => {
        this.physics.add.collider(g, body);
      });
    }

    // Camera - follow player with bounds set to rooftop area
    this.cameras.main.setBounds(rooftopOffsetX, rooftopOffsetY, 480, 480);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
