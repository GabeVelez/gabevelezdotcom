# Homepage Optimization Plan: Fix 91% Drop-Off Rate

**Date Created:** September 30, 2025
**Project:** GabeVelez.com Homepage Conversion Optimization
**Priority:** CRITICAL - Homepage is the biggest point of friction in the funnel
**Goal:** Transform homepage from portfolio gallery into recruiter conversion funnel

---

## 🚨 Critical Problem Statement

### Current Analytics (Google Analytics: Sept 1-28, 2025)

**Traffic Distribution:**
- **Homepage (/)**: 60 views (~89% of all traffic)
  - Avg time on page: 45 seconds
  - Primary entry point for almost all visitors

- **Case Studies Combined**: 6 views (~9% of all traffic)
  - NYCNewYears.com Site Overhaul
  - AfterPromCentral Events Calendar
  - Integrate Design System Audit
  - TokTix Ticketing Platform
  - Engagement time: 2-30 seconds

- **About Page**: 1 view (~1.5% of all traffic)

### The Crisis

**91% of visitors drop off without exploring case studies.**

This means:
- ❌ Recruiters see hero, scroll once, leave
- ❌ Strong case study content goes unseen (detailed, results-driven, well-documented)
- ❌ Resume achievements (10% YOY conversion lift, 48% code reduction, CTO role) buried
- ❌ No clear path from homepage → case studies → resume → contact

**Root Cause:** Homepage is designed as a portfolio gallery, not a conversion funnel.

---

## 📊 Current Homepage State Analysis

### ✅ What's Working

1. **A/B Test Infrastructure (lines 263-334)**
   - PostHog feature flags set up correctly
   - Testing 3 hero variants:
     - **Variant A**: "solve real user problems and deliver products that work"
     - **Variant B**: "design and deliver products that thousands of people actually use"
     - **Variant C**: "get products from idea to user's hands"
   - Tracking `homepage_variant_viewed`
   - Tracking `case_study_clicked` with variant attribution
   - Tracking `about_page_clicked` with variant attribution

2. **Hero Section (lines 77-95)**
   - Professional photo (responsive images for mobile/tablet/desktop)
   - Clear name presentation with SVG logo
   - Dynamic hero text based on A/B test variant
   - Mentions CTO role at A&N Online Marketing

3. **Case Study Cards (lines 97-157)**
   - 3 featured projects with responsive images
   - Proper semantic HTML
   - Good image optimization (webp with fallbacks)

4. **Testimonials Section (lines 177-229)**
   - 4 strong testimonials from credible professionals
   - Good for social proof

### ❌ Critical Problems

#### Problem 1: No Resume Access
**Impact:** Recruiters want resume FIRST, case studies SECOND.

**Current State:**
- Resume link only in mobile nav menu (hidden behind hamburger)
- Resume link only in desktop nav (small, easily missed)
- No prominent "View Resume" CTA anywhere on homepage

**Evidence:** 0 tracked resume clicks (not even in analytics)

#### Problem 2: Generic Case Study Descriptions
**Impact:** Visitors don't see value, don't click.

**Current State:**
```
"Complete inside and outside rethink of how the website performs."
"A custom plugin built for internal use, leading to a better user experience and increased sales."
"New design language that both ignited deep conversations within design & engineering."
```

**Problems:**
- No quantified results visible
- Process-focused, not results-focused
- No indication of business impact
- All descriptions sound similar (no differentiation)

**Your Resume Says:**
- "Increased year-over-year conversion rates by 10%"
- "Managed cross-site deployments... reduce time-to-launch by 30%"
- "Founded and launched Toktix... Event Pages, QR tickets with scanning functionality, Stripe Connect"

**Why This Matters:** Resume shows impact. Homepage doesn't. Disconnect.

#### Problem 3: No Path Segmentation
**Impact:** Visitors don't know where to start exploring.

**Current State:**
- 3 case studies presented equally
- No filtering by role (Product Design vs Engineering vs Systems)
- No filtering by impact type (Conversion vs Performance vs Launch)
- No indication of which projects matter for specific job searches

**Recruiter Reality:**
- Design System recruiter: wants to see Integrate case study
- Full-stack recruiter: wants to see TokTix case study
- Product design recruiter: wants to see NYCNewYears + APCE
- Engineering manager recruiter: wants to see leadership + technical capability

#### Problem 4: No Quick Wins / Impact Strip
**Impact:** Visitors don't see your value prop immediately.

**Current State:**
- Hero text explains WHO you are
- Featured Projects section is 2-3 scrolls down
- No immediate "here's what I've accomplished" visible above the fold

**Best Practice:**
- Impact metrics visible within first scroll
- Clickable "proof points" leading to case studies
- Quick-scan format for recruiters with limited time

#### Problem 5: Testimonials Buried at Bottom
**Impact:** Social proof comes too late in the journey.

**Current State:**
- 4 excellent testimonials (Sandro, Nacer, Thom, Matt)
- All below case studies
- Visitors who bounce at 45s never see them

**Your Testimonials Say:**
- "consistently delivers cutting-edge solutions" - Nacer (COO)
- "ability to lead with clarity made him an indispensable part of our team" - Thom
- "fantastic product designer and an even better teammate" - Matt (COO)

**Why This Matters:** These validate your resume claims. They should be visible earlier.

---

## 🎯 Strategic Optimization Plan

### Design Principle: Layer Information by Priority

