/**
 * Cutscene definitions.
 *
 * Each entry is a list of frames. A frame is:
 *   image     texture key, loaded in BootScene
 *   duration  ms on screen (default 2000)
 *   text      caption drawn in the lower letterbox bar (optional)
 *   sound     audio key to play as the frame appears (optional)
 *   shake     camera shake duration in ms (optional)
 *
 * Frames whose texture is missing are skipped, so a cutscene can be wired into
 * the story before its art exists and will start playing the moment it lands.
 *
 * Art spec is in docs/CUTSCENE_PROMPT.md: 1536x640 (2.4:1), which fills the
 * window between the letterbox bars.
 */

export const CUTSCENES = {
  /**
   * Between Security Office and Executive Wing. The reveal: who took him.
   */
  villain_reveal: {
    frames: [
      { image: "cs_reveal_01", duration: 2600, text: "SO IT WAS YOU" },
      { image: "cs_reveal_02", duration: 2600 },
      { image: "cs_reveal_03", duration: 2600 },
    ],
  },

  /**
   * The confrontation. Player presses the water, and the throw plays out as
   * three beats rather than an in-game arc: the glass in flight, the hit, and
   * the villain screaming.
   */
  water_throw: {
    frames: [
      { image: "cs_water_01", duration: 1400, sound: "box_toggle" },
      { image: "cs_water_02", duration: 1800, sound: "ground_impact", shake: 240 },
      { image: "cs_water_03", duration: 2600, text: "AAAAARGH!" },
    ],
  },

  /**
   * After the roof door. He is not finished, he is changing.
   */
  villain_transform: {
    frames: [
      { image: "cs_transform_01", duration: 2200 },
      { image: "cs_transform_02", duration: 2200, shake: 300 },
      { image: "cs_transform_03", duration: 2600, text: "THAT IS NOT HIM ANY MORE" },
    ],
  },

  /**
   * Victory. Helicopter, cigar, explosions behind.
   */
  escape: {
    frames: [
      { image: "cs_escape_01", duration: 2400, shake: 400 },
      { image: "cs_escape_02", duration: 2400 },
      { image: "cs_escape_03", duration: 3200, text: "HAPPY BIRTHDAY TO ME" },
    ],
  },
};

/**
 * Every frame key, so BootScene can attempt to load them in one pass.
 * Missing files fail quietly and their frames are skipped at runtime.
 */
export const ALL_CUTSCENE_FRAMES = Object.values(CUTSCENES).flatMap((c) =>
  c.frames.map((f) => f.image)
);
