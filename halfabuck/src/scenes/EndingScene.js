import Phaser from "phaser";

export class EndingScene extends Phaser.Scene {
  constructor() {
    super("EndingScene");
  }

  create() {
    const { width, height } = this.scale;
    this.add.text(8, 8, "MISSION COMPLETE\nHAPPY 50TH BIRTHDAY\nSTATUS: LEGEND", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#ffffff"
    });

    this.add.text(8, height - 24, "Press SPACE / Tap to restart", {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#ffffff"
    });

    this.input.keyboard.once("keydown-SPACE", () => this.scene.start("IntroScene"));
    this.input.once("pointerdown", () => this.scene.start("IntroScene"));
  }
}