**Priority 1 (Above Fold):**
1. Hero with A/B tested copy ✅ (already have this)
2. **Resume CTA** ❌ (missing)
3. **Impact Strip** ❌ (missing)

**Priority 2 (First Scroll):**
4. **Segmentation Tiles** ❌ (missing)
5. Featured Projects with rewritten descriptions ⚠️ (needs improvement)

**Priority 3 (Below Fold):**
6. Side Projects (currently separate section)
7. Testimonials (currently at bottom)

### Key Insight: Don't Break A/B Test

Your hero A/B test is testing **messaging strategy**. Our additions test **information architecture and navigation**. These don't conflict.

**We will NOT touch:**
- Hero section (lines 77-95)
- A/B test variants (lines 276-295)
- Existing PostHog tracking (lines 263-334)

**We will ADD below hero:**
- Resume CTA section
- Impact strip
- Segmentation tiles
- Enhanced PostHog tracking for new elements

---

## 📋 Detailed Implementation Plan

### Phase 1: Resume CTA (Week 1, Day 1-2)

#### Goal
Make resume accessible with ONE click from homepage, tracked in analytics.

#### Implementation

**1. Add Resume CTA Section (Insert after line 95, before line 97)**

```html
<!-- Resume CTA Section - Insert after hero, before Featured Projects -->
<section class="resume-cta">
    <div class="resume-cta__container">
        <a href="/GabeVelezResumeSept2025.pdf"
           target="_blank"
           rel="nofollow noopener"
           class="resume-cta__button"
           id="resume-cta-primary">
            📄 View Resume (PDF)
        </a>
    </div>
</section>
```

**2. Add CSS Styles to `css/style.css`**

```css
/* Resume CTA Section */
.resume-cta {
    padding: 2rem 0;
    background: linear-gradient(
        180deg,
        var(--gabe-black) 0%,
        var(--gabe-darkgray) 100%
    );
}

.resume-cta__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
}

.resume-cta__button {
    display: inline-block;
    padding: 1rem 2rem;
    background: var(--gabe-gold);
    color: var(--gabe-black);
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 1.125rem;
    border-radius: 4px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.resume-cta__button:hover {
    background: linear-gradient(
        45deg,
        rgba(224,170,62,1) 0%,
        rgba(249,242,149,1) 100%
    );
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    color: var(--gabe-black);
}

/* Mobile responsive */
@media (max-width: 768px) {
    .resume-cta {
        padding: 1.5rem 0;
    }

    .resume-cta__button {
        padding: 0.875rem 1.5rem;
        font-size: 1rem;
    }
}
```

**3. Add PostHog Tracking (Insert in DOMContentLoaded listener after line 322)**

```javascript
// Track resume CTA clicks
const resumeCTA = document.getElementById('resume-cta-primary');
if (resumeCTA) {
    resumeCTA.addEventListener('click', function() {
        posthog.capture('resume_cta_clicked', {
            variant: posthog.getFeatureFlag('homepage-redesign-test') || 'control',
            location: 'homepage-primary',
            timestamp: new Date().toISOString()
        });
    });
}
```

**4. Add Sticky Resume Button to Navigation**

**Edit `layout/nav.html` and `layout/nav_index.html` - Add after logo link (around line 19):**

```html
<a href="/GabeVelezResumeSept2025.pdf"
   target="_blank"
   rel="nofollow noopener"
   class="nav__resume-btn"
   id="sticky-resume-btn">
    Resume
</a>
```

**Add CSS to `css/style.css`:**

```css
/* Sticky Resume Button in Nav */
.nav__resume-btn {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    background: var(--gabe-gold);
    color: var(--gabe-black);
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.875rem;
    border-radius: 4px;
    z-index: 9999;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
    pointer-events: none;
}

.nav__resume-btn.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.nav__resume-btn:hover {
    background: linear-gradient(
        45deg,
        rgba(224,170,62,1) 0%,
        rgba(249,242,149,1) 100%
    );
    color: var(--gabe-black);
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .nav__resume-btn {
        font-size: 0.75rem;
        padding: 0.375rem 0.75rem;
        top: 0.75rem;
        right: 0.75rem;
    }
}
```

**Add JavaScript to show/hide on scroll (Insert after line 344):**

```javascript
// Show/hide sticky resume button on scroll
$(function() {
    $(window).on("scroll", function() {
        if($(window).scrollTop() > 300) {
            $("#sticky-resume-btn").addClass("visible");
        } else {
            $("#sticky-resume-btn").removeClass("visible");
        }
    });
});
```

**Add PostHog tracking for sticky button:**

```javascript
// Track sticky resume button clicks
const stickyResumeBtn = document.getElementById('sticky-resume-btn');
if (stickyResumeBtn) {
    stickyResumeBtn.addEventListener('click', function() {
        posthog.capture('resume_cta_clicked', {
            variant: posthog.getFeatureFlag('homepage-redesign-test') || 'control',
            location: 'sticky-nav',
            timestamp: new Date().toISOString()
        });
    });
}
```

#### Success Metrics (Resume CTA)

**Track in PostHog:**
- Resume CTA clicks from homepage-primary
- Resume CTA clicks from sticky-nav
- Resume CTA click rate by A/B test variant
- Time to first resume click per session

**Target:**
- >15% of homepage visitors click resume CTA
- Resume CTA converts better than case study cards initially
- Funnel: Homepage view → Resume click → Return visit → Case study click

