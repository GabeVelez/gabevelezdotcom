import { Guard } from "./Guard.js";

export class LeadGuard extends Guard {
  constructor(scene, x, y, pathPoints = []) {
    super(scene, x, y, pathPoints);
    this.speed = 52;
    this.guardType = "lead";
  }
}
