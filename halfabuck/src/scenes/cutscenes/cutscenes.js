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
   * The reveal, on arriving in the Executive Wing.
   *
   * Composited rather than a sequence: a Midtown office behind, then Gabe
   * sliding in from the left and the captor from the right. The two character
   * layers are exported at full frame size with transparent backgrounds and
   * aligned to the background, so they share its transform and only their x
   * needs animating.
   */
  villain_reveal: {
    type: "layered",
    duration: 13800,
    background: "cs_reveal_bg",
    layers: [
      { image: "cs_reveal_gabe",    from: "left",  delay: 250, duration: 850 },
      { image: "cs_reveal_villain", from: "right", delay: 850, duration: 850 },
    ],
    // He talks. Split into beats rather than one block: at 10px in a 384-wide
    // canvas the whole speech would be an unreadable wall.
    captions: [
      { at: 2000, until: 4400,  text: "HEARD IT WAS YOUR BIRTHDAY." },
      { at: 4400, until: 7800,  text: "AND YOUR CAPTAIN WOKE, COMMY-LOVING ASS IS NOW AT AN END." },
      { at: 7800, until: 10200, text: "YOUR END WILL BE SO GREAT." },
      { at: 10200, until: 13600, text: "THE GREATEST END OF ALL TIME, THEY TELL ME." },
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
export const ALL_CUTSCENE_FRAMES = Object.values(CUTSCENES).flatMap((c) => [
  ...(c.frames || []).map((f) => f.image),
  ...(c.background ? [c.background] : []),
  ...(c.layers || []).map((l) => l.image),
]);
