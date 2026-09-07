/**
 * Music that survives scene changes.
 *
 * Phaser tears down a scene's sounds when it stops, but a track that starts in
 * a cutscene and should carry on into the room after it has to outlive both.
 * The active track is held in the registry, which is global to the game.
 *
 * Asking for the track that is already playing is a no-op, so a scene can
 * declare its music on every create() without restarting it.
 */

const ACTIVE = "activeMusic";

/**
 * @param {Phaser.Scene} scene
 * @param {string|null} key   audio key, or null to stop whatever is playing
 */
export function playMusic(scene, key, { loop = true, volume = 0.5 } = {}) {
  const current = scene.registry.get(ACTIVE);

  if (key && current?.key === key) {
    // Already the right track. Make sure it is audible and leave it alone.
    if (scene.registry.get("soundEnabled") && !current.sound.isPlaying) {
      current.sound.play();
    }
    return current.sound;
  }

  if (current?.sound) {
    current.sound.stop();
    current.sound.destroy();
    scene.registry.set(ACTIVE, null);
  }

  if (!key) return null;

  // A track whose file is missing should not take the game down with it.
  if (!scene.cache.audio.exists(key)) {
    console.info(`[music] "${key}" is not loaded; skipping`);
    return null;
  }

  const sound = scene.sound.add(key, { loop, volume });
  scene.registry.set(ACTIVE, { key, sound });
  if (scene.registry.get("soundEnabled")) sound.play();
  return sound;
}

export function stopMusic(scene) {
  playMusic(scene, null);
}

export function getActiveMusic(scene) {
  return scene.registry.get(ACTIVE)?.sound ?? null;
}
