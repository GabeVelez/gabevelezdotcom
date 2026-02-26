import { BaseRoomScene } from "../BaseRoomScene.js";
import { Guard } from "../../entities/Guard.js";
import { LeadGuard } from "../../entities/LeadGuard.js";
import { Officer } from "../../entities/Officer.js";
import { SecurityKeycard } from "../../entities/SecurityKeycard.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Security Office - Level 7
 * 400×352 pixels with 4 guards (2 Lead, 1 Regular, 1 Overseer)
 * Guard 3 (Overseer) activates when Security Keycard is collected
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

    if (this.entryDirection === "north") {
      // Coming from Maintenance Tunnel (top exit)
      playerX = 240;
      playerY = 60; // Below the exit
      console.log(`Spawning from Maintenance Tunnel at (${playerX}, ${playerY})`);
    }

    this.createPlayer(playerX, playerY);

    // Create guards
    this.createGuards();

    // Lead Guard 1 - Patrolling main area
    const guard1 = new LeadGuard(this, 100, 100, [
      { x: 100, y: 100 },
      { x: 200, y: 100 },
      { x: 200, y: 200 },
      { x: 100, y: 200 }
    ]);
    guard1.setDepth(10);
    this.guards.push(guard1);

    // Lead Guard 2 - Patrolling central corridor
    const guard2 = new LeadGuard(this, 200, 250, [
      { x: 150, y: 250 },
      { x: 250, y: 250 }
    ]);
    guard2.setDepth(10);
    this.guards.push(guard2);

    // Regular Guard - Patrolling near locked room
    const guard3 = new Guard(this, 300, 150, [
      { x: 300, y: 150 },
      { x: 350, y: 150 },
      { x: 350, y: 200 },
      { x: 300, y: 200 }
    ]);
    guard3.setDepth(10);
    this.guards.push(guard3);

    // Officer Guard - Starts inactive, activates when keycard collected
    const guard4 = new Officer(this, 240, 100, [
      { x: 200, y: 100 },
      { x: 280, y: 100 }
    ]);
    guard4.setDepth(10);
    guard4.active = false;
    guard4.visible = false;
    this.guards.push(guard4);

    // Store reference to guard4 for activation
    this.inactiveGuard = guard4;

    // Create Security Keycard at (336,176) inside locked room
    const keycard = new SecurityKeycard(this, 336, 176, {
      keycardId: "security-office",
      onCollect: (player, scene) => {
        // Activate Guard 4 when keycard is collected
        console.log("Security Keycard collected! Activating Overseer guard...");
        if (scene.inactiveGuard) {
          scene.inactiveGuard.active = true;
          scene.inactiveGuard.visible = true;

          // Play alert sound
          if (scene.registry.get("soundEnabled")) {
            scene.sound.play("alert", { volume: 0.6 });
          }

          // Visual feedback - flash the guard
          scene.tweens.add({
            targets: scene.inactiveGuard,
            alpha: 0.3,
            duration: 200,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
              scene.inactiveGuard.setAlpha(1);
            }
          });
        }
      }
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

    // Add colliders for guards
    for (const g of this.guards) {
      collisionBodies.forEach(body => {
        this.physics.add.collider(g, body);
      });
    }

    // Camera
    this.cameras.main.setBounds(officeOffsetX, officeOffsetY, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
