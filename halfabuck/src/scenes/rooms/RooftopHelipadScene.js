import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Rooftop Helipad - Level 10.
 *
 * Cleared back to a bare room while it is redesigned: background, collision,
 * spawn, camera and a working exit, and nothing else. Everything that used to
 * be here was built for the old 480x480 placeholder art and is being replaced,
 * so it has been taken out rather than left to be worked around:
 *
 *   - eight guards (2 regular, 2 lead, 2 officer, a captain and an overseer)
 *   - the helipad_gate, a locked door whose keycard does not exist in the
 *     game, so it could never open
 *   - the helicopter, which span its whole fuselage rather than a rotor
 *   - the bazooka and the monster it was thrown at
 *
 * The exit is deliberately kept and left open so the game can still be played
 * end to end while the level is designed. It sits where the helicopter used to.
 */
export class RooftopHelipadScene extends BaseRoomScene {
  constructor() {
    super("RooftopHelipadScene");
    this.levelLabel = "LVL 10: Rooftop Helipad";
  }

  create() {
    // Rooftop is 480x480
    // Center on 320x180 canvas would overflow - keep at (0,0) or use camera bounds
    this.rooftopOffsetX = -48; // Center horizontally: (384 - 480) / 2
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

    // No guards. The room is being redesigned; they will be placed against
    // the new art. The array and vision system still have to exist because
    // BaseRoomScene's update loop iterates them unconditionally.
    this.createGuards();

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // The way out, kept open so the level is completable while it is built.
    // Move it once the new layout exists.
    this.createExit(
      rooftopOffsetX + 240,
      rooftopOffsetY + 240,
      64,
      64,
      "EndingScene",
      "victory"
    );

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