---

### Phase 2: TL;DR Impact Strip (Week 1, Day 3-4)

#### Goal
Show quantified achievements immediately, give visitors "proof points" to click.

#### Implementation

**1. Add Impact Strip Section (Insert after Resume CTA, before line 97)**

```html
<!-- TL;DR Impact Strip -->
<section class="impact-strip">
    <div class="impact-strip__container">
        <h2 class="impact-strip__title">Recent Impact</h2>
        <div class="impact-strip__items">
            <a href="case-studies/nycnewyears-dot-com-site-overhaul.html"
               class="impact-item"
               data-metric="48% code reduction"
               data-case="nycnewyears"
               data-tags="engineering,ux">
                <span class="impact-item__metric">48% code reduction</span>
                <span class="impact-item__project">NYCNewYears.com</span>
                <span class="impact-item__tags">🏷️ Engineering • UX</span>
            </a>

            <a href="case-studies/afterpromcentral-events-calendar.html"
               class="impact-item"
               data-metric="3-month launch"
               data-case="apce"
               data-tags="product,systems">
                <span class="impact-item__metric">3-month plugin launch</span>
                <span class="impact-item__project">AfterPromCentral</span>
                <span class="impact-item__tags">🏷️ Product • Systems</span>
            </a>

            <a href="case-studies/integrate-design-system-audit.html"
               class="impact-item"
               data-metric="55% color reduction"
               data-case="integrate"
               data-tags="design-systems,accessibility">
                <span class="impact-item__metric">55% color reduction</span>
                <span class="impact-item__project">Integrate Design System</span>
                <span class="impact-item__tags">🏷️ Design Systems</span>
            </a>

            <a href="side-projects/toktix-ticketing-platform.html"
               class="impact-item"
               data-metric="0→1 launch"
               data-case="toktix"
               data-tags="founder,full-stack">
                <span class="impact-item__metric">0→1 platform, 9 months</span>
                <span class="impact-item__project">TokTix Platform</span>
                <span class="impact-item__tags">🏷️ Founder • Full-Stack</span>
            </a>
        </div>
    </div>
</section>
```

**2. Add CSS Styles to `css/style.css`**

```css
/* Impact Strip */
.impact-strip {
    padding: 3rem 0;
    background: var(--gabe-darkgray);
}

.impact-strip__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.impact-strip__title {
    text-align: center;
    font-size: 1.75rem;
    margin-bottom: 2rem;
    color: var(--gabe-white);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.impact-strip__items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.impact-item {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background: var(--gabe-black);
    border-left: 4px solid var(--gabe-gold);
    text-decoration: none;
    transition: all 0.3s ease;
    border-radius: 4px;
}

.impact-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    border-left-color: var(--gabe-white);
}

.impact-item__metric {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--gabe-gold);
    margin-bottom: 0.5rem;
    display: block;
}

.impact-item__project {
    font-size: 0.875rem;
    color: var(--gabe-white);
    margin-bottom: 0.75rem;
    display: block;
    opacity: 0.9;
}

.impact-item__tags {
    font-size: 0.75rem;
    color: var(--gabe-white);
    opacity: 0.7;
    display: block;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .impact-strip {
        padding: 2rem 0;
    }

    .impact-strip__title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .impact-strip__items {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .impact-item {
        padding: 1.25rem;
    }

    .impact-item__metric {
        font-size: 1.125rem;
    }
}

/* Tablet responsive */
@media (min-width: 769px) and (max-width: 1024px) {
    .impact-strip__items {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

**3. Add PostHog Tracking (Insert in DOMContentLoaded listener)**

```javascript
// Track impact strip clicks
document.querySelectorAll('.impact-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
        posthog.capture('impact_bullet_clicked', {
            variant: posthog.getFeatureFlag('homepage-redesign-test') || 'control',
            metric: this.getAttribute('data-metric'),
            case_study: this.getAttribute('data-case'),
            tags: this.getAttribute('data-tags'),
            timestamp: new Date().toISOString()
        });
    });
});
```

#### Success Metrics (Impact Strip)

**Track in PostHog:**
- Impact bullet clicks (which metrics drive most clicks?)
- Impact bullet click rate by A/B test variant
- Impact bullet → case study engagement time (do they read after clicking?)
- Most clicked metric (is "48% code reduction" more compelling than "0→1 launch"?)

**Target:**
- >25% of homepage visitors click at least one impact bullet
- Impact strip drives more case study traffic than Featured Projects cards
- Time on case study >90s when arriving from impact strip (shows engagement)

---

### Phase 3: Rewrite Case Study Card Descriptions (Week 1, Day 5)

#### Goal
Make case study cards results-focused, not process-focused. Show impact immediately.

#### Current vs Proposed

**NYCNewYears.com (line 108)**

```html
<!-- BEFORE -->
<p class="card__description">Complete inside and outside rethink of how the website performs.</p>

<!-- AFTER -->
<p class="card__description">
    <strong>48% code reduction</strong> while optimizing for 83% mobile traffic.
    E-commerce site serving thousands of international tourists.
</p>
```

**AfterPromCentral (line 119)**

```html
<!-- BEFORE -->
<p class="card__description">A custom plugin built for internal use, leading to a better user experience and increased sales.</p>

