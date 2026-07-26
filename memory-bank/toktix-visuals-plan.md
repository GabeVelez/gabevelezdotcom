# TokTix Case Study — Product Visuals Plan (awaiting decision)

Written 2026-07-26. Proposal for adding real product screenshots to
`side-projects/toktix-ticketing-platform.html`. Nothing here is applied yet -
review and pick, then implement in a future session.

## Why

The case study's images are mostly process artifacts (Figma wireframes, flow
diagrams, Claude screenshots). The sections that argue "this is a real shipping
product" have no product visuals at all. The handoff doc flagged this as a
nice-to-have; this doc is the concrete plan.

## Available assets

**Polished App Store marketing frames** (best option - headline + device mockup
on a nightlife background, 1284x2778, with `-1290` width variants):

Located at `~/Projects/toktix/toktix-marketing/app-store-screenshots/ios/`

| File | Headline | Screen shown |
|---|---|---|
| `01_Create_Events.png` | "Create events in 60 seconds" | FAITH extraction results (confidence scores, field checkboxes) |
| `02_AI_Scanning.png` | "AI builds your event" | FAITH robot scanning a flyer |
| `03_Event_Management.png` | "Run your night like a pro" | Live event page (Cupid's Night Off) |
| `04_Pricing.png` | (not yet reviewed) | Pricing/fees screen |
| `05_Nightlife_Platform.png` | "Built for nightlife" | Event Analytics screen (tickets, tiers, revenue, check-in rate) |

There's also an `android/` folder (not yet reviewed) and an
`ANDROID-DIFFERENCES.md`.

**Raw device captures** (unframed, debug-era) in `~/Projects/toktix/`:
`android-events-list-real.png`, `android-profile.png`, `app-launch-final.png`,
`tix-screen-loaded.png`, `login-success.png` and similar (1080x2424 Android,
1206x2622 iOS). Less polished; only worth using if we want visible
Android-on-Android proof.

## Recommended placements (minimal set: 3 images, 3 sections)

1. **Where It Is Today** - the proof-point section, currently text-only.
   Add a row of two: `03_Event_Management` + `05_Nightlife_Platform`.
   These are literally what's on the App Store today, which is the section's
   whole argument.

2. **Beyond Ticketing → AI flyer scanning** - add `02_AI_Scanning`.
   Best narrative payoff on the page: The Spark section up top shows the rough
   OCR prototype video; this closes the loop with the shipped FAITH feature.
   ("The OCR prototype from the early days is now a production feature.")

3. **Expanding the Platform → Money & Trust (optional third spot)** -
   `05_Nightlife_Platform` actually shows the Event Analytics screen the
   Analytics bullet describes. Only if 05 is NOT used in Where It Is Today -
   one appearance per screenshot, no repeats.

**Skipped on purpose:** raw Android captures (unpolished next to the framed
set), `01_Create_Events` (overlaps with 02's FAITH story - could swap in if
preferred).

## Implementation notes (for whoever applies this)

- Copy chosen files into `img/`, convert to webp at display resolution
  (~600-700px wide) to keep page weight down. Check if `cwebp` is installed;
  macOS `sips` doesn't write webp.
- Add a small responsive `.casestudy__screens` row to `css/style.css`: flex,
  wrap, gap, images `max-width: 100%` - match the existing image treatment.
- Alt text: describe the screen, plain ("TokTix event analytics screen showing
  ticket sales and check-in rate").
- Captions short and human, per `content-tone-guide.md`.
- The analytics screen in 05 shows demo-scale numbers ($0.00 revenue, 1 sold).
  Fine as a UI showcase; do not caption it as real sales data.

## Open decisions for Gabe

1. Go with the minimal set (03 + 05 in Where It Is Today, 02 in Beyond
   Ticketing), or a different mix?
2. Include an Android frame from the `android/` folder for two-platform proof?
3. Replace or keep the older Figma wireframe image in the Solution section?
   (Plan keeps it - it shows process, and the new shots cover product.)
