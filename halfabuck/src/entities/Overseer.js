import { Guard } from "./Guard.js";

export class Overseer extends Guard {
  constructor(scene, x, y, pathPoints = []) {
    super(scene, x, y, pathPoints);
    this.speed = 34;
    this.guardType = "overseer";
  }
}
