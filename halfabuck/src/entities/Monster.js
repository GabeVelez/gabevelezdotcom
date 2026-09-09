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
    this.grabRadius = config.grabRadius ?? 20;
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

    if (dist <= this.grabRadius) this.scene.playerCaught?.("grabbed");
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

    const shadow = scene.add.ellipse(landX, landY, 8, 4, 0x000000, 0.55);
    shadow.setDepth(4);

    this.setVisible(false);
    this.setPosition(landX, landY - 260);
    this.setScale(0.95);

    scene.tweens.add({ targets: shadow, scaleX: 7, scaleY: 7, duration: 620, ease: "Quad.easeIn" });

    scene.time.delayedCall(300, () => {
      this.setVisible(true);
      this._pose("walk", "down", 0);
      scene.tweens.add({
        targets: this,
        y: landY,
        scaleX: 0.5, scaleY: 0.5,
        duration: 340,
        ease: "Quad.easeIn",
        onComplete: () => {
          scene.cameras.main.shake(360, 0.012);
          shadow.destroy();

          // Dust, thrown outward from the impact.
          for (let i = 0; i < 12; i++) {
            const a = (Math.PI * 2 * i) / 12;
            const p = scene.add.circle(landX, landY - 4, 3, 0x8a8578, 0.5).setDepth(11);
            scene.tweens.add({
              targets: p,
              x: landX + Math.cos(a) * (28 + Math.random() * 22),
              y: landY - 4 + Math.sin(a) * (12 + Math.random() * 10),
              alpha: 0,
              duration: 520,
              onComplete: () => p.destroy(),
            });
          }

          // A beat on the deck before he starts hunting.
          scene.time.delayedCall(520, () => {
            this.body.enable = true;
            this._enter(MonsterState.STALK);
            if (onLanded) onLanded();
          });
        },
      });
    });
  }

  /** The rocket lands. */
  defeat() {
    this.state = MonsterState.DOWN;
    if (this.body) { this.body.setVelocity(0, 0); this.body.enable = false; }
    this.anims.stop();
  }
}