<!-- AFTER -->
<p class="card__description">
    <strong>3-month launch.</strong> WordPress plugin eliminating HTML editing errors,
    boosting conversions for 20-30 seasonal events.
</p>
```

**Integrate Design System (line 130)**

```html
<!-- BEFORE -->
<p class="card__description">New design language that both ignited deep conversations within design & engineering.</p>

<!-- AFTER -->
<p class="card__description">
    <strong>55% color reduction, 33% typography simplification.</strong>
    Unified design system across 3 acquired companies.
</p>
```

**TokTix (line 171)**

```html
<!-- BEFORE -->
<p class="card__description">Complete mobile/web events solution I founded and created</p>

<!-- AFTER -->
<p class="card__description">
    <strong>95% beta-ready, 9 months, solo dev.</strong>
    React Native + Next.js + Firebase ticketing platform with Stripe integration.
</p>
```

#### Additional Enhancement: Add Impact Badges to Cards

**Insert before card description for each case study:**

```html
<!-- Example for NYCNewYears card -->
<div class="card__badges">
    <span class="card__badge card__badge--metric">48% Code Reduction</span>
    <span class="card__badge card__badge--timeline">3 Months</span>
</div>
```

**Add CSS:**

```css
.card__badges {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
}

.card__badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.025em;
}

.card__badge--metric {
    background: var(--gabe-gold);
    color: var(--gabe-black);
}

.card__badge--timeline {
    background: var(--gabe-teal);
    color: var(--gabe-white);
}

.card__badge--tech {
    background: var(--gabe-sage);
    color: var(--gabe-white);
}
```

#### Success Metrics (Card Rewrites)

**Compare in PostHog:**
- Case study clicks BEFORE card rewrite (current: 6 views from 60 homepage views = 10%)
- Case study clicks AFTER card rewrite (target: >20%)
- Which case study benefits most from impact-first description?
- Time on case study page after clicking from card (engagement quality)

**Target:**
- >20% click-through rate on case study cards (2x current)
- NYCNewYears + TokTix become most-clicked (strongest metrics)

---

### Phase 4: Segmentation Tiles (Week 2, Day 1-3)

#### Goal
Let visitors self-select by role/focus area. Guide them to relevant case studies.

#### Implementation

**1. Add Segmentation Section (Insert after Impact Strip, before Featured Projects)**

```html
<!-- Segmentation Tiles -->
<section class="segmentation">
    <div class="segmentation__container">
        <h2 class="segmentation__title">Explore by Focus</h2>
        <p class="segmentation__subtitle">Choose the area most relevant to your search</p>
        <div class="segmentation__tiles">
            <a href="#featured-projects"
               class="segment-tile segment-tile--gold"
               data-segment="product-ux"
               data-filter="product-ux">
                <span class="segment-tile__icon">🎨</span>
                <span class="segment-tile__label">Product & UX</span>
                <span class="segment-tile__count">3 projects</span>
            </a>

            <a href="#featured-projects"
               class="segment-tile segment-tile--teal"
               data-segment="design-systems"
               data-filter="design-systems">
                <span class="segment-tile__icon">🧩</span>
                <span class="segment-tile__label">Design Systems</span>
                <span class="segment-tile__count">1 project</span>
            </a>

            <a href="#featured-projects"
               class="segment-tile segment-tile--sage"
               data-segment="frontend"
               data-filter="frontend">
                <span class="segment-tile__icon">💻</span>
                <span class="segment-tile__label">Front-End Engineering</span>
                <span class="segment-tile__count">3 projects</span>
            </a>

            <a href="#featured-projects"
               class="segment-tile segment-tile--red"
               data-segment="founder"
               data-filter="founder">
                <span class="segment-tile__icon">🚀</span>
                <span class="segment-tile__label">Founder / 0→1</span>
                <span class="segment-tile__count">1 project</span>
            </a>
        </div>
    </div>
</section>
```

**2. Add Data Attributes to Case Study Cards (for filtering)**

**Edit existing cards to add data-categories attribute:**

```html
<!-- NYCNewYears card -->
<a class="card"
   href="case-studies/nycnewyears-dot-com-site-overhaul.html"
   data-categories="product-ux frontend">
   <!-- existing content -->
</a>

<!-- AfterPromCentral card -->
<a class="card"
   href="case-studies/afterpromcentral-events-calendar.html"
   data-categories="product-ux frontend">
   <!-- existing content -->
</a>

<!-- Integrate Design System card -->
<a class="card"
   href="case-studies/integrate-design-system-audit.html"
   data-categories="design-systems">
   <!-- existing content -->
</a>

<!-- TokTix card -->
<a class="card"
   href="side-projects/toktix-ticketing-platform.html"
   data-categories="founder frontend product-ux">
   <!-- existing content -->
</a>
```

**3. Add CSS Styles to `css/style.css`**

```css
/* Segmentation Section */
.segmentation {
    padding: 3rem 0;
    background: var(--gabe-black);
}

.segmentation__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.segmentation__title {
    text-align: center;
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
    color: var(--gabe-white);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.segmentation__subtitle {
    text-align: center;
    font-size: 1rem;
    margin-bottom: 2rem;
    color: var(--gabe-white);
    opacity: 0.7;
}

.segmentation__tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.segment-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: var(--gabe-darkgray);
    text-decoration: none;
    transition: all 0.3s ease;
    border-radius: 8px;
    border: 2px solid transparent;
    min-height: 180px;
}

