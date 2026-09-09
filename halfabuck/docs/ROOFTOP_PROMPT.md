# Rooftop background prompt

For level 10. Attach the block-out exported from the Figma `rooftop` frame
(the `sketch` layer; `collision` and `exits` are hidden already) and use the
prompt below. The sketch is the layout; the prompt is the look.

Generate at **1536 × 480** — twice the level size, an exact 2:1 so it
downsamples cleanly — and I will bring it down to 768 × 240.

The roof is **taller than the screen**. The screen is 384 × 180 and the level
is 768 × 240, so it scrolls a little vertically as well as horizontally. That
is deliberate: at one screen tall the deck was a 100px strip that a lunge
crossed in a single move, and there was nowhere to step to.

---

## The one thing this image has to do

Make someone glancing at a phone know, instantly and without reading
anything, that they are **outside and high up**. Every other level in this
game is a dark room with a wall band around the edge, and if this comes back
looking like that, it has failed no matter how nicely it is painted. Three
things carry it: a sky with a city in it, the ground visible far below the
near edge, and cold light instead of the warm indoor light everywhere else.

---

## The prompt

> Paint a top-down night rooftop for a 16-bit stealth game, 1536 × 480
> pixels, matching the attached layout block-out exactly: same proportions,
> same objects, same positions.
>
> **Camera.** The deck is seen from directly above, flat, like a floor plan.
> The top and bottom edges break that on purpose, the way a stage set does:
> at the top you look out across a night skyline, and at the bottom you look
> down over the parapet at the face of the building falling away and the
> street far below. That combination is what makes the space read as a roof
> instead of a floor.
>
> **Bands, top to bottom, as fractions of the height:**
> - **0–17% — sky and city.** A deep blue-black gradient with a scatter of
>   stars and a small moon toward the right. Across the bottom of this band,
>   a skyline of distant towers at varied heights with hundreds of tiny lit
>   windows in warm yellow. This band must be substantial and clearly
>   readable, not a thin dark strip.
> - **17–21% — the far parapet**, seen face-on, with a pale concrete coping
>   along its top edge.
> - **21–88% — the open deck**, seen from straight above. This is most of
>   the image and most of it is empty.
> - **88–100% — the near edge and the drop.** The near parapet's top
>   surface, then below it the sheer face of the building falling away into
>   shadow, a row of small lit windows, and at the very bottom the warm
>   sodium glow of the street a long way down with a few streetlamps in it.
>   **This band is the most important thing in the image** — it is the only
>   place that shows how high up we are.
>
> A parapet also runs down the left and right edges.
>
> **The deck** is weathered asphalt and tar: seams between the sheets,
> patches, old water stains, scattered grit. Several **shallow puddles of
> standing rainwater reflecting the night sky** — cold blue against the dark
> deck.
>
> **The deck is nearly bare, and that is deliberate.** It is an arena, and
> anything standing on it is somewhere a chase snags. Only three things:
> - **A steel door set into the left-hand parapet, exactly halfway down it.**
>   Weathered and riveted, slightly ajar, a sliver of warm light spilling
>   out onto the deck. Flush with the wall — not a hut or a stairwell box
>   standing on the roof. It is the only feature on the left half and it
>   must read clearly as the way in.
> - **One low air-conditioning unit** against the far parapet, about a third
>   of the way across: a rusted housing with a fan grille on top, showing
>   its top surface and the face turned toward the viewer. Two capped vent
>   pipes beside it with **a thin plume of steam drifting off to one side**,
>   so there is wind.
> - **A helipad painted flat on the deck in the right third**: a faded
>   yellow circle, a second ring inside it, a large letter H, and small
>   pale-blue perimeter lamps around its edge. Paint on asphalt, worn and
>   scuffed — not a raised platform. Nothing stands on it or near it.
>
> A slim antenna mast near the right-hand end with **a red aircraft warning
> light** at the top, glowing.
>
> Everything from the middle of the roof across to the helipad is empty
> deck. Do not fill it.
>
> **Light.** Cold. Moonlight and skyglow from above, blue-grey, with no
> visible lamp casting it — this is outdoors and it must not look like a lit
> interior. The only warm light is what leaks from elsewhere: the doorway,
> the distant windows, the street below, the red mast lamp. Long soft
> shadows falling down and slightly right.
>
> Painterly pixel art with visible texture, the look of a late-90s console
> game, not clean vector. No characters, no helicopter, no text, no labels,
> no UI, no border or frame.

---

## Notes

**Do not expect it to hit the pixel positions.** It will put the door and
the unit near where the sketch has them, not on them. That is fine and it is
why the collision is authored afterwards, in Figma, against whatever the art
actually does — the same order that got the corridor lining up perfectly on
the first try.

**Regenerate if the sky band comes back thin, or if the drop is missing.**
Those two bands are the whole reason the image reads as a rooftop; a
misplaced AC unit is not worth another pass, and neither of those is
something the collision can fix afterwards.

**Regenerate if it comes back cluttered.** These models like to fill a roof
with crates, ducting and pipework. The empty right half is load-bearing: it
is where the chase happens and where the weapon gets picked up under
pressure.

**Bands, in level pixels** (768 × 240), for authoring the collision:

| band | y | walkable |
|---|---|---|
| sky and skyline | 0–40 | no |
| far parapet | 40–50 | no |
| **deck** | **50–210** | **yes** |
| near edge and drop | 210–240 | no |

Side parapets at x 0–14 and 754–768. Deck is 740 × 160.

**Check it before it goes in:** `python3 tools/collision-overlay.py rooftop`
draws the collision over the art using the same maths the game does.
