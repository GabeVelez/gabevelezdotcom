# Story cutscene frames

Drop PNGs here named after the keys in `src/scenes/cutscenes/cutscenes.js`.

Nothing else needs changing: a frame appears in the game the moment its file
exists, and missing files are skipped rather than erroring, so the game stays
playable while art is in progress.

## Size

**1536 x 640 (2.4:1)** for every file, including the layers of a layered
cutscene. See `docs/CUTSCENE_PROMPT.md`.

## Layered cutscenes

`villain_reveal` is composited rather than a sequence. All three files are the
same 1536 x 640 canvas, aligned, so a character sits in the same place in its
layer as it should in the final shot:

- `cs_reveal_bg.png`       Midtown office. Opaque, fills the frame.
- `cs_reveal_gabe.png`     Gabe in tactical gear, left. **Transparent elsewhere.**
- `cs_reveal_villain.png`  The blond captor, right. **Transparent elsewhere.**

The two character layers slide in from their own sides, so export them in their
final positions and the animation handles the rest. Do not pre-offset them.

**Export each layer on the full 1942x809 canvas, not cropped to the character.**
This is the easy one to get wrong: if one layer is cropped tight and another is
not, they end up at wildly different scales when composited, because the game
fits each to the same frame. The villain layer arrived cropped at 1536x1024 and
had to be trimmed and placed by hand; the original is kept in originals/.

Transparency matters: exported on a solid background they will cover each other
and the office.
