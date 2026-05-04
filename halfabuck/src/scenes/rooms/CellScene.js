import { BaseRoomScene } from "../BaseRoomScene.js";
import { Item } from "../../entities/Item.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";
import { SVGExitParser } from "../../utils/SVGExitParser.js";

/**
 * Cell with Bed - Starting room
 * Player wakes up here and must escape to the corridor
 */
export class CellScene extends BaseRoomScene {
  constructor() {
    super("CellScene");
    this.levelLabel = "LVL 1: Cell";

    // Toilet easter egg tracking
    this.toiletTimeOnSeat = 0;
    this.toiletFlushTriggered = false;
    this.toiletFlushDuration = 20000; // 20 seconds in milliseconds
  }

  create() {
    const { width, height } = this.scale;

    // Cell is 240x160 (15 tiles × 10 tiles)
    // Center on 320x180 canvas: offset (40, 10)
    this.cellOffsetX = 40;
    this.cellOffsetY = 10;

    // Add cell background image immediately (scale to 240×160)
    const cellBg = this.add.image(this.cellOffsetX, this.cellOffsetY, "cell_layout");
    cellBg.setOrigin(0, 0);
    cellBg.setDisplaySize(240, 160); // 15 tiles × 10 tiles at 16px each
    cellBg.setDepth(0);

    // Fade in from black (smooth transition from cutscene)
    this.cameras.main.fadeIn(2500, 0, 0, 0);

    // Initialize the rest asynchronously
    this.initializeScene();
  }

  async initializeScene() {
    const { width, height } = this.scale;
    const cellOffsetX = this.cellOffsetX;
    const cellOffsetY = this.cellOffsetY;

    // Create invisible tilemap for waypoint/vision system (all walkable)
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 15,
      height: 10
    });

    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.x = cellOffsetX;
    ground.y = cellOffsetY;
    ground.fill(1, 0, 0, 15, 10); // Fill all tiles as walkable
    ground.setVisible(false);
    this.groundLayer = ground;

    // Load collision from SVG file with offset applied
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/cell-collision.svg",
      cellOffsetX,
      cellOffsetY
    );

    // Store for reference (needed for vision system)
    this.collisionBodies = collisionBodies;

    // Create base systems
    this.createBaseSystems();

    // Load exit data from SVG (but manually create exit for special hole logic)
    const exitData = await SVGExitParser.parseSVGFile("assets/exits/cell-exits.svg", cellOffsetX, cellOffsetY);

    // Use SVG spawn position (blue circle)
    const spawnPos = exitData?.enterSpawn || { x: cellOffsetX + 112, y: cellOffsetY + 80 };
    this.createPlayer(spawnPos.x, spawnPos.y);

    // Create guards array (no guards in cell - it's a prison cell)
    this.createGuards();

    // Setup vision system
    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // Create exit from SVG data (hole in bottom-right corner)
    if (exitData?.exitZone) {
      const xz = exitData.exitZone;
      const centerX = xz.x + xz.width / 2;
      const centerY = xz.y + xz.height / 2;
      this.createExit(centerX, centerY, xz.width, xz.height, "SewerScene", "south");

      // Mark this exit as a "hole" type for special animation
      if (this._exits && this._exits.length > 0) {
        this._exits[0].isHole = true;
        // Disable exit initially (until box is collected)
        this._exits[0].triggered = true;
      }
    }

    // Create cardboard box as interactable item with collision
    // Position over the hole exit zone (using SVG center)
    const holeX = exitData?.exitZone ? exitData.exitZone.x + exitData.exitZone.width / 2 : cellOffsetX + (12 * 16) + 8;
    const holeY = exitData?.exitZone ? exitData.exitZone.y + exitData.exitZone.height / 2 : cellOffsetY + (8.5 * 16);
    const cardboardBox = new Item(this, holeX, holeY, {
      id: "cardboard_box",
      name: "Cardboard Box",
      description: "A sturdy cardboard box. Maybe it's hiding something?",
      texture: "cardboardbox",
      displaySize: 32,
      depth: 5,
      interactionRange: 45,
      hasCollision: true, // Enable physics collision
      onCollect: (player, scene) => {
        // Enable the hole exit when box is collected
        if (scene._exits && scene._exits.length > 0) {
          scene._exits[0].triggered = false;
          console.log("Hole exit enabled! You can now escape through the hole.");
        }
      }
    });

    // Add to scene's items array
    this.items.push(cardboardBox);

    // Setup physics - add colliders for all SVG collision bodies
    console.log(`Setting up colliders for ${collisionBodies.length} collision bodies with player at (${this.player.x}, ${this.player.y})`);
    collisionBodies.forEach((body, index) => {
      const collider = this.physics.add.collider(this.player, body);
      console.log(`Collider ${index} added: active=${collider.active}, body1=${!!collider.object1}, body2=${!!collider.object2}`);
    });

    // Add collision between player and cardboard box
    this.physics.add.collider(this.player, cardboardBox);

    // Camera - don't follow player, keep view centered on full canvas
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.scrollX = 0;
    this.cameras.main.scrollY = 0;
  }

  update(time, delta) {
    this.updateBase(time, delta);

    // Toilet easter egg: Check if player is sitting on toilet (top-right corner)
    if (this.player && !this.toiletFlushTriggered) {
      const toiletAreaX = this.cellOffsetX + 200; // Top-right area
      const toiletAreaY = this.cellOffsetY + 30;
      const toiletRadius = 20; // Radius around toilet

      const distanceToToilet = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        toiletAreaX, toiletAreaY
      );

      // Check if player is on toilet
      if (distanceToToilet <= toiletRadius) {
        this.toiletTimeOnSeat += delta;

        // Trigger flush after 20 seconds
        if (this.toiletTimeOnSeat >= this.toiletFlushDuration) {
          this.toiletFlushTriggered = true;

          // Play flush sound
          if (this.registry.get("soundEnabled")) {
            this.sound.play("toilet_flush", { volume: 0.6 });
          }

          // Show a fun message
          if (this.gameUI && this.gameUI.showItemNotification) {
            this.gameUI.showItemNotification("easter_egg", "Don't forget to wipe...");
          }

          console.log("🚽 Toilet easter egg activated! Player sat for 20 seconds.");
        }
      } else {
        // Reset timer if player moves away from toilet
        if (this.toiletTimeOnSeat > 0 && this.toiletTimeOnSeat < this.toiletFlushDuration) {
          this.toiletTimeOnSeat = 0;
        }
      }
    }
  }
}
