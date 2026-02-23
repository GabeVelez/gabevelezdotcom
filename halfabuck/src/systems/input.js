/**
 * Aggregates keyboard + touch input into a single logical input object.
 * Provides both isDown and justPressed (edge-trigger) flags.
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
    interact: "G",
    crouch: "SHIFT",
    slot1: "ONE",
    slot2: "TWO",
    slot3: "THREE",
  });

  const prev = { interact: false, crouch: false, slot1: false, slot2: false, slot3: false };

  function compute() {
    const t = touchRef?.state;
    const touchEnabled = !!(t && touchRef.state.enabled);

    const up = keys.up.isDown || keys.up2.isDown || (touchEnabled && t.up);
    const down = keys.down.isDown || keys.down2.isDown || (touchEnabled && t.down);
    const left = keys.left.isDown || keys.left2.isDown || (touchEnabled && t.left);
    const right = keys.right.isDown || keys.right2.isDown || (touchEnabled && t.right);

    const interact = keys.interact.isDown || (touchEnabled && t.a);
    const crouch = keys.crouch.isDown || (touchEnabled && t.b);
    const slot1 = keys.slot1.isDown || (touchEnabled && t.x);
    const slot2 = keys.slot2.isDown || (touchEnabled && t.y);
    const slot3 = keys.slot3.isDown;

    const justInteract = interact && !prev.interact;
    const justCrouch = crouch && !prev.crouch;
    const justSlot1 = slot1 && !prev.slot1;
    const justSlot2 = slot2 && !prev.slot2;
    const justSlot3 = slot3 && !prev.slot3;

    prev.interact = interact;
    prev.crouch = crouch;
    prev.slot1 = slot1;
    prev.slot2 = slot2;
    prev.slot3 = slot3;

    return {
      up, down, left, right,
      interact, crouch, slot1, slot2, slot3,
      justInteract, justCrouch, justSlot1, justSlot2, justSlot3
    };
  }

  return { get: compute };
}
