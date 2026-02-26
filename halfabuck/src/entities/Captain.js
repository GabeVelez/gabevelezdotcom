import { Guard } from "./Guard.js";

/**
 * Captain Guard - High-tier guard between Officer and Overseer
 * Vision: 115px range, 85° angle
 * Speed: Fast (60) - faster than other guards
 * Introduction: Level 8 (Maintenance Tunnel)
 */
export class Captain extends Guard {
  constructor(scene, x, y, waypoints) {
    super(scene, x, y, waypoints);

    // Captain stats (faster and stronger vision than Officer)
    this.visionDistance = 115;
    this.visionAngle = 85;
    this.baseSpeed = 60;
    this.speed = 60;

    // Visual distinction - Orange tint
    this.setTint(0xff6600);
  }
}
