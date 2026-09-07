# Cutscene frame generation prompt

The game canvas is `384 x 180`. Cutscenes draw 14px letterbox bars top and
bottom, so the window art actually appears in is **384 x 152**, or **2.53:1**.

Frames are contain-fitted, so nothing is ever cropped. Anything narrower than
the window just gets side bars. The original frames were 1.5:1, which left 78px
of black down each side and, before the fit was corrected, hid 45% of every
frame.

**Generate at 1536 x 640 (2.4:1).** That renders at 365 x 152 with about 10px of
side bar, which reads as intentional framing.

## Two rules that matter more than the wording

**Ask for the whole set in one request.** Frame by frame is where character
consistency dies: the model has no memory of what your face looked like in the
last image. Every frame in one go, and attach the existing frames as reference.

**Keep subjects centred.** At 2.4:1 the top and bottom of the composition are
the first things to go if the aspect drifts. A portrait framing regenerated
wide just puts the subject in the middle third with empty space either side.

---

## Style block

Paste this once at the top, then the frame list.

> Generate a set of cinematic cutscene frames for a retro-styled stealth game.
>
> **Format:** every frame **1536 x 640 pixels, 2.4:1 ultra-wide cinematic**.
> Same dimensions for all frames, no exceptions.
>
> **Style:** dramatic digital painting, painterly rather than photographic.
> Heavy chiaroscuro with deep shadows and a single warm light source. Rich
> amber, orange and deep red night palette. Film grain, soft vignette, shallow
> depth of field. Think a graphic-novel adaptation of a 90s thriller.
>
> **Character (identical in every frame):** a heavyset bearded man in his
> forties, warm brown skin, thick black-rimmed glasses, a black baseball cap
> with a white letter G on the front, dark jacket over a dark shirt.
>
> **Composition:** wide cinematic framing. Keep the subject and all important
> detail in the central band. Leave the extreme top and bottom edges free of
> anything that matters. No text, captions, subtitles, logos, borders or
> letterbox bars anywhere in the image; the game draws those itself.

---

## Frames

Numbering matches `AbductionCutscene.js`. Frame 07 is intentionally absent, it
was cut from the sequence.

| # | Beat | Caption shown by the game |
|---|---|---|
| 01 | Leaving his building at dusk, walking toward the street, cheerful, dressed for a night out. Warm street lamps, autumn city block. | EN ROUTE TO MY BIRTHDAY PARTY TONIGHT |
| 02 | Opening the rear door of a black sedan at the kerb. The door reads GUBER in white lettering. Night, city lights behind. | GUBER BLACK - CONFIRMED |
| 03 | Interior, back seat. He looks at his phone, lit by the screen. Highway lights streak past the window. | ON THE MAJOR DEEGAN |
| 04 | Interior, wider. Him in the back, and in the front a stern older driver with grey hair and a moustache watching him in the rear-view mirror. | ON MY WAY TO THE PARTY! |
| 05 | Close on a gloved hand pressing a glowing red button on the centre console. Everything lit red. | *(no caption)* |
| 06 | From the back seat, a dark partition rising between front and rear. The driver is barely visible through the closing gap. Red interior light. | *(no caption)* |
| 08 | Close on his face, mouth open, alarmed, realising he is locked in. Harsh red interior light. | WHAT THA HELL! |
| 09 | He presses one palm flat against the window, shouting. Sickly yellow-green gas filling the cabin. | LET ME OUT! |
| 10 | Slumped against the seat, eyes closing, head tipping back. Gas thick, light fading. | LOSING CONSCIOUSNESS... |

---

## When they come back

Drop them into `assets/cutscenes/abduction/` with the same filenames and the
sizing takes care of itself. Check any frame with:

```
python3 tools/collision-overlay.py      # unrelated, but the same idea
magick identify -format "%wx%h %[fx:w/h]\n" assets/cutscenes/abduction/*.png
```

Anything at 2.4:1 will fill the window. Anything else still will not crop, it
will just sit smaller with wider side bars.
