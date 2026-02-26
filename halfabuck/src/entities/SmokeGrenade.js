import Phaser from "phaser";
import { Item } from "./Item.js";

/**
 * Smoke Grenade Item
 * Throwable item that creates a smoke cloud on deployment
 */
export class SmokeGrenade extends Item {
  constructor(scene, x, y) {
    super(scene, x, y, {
      id: "smoke_grenade",
      name: "Smoke Grenade",
      description: "Deploys a smoke cloud that blocks vision. Press 2 to throw.",
      texture: "smoke_grenade",
      displaySize: 24,
      depth: 5,
      interactionRange: 45,
      hasCollision: false
    });
  }

  /**
   * Deploy smoke grenade at player's position
   * @param {Player} player - The player deploying the grenade
   * @param {Phaser.Scene} scene - The scene where deployment happens
   */
  deploy(player, scene) {
    // Create smoke cloud at player's position
    const SmokeCloud = require("./SmokeCloud.js").SmokeCloud;
    const smokeCloud = new SmokeCloud(scene, player.x, player.y);

    // Add smoke cloud to scene's smoke clouds array
    if (!scene.smokeClouds) {
      scene.smokeClouds = [];
    }
    scene.smokeClouds.push(smokeCloud);

    // Play deployment sound if available
    if (scene.registry.get("soundEnabled") && scene.sound.get("smoke_deploy")) {
      scene.sound.play("smoke_deploy", { volume: 0.5 });
    }

    // Trigger INVESTIGATE state for nearby guards
    if (scene.guards) {
      const investigateRadius = 150; // Guards within this radius will investigate

      for (const guard of scene.guards) {
        if (!guard.active || guard.isKnockedOut || guard.isHidden) continue;

        const distance = Phaser.Math.Distance.Between(
          guard.x, guard.y,
          player.x, player.y
        );

        if (distance <= investigateRadius) {
          // Transition to INVESTIGATE state with smoke position
          if (guard.stateMachine && guard.stateMachine.transition) {
            const GuardStates = require("./Guard.js").GuardStates;
            guard.stateMachine.transition(GuardStates.INVESTIGATE, {
              x: player.x,
              y: player.y,
              percent: 0.4, // Mid-level alert (between suspicious and chase)
              searchDuration: 8000 // 8 seconds investigation
            });
          }
        }
      }
    }

    return smokeCloud;
  }
}
