# Homepage Optimization Plan - REVISED
## Post-Resume Engagement Strategy

**Date Created:** September 30, 2025 (Revised)
**Critical Insight:** Visitors have already seen resume before arriving. They're evaluating your work quality, not looking for credentials.

---

## 🎯 Revised Problem Statement

### Original Assumption (WRONG)
Recruiters need to see resume first → We need prominent resume CTAs

### Actual Reality (CORRECT)
**Visitors come FROM resume TO portfolio.** They want to:
1. See proof of the claims on your resume (48% code reduction, 10% conversion lift)
2. Understand the quality/depth of your work
3. Decide if you're worth interviewing

### The Real Problem
**91% drop off without exploring case studies** = They don't see enough value to click through.

---

## 📊 Revised Analytics Interpretation

**Current State:**
- Homepage: 60 views (89%)
- Case studies: 6 views (9%)

**What This Actually Means:**
- 60 people interested enough to visit (resume worked!)
- 54 people (90%) don't see compelling reason to click case studies
- **The homepage isn't converting interested visitors into engaged readers**

**Root Causes:**
1. ❌ **Generic card descriptions** - "Complete inside and outside rethink" tells them nothing
2. ❌ **No visible proof** - Resume says "48% code reduction" but homepage doesn't show it
3. ❌ **No differentiation** - All 3 case studies look equally important/unimportant
4. ❌ **Buried value** - Impact is hidden inside case studies they won't click

---

## 🎯 Revised Strategic Goal

**Not:** Get resume in front of visitors
**Instead:** **Prove resume claims visually and get them to read at least ONE case study**

### Success Metric (Revised)
- Case study views: 6 → **>20** (from 60 homepage views)
- **Primary:** Click-through rate from homepage to case studies: 10% → >33%
- **Secondary:** Time on case study pages: 2-30s → >90s (quality engagement)

---

## 📋 Revised Implementation Plan

### Phase 1: Impact-First Card Descriptions (HIGHEST PRIORITY)

#### Goal
Make resume claims visible on homepage cards. Show proof before they click.

#### Current State
```
NYCNewYears: "Complete inside and outside rethink of how the website performs."
APCE: "A custom plugin built for internal use, leading to better UX and increased sales."
Integrate: "New design language that ignited conversations within design & engineering."
TokTix: "Complete mobile/web events solution I founded and created"
```

**Problems:**
- No numbers/metrics
- Process-focused, not results-focused
- Doesn't connect to resume claims

#### Revised Card Descriptions

**NYCNewYears.com**
```html
<p class="card__description">
    <strong>48% code reduction</strong> (8.2MB → 4.2MB) while optimizing for
    <strong>83% mobile traffic.</strong> WordPress theme rebuild serving thousands
    of international tourists for NYC's largest NYE event.
</p>
```

**AfterPromCentral**
```html
<p class="card__description">
    <strong>3-month end-to-end launch.</strong> WordPress plugin replacing manual
    HTML editing, eliminating content errors, and <strong>boosting conversions</strong>
    for 20-30 seasonal high school events across NY/NJ.
</p>
```

**Integrate Design System**
```html
<p class="card__description">
    <strong>55% color reduction</strong> (103→46), <strong>33% typography
    simplification.</strong> Unified design system across 3 acquired companies,
    ensuring WCAG accessibility compliance while reducing design debt.
</p>
```

**TokTix**
```html
<p class="card__description">
    <strong>95% beta-ready in 9 months, solo development.</strong> React Native +
    Next.js + Firebase platform with Stripe integration. 0→1 product demonstrating
    full-stack capability from concept to near-launch.
</p>
```

