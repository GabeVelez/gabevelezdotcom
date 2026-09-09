import Phaser from "phaser";

/**
 * The transformed villain, on the roof.
 *
 * Not a Guard. A guard patrols, sees, doubts and forgets; this thing knows
 * exactly where you are and is walking toward you. It has no cone and nothing
 * to break line of sight with, because giving it one would invite people to
 * hide from something that cannot be hidden from.
 *
 * Four states, and the whole fight is in the third and fourth:
 *
 *   STALK    walks at you, slower than you move. You can open ground; closing
 *            it again is what builds the pressure.
 *   WIND UP  plants and rears back within reach. The tell. He locks his
 *            direction here, to the nearest of the four the sheet can draw.
 *   RUSH     twice your speed, straight, and CANNOT STEER. You do not outrun
 *            it, you step out of its lane.
 *   RECOVER  overshot and stopped. Cannot turn, cannot grab. This is the
 *            window: to put ground between you, or to line up the shot.
 *
 * Contact in any state ends the run.
 */
export const MonsterState = {
  ENTERING: "entering",
  STALK: "stalk",
  WINDUP: "windup",
  RUSH: "rush",
  RECOVER: "recover",
  DOWN: "down",
};

export class Monster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config = {}) {
    super(scene, x, y, "villain-big", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.5); // 152px cells, so he stands about 50px on screen
    this.setOrigin(0.5, 1.0);
    this.setDepth(12);

    // A feet box, like everything else that walks in this game. The sprite is
    // 152 square and mostly empty air around a lunging arm.
    const bw = 69.2, bh = 45.8;
    this.body.setSize(bw, bh);
    this.body.setOffset((152 - bw) / 2, 152 - bh);
    this.body.setImmovable(false);

    this.stalkSpeed = config.stalkSpeed ?? 52;
    this.rushSpeed = config.rushSpeed ?? 165;
    this.windupMs = config.windupMs ?? 400;
    this.rushMs = config.rushMs ?? 520;
    this.recoverMs = config.recoverMs ?? 800;
    this.commitRange = config.commitRange ?? 90;
    this.grabRadius = config.grabRadius ?? 22;
    // He is 50px tall with an arm thrown out well past his feet, and the grab
    // was measured foot to foot - so his hand could be through you while the
    // check said 40px clear. During a lunge the reach is taken from a point
    // out in front of him instead, which is where the sprite actually is.
    this.reach = config.reach ?? 30;
    this.reachRadius = config.reachRadius ?? 26;
    // He aims where you are going, not where you are. Without this a committed
    // rush is beaten by walking in any direction at all, since he arrives at
    // the spot you have already left; with it, running in a straight line is
    // punished and the correct answer is to change direction on the tell.
    this.leadSeconds = config.leadSeconds ?? 0.45;

    // Nothing is on the roof until the entrance plays. Ten seconds of an
    // empty deck is what makes the landing land.
    this.setVisible(false);

