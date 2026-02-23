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
    box: "Q",
    item: "F",
  });

  const prev = { interact: false, crouch: false, box: false, item: false };

  function compute() {
    const t = touchRef?.state;
    const touchEnabled = !!(t && touchRef.state.enabled);

    const up = keys.up.isDown || keys.up2.isDown || (touchEnabled && t.up);
    const down = keys.down.isDown || keys.down2.isDown || (touchEnabled && t.down);
    const left = keys.left.isDown || keys.left2.isDown || (touchEnabled && t.left);
    const right = keys.right.isDown || keys.right2.isDown || (touchEnabled && t.right);

    const interact = keys.interact.isDown || (touchEnabled && t.a);
    const crouch = keys.crouch.isDown || (touchEnabled && t.b);
    const box = keys.box.isDown || (touchEnabled && t.x);
    const item = keys.item.isDown || (touchEnabled && t.y);

    const justInteract = interact && !prev.interact;
    const justCrouch = crouch && !prev.crouch;
    const justBox = box && !prev.box;
    const justItem = item && !prev.item;

    prev.interact = interact;
    prev.crouch = crouch;
    prev.box = box;
    prev.item = item;

    return {
      up, down, left, right,
      interact, crouch, box, item,
      justInteract, justCrouch, justBox, justItem
    };
  }

  return { get: compute };
}
