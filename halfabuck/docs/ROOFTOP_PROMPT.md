# Rooftop background prompt

For level 10. Attach the block-out exported from the Figma `rooftop` frame
(the `sketch` layer, with `collision` and `exits` hidden) and use the prompt
below. The sketch is the layout; the prompt is the look.

Generate at **1536 × 360** — twice the level size, an exact 2:1 so it
downsamples cleanly — and I will bring it down to 768 × 180.

---

## The prompt

> Paint a top-down night rooftop for a 16-bit stealth game, 1536 × 360
> pixels, matching the attached layout block-out exactly: same proportions,
> same objects, same positions.
>
> **Camera.** The deck is seen from directly above, flat, like a floor plan.
> The one exception is the far edge at the top of the image, which is drawn
> face-on as if seen slightly from the side: a low parapet wall, and beyond
> it a night skyline of distant buildings against a dark sky. That
> combination — floor from above, far wall face-on — is the convention the
> rest of this game uses and it is what makes the space read as a roof and
> not a floor. Do not draw the sky anywhere except that top band.
>
> **Bands, top to bottom, as fractions of the height.** Sky and distant
> skyline in the top 11%. The far parapet, face-on with a pale concrete
> coping along its top edge, from 11% to 18%. The open deck from 18% to 91%.
> The near parapet across the bottom 9%, seen from above so mostly its top
> surface shows. A matching parapet runs down the left and right edges.
>
> **The deck** is weathered asphalt and tar: dark grey-brown, seams between
> the sheets, patches, old water stains, scattered grit. Worn, not clean.
> Keep the middle of the deck **open and uncluttered** — no crates, no
> pipework, no debris in the central band. It has to stay readable as a
> space to run in.
>
> **The deck is nearly bare, and that is deliberate** — it is an arena, and
> anything standing on it is somewhere a chase snags. There are only three
> things on it:
> - **A steel door set into the left-hand parapet, exactly halfway down it.**
>   Weathered, riveted, standing slightly ajar with a sliver of warm light
>   spilling out onto the deck. It is flush with the wall, not a hut or a
>   box standing on the roof. This is the only feature on the left half of
>   the image and it needs to read clearly as the way in.
> - **One low air-conditioning unit**, set against the far parapet about a
>   third of the way across: a rusted metal housing with a fan grille on
>   top, lit from above and slightly left, with a short shadow falling down
>   and to the right. It shows its top surface and the face turned toward
>   the viewer, like furniture in a top-down game. Two small capped vent
>   pipes stand near it, silhouette only.
> - **A helipad painted flat on the deck in the right third**: a faded
>   yellow circle with a second ring inside it and a large letter H. Paint
>   on asphalt, worn and scuffed — not a raised platform. Nothing stands
>   on it, and nothing stands near it.
>
> Everything from the middle of the roof across to the helipad is empty
> deck. Do not fill it.
>
> **Light and colour.** Night. Cold moonlight over the deck, and warm amber
> spill from the city below catching the outer face of the parapets. The
> distant skyline has a scatter of small lit windows. Deep shadow, high
> contrast, muted palette — dark blue-greys and warm browns. Painterly pixel
> art with visible texture, the look of a late-90s console game, not clean
> vector.
>
> No characters, no helicopter, no text, no labels, no UI, no border or
> frame. Just the empty roof.

---

## Notes

**Do not expect it to hit the pixel positions.** It will come back with the
head-house and the units near where the sketch puts them but not on them.
That is fine and it is why the collision is authored afterwards, in Figma,
against whatever the art actually does — the same order that got the
corridor to line up perfectly on the first try.

**The band fractions matter more than the objects.** If the sky band comes
back much deeper than 11%, the playable deck shrinks and the chase gets
cramped. That one is worth regenerating for; a misplaced AC unit is not.

**The other thing worth regenerating for is clutter.** These models like to
fill a roof with crates, ducting and pipework. The empty right half is
load-bearing: it is where the chase happens and where the weapon has to be
picked up under pressure. If it comes back busy, say so and ask again.

**Check it before it goes in:** `python3 tools/collision-overlay.py rooftop`
draws the collision over the art using the same maths the game does.
