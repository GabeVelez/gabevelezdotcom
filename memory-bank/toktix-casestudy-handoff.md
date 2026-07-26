# TokTix Case Study — Session Handoff

**Last updated:** 2026-07-26
**Purpose:** Hand off the in-progress TokTix side-project case-study update to a
new session that has (or can get) access to the TokTix product repos.

---

## 1. Git state — READ THIS FIRST

- **Repo:** `GabeVelez/gabevelezdotcom`
- **Working branch:** `claude/talktick-case-study-updates-d4pwvx`
- **Default branch:** `main`
- **Status at handoff:** working tree **clean**, everything **committed and pushed**.
  - Local `HEAD` == `origin/claude/talktick-case-study-updates-d4pwvx` == `e3d5be4`
- **No PR has been opened** (user has not asked for one yet).

To continue, check out the same branch and keep pushing to it:
```
git fetch origin claude/talktick-case-study-updates-d4pwvx
git checkout claude/talktick-case-study-updates-d4pwvx
```

### Commits made this session (newest first)
| SHA | Summary |
|-----|---------|
| `e3d5be4` | Add Google Play store link with install-referrer tracking |
| `c743dda` | Add UTM/campaign tracking to TokTix links in case study |
| `24f8259` | Add App Store link to TokTix case study hero |
| `5fa22bb` | Update TokTix case study: live iOS/Android apps, company pilot, and platform expansion |

---

## 2. Files touched
- `side-projects/toktix-ticketing-platform.html` — main case study (primary deliverable, this is the live page)
- `side-projects/toktix-ticketing-platform.md` — markdown source, kept in sync with the HTML
- `css/style.css` — added `.casestudy__cta`, `.casestudy__cta-note`, `.casestudy__stores`, `.casestudy__store`
- `index.html` — updated the TokTix side-project card blurb (now mentions live iOS/Android + company pilot)

---

## 3. What was changed in the case study
Reframed the project from "25-user beta" to a **live, in-market product**:
- Native **iOS + Android** apps live; **active pilot with one real event company**.
- New hero TL;DR, updated impact stats (Solo Developer / 2 App Stores / 1 Pilot Partner / Aug '25 Beta Launch).
- New **"Where It Is Today"** section (beta → real company pilot).
- New **"Expanding the Platform"** section covering the current build-out:
  - **Money & Trust:** analytics, refunds, chargebacks
  - **Organizations & Roles:** organizations, company roles, event-based roles
- Updated Summary, Results, and "Platform Status & Next Steps".
- Updated SEO: meta description, Open Graph, schema.org JSON-LD (+ `dateModified`).
- Prominent gold **CTA buttons** to toktix.com in hero, "Where It Is Today", and Results.

### Store links + tracking (all live in the hero `.casestudy__stores`)
- **App Store:** `https://apps.apple.com/us/app/toktix-ai-powered-events/id6749721306?ct=gabevelez-casestudy`
  - App Store ignores `utm_*`; Apple uses the `ct` campaign token (shows in App Store Connect → App Analytics).
- **Google Play:** `https://play.google.com/store/apps/details?id=com.toktix&referrer=<url-encoded utm string>`
  - Play uses the `&referrer=` param (URL-encoded `utm_source=gabevelez.com&utm_medium=portfolio&utm_campaign=toktix-casestudy`), captured by the Play Install Referrer API.
- **4× toktix.com CTAs:** `utm_source=gabevelez.com`, `utm_medium=portfolio`, `utm_campaign=toktix-casestudy`, per-placement `utm_content` = `hero-visit` / `hero-cta` / `today-cta` / `results-cta` (read by GA + PostHog on the destination site).

**Confirmed product URLs/IDs:**
- iOS App Store app id: `6749721306` (name: "TokTix: AI-Powered Events", dev: Gabriel Velez / TokTix, Inc.)
- Android package: `com.toktix`
- Marketing site: `https://www.toktix.com/`

---

## 4. OPEN / NOT DONE — pick up here

### A. Review the real product code (main reason for handoff)
The current case-study copy about the roadmap (analytics, refunds, chargebacks,
organizations, company roles, event-based roles) came from the **user's verbal
summary**, NOT from the actual code. It should be **verified/tightened against
the real repos.**

This `gabevelezdotcom` session was scoped only to `GabeVelez/gabevelezdotcom`,
and an attempt to `add_repo` `TokTix/toktix-mobile` was **denied at the
permission prompt** — so the code was never reviewed.

**Available TokTix repos** (from `list_repos`, all private, user has push):
- `TokTix/toktix-mobile` — React Native app (**primary source for the case study**)
- `TokTix/toktix-web`
- `TokTix/toktix-pages`
- `TokTix/toktix-marketing`
- `TokTix/toktix-memory` (may hold product memory-bank / context docs)
- `TokTix/toktix-webadmin`, `toktix-wp`, `toktix-slides`, `toktix-remotion`, `toktix-faith`, `flyer-ai-recognition`

**Next-session TODO:**
1. Add `TokTix/toktix-mobile` (read access) via `add_repo` and clone it; approve the prompt.
2. Review recent history (commits / CHANGELOG / memory-bank) for what's actually
   shipped vs in-progress on: **analytics, refunds, chargebacks, organizations,
   company roles, event-based roles**, plus AI OCR flyer extraction.
3. Correct/strengthen the "Expanding the Platform" + Results sections in
   `side-projects/toktix-ticketing-platform.html` (and mirror in the `.md`) so the
   claims match reality. Distinguish **shipped** from **in development**.
4. Commit + push to `claude/talktick-case-study-updates-d4pwvx`.

### B. Verify Android public availability
Web search at handoff time suggested Android was "coming soon"; the **user
confirmed it is live** and supplied `id=com.toktix`, which is now linked. If the
new session can reach the Play listing, double-check it resolves. (Note: this
sandbox's **network policy blocks direct access to toktix.com** — `CONNECT`
returns 403 — so on-site scraping isn't possible here; web search still works.)

### C. Nice-to-haves not yet done
- Consider adding real screenshots from the live apps (App Store / device) to replace/augment older Figma wireframe images.
- Optionally distinguish pilot metrics (tickets sold, events run) if the user wants concrete numbers — none are currently claimed to avoid fabrication.

---

## 5. Guardrails observed this session
- Did **not** fabricate any URLs, metrics, or store links — everything is either
  user-supplied or confirmed via search.
- No PR created (not requested).
- All pushes went only to `claude/talktick-case-study-updates-d4pwvx`.