    this.state = MonsterState.ENTERING;
    this.timer = 0;
    this.facing = "down";
    this.rushDir = { x: 0, y: 1 };
    this.body.enable = false; // until he lands
  }

  get isRecovering() {
    return this.state === MonsterState.RECOVER;
  }

  /** Nearest of the four directions the sheet can draw. */
  _cardinal(dx, dy) {
    return Math.abs(dx) > Math.abs(dy)
      ? (dx < 0 ? "left" : "right")
      : (dy < 0 ? "up" : "down");
  }

  _play(kind, dir) {
    const key = `monster_${kind}_${dir}`;
    if (this.anims.currentAnim?.key !== key) this.anims.play(key, true);
  }

  /** Hold one frame of an animation without running it. */
  _pose(kind, dir, frame) {
    this.anims.stop();
    this.setFrame(({ right: 0, left: 1, down: 2, up: 3 }[dir] + (kind === "rush" ? 4 : 0)) * 5 + frame);
  }

  update(dt) {
    if (this.state === MonsterState.ENTERING || this.state === MonsterState.DOWN) return;

    const player = this.scene.player;
    if (!player?.body || !this.body) return;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    switch (this.state) {
      case MonsterState.STALK: {
        this.facing = this._cardinal(dx, dy);
        this._play("walk", this.facing);
        const len = dist || 1;
        this.body.setVelocity((dx / len) * this.stalkSpeed, (dy / len) * this.stalkSpeed);
        if (dist <= this.commitRange) this._enter(MonsterState.WINDUP);
        break;
      }

      case MonsterState.WINDUP: {
        this.body.setVelocity(0, 0);
        this.timer -= dt;
        if (this.timer <= 0) {
          // Direction is locked at the END of the wind-up, not the start, so
          // the tell is honest: where he is pointing when he goes is where he
          // goes, and stepping aside during it actually works.
          const pv = player.body.velocity;
          const ax = dx + pv.x * this.leadSeconds;
          const ay = dy + pv.y * this.leadSeconds;
          this.facing = this._cardinal(ax, ay);
          this.rushDir = Math.abs(ax) > Math.abs(ay)
            ? { x: Math.sign(ax) || 1, y: 0 }
            : { x: 0, y: Math.sign(ay) || 1 };
          this._enter(MonsterState.RUSH);
        } else {
          this._pose("rush", this._cardinal(dx, dy), 0);
        }
        break;
      }

      case MonsterState.RUSH: {
        this._play("rush", this.facing);
        this.body.setVelocity(this.rushDir.x * this.rushSpeed, this.rushDir.y * this.rushSpeed);
        this.timer -= dt;
        // Ends on time, or early against a wall - either way he is spent.
        const stopped = this.body.blocked.left || this.body.blocked.right ||
                        this.body.blocked.up || this.body.blocked.down;
        if (this.timer <= 0 || stopped) this._enter(MonsterState.RECOVER);
        break;
      }

      case MonsterState.RECOVER: {
        this.body.setVelocity(0, 0);
        this._pose("rush", this.facing, 4);
        this.timer -= dt;
        if (this.timer <= 0) this._enter(MonsterState.STALK);
        break;
      }
    }

    // Measured AFTER he has moved, not before. Checking the distance from the
    // top of update tested last frame's position, which at 165px/s is most of
    // a body behind where he actually is.
    if (this._grabbed(player)) this.scene.playerCaught?.("grabbed");
  }

  _grabbed(player) {
    if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= this.grabRadius) {
      return true;
    }
    // Mid-lunge the arm is out, so test the hand as well as the body.
    if (this.state !== MonsterState.RUSH && this.state !== MonsterState.WINDUP) return false;
    const d = this.state === MonsterState.RUSH
      ? this.rushDir
      : { right: { x: 1, y: 0 }, left: { x: -1, y: 0 }, down: { x: 0, y: 1 }, up: { x: 0, y: -1 } }[this.facing];
    const hx = this.x + d.x * this.reach;
    const hy = this.y + d.y * this.reach - 8; // his hand rides above his feet
    return Phaser.Math.Distance.Between(hx, hy, player.x, player.y) <= this.reachRadius;
  }

  _enter(state) {
    this.state = state;
    if (state === MonsterState.WINDUP) this.timer = this.windupMs;
    if (state === MonsterState.RUSH) this.timer = this.rushMs;
    if (state === MonsterState.RECOVER) this.timer = this.recoverMs;
  }

  /**
   * The entrance. He is not walked on, he arrives.
   *
   * In a top-down view a fall has to be sold by something other than the fall
   * itself, so a shadow appears on the deck first and grows: it says both that
   * something is coming and exactly where it will land, which is what makes it
   * dramatic rather than merely sudden.
   */
  dropIn(onLanded) {
    const scene = this.scene;
    const landX = this.x, landY = this.y;

    // A shadow on the deck that grows in step with him. It says both that
    // something is coming and exactly where it will land, which is what makes
    // this dramatic rather than merely sudden.
    const shadow = scene.add.ellipse(landX, landY, 10, 5, 0x000000, 0.5).setDepth(4);

    // Scale, not position. Up-screen in a top-down view is AWAY, not UP, so
    // dropping him in from above the frame read as walking in from the north
    // and he was off screen for most of it. Falling toward the floor is
    // something getting BIGGER, then settling to its real size - so he starts
    // at three times scale, right on the spot, and comes down on top of you
    // in full view the whole way.
    // 1.4 puts him about 140px tall on a 180px screen for the first instant -
    // enough to fill it without his head being cropped off the top of the
    // frame, which is what a larger start does.
    const START = 1.4, END = 0.5;
    this.setScale(START);
    this.setPosition(landX, landY - 30);
    this._pose("walk", "down", 0);
    this.setAlpha(0);
    this.setVisible(true);

    scene.tweens.add({ targets: this, alpha: 1, duration: 140 });
    // A rumble under the descent, so the impact is the end of something rather
    // than the whole event.
    scene.cameras.main.shake(600, 0.003);
    scene.tweens.add({
      targets: shadow,
      scaleX: 5.5, scaleY: 5.5,
      alpha: 0.62,
      duration: 620,
      ease: "Quad.easeIn",
    });

    scene.tweens.add({
      targets: this,
      scaleX: END, scaleY: END,
      y: landY,
      duration: 620,
      ease: "Quad.easeIn",
      onComplete: () => {
        scene.cameras.main.shake(380, 0.014);
        shadow.destroy();

        for (let i = 0; i < 14; i++) {
          const a = (Math.PI * 2 * i) / 14;
          const p = scene.add.circle(landX, landY - 4, 3, 0x8a8578, 0.55).setDepth(11);
          scene.tweens.add({
            targets: p,
            x: landX + Math.cos(a) * (30 + Math.random() * 24),
            y: landY - 4 + Math.sin(a) * (13 + Math.random() * 11),
            alpha: 0,
            duration: 560,
            onComplete: () => p.destroy(),
          });
        }

        // A beat stood over the crater before he comes for you.
        scene.time.delayedCall(620, () => {
          this.body.enable = true;
          this._enter(MonsterState.STALK);
          if (onLanded) onLanded();
        });
      },
    });
  }

  /** The rocket lands. */
  defeat() {
    this.state = MonsterState.DOWN;
    if (this.body) { this.body.setVelocity(0, 0); this.body.enable = false; }
    this.anims.stop();
  }
}
