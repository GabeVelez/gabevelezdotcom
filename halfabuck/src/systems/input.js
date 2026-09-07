/**
 * Aggregates keyboard + touch input into a single logical input object.
 * Provides both isDown and justPressed (edge-trigger) flags.
 *
 * Move, and use an item slot. That is the whole control set. Items are picked
 * up by walking to them, so there is no interact key and no action button, and
 * the slot numbers are the same on the keyboard as they are on screen.
 */
export function createInputManager(scene, touchRef) {
  const keys = scene.input.keyboard.addKeys({
    up: "W",
    down: "S",
    left: "A",
    right: "D",
    up2: "UP",
    down2: "DOWN",
    left2: "LEFT",
    right2: "RIGHT",
    slot1: "ONE",
    slot2: "TWO",
    slot3: "THREE",
  });

  const prev = { slot1: false, slot2: false, slot3: false };

  function compute() {
    const t = touchRef?.state;
    const touchEnabled = !!(t && touchRef.state.enabled);

    const up = keys.up.isDown || keys.up2.isDown || (touchEnabled && t.up);
    const down = keys.down.isDown || keys.down2.isDown || (touchEnabled && t.down);
    const left = keys.left.isDown || keys.left2.isDown || (touchEnabled && t.left);
    const right = keys.right.isDown || keys.right2.isDown || (touchEnabled && t.right);

    const slot1 = keys.slot1.isDown || (touchEnabled && t.slot1);
    const slot2 = keys.slot2.isDown || (touchEnabled && t.slot2);
    const slot3 = keys.slot3.isDown || (touchEnabled && t.slot3);

    const justSlot1 = slot1 && !prev.slot1;
    const justSlot2 = slot2 && !prev.slot2;
    const justSlot3 = slot3 && !prev.slot3;

    prev.slot1 = slot1;
    prev.slot2 = slot2;
    prev.slot3 = slot3;

    return {
      up, down, left, right,
      slot1, slot2, slot3,
      justSlot1, justSlot2, justSlot3
    };
  }

  return { get: compute };
}