#### Implementation
- Edit `index.html` lines 108, 119, 130, 171
- Add `<strong>` tags to metrics
- Keep character count similar (don't make too long)
- Add PostHog tracking for card hover time (see if new descriptions increase engagement)

#### Success Metrics
- Case study click-through rate: 10% → **>25%**
- Which card gets most clicks? (Is it the one with strongest metrics?)
- PostHog hover time: Do visitors pause longer on cards now?

---

### Phase 2: Impact Badges on Cards (HIGH PRIORITY)

#### Goal
Make metrics scannable at a glance. Visitors should see numbers before reading descriptions.

#### Implementation

Add impact badges to each card (insert before description):

**NYCNewYears**
```html
<div class="card__badges">
    <span class="card__badge card__badge--metric">48% Code Reduction</span>
    <span class="card__badge card__badge--scale">83% Mobile Traffic</span>
</div>
```

**AfterPromCentral**
```html
<div class="card__badges">
    <span class="card__badge card__badge--timeline">3-Month Launch</span>
    <span class="card__badge card__badge--metric">Eliminated Errors</span>
</div>
```

**Integrate**
```html
<div class="card__badges">
    <span class="card__badge card__badge--metric">55% Color Reduction</span>
    <span class="card__badge card__badge--quality">WCAG Compliant</span>
</div>
```

**TokTix**
```html
<div class="card__badges">
    <span class="card__badge card__badge--timeline">9 Months, Solo</span>
    <span class="card__badge card__badge--stage">95% Beta-Ready</span>
</div>
```

#### CSS Styling

```css
.card__badges {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
}

.card__badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    line-height: 1.5;
}

.card__badge--metric {
    background: var(--gabe-gold);
    color: var(--gabe-black);
}

.card__badge--timeline {
    background: var(--gabe-teal);
    color: var(--gabe-white);
}

.card__badge--scale {
    background: var(--gabe-sage);
    color: var(--gabe-white);
}

.card__badge--quality {
    background: var(--gabe-forrest);
    color: var(--gabe-white);
}

.card__badge--stage {
    background: var(--gabe-red);
    color: var(--gabe-white);
}

/* Mobile responsive */
@media (max-width: 768px) {
    .card__badge {
        font-size: 0.625rem;
        padding: 0.2rem 0.6rem;
    }
}
```

#### Success Metrics
- Do badges increase click-through rate vs descriptions alone?
- Eye-tracking simulation: Do users scan badges first?
- Which badge type drives most clicks? (metric vs timeline vs quality)

---

### Phase 3: Visual Hierarchy - Feature Flag Best Work (MEDIUM PRIORITY)

#### Goal
Not all case studies are equal. Guide visitors to your strongest work first.

#### Current Problem
All 3 cards presented equally. Visitor doesn't know which to click first.

#### Solution: Feature the Strongest Case Study

**Make NYCNewYears.com the "hero" card:**
- Larger image
- More prominent badge
- "Featured Work" label

**Implementation:**

```html
<!-- Featured Projects Section -->
<section class="cases" id="featured-projects">
    <h2 class="cases__title">Featured Projects</h2>
    <div class="cases__container">

        <!-- HERO CARD: NYCNewYears -->
        <a class="card card--featured" href="case-studies/nycnewyears-dot-com-site-overhaul.html">
            <span class="card__label">Featured Work</span>
            <picture>
                <!-- existing image -->
            </picture>
            <div class="card__textarea">
                <div class="card__badges">
                    <span class="card__badge card__badge--metric">48% Code Reduction</span>
                    <span class="card__badge card__badge--scale">83% Mobile Traffic</span>
                </div>
                <h3 class="card__title"><span class="company__link">NYCNewYears.com Site Overhaul</span></h3>
                <p class="card__description">
                    <strong>48% code reduction</strong> (8.2MB → 4.2MB) while optimizing for
                    <strong>83% mobile traffic.</strong> WordPress theme rebuild serving thousands
                    of international tourists for NYC's largest NYE event.
                </p>
            </div>
        </a>

        <!-- Standard cards for APCE and Integrate -->
        <!-- ... -->
    </div>
</section>
```

**CSS for Featured Card:**

```css
.card--featured {
    border: 2px solid var(--gabe-gold);
    position: relative;
}

.card__label {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: var(--gabe-gold);
    color: var(--gabe-black);
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    border-radius: 4px;
    z-index: 2;
}

@media (min-width: 1060px) {
    .card--featured .card__image {
        height: 400px; /* Slightly taller than others */
    }

    .card--featured .card__title {
        font-size: 1.5rem; /* Larger title */
    }
}
```

#### Success Metrics
- Does featured card get >50% of clicks?
- Do visitors who click featured card read longer?
- Funnel: Featured card → Full read → Second case study click

---

### Phase 4: Testimonial Repositioning (MEDIUM PRIORITY)

#### Goal
Social proof validates resume claims. Move it higher so visitors see it.

#### Current State
Testimonials are at bottom of page (line 177). 91% of visitors never see them.

#### Your Testimonials Validate Resume Claims:

- **Nacer (COO):** "consistently delivers cutting-edge solutions"
- **Thom (Program Strategist):** "ability to lead with clarity made him indispensable"
- **Matt (COO):** "fantastic product designer and even better teammate"

#### Solution: Move Testimonials Above Case Studies

**New Homepage Order:**
1. Hero (A/B test)
2. **Testimonials** (moved up) ← NEW POSITION
3. Featured Projects
4. Side Projects

**Why This Works:**
- Visitor sees hero → reads social proof → feels confident clicking case studies
- Testimonials act as "trust bridge" between hero and case studies
- 4 testimonials from real people (with photos/titles) builds credibility

#### Implementation

Move `<section class="testimonials">` from line 177 to line 97 (after hero, before cases).

#### Success Metrics
- Do case study clicks increase when testimonials are above?
- Session recordings: Do visitors scroll past testimonials to case studies?
- Time on page before first case study click (does social proof slow them down in a good way?)

---

### Phase 5: "Quick Wins" Strip Above Featured Projects (LOW PRIORITY)

#### Goal
Surface all key achievements in one scannable section before case studies.

#### Implementation

```html
<!-- After Testimonials, Before Featured Projects -->
<section class="quick-wins">
    <div class="quick-wins__container">
        <h2 class="quick-wins__title">Recent Impact</h2>
        <div class="quick-wins__grid">
            <div class="quick-win">
                <span class="quick-win__number">48%</span>
                <span class="quick-win__label">Code Reduction</span>
            </div>
            <div class="quick-win">
                <span class="quick-win__number">10%</span>
                <span class="quick-win__label">YOY Conversion Lift</span>
            </div>
            <div class="quick-win">
                <span class="quick-win__number">30%</span>
                <span class="quick-win__label">Faster Deployment</span>
            </div>
            <div class="quick-win">
                <span class="quick-win__number">0→1</span>
                <span class="quick-win__label">Platform Launch</span>
            </div>
        </div>
    </div>
</section>
```

**CSS:**

```css
.quick-wins {
    padding: 2rem 0;
    background: var(--gabe-darkgray);
}

.quick-wins__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.quick-wins__title {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--gabe-white);
    text-transform: uppercase;
}

.quick-wins__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
}

.quick-win {
    text-align: center;
    padding: 1rem;
    background: var(--gabe-black);
    border-radius: 8px;
    border-top: 3px solid var(--gabe-gold);
}

.quick-win__number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--gabe-gold);
    margin-bottom: 0.5rem;
}

.quick-win__label {
    display: block;
    font-size: 0.875rem;
    color: var(--gabe-white);
    opacity: 0.9;
}

@media (max-width: 768px) {
    .quick-wins__grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .quick-win__number {
        font-size: 2rem;
    }
}
```

#### Success Metrics
- Scroll depth: What % reach Featured Projects after seeing Quick Wins?
- Click attribution: Do visitors who see Quick Wins click more case studies?
- A/B test: Quick Wins vs No Quick Wins

---

## 📊 Revised Success Metrics

### Primary KPIs

**Engagement (Week 1-2):**
- [ ] Case study click-through rate: 10% → **>25%**
- [ ] At least 15 case study views (from 60 homepage views)
- [ ] Featured card (NYCNewYears) gets **>40%** of case study clicks

**Quality (Week 2-4):**
- [ ] Time on case studies: 2-30s → **>60s** (showing real engagement)
- [ ] Bounce rate on case studies: Track (currently unknown)
- [ ] Multiple case studies per session: **>20%** of visitors

### Secondary KPIs

**Homepage Engagement:**
- [ ] Scroll depth >75%: **>40%** of visitors
- [ ] Testimonial views: Track visibility
- [ ] Quick Wins visibility: Track if implemented

**Attribution:**
- [ ] Which card drives most clicks? (Track by variant too)
- [ ] Which badge type drives clicks? (metric vs timeline vs quality)
- [ ] Does testimonial positioning impact clicks?

---

## 🚀 Revised Implementation Timeline

### Week 1: Proof on Homepage

**Day 1: Impact-First Card Descriptions**
- Rewrite all 4 card descriptions
- Add `<strong>` tags to metrics
- Add PostHog hover tracking
- Test on mobile/tablet/desktop
- **Deliverable:** Resume claims visible on cards

**Day 2: Impact Badges**
- Add badge HTML to all cards
- Add badge CSS styles
- Color-code by badge type
- Test responsive layout
- **Deliverable:** Scannable metrics before descriptions

**Day 3: Testing & Data Collection**
- Monitor PostHog for click-through rate
- Review session recordings
- Identify which card/badge drives most engagement
- **Deliverable:** 48 hours of clean data

---

### Week 2: Hierarchy & Social Proof

**Day 1: Feature Flag Best Work**
- Make NYCNewYears.com the featured card
- Add "Featured Work" label
- Enlarge image/title on desktop
- Add gold border
- **Deliverable:** Clear visual hierarchy

**Day 2: Reposition Testimonials**
- Move testimonials above Featured Projects
- Test new layout
- Monitor scroll depth
- **Deliverable:** Social proof validates claims earlier

**Day 3: Testing & Iteration**
- Compare Week 1 vs Week 2 click-through rates
- Review which changes drove most impact
- Decide on Quick Wins strip (implement or skip)
- **Deliverable:** Data-driven decision on next steps

---

### Week 3: Analysis & Optimization

**Day 1-7: Monitor & Iterate**
- Identify winning variant from A/B test
- Remove losing variants
- Optimize underperforming cards
- Plan Phase 2 (case study content optimization)

---

## ⚠️ Key Revisions from Original Plan

### ❌ REMOVED (Not Priority)
- Resume CTA section (visitors already saw resume)
- Sticky resume button (unnecessary)
- Segmentation tiles (too complex for Phase 1)
- Work landing page (premature)

### ✅ ADDED (New Priority)
- Impact-first card descriptions (connects to resume claims)
- Impact badges on cards (scannable proof)
- Featured card highlighting (guide to best work)
- Testimonial repositioning (social proof earlier)

### 🔄 REVISED (Different Approach)
- **Goal:** Not "show resume" but "prove resume claims visually"
- **Metric:** Not "resume downloads" but "case study engagement"
- **Funnel:** Resume → Homepage → Case Studies (not Homepage → Resume)

---

## 💡 Philosophy Shift

### Old Thinking
"Visitors need to see my credentials (resume) before they'll look at my work."

### New Thinking
**"Visitors already believe I'm qualified (they saw resume). Now they're evaluating: Is the work actually as good as claimed?"**

This means:
- Homepage must PROVE resume claims, not repeat them
- Metrics/numbers must be VISIBLE, not hidden in case studies
- Best work must be FEATURED, not presented equally
- Social proof must VALIDATE claims early

---

## 🎯 Definition of Success (Revised)

### After 2 Weeks:

- [x] Case study views >20 (from current 6) = **3x improvement**
- [x] Click-through rate >25% (from current 10%)
- [x] Featured card (NYCNewYears) >40% of case study clicks
- [x] Time on case studies >60s (showing engagement)
- [x] At least one A/B test variant clear winner

**If achieved:** Proceed to Phase 2 (case study content optimization)
**If not achieved:** Iterate on card descriptions/badges until CTR >20%

---

**Document Version:** 2.0 (Revised)
**Last Updated:** September 30, 2025
**Next Review:** After Week 1 implementation