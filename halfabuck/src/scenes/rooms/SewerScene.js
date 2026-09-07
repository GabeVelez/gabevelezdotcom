import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";
import { BASE_W } from "../../config/gameConfig.js";

/**
 * Sewer - Dark transitional space beneath the cell
 * Small safe area with ladder exit to warehouse corridor
 */
export class SewerScene extends BaseRoomScene {
  constructor() {
    super("SewerScene");
    this.levelLabel = "LVL 2: Sewer";
  }

  create() {
    // Sewer is 288x192 (18 tiles × 12 tiles)
    // Center on 320x180 canvas: offset (16, -6)
    this.sewerOffsetX = 48; // (384 - 288) / 2
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

    // Setup exits from SVG and get spawn position
    const spawnPos = await this.setupExitsFromSVG("assets/exits/sewer-exits.svg", {
      exitZone: { scene: "WarehouseCorridorScene", direction: "east", entryDirection: "north" }
    }, sewerOffsetX, sewerOffsetY);

    this.createPlayer(spawnPos.x, spawnPos.y);

    this.createGuards();
    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Add colliders for all SVG collision bodies
    collisionBodies.forEach(body => {
      this.physics.add.collider(this.player, body);
    });

    // Bottom UI barrier - prevents player from walking behind UI overlay
    const uiBarrier = this.add.rectangle(
      BASE_W / 2,  // Centre of the canvas
      170,         // Bottom 20 pixels (180 - 10)
      BASE_W,      // Full canvas width
      20,          // Barrier height
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
