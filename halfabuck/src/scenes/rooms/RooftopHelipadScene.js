import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";

/**
 * Rooftop Helipad - Level 10.
 *
 * 768 x 256 on a 384 x 180 screen, so it scrolls both ways. The deck is only
 * y 58 to 214 of that; everything above is the city seen from up here and
 * everything below is our own building falling away. Both bands are drawn,
 * neither is walkable, and the far one is more than twice the depth of the
 * near one because that lopsidedness is what reads as a tilted camera.
 *
 * The old offset scheme is gone. The art is authored at the level's own size
 * now, so the level starts at 0,0 like every other room and the collision SVG
 * needs no offset applied to it.
 *
 * Still to come: the monster, his entrance, the survive timer, the helicopter
 * and the bazooka. The exit is open in the meantime so the game can be played
 * end to end.
 */
export class RooftopHelipadScene extends BaseRoomScene {
  constructor() {
    super("RooftopHelipadScene");
    this.levelLabel = "LVL 10: Rooftop Helipad";
  }

  create() {
    this.roofWidth = 768;
    this.roofHeight = 256;

    const bg = this.add.image(0, 0, "rooftop_layout");
    bg.setOrigin(0, 0);
    bg.setDisplaySize(this.roofWidth, this.roofHeight);
    bg.setDepth(0);

    this.initializeScene();
  }

  async initializeScene() {
    // Walkable everywhere; the SVG bodies below do the actual blocking.
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 48,   // 768 / 16
      height: 16,  // 256 / 16
    });
    const tiles = map.addTilesetImage("warehouse_tiles");
    const ground = map.createBlankLayer("ground", tiles);
    ground.fill(1, 0, 0, 48, 16);
    ground.setVisible(false);
    this.groundLayer = ground;

    // Measured off the art rather than off the block-out: the far coping runs
    // y 51-57 and the near one y 215-221, so the deck is y 58 to 214.
    const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
      this,
      "assets/collision/rooftop-collision.svg"
    );
    this.collisionBodies = collisionBodies;

    this.createBaseSystems();

    // Out of the door in the left parapet, which the art puts at y 125-151.
    this.createPlayer(40, 146);

    // No guards up here - what hunts you is the monster, and he is not one.
    // The array and vision system still have to exist because BaseRoomScene's
    // update loop iterates them unconditionally.
    this.createGuards();

    this.setupVisionSystem(ground);
    this.buildWaypointNetwork(ground);

    // The helipad, centred where the paint actually is. Open for now; it will
    // be held shut until the monster is down.
    this.createExit(607, 141, 64, 64, "EndingScene", "victory");

    collisionBodies.forEach((body) => {
      this.physics.add.collider(this.player, body);
      for (const g of this.guards) this.physics.add.collider(g, body);
    });

    this.cameras.main.setBounds(0, 0, this.roofWidth, this.roofHeight);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
  }
}