.segment-tile:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

.segment-tile--gold {
    border-color: var(--gabe-gold);
}

.segment-tile--gold:hover {
    background: var(--gabe-gold);
}

.segment-tile--gold:hover .segment-tile__label,
.segment-tile--gold:hover .segment-tile__count {
    color: var(--gabe-black);
}

.segment-tile--teal {
    border-color: var(--gabe-teal);
}

.segment-tile--teal:hover {
    background: var(--gabe-teal);
}

.segment-tile--sage {
    border-color: var(--gabe-sage);
}

.segment-tile--sage:hover {
    background: var(--gabe-sage);
}

.segment-tile--red {
    border-color: var(--gabe-red);
}

.segment-tile--red:hover {
    background: var(--gabe-red);
}

.segment-tile__icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
}

.segment-tile__label {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--gabe-white);
    text-align: center;
    margin-bottom: 0.5rem;
    transition: color 0.3s ease;
}

.segment-tile__count {
    font-size: 0.875rem;
    color: var(--gabe-white);
    opacity: 0.7;
    transition: color 0.3s ease;
}

/* Active state when filtering */
.segment-tile.active {
    background: var(--gabe-gold);
    border-color: var(--gabe-gold);
}

.segment-tile.active .segment-tile__label,
.segment-tile.active .segment-tile__count {
    color: var(--gabe-black);
}

