import { Guard } from "./Guard.js";

/**
 * Officer Guard - Mid-tier guard between Lead Guard and Captain
 * Vision: 110px range, 90° angle
 * Speed: Normal (52)
 * Introduction: Level 6 (Loading Dock)
 */
export class Officer extends Guard {
  constructor(scene, x, y, waypoints) {
    super(scene, x, y, waypoints);

    // Officer stats (stronger than Lead, weaker than Captain)
    this.visionDistance = 110;
    this.visionAngle = 90;
    this.baseSpeed = 52;
    this.speed = 52;

    // Visual distinction - Blue tint
    this.setTint(0x3399ff);
  }
}
