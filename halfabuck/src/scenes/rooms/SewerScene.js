import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Sewer - Dark transitional space beneath the cell
 * Small safe area with ladder exit to warehouse corridor
 */
export class SewerScene extends BaseRoomScene {
  constructor() {
    super("SewerScene");
  }

  create() {
    // Sewer is 288x192 (18 tiles × 12 tiles)
    // Center on 320x180 canvas: offset (16, -6)
    this.sewerOffsetX = 16;
    this.sewerOffsetY = -6;

    // Add sewer background image immediately
    const sewerBg = this.add.image(this.sewerOffsetX, this.sewerOffsetY, "sewer_layout");
    sewerBg.setOrigin(0, 0);
    sewerBg.setDisplaySize(288, 192);
    sewerBg.setDepth(0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    const { width, height } = this.scale;
    const sewerOffsetX = this.sewerOffsetX;
    const sewerOffsetY = this.sewerOffsetY;

    // Create invisible tilemap for waypoint/vision system (all walkable)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 18,
      height: 12
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.x = sewerOffsetX;
    ground.y = sewerOffsetY;
    ground.fill(1, 0, 0, 18, 12); // Fill all tiles as walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    // Load collision from SVG file with offset applied
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/sewer-collision.svg",
      sewerOffsetX,
      sewerOffsetY
    );

    // Store for reference (needed for vision system and player collision)
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // Player spawn position depends on entry direction
    let playerX = sewerOffsetX + (2.5 * 16); // Default: left walkable platform
    let playerY = sewerOffsetY + (5 * 16); // 1/2 tile south from original (was 4.5)

    if (this.entryDirection === "north") {
      // Coming from corridor (down the ladder) - spawn at right side near ladder
      playerX = sewerOffsetX + (15 * 16); // Slightly left of ladder (column 15)
      playerY = sewerOffsetY + (5.5 * 16); // Below ladder exit
      console.log(`Spawning from corridor at (${playerX}, ${playerY})`);
    }

    this.createPlayer(playerX, playerY);

    this.createGuards();
    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Exit zone at ladder on the right side
    // Positioned left of the narrow right wall to be accessible, 10px to the right
    const exitX = sewerOffsetX + (16 * 16) + 10; // Column 16 + 10px offset
    const exitY = sewerOffsetY + (2 * 16);
    this.createExit(exitX, exitY, 32, 64, "WarehouseCorridorScene", "east"); // Width 32 instead of 16

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

    this.cameras.main.setBounds(sewerOffsetX, sewerOffsetY, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