/* Mobile responsive */
@media (max-width: 768px) {
    .segmentation {
        padding: 2rem 0;
    }

    .segmentation__title {
        font-size: 1.5rem;
    }

    .segmentation__tiles {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .segment-tile {
        padding: 1.5rem 0.75rem;
        min-height: 150px;
    }

    .segment-tile__icon {
        font-size: 2.5rem;
        margin-bottom: 0.75rem;
    }

    .segment-tile__label {
        font-size: 1rem;
    }
}

/* Card filtering states */
.card.hidden {
    display: none;
}

.card.visible {
    display: block;
}
```

**4. Add JavaScript for Filtering (Insert after PostHog script)**

```javascript
// Segment tile filtering
document.addEventListener('DOMContentLoaded', function() {
    const segmentTiles = document.querySelectorAll('.segment-tile');
    const caseCards = document.querySelectorAll('.card[data-categories]');
    let activeFilter = null;

    segmentTiles.forEach(function(tile) {
        tile.addEventListener('click', function(e) {
            e.preventDefault();

            const filter = this.getAttribute('data-filter');

            // Track the click
            posthog.capture('segment_tile_clicked', {
                variant: posthog.getFeatureFlag('homepage-redesign-test') || 'control',
                segment: this.getAttribute('data-segment'),
                filter: filter,
                timestamp: new Date().toISOString()
            });

            // Toggle active state
            if (activeFilter === filter) {
                // Clicking the same tile again shows all cards
                activeFilter = null;
                segmentTiles.forEach(t => t.classList.remove('active'));
                caseCards.forEach(card => {
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                });
            } else {
                // Apply new filter
                activeFilter = filter;

                // Update tile states
                segmentTiles.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Filter cards
                caseCards.forEach(function(card) {
                    const categories = card.getAttribute('data-categories').split(' ');
                    if (categories.includes(filter)) {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('visible');
                    }
                });
            }

            // Smooth scroll to Featured Projects section
            document.getElementById('featured-projects').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
});
```

**5. Add ID to Featured Projects Section (line 97)**

```html
<!-- BEFORE -->
<section class="cases">

<!-- AFTER -->
<section class="cases" id="featured-projects">
```

#### Success Metrics (Segmentation)

**Track in PostHog:**
- Segment tile clicks (which focus areas get most clicks?)
- Segment tile → filtered card click (do visitors click after filtering?)
- Segment tile click rate by A/B test variant
- Most popular segment (Product & UX vs Frontend vs Design Systems vs Founder)

**Target:**
- >40% of visitors click at least one segment tile
- Filtered cards get higher click-through rate than unfiltered (shows value of segmentation)
- "Founder / 0→1" segment drives TokTix clicks (validate positioning)

---

### Phase 5: Enhanced PostHog Analytics (Week 2, Day 4-5)

#### Goal
Comprehensive tracking to measure success of all homepage changes.

#### Implementation

**1. Add Scroll Depth Tracking**

**Insert after existing PostHog script (line 334):**

```javascript
// Scroll depth tracking
(function() {
    let scrollDepthTracked = {
        25: false,
        50: false,
        75: false,
        100: false
    };

    let lastScrollPercent = 0;
    let scrollTimer = null;

    function trackScrollDepth() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        // Track milestones
        Object.keys(scrollDepthTracked).forEach(function(depth) {
            const depthNum = parseInt(depth);
            if (scrollPercent >= depthNum && !scrollDepthTracked[depth]) {
                scrollDepthTracked[depth] = true;
                posthog.capture('homepage_scroll_depth', {
                    variant: posthog.getFeatureFlag('homepage-redesign-test') || 'control',
                    depth_percent: depthNum,
                    timestamp: new Date().toISOString()
                });
            }
        });

        lastScrollPercent = scrollPercent;
    }

    // Throttled scroll handler
    window.addEventListener('scroll', function() {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(trackScrollDepth, 150);
    });
})();
```

**2. Add Time on Page Tracking**

```javascript
// Track time on page
(function() {
    const startTime = Date.now();

    // Track when user leaves page
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000); // seconds

        posthog.capture('homepage_time_spent', {
            variant: posthog.getFeatureFlag('homepage-redesign-test') || 'control',
            seconds: timeOnPage,
            timestamp: new Date().toISOString()
        });
    });

    // Also track at intervals for users who keep page open
    setInterval(function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);

        // Track every 30 seconds
        if (timeOnPage % 30 === 0) {
            posthog.capture('homepage_time_interval', {
                variant: posthog.getFeatureFlag('homepage-redesign-test') || 'control',
                seconds: timeOnPage,
                timestamp: new Date().toISOString()
            });
        }
    }, 1000);
})();
```

**3. Add Rage Click Detection**

```javascript
// Detect rage clicks (clicking same element multiple times quickly)
(function() {
    const clickCounts = {};
    const rageThreshold = 3; // 3 clicks in 2 seconds
    const timeWindow = 2000; // 2 seconds

    document.addEventListener('click', function(e) {
        const element = e.target;
        const selector = element.tagName + (element.className ? '.' + element.className.replace(/\s+/g, '.') : '');

        if (!clickCounts[selector]) {
            clickCounts[selector] = [];
        }

        const now = Date.now();
        clickCounts[selector].push(now);

        // Remove old clicks outside time window
        clickCounts[selector] = clickCounts[selector].filter(time => now - time < timeWindow);

        // Check for rage click
        if (clickCounts[selector].length >= rageThreshold) {
            posthog.capture('rage_click_detected', {
                variant: posthog.getFeatureFlag('homepage-redesign-test') || 'control',
                element: selector,
                click_count: clickCounts[selector].length,
                timestamp: new Date().toISOString()
            });

            // Reset to avoid duplicate tracking
            clickCounts[selector] = [];
        }
    });
})();
```

**4. Add Exit Intent Tracking**

```javascript
// Track exit intent (mouse leaving top of viewport)
(function() {
    let exitIntentFired = false;

    document.addEventListener('mouseout', function(e) {
        if (exitIntentFired) return;

        // Check if mouse is leaving from top of page
        if (e.clientY < 10 && !e.relatedTarget) {
            exitIntentFired = true;

            const timeOnPage = Math.round((Date.now() - performance.timing.navigationStart) / 1000);

            posthog.capture('exit_intent_detected', {
                variant: posthog.getFeatureFlag('homepage-redesign-test') || 'control',
                time_on_page_seconds: timeOnPage,
                timestamp: new Date().toISOString()
            });
        }
    });
})();
```

#### Success Metrics (Enhanced Analytics)

**New Insights from Analytics:**

1. **Scroll Depth by Variant**
   - Which A/B test variant keeps users scrolling?
   - Do users reach Featured Projects section (line 97)?
   - What % reach Testimonials section (line 177)?

2. **Time on Page by Variant**
   - Which variant keeps users engaged longest?
   - Target: Increase from 45s average to >90s

3. **Rage Clicks**
   - Are users clicking case study cards that aren't working?
   - Are segment tiles confusing?
   - Are resume CTAs clickable but broken?

4. **Exit Intent**
   - At what scroll depth do users leave?
   - How long before they try to exit?
   - Can we show exit popup with resume CTA? (future consideration)

---

### Phase 6: PostHog Funnels Setup (Week 2, Day 5)

#### Goal
Track complete user journeys to identify drop-off points.

#### Funnels to Create in PostHog Dashboard

**Funnel 1: Resume-First Journey**
1. Homepage view
2. Resume CTA click (homepage-primary OR sticky-nav)
3. Return to site (within 7 days)
4. Case study click

**Purpose:** Do resume-first visitors convert to engaged readers?

---

**Funnel 2: Impact-Driven Journey**
1. Homepage view
2. Impact bullet click
3. Case study engagement (scroll >50%)
4. Resume CTA click

**Purpose:** Does impact strip drive quality engagement?

---

**Funnel 3: Segmentation Journey**
1. Homepage view
2. Segment tile click
3. Filtered case study click
4. Case study engagement (scroll >50%)

**Purpose:** Does segmentation improve case study relevance?

---

**Funnel 4: Traditional Journey (Control)**
1. Homepage view
2. Scroll to Featured Projects section (>50% depth)
3. Case study click
4. Case study engagement (scroll >50%)

**Purpose:** Baseline funnel to compare against new journeys

---

**Funnel 5: Complete Conversion**
1. Homepage view
2. ANY interaction (resume, impact, segment, case study)
3. Case study engagement (>90s)
4. Resume download

**Purpose:** Ultimate conversion - from homepage to resume download

---

#### Success Metrics (Funnels)

**Compare Funnel Performance:**
- Which journey has highest completion rate?
- Which journey has fastest time to conversion?
- Which A/B test variant performs best in each funnel?

**Target Funnel Improvements:**
- Resume-First Journey: >30% complete funnel (homepage → resume → return → case study)
- Impact-Driven Journey: >40% complete funnel (homepage → impact → engagement → resume)
- Segmentation Journey: >35% complete funnel (homepage → segment → case study → engagement)

---

## 📊 Before/After Comparison

### Current State (Baseline)

**Traffic:**
- Homepage: 60 views (89%)
- Case studies: 6 views (9%)
- Conversion rate: 10%

**Engagement:**
- Avg time on homepage: 45s
- Avg time on case studies: 2-30s
- Bounce rate: ~91%

**Resume Access:**
- Resume clicks: 0 (not tracked)
- Resume prominence: Low (hidden in nav menu)

**Case Study Discovery:**
- Path to case studies: Scroll to Featured Projects → Hope something looks interesting → Click
- Differentiation: Low (all cards look similar)
- Impact visibility: Low (results buried in case studies)

---

### Target State (After All Phases)

**Traffic:**
- Homepage: Maintain ~60 views
- Case studies: >20 views (>33%)
- Conversion rate: >33% (3x improvement)

**Engagement:**
- Avg time on homepage: <30s (faster routing to action)
- Avg time on case studies: >90s (quality engagement)
- Bounce rate: <60% (31% reduction)

**Resume Access:**
- Resume clicks: >15% of homepage visitors
- Resume prominence: High (primary CTA + sticky button)
- Resume as entry point: New funnel (homepage → resume → return → case studies)

**Case Study Discovery:**
- Multiple paths:
  - Path 1: Resume CTA → Resume → Return visit → Case studies
  - Path 2: Impact strip → Specific case study
  - Path 3: Segment tiles → Filtered case studies → Relevant projects
  - Path 4: Traditional scroll → Featured Projects
- Differentiation: High (impact metrics visible, role tags, tech stack)
- Impact visibility: High (metrics in 3 places: impact strip, card badges, card descriptions)

---

## 🎯 Critical Success Factors

### Must-Have Outcomes

1. **Resume accessibility >15% click rate**
   - If this fails: Resume not prominent enough OR visitors don't want PDF
   - Solution: Test different CTA copy ("View Full Resume" vs "Download Resume" vs "See Experience")

2. **Case study views >20 (3x increase)**
   - If this fails: New elements don't drive traffic OR A/B test variant problem
   - Solution: Test different impact strip metrics OR reorder elements

3. **Time on case studies >90s**
   - If this fails: Wrong visitors clicking OR case study content needs work
   - Solution: Review session recordings, improve case study content (Phase 7)

4. **One funnel >30% completion rate**
   - If this fails: Drop-off at specific step identifies problem
   - Solution: Fix that specific step (e.g., if drop-off at "impact → case study", improve impact strip)

### Nice-to-Have Outcomes

5. Scroll depth >75% for >30% of visitors (shows engagement)
6. Segment tile clicks >40% of visitors (shows value of segmentation)
7. Multiple case studies viewed per session (shows exploration)
8. Return visits within 7 days (shows interest)

---

## 🚀 Implementation Timeline

### Week 1: Core Homepage Fixes

**Day 1-2: Resume CTA**
- Add primary resume CTA section
- Add sticky resume button to nav
- Add PostHog tracking for resume clicks
- Test on mobile/tablet/desktop
- **Deliverable:** Resume accessible with 1 click, tracked in analytics

**Day 3-4: Impact Strip**
- Add TL;DR impact strip section
- Add CSS styling
- Add PostHog tracking for impact bullet clicks
- Test responsive layout
- **Deliverable:** Impact metrics visible, clickable, tracked

**Day 5: Card Rewrites**
- Rewrite all case study card descriptions (impact-first)
- Add impact badges to cards
- Test new copy with team for approval
- **Deliverable:** Case study cards show quantified results

---

### Week 2: Segmentation & Analytics

**Day 1-2: Segmentation Tiles**
- Add segmentation section with 4 tiles
- Add data-categories to case study cards
- Add filtering JavaScript
- Test filter logic on all cards
- **Deliverable:** Segmentation working, smooth scroll to filtered projects

**Day 3: Testing & QA**
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile testing (iOS, Android)
- Test all PostHog events firing correctly
- Fix any bugs or edge cases
- **Deliverable:** All features working across devices

**Day 4-5: Enhanced Analytics**
- Add scroll depth tracking
- Add time on page tracking
- Add rage click detection
- Add exit intent tracking
- Set up PostHog funnels in dashboard
- **Deliverable:** Comprehensive analytics in place

---

### Week 3: Monitoring & Iteration

**Day 1-7: Data Collection**
- Monitor PostHog dashboard daily
- Review A/B test variant performance
- Check funnel completion rates
- Identify any unexpected issues
- **Deliverable:** 7 days of clean data

**Week 4+: Analysis & Optimization**
- Analyze which changes drove most impact
- Identify winning A/B test variant
- Optimize underperforming elements
- Plan Phase 7 (case study content improvements)

---

## 📝 Files to Edit Summary

### New Files to Create
None (all additions to existing files)

### Existing Files to Edit

**1. `index.html` (Primary file)**
- Line 95: Insert Resume CTA section
- Line 95: Insert Impact Strip section
- Line 95: Insert Segmentation section
- Line 97: Add `id="featured-projects"` to cases section
- Line 100-132: Add `data-categories` attributes to case study cards
- Line 108, 119, 130, 171: Rewrite card descriptions
- Line 313-334: Enhance PostHog tracking in DOMContentLoaded
- Line 334: Add scroll depth tracking script
- Line 334: Add time on page tracking script
- Line 334: Add rage click detection script
- Line 334: Add exit intent tracking script
- Line 344: Add sticky resume button show/hide script

**2. `layout/nav.html`**
- Line ~19: Add sticky resume button after logo link

**3. `layout/nav_index.html`**
- Line ~19: Add sticky resume button after logo link

**4. `css/style.css`**
- Add: Resume CTA section styles
- Add: Sticky resume button styles
- Add: Impact strip styles
- Add: Segmentation section styles
- Add: Segment tile styles
- Add: Card badge styles
- Add: Mobile responsive adjustments

---

## ⚠️ Important Notes

### Do NOT Touch

1. **Hero Section (lines 77-95)** - A/B test in progress
2. **A/B Test Variants (lines 276-295)** - Working correctly
3. **Existing PostHog Tracking (lines 312-322)** - Keep intact, enhance only

### Preserve Functionality

1. **Existing case study click tracking** - Add to it, don't replace
2. **About page click tracking** - Keep as-is
3. **Homepage variant viewed tracking** - Keep as-is
4. **jQuery scroll behavior (lines 335-344)** - Keep for logo animation

### Testing Checklist Before Launch

- [ ] All resume CTAs link to `/GabeVelezResumeSept2025.pdf`
- [ ] Resume CTAs open in new tab (`target="_blank"`)
- [ ] All PostHog events fire correctly (test in browser console)
- [ ] Segment tile filtering works (click each tile, verify filtering)
- [ ] Smooth scroll to Featured Projects works
- [ ] Mobile responsive (test on actual mobile device)
- [ ] All images load correctly
- [ ] No JavaScript errors in console
- [ ] A/B test still working (clear cookies, refresh multiple times)

---

## 📈 Monitoring Plan

### Week 1: Daily Checks
- PostHog dashboard: resume CTA clicks
- PostHog dashboard: impact bullet clicks
- PostHog dashboard: case study clicks by source
- Google Analytics: confirm traffic maintained
- Session recordings: watch 5 user sessions per day

### Week 2: Analytics Deep Dive
- Compare A/B test variant performance
- Identify winning variant (highest case study click rate)
- Review funnel completion rates
- Check for rage clicks or broken elements
- Review scroll depth by variant

### Week 3: Optimization
- If resume CTA <10% click rate: test different copy
- If impact strip <20% click rate: test different metrics or positioning
- If segmentation <30% click rate: test different labels or descriptions
- If case study views <15: review session recordings for drop-off point

### Week 4: Decision Point
- Keep or remove underperforming elements
- Declare A/B test winner, remove losing variants
- Plan Phase 7 (case study content optimization)
- Plan Phase 8 (Work landing page with advanced filtering)

---

## 🎯 Next Phase Preview

### Phase 7: Case Study Content Optimization (Month 2)

**Once homepage funnel is optimized, focus on case study pages:**

1. **Rewrite Case Studies (Impact-First Format)**
   - Move Results sections to top
   - Add Impact Snapshot (3 bullets with metrics)
   - Add case study sidebar with Resume link + Related Projects
   - Add Skills Used tags

2. **Add Progressive Disclosure**
   - Expandable technical sections
   - "Read More" buttons for long content
   - Table of contents for long case studies

3. **Enhanced Media**
   - More before/after comparisons
   - Interactive demos where possible
   - Better image captions with context

**Goal:** Visitors who click case studies stay >90s and read to completion

---

### Phase 8: Work Landing Page (Month 3)

**Create dedicated `/work.html` page with advanced filtering:**

1. **Multi-Filter System**
   - By Role (Product, Engineering, Systems, Founder)
   - By Platform (Web, Mobile, Hybrid)
   - By Industry (E-commerce, SaaS, Events)
   - By Impact (Conversion, Performance, Accessibility, Launch)

2. **Case Study Grid**
   - All 4 case studies visible
   - Filter by multiple categories simultaneously
   - Sort by date or impact

3. **Deep Linking**
   - URL parameters for filters (e.g., `/work?role=engineering&platform=web`)
   - Share filtered views

**Goal:** Segmentation tiles link to Work page, providing more granular exploration

---

## ✅ Definition of Done

### Phase 1-5 Complete When:

- [x] Resume CTA visible on homepage (primary + sticky)
- [x] Resume CTA tracked in PostHog
- [x] Impact strip showing 4 metrics with role tags
- [x] Impact bullet clicks tracked in PostHog
- [x] All case study card descriptions rewritten (impact-first)
- [x] Segmentation tiles working with filtering logic
- [x] Segment tile clicks tracked in PostHog
- [x] Scroll depth tracking implemented
- [x] Time on page tracking implemented
- [x] Rage click detection implemented
- [x] Exit intent tracking implemented
- [x] 5 funnels created in PostHog dashboard
- [x] All features tested on mobile/tablet/desktop
- [x] No JavaScript errors in console
- [x] A/B test still functioning correctly
- [x] 7 days of clean analytics data collected

### Success Criteria After 2 Weeks:

- [ ] Case study views >20 (from current 6) = **3x improvement**
- [ ] Resume CTA clicks >15% of homepage visitors
- [ ] Impact bullet clicks >25% of homepage visitors
- [ ] Segment tile clicks >35% of homepage visitors
- [ ] At least one funnel >30% completion rate
- [ ] Bounce rate <70% (from current 91%)
- [ ] Avg time on case studies >90s (from current 2-30s)

**If all criteria met:** Proceed to Phase 7 (case study content optimization)
**If criteria not met:** Review analytics, identify bottleneck, iterate on homepage

---

**Document Version:** 1.0
**Last Updated:** September 30, 2025
**Next Review:** Week 2 (Analytics Check-in)