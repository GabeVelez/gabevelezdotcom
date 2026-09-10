# Elevator ride — art brief

Three PNGs. Drop them in `assets/cutscenes/elevator/` under exactly these
names and the ride picks them up with no code change:

| File | Size | What it is |
|---|---|---|
| `elev_facade.png` | **384 × 160** | The tower wall. Tiles vertically, forever. |
| `elev_crown.png` | **384 × 220** | The top of the tower, with night sky above it. |
| `elev_car.png` | **~74 × 62**, transparent | The glass car with him inside. |

Until they exist the scene draws its own stand-ins, so nothing is blocked on
this. Generate them one at a time — three prompts, not one.

---

## The shot, so the three pieces agree

The camera hangs in the air off the side of the building, looking **straight
at the wall** — flat elevation, no perspective, no vanishing point, no
tilt. The wall fills the frame. The car climbs it dead centre. Everything is
lit only by what is behind the windows, at night.

The two wall pieces have to line up seam to seam, so keep one palette and one
light across both: cold blue-grey concrete, warm amber windows, nothing else
bright.

---

## 1 — `elev_facade.png` · 384 × 160

> A seamless, vertically tiling pixel-art texture of the side of a 1980s
> corporate skyscraper at night, seen straight on as a flat elevation with no
> perspective. Exactly two identical storeys stacked, each 80 pixels tall,
> divided by a dark horizontal concrete floor slab. Each storey has a row of
> tall narrow windows, evenly spaced; most glow warm amber from the offices
> inside, a few are dark. Cold blue-grey concrete between the windows. Gritty,
> muted, cinematic, moody. Flat lighting, no glow bloom, no sky, no ground, no
> roof, no people, no text. The image must tile seamlessly top to bottom: the
> top edge continues the bottom edge exactly.

**The one thing that matters:** the top edge must continue the bottom edge, or
you'll see a hard line strobe past every 160 pixels. Image models are bad at
this. Don't fight it — generate it and hand it to me, and I'll fix the seam.

Keep the windows **smallish**. The stand-in's windows are chunky and it costs
the ride its sense of speed. More floors rushing past reads faster.

## 2 — `elev_crown.png` · 384 × 220

> Pixel-art night scene, flat straight-on elevation, no perspective. The top of
> a 1980s corporate skyscraper. The bottom two thirds is the topmost office
> floors, matching the wall below: cold blue-grey concrete with tall narrow
> windows glowing warm amber, every one of them lit. A heavy concrete parapet
> caps the building. Above it, open night sky: deep blue-black, faint stars,
> and the distant lights of a city skyline far below on the horizon. Moody,
> gritty, cinematic. No people, no text, no helicopter.

This is the payoff — the wall runs out and the sky opens. Put the parapet
around **95–105px from the top** so the sky band and the arrival land right.

## 3 — `elev_car.png` · ~74 × 62, transparent background

> Pixel-art sprite of a single luxury glass elevator car, seen straight on from
> outside, on a fully transparent background. A brass-framed glass box, warmly
> lit from within so the interior glows amber. Inside, seen in silhouette from
> behind, a stocky bearded man in a tactical vest standing facing away. Ornate
> but compact. Sharp edges, no drop shadow, no background, no floor, nothing
> outside the car itself.

Transparent really does have to be transparent — a white background will show
as a white box on the wall. If it comes back opaque, send it anyway and I'll
key it out.

---

## Notes

- Sizes are forgiving. The wall scales to frame width whatever it arrives at,
  the crown does too, and an oversized car is shrunk to fit. But the wall's
  **height should stay a whole number of 80px storeys** or the floor counter
  drifts out of step with the windows going past.
- One palette across all three. The crown's lower half has to look like the
  same building as the facade or the seam shows at the exact moment you want
  the player looking.
