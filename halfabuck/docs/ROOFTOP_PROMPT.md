# Rooftop background prompt

For level 10. Attach the block-out exported from the Figma `rooftop` frame
(the `sketch` layer; `collision` and `exits` are hidden already) and use the
prompt below. The sketch is the layout; the prompt is the look.

Generate at **1536 × 512** — twice the level size, an exact 2:1 so it
downsamples cleanly — and I will bring it down to 768 × 256.

You can generate this **without attaching the sketch**. Everything the layout
needs is written below, and a fresh composition is probably better than one
copying a block-out. Attach the sketch only if the result drifts.

---

## The camera, and why the drop goes at the top

This is the one thing to get right, and it is settled by the art that already
exists rather than by preference.

Every finished background in this game shows the **far wall face-on** and
nothing but floor at the near edge. The executive office has panelling,
sconces and framed pictures across the top of the frame; the sewer has a lit
wall and a ladder; the cell has a barred window. All three bottom edges are
plain floor — not one of them draws a near wall's face.

So the camera is tilted looking **up-screen**. You see the front of whatever
is furthest away, and the near edge is only ever a top surface.

The interiors cannot tell us what is *past* the near edge, because in a room
there is nothing there and the art simply stops. The rooftop is the first
level where something exists beyond it, so geometry settles the rest.

With the camera tilted up-screen, a sight line toward the top of the frame is
shallow: it clears the far parapet and runs out across open distance, so you
see a great deal — the city, all the way to a horizon. A sight line toward the
bottom is much steeper, close to straight down: past the near parapet it
strikes the building's own face almost edge-on.

**So you see over both edges, but nowhere near equally.** The far edge opens
onto the whole city; the near edge shows a thin, hard-compressed sliver of
facade and the street immediately below. In this image that is 58 pixels
against 24 — a bit under two and a half to one. That lopsidedness IS the
camera tilt. Draw the two bands the same depth and the tilt flattens out, and
the roof stops reading as a roof.

Get the top backwards — a skyline seen across at eye level rather than a city
seen from above — and it looks like a room with a poster of a city on the far
wall.

---

## The prompt

> Paint a top-down night rooftop for a 16-bit stealth game, 1536 × 512
> pixels.
>
> **Camera.** The roof deck is seen from directly above, flat, like a floor
> plan. The camera is tilted very slightly, so you look out over both the far
> and near edges of the building — but not equally. Over the **far** edge, at
> the top of the frame, the sight line is shallow and you see a long way: the
> whole city, far below and receding. Over the **near** edge, at the bottom,
> it is almost vertical, so you see only a thin compressed sliver of the
> building's face and the street directly beneath. The top band should be
> roughly four times the depth of the bottom one.
>
> **Bands, top to bottom, as fractions of the height:**
>
> - **0–23% — the city, far below.** This is a bird's-eye view looking down
>   from a great height, not a skyline seen across at eye level. Nearest the
>   bottom of this band is the street at the foot of our own building: dark,
>   with the warm sodium pools of a few streetlamps. Beyond it, the roofs and
>   lit faces of lower buildings, getting smaller and hazier as they recede,
>   hundreds of tiny warm windows. A thin band of night sky and haze at the
>   very top. **This band is what tells the player they are high up — it must
>   be legible, and it must clearly be seen from above.**
> - **23–27% — our own parapet**, seen face-on: a low concrete wall with a
>   pale weathered coping along its top edge. This is the lip you are looking
>   over.
> - **27–91% — the open roof deck**, seen from straight above. This is most
>   of the image and most of it is empty.
> - **91–100% — the near edge.** A strip of the near parapet's flat top
>   surface, and then, below it, a **thin hard-compressed sliver** of our own
>   building's face with a couple of lit windows, and the street immediately
>   below at the very bottom. You are looking almost straight down here, so
>   this band is steep and shallow — roughly a quarter the depth of the band
>   at the top. Do not give it the same weight as the top; the difference
>   between the two is the camera angle.
>
> A parapet also runs down the left and right edges, seen from above.
>
> **The deck** is weathered asphalt and tar: seams between the sheets,
> patches, old water stains, scattered grit. Several **shallow puddles of
> standing rainwater reflecting the night sky** — cold blue against the dark
> deck.
>
> **The deck is nearly bare, and that is deliberate.** It is an arena for a
> chase, and anything standing on it is somewhere the chase snags. Only three
> things:
> - **A steel door set into the left-hand parapet, exactly halfway down it.**
>   Weathered and riveted, slightly ajar, a sliver of warm light spilling out
>   onto the deck. Flush with the wall — not a hut or a stairwell box standing
>   on the roof. It is the only feature on the left half and it must read
>   clearly as the way in.
> - **One low air-conditioning unit** against the far parapet, about a third
>   of the way across: a rusted housing with a fan grille on top, showing its
>   top surface and the face turned toward the viewer. Two capped vent pipes
>   beside it with **a thin plume of steam drifting off to one side**, so
>   there is wind.
> - **A helipad painted flat on the deck in the right third**: a faded yellow
>   circle, a second ring inside it, a large letter H, small pale-blue
>   perimeter lamps around its edge. Paint on asphalt, worn and scuffed — not
>   a raised platform. Nothing stands on it or near it.
>
> A slim antenna mast near the right-hand end with **a red aircraft warning
> light** at the top, glowing.
>
> Everything from the middle of the roof across to the helipad is empty deck.
> Do not fill it.
>
> **Light.** Cold. Moonlight and skyglow from above, blue-grey, with no
> visible lamp casting it — this is outdoors and it must not look like a lit
> interior. The only warm light is what leaks from elsewhere: the doorway, the
> windows far below, the street, the red mast lamp. Long soft shadows falling
> down and slightly right.
>
> Painterly pixel art with visible texture, the look of a late-90s console
> game, not clean vector. No characters, no helicopter, no text, no labels, no
> UI, no border or frame.

---

## Notes

**Let it place things where it likes.** The collision is authored afterwards,
in Figma, against whatever the art actually does — the same order that got the
corridor lining up perfectly on the first try. The only placements that matter
are the door on the left edge at mid-height and the helipad in the right
third, because the level's beats hang off them.

**Regenerate if the top band comes back as a skyline seen across at eye
level** rather than a city seen from above, or if it comes back thin. That
band is the whole reason the image reads as a rooftop, it is the thing these
models get wrong by default, and it is not something the collision can fix
afterwards. A misplaced AC unit is not worth another pass.

**Regenerate if it comes back cluttered.** These models like to fill a roof
with crates, ducting and pipework. The empty right half is load-bearing: it
is where the chase happens and where the weapon gets picked up under
pressure.

**Bands, in level pixels** (768 × 256), for authoring the collision:

| band | y | walkable |
|---|---|---|
| the city, far below | 0–58 | no |
| far parapet, face-on | 58–70 | no |
| **deck** | **70–232** | **yes** |
| near parapet top, then the facade sliver | 232–256 | no |

Side parapets at x 0–14 and 754–768. Deck is 740 × 162, and a lunge covers
53% of its depth, which is what leaves somewhere to step.

**Check it before it goes in:** `python3 tools/collision-overlay.py rooftop`
draws the collision over the art using the same maths the game does.
