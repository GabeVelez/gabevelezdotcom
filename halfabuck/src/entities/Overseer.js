import { Guard } from "./Guard.js";

export class Overseer extends Guard {
  constructor(scene, x, y, pathPoints = []) {
    super(scene, x, y, pathPoints);

    // Change to overseer sprite
    this.setTexture("overseer-front", 0);

    this.speed = 34;
    this.guardType = "overseer";
  }
}
