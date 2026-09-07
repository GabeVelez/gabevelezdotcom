import Phaser from "phaser";
import { Guard } from "./Guard.js";

/**
 * The villain, in his human form, standing between the player and his desk.
 *
 * He is a Guard so the vision system gives him a cone, a detection meter and
 * wall occlusion for free, but none of the patrol, waypoint or alert-state
 * machinery applies to him: he has one post to hold and one thing to do. So
 * update() is replaced outright rather than extended.
 *
 * Two states, no state machine:
 *
 *   guarding   stand at the desk facing down the room. Drift back to the post
 *              if he has wandered off it.
 *   charging   run straight at the player. Entered when the detection meter
 *              fills, held for lockMs after he loses sight, so breaking his
 *              cone buys distance rather than switching him off instantly.
 *
 * The meter is a warning, not a loss condition: what gets you is the grab.
 * capturesOnDetection tells BaseRoomScene to keep showing his meter in the HUD
 * but not to end the run when it tops out.
 */
export class Villain extends Guard {
  constructor(scene, x, y, config = {}) {
    super(scene, x, y, []);

    this.setTexture("villain-front", 0);
    this.setScale(0.5); // 64px frames, same 2:1 as the player
    this.setOrigin(0.5, 1.0);

    // Same body as the player's, so the gaps he can be squeezed through are
    // the ones the room looks like it offers.
    const bodyW = this.width * 0.9;
    const bodyH = this.height * 0.5;
    this.body.setSize(bodyW, bodyH);
    this.body.setOffset((this.width - bodyW) / 2, this.height - bodyH);

    this.guardType = "villain";
    this.capturesOnDetection = false;

    this.homeX = x;
    this.homeY = y;

    // The player walks at 80. He is deliberately slower in a straight line, so
    // a sprint across open floor is survivable and the desk is what saves you.
    this.chaseSpeed = config.chaseSpeed ?? 66;
    this.returnSpeed = config.returnSpeed ?? 48;
    this.grabRadius = config.grabRadius ?? 18;
    this.lockMs = config.lockMs ?? 1800;

    // The cone alone is not enough. It only points down the room, the desk
    // blocks his sight through it, and the water can be reached over the far
    // edge — so a cone-only villain can be walked around and robbed from
    // behind, which is the opposite of the point. Anything this close is
    // noticed regardless of where he is looking or what is between them: this
    // is his office and you are leaning on his desk. It is sized so that every
    // position the water can be picked up from is inside it, which is what
    // makes moving him the problem to solve.
    this.awareRadius = config.awareRadius ?? 78;

    // Standing dead still facing one way makes the far side of his desk a
    // permanent blind spot. He sweeps instead, so getting behind him is a
    // question of timing rather than a free pass.
    this.sweepArc = config.sweepArc ?? Phaser.Math.DegToRad(38);
    this.sweepMs = config.sweepMs ?? 3200;
    this._sweepT = 0;

    this.lockTimer = 0;
    this.defeated = false;

    this._stuckMs = 0;
    this._lastX = x;
    this._lastY = y;
    this._sidestep = 0;

    this.setDepth(9);
  }

  get isCharging() {
    return this.lockTimer > 0;
  }

  update(dt) {
    if (this.defeated || !this.body) return;

    const player = this.scene.player;
    if (!player || !player.body) return;

    const meter = this.scene.vision?.getMeter(this) ?? 0;
    const near = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= this.awareRadius;

    if (meter >= 1 || near) {
      this.lockTimer = this.lockMs;
    } else if (this.lockTimer > 0) {
      this.lockTimer = Math.max(0, this.lockTimer - dt);
    }

    if (this.lockTimer > 0) {
      this._charge(player, dt);
    } else {
      this._returnToPost(dt);
    }

    this._playWalkAnimation();
    this._checkGrab(player);
  }

  _charge(player, dt) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const len = Math.hypot(dx, dy) || 1;

    let ax = dx / len;
    let ay = dy / len;

    // Straight-line pursuit walks him into the desk and holds him there. If he
    // has been trying to move and hasn't actually moved, steer sideways so he
    // slides around whatever is in the way instead of pressing into it.
    const moved = Math.hypot(this.x - this._lastX, this.y - this._lastY);
    this._stuckMs = moved < 0.4 ? this._stuckMs + dt : 0;
    this._lastX = this.x;
    this._lastY = this.y;

    if (this._stuckMs > 200) {
      if (this._sidestep === 0) this._sidestep = player.x < this.x ? -1 : 1;
      const px = -ay * this._sidestep;
      const py = ax * this._sidestep;
      ax = ax * 0.35 + px;
      ay = ay * 0.35 + py;
      const l2 = Math.hypot(ax, ay) || 1;
      ax /= l2;
      ay /= l2;
    } else {
      this._sidestep = 0;
    }

    this.body.setVelocity(ax * this.chaseSpeed, ay * this.chaseSpeed);
  }

  _returnToPost(dt) {
    const dx = this.homeX - this.x;
    const dy = this.homeY - this.y;
    const len = Math.hypot(dx, dy);

    if (len < 3) {
      this.body.setVelocity(0, 0);
      // Standing still, the vision system leaves facing wherever it last was,
      // so drive it here: a slow sweep either side of straight down the room.
      this._sweepT += dt;
      if (this.vision) {
        const phase = (this._sweepT / this.sweepMs) * Math.PI * 2;
        this.vision.facing = Math.PI / 2 + Math.sin(phase) * this.sweepArc;
      }
      return;
    }

    this.body.setVelocity(
      (dx / len) * this.returnSpeed,
      (dy / len) * this.returnSpeed
    );
  }

  _playWalkAnimation() {
    const v = this.body.velocity;
    const moving = Math.abs(v.x) + Math.abs(v.y) > 1;

    if (!moving) {
      this.anims.stop();
      this.setTexture("villain-front", 0);
      return;
    }

    const dir = Math.abs(v.x) > Math.abs(v.y)
      ? (v.x < 0 ? "left" : "right")
      : (v.y < 0 ? "up" : "down");

    this.anims.play(`villain_walk_${dir}`, true);
  }

  _checkGrab(player) {
    if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) > this.grabRadius) {
      return;
    }
    this.scene.playerCaught?.("grabbed");
  }

  /** Called when the water lands. He stops dead and stops looking. */
  defeat() {
    this.defeated = true;
    this.lockTimer = 0;
    if (this.body) this.body.setVelocity(0, 0);
    if (this.vision) this.vision.distance = 0;
  }
}
