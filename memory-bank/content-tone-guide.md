# Content Tone Guide — gabevelez.com

How to write (and review) case studies and site copy so it sounds like Gabe and
not like AI. Written 2026-07-26 after the TokTix case-study rewrite. Any copy
added to this site should pass every check in here before it ships.

---

## 1. The voice

Read the human-written case studies first (`case-studies/*.html`). The voice is
conversational, first-person, and direct:

> "I had many hats. I made mockups. I pushed code."
> "This was messy - the people on the team that manage this are not developers."
> "As the adage goes: Always Be Closing."
> "Manually editing HTML only causes human error!"

Traits to match:

- **First person, active voice.** "I built", "I found", "we needed". Never "it
  was decided" or "the platform was designed to".
- **Short sentences mixed with longer ones.** A three-word sentence after a long
  one is a feature, not a bug.
- **Conversational asides are welcome.** Rhetorical questions, the occasional
  exclamation point, "the tricky part was...", a joke in an image caption.
- **Specifics over adjectives.** "103 colors - 90 from Material Design, 8 black
  variations, black & white, and 3 brand colors" beats "a comprehensive color
  audit" every time. If a sentence has no number, name, or concrete detail, ask
  whether it's saying anything.
- **Stories, not assessments.** The human case studies narrate what happened and
  let the reader judge. They never grade themselves ("demonstrates capability",
  "validates the approach").

## 2. Punctuation rules

- **No em-dashes (—). Ever.** This is the #1 AI tell. Replace with:
  - two sentences (usually the best fix)
  - a comma
  - parentheses for a true aside
  - a spaced hyphen " - " (Gabe's own habit, see the older case studies)
- **No suspended hyphens.** Write "organization, company, and event-based
  roles", not "organization-, company-, and event-based roles".
- Sweep before shipping: `grep -n "—" <files>` must return nothing.

## 3. Banned words and phrases

These read as AI-generated. Replace on sight:

| Banned | Use instead |
|---|---|
| leverage / leveraging | use, with |
| comprehensive | (delete it, or name what's actually covered) |
| robust | solid, or name the specific behavior |
| seamless / seamlessly | (delete, or describe what actually connects) |
| showcase / showcases | shows, or just state the fact |
| demonstrates (capability) | (tell the story instead) |
| validates / validation (self-praise) | (cut the whole sentence, usually) |
| optimal / maximize | fast, simple, best for X |
| strategic (as filler) | (delete, or say the actual strategy) |
| utilize | use |
| delve / dive into | look at, dig into |
| empower / elevate / unlock | (rewrite the sentence) |
| cutting-edge / state-of-the-art | (name the actual tech) |
| "represents a complete..." | "What's live today:" |
| "enhanced by" | with |
| journey (except the AI-tools journey section, which is literal) | |

Also watch for **AI sentence shapes**, not just words:

- The triad tic: "X, Y, and Z" three times in one paragraph.
- "Not just X, but Y."
- Every paragraph opening with the subject ("The platform... The platform...").
- Chained clauses glued with em-dashes or "while ...ing" ("...while maintaining
  code quality and security standards").
- Grading your own work ("successfully integrates", "high standards for
  technical excellence").

## 4. Truth rules (no inflated claims)

- **Every claim verified before it ships.** Feature status comes from the actual
  repo (shipped = merged to main and live, not on a branch, not flag-gated).
  Numbers come from production data (Firestore / Stripe), with test and QA data
  excluded.
- **Shipped vs in development is always explicit.** Never present roadmap as
  reality. (Chargebacks were in development as of July 2026 - labeled that way.)
- **Round numbers down so they stay true.** "600+ tickets scanned" survives next
  month; "652" doesn't.
- **No dollar figures or client names from the pilot** without their
  leadership's written OK. "A real event company" is the approved framing.
  (AfterPromCentral is Gabe's employer - internal docs flag this.)
- **Each claim appears once.** The status line (live apps + pilot) lives in the
  TL;DR and "Where It Is Today" only. If a fact shows up in a third place, cut
  it there.

## 5. Structure habits

- Impact tiles: number + short label + one plain detail line. Numbers must be
  verifiable (see truth rules).
- Buttons and links follow the site design system: white box, black uppercase
  text, square corners, gold-gradient hover. No one-off gradient pills. Button
  copy stays short ("Visit toktix.com", not "Visit toktix.com to see it in
  action").
- Store links keep their tracking (`ct=` for the App Store, `referrer=` UTM for
  Google Play, `utm_*` with per-placement `utm_content` for site links).
- The HTML case study is the single source of truth. No `.md` mirrors (the old
  TokTix mirror now lives in `memory-bank/toktix-casestudy-source.md` as a
  draft). Machine readability comes from clean HTML + JSON-LD + `/llms.txt`.
- Image captions are short and human ("Claude Code time is here." is the bar).

## 6. Review checklist before shipping copy

1. `grep "—"` returns nothing.
2. Grep the banned-word list; zero hits in body copy.
3. Read it out loud. If a sentence wouldn't be said to a friend at a bar, or a
   colleague across the desk, rewrite it.
4. Every number and feature claim traceable to repo, Stripe, or Firestore.
5. Shipped vs in-development labeled honestly.
6. No claim repeated more than twice across the whole page.
7. Compare a paragraph against one from `integrate-abm-web-analytics.html` or
   `nycnewyears-dot-com-site-overhaul.html`. If yours sounds like a different
   author wrote it, it fails.
