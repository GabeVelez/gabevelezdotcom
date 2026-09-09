import { BaseRoomScene } from "../BaseRoomScene.js";
import { SVGCollisionParser } from "../../utils/SVGCollisionParser.js";
import { Monster } from "../../entities/Monster.js";

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
 * Three acts. You walk out and head for the pad; he lands between you and it;
 * you stay alive until the chopper arrives with a weapon in it. Still to come:
 * the helicopter and the bazooka, so for now surviving the timer opens the
 * exit directly.
 */
const SURVIVE_MS = 45000;
const TRIGGER_X = 192;

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

    // The helipad, centred where the paint actually is. Shut until you have
    // held out; there is nothing to board before then.
    this.createExit(607, 141, 64, 64, "EndingScene", "victory");
    this.victoryExit = this._exits[this._exits.length - 1];
    this.victoryExit.triggered = true;

    // He is not on the roof yet. You get ten seconds of it being empty, which
    // is what makes the landing land.
    this.monster = new Monster(this, 400, 140);
    this.monsterArrived = false;
    this.surviveLeft = SURVIVE_MS;

    collisionBodies.forEach((body) => {
      this.physics.add.collider(this.player, body);
      this.physics.add.collider(this.monster, body);
    });

    this.cameras.main.setBounds(0, 0, this.roofWidth, this.roofHeight);
    this.cameras.main.startFollow(this.player, true);
  }

  update(time, delta) {
    this.updateBase(time, delta);
    if (!this.player?.body) return;

    if (!this.monsterArrived) {
      // Crossing a third of the way over, on your way to the pad.
      if (this.player.x >= TRIGGER_X) this._arrive();
      return;
    }

    this.monster.update(delta);

    if (this.surviveLeft > 0) {
      this.surviveLeft = Math.max(0, this.surviveLeft - delta);
      this.gameUI?.updateDetectionMeter(1 - this.surviveLeft / SURVIVE_MS);
      if (this.surviveLeft === 0) this._chopperArrives();
    }
  }

  /** He drops in between you and the helipad, and your kit stops working. */
  _arrive() {
    this.monsterArrived = true;
    this._scripted = true;
    this.player.body.setVelocity(0, 0);

    this.gameUI?.setMeterMode("survive");
    this.gameUI?.updateDetectionMeter(0);

    // The box and the smoke are dead from here. Nine levels of tricks, gone
    // the moment he arrives, and taken away where you can see it happen.
    this.gameUI?.setSlotsDisabled([0, 1]);
    this.inventoryFrozen = true;

    this.monster.dropIn(() => {
      this._scripted = false;
      this.gameUI?.showItemNotification("easter_egg", "Stay alive.");
    });
  }

  /** Forty-five seconds later. */
  _chopperArrives() {
    this.victoryExit.triggered = false;
    this.gameUI?.showItemNotification("easter_egg", "Get to the chopper.");
  }
}
