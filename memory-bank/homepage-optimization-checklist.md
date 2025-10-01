# Homepage Optimization Checklist & Progress Tracker

**Project:** GabeVelez.com Homepage Conversion Optimization
**Goal:** Increase case study engagement from 10% to >25%
**Strategy:** Prove resume claims visually on homepage

---

## 📊 Current Baseline (Sept 1-28, 2025)

- [x] **Homepage views:** 60 (89% of traffic)
- [x] **Case study views:** 6 (9% of traffic)
- [x] **Click-through rate:** 10%
- [x] **Avg time on homepage:** 45 seconds
- [x] **Avg time on case studies:** 2-30 seconds
- [x] **Bounce rate:** ~91%

**Target After Implementation:**
- [ ] **Case study views:** >20 (from 60 homepage views)
- [ ] **Click-through rate:** >25%
- [ ] **Avg time on case studies:** >60 seconds
- [ ] **Bounce rate:** <75%

---

## 🎯 Week 1: Prove Resume Claims on Homepage

### Phase 1: Impact-First Card Descriptions ✅ COMPLETE

**Goal:** Show metrics/results in card descriptions before visitors click

#### NYCNewYears.com Card
- [x] **Read current description** (index.html line 108)
- [x] **Rewrite to impact-first:**
  - [x] Include "48% code reduction (8.2MB → 4.2MB)"
  - [x] Include "83% mobile traffic" → CHANGED: "thousands of tourists"
  - [x] Mention "thousands of international tourists"
  - [x] Keep under 200 characters
  - **Final:** "Slashing 48% of code to keep one of NYC's biggest NYE sites running smoothly for thousands of tourists"
- [ ] **Add `<strong>` tags** to key metrics (deferred - not needed for now)
- [x] **Test on mobile/tablet/desktop** for readability

#### AfterPromCentral Card
- [x] **Read current description** (index.html line 119)
- [x] **Rewrite to impact-first:**
  - [x] Include "3-month end-to-end launch"
  - [x] Include "boosting conversions"
  - [x] Mention "eliminated content errors"
  - [x] Reference "20-30 seasonal events"
  - [x] Keep under 200 characters
  - **Final:** "A custom calendar plugin Built in under 3 months that boosted conversions and eliminated content errors across 20-30 seasonal events"
- [ ] **Add `<strong>` tags** to key metrics (deferred - not needed for now)
- [x] **Test on mobile/tablet/desktop** for readability

#### Integrate Design System Card
- [x] **Read current description** (index.html line 130)
- [x] **Rewrite to impact-first:**
  - [x] Include "55% color reduction (103→46)"
  - [x] Include "33% typography simplification" → CHANGED: "Typography audit"
  - [x] Mention "unified 3 acquired companies"
  - [x] Include "WCAG accessibility compliance"
  - [x] Keep under 200 characters
  - **Final:** "Unified the design language of 3 companies. 55% fewer colors. Typography audit with WCAG compliance"
- [ ] **Add `<strong>` tags** to key metrics (deferred - not needed for now)
- [x] **Test on mobile/tablet/desktop** for readability

#### TokTix Card
- [x] **Read current description** (index.html line 171)
- [x] **Rewrite to impact-first:**
  - [x] Include "95% beta-ready in 9 months" → CHANGED: "9 months"
  - [x] Include "solo development" → "Solo-launched"
  - [x] Mention "React Native + Next.js + Firebase"
  - [x] Include "Stripe integration"
  - [x] Reference "0→1 product" (implied in "Solo-launched")
  - [x] Keep under 200 characters
  - **Final:** "Solo-launched a complete mobile/web events platform in 9 months with React Native, Next.js, Firebase, and Stripe integration"
- [ ] **Add `<strong>` tags** to key metrics (deferred - not needed for now)
- [x] **Test on mobile/tablet/desktop** for readability

#### PostHog Tracking Enhancement
- [ ] **Add hover time tracking** for cards (deferred to Phase 2+)
  - [ ] Track how long users hover over each card
  - [ ] Track by A/B test variant
  - [ ] Track which card gets most hovers
- [x] **Update case study click tracking** to include side projects
  - [x] Updated selector to `.cases a, .side-projects a`
  - [x] All case study clicks now tracked consistently

#### Testing & Validation
- [x] **Visual QA:**
  - [x] Desktop (Chrome, Firefox, Safari) - tested locally
  - [x] Tablet (iPad, Android tablet) - responsive
  - [x] Mobile (iPhone, Android phone) - responsive
- [x] **Content QA:**
  - [x] All numbers accurate (match case studies)
  - [x] No typos
  - [x] Descriptions fit within card layout
- [x] **Analytics QA:**
  - [x] PostHog events firing correctly
  - [ ] Hover tracking working (deferred)
  - [x] Click tracking includes case studies + side projects

#### Success Criteria (Phase 1)
- [x] **All 4 card descriptions rewritten** ✅
- [x] **Metrics visible before clicking** ✅
- [x] **Mobile responsive** ✅
- [x] **PostHog tracking working** ✅
- [ ] **Baseline data collected** (48 hours) - PENDING
- [ ] **Click-through rate increases by >5%** (10% → 15%+) - PENDING

---

### Phase 2: Category Badges on Cards ✅ COMPLETE (Modified Approach)

**Goal:** Make work categories scannable at a glance with badges
**Change:** Instead of impact metric badges (48% Code Reduction), used category badges (Product Design, Engineering, Systems, 0→1/Founder)

#### Badge HTML Structure
- [x] **Create badge HTML template**
  - [x] Define `<div class="card__badges">` container
  - [x] Define `<span class="card__badge">` element (no type variants needed)
  - [x] Changed approach: Category badges instead of metric badges
- [x] **Add badges to NYCNewYears card** (above title)
  - [x] Product Design
  - [x] Engineering
  - [x] Systems
- [x] **Add badges to APCE card** (above title)
  - [x] Product Design
  - [x] Engineering
- [x] **Add badges to Integrate card** (above title)
  - [x] Product Design
  - [x] Systems
- [x] **Add badges to TokTix card** (above title)
  - [x] Product Design
  - [x] Engineering
  - [x] 0→1/Founder

#### Badge CSS Styling
- [x] **Create base badge styles** (css/style.css)
  - [x] `.card__badges` container (flexbox, gap, wrap, center)
  - [x] `.card__badge` base styles (padding, font, border-radius)
  - [x] Subtle background: `rgba(255, 255, 255, 0.1)`
  - [x] Uppercase, small text, letter spacing
- [x] **Mobile responsive adjustments**
  - [x] Font size: 0.75rem (responsive)
  - [x] Padding: 0.25rem 0.625rem
  - [x] Badges wrap properly with gap: 0.5rem

#### PostHog Tracking for Badges
- [x] **No tracking needed** - badges are informational, not interactive

#### Testing & Validation
- [x] **Visual QA:**
  - [x] Badges readable on all devices
  - [x] Badges don't overlap with text
  - [x] Consistent styling across all cards
- [x] **Layout QA:**
  - [x] Badges display above title (best practice for card patterns)
  - [x] Proper spacing: 0.75rem margin-bottom
  - [x] Badges wrap correctly on narrow screens
- [x] **Analytics QA:**
  - [x] No tracking needed (passive information display)

#### Success Criteria (Phase 2)
- [x] **All 4 cards have category badges** ✅
- [x] **Badges clearly identify work type** ✅
- [x] **Mobile responsive** ✅
- [ ] **Click-through rate >20%** (from baseline 10%) - PENDING MEASUREMENT

---

### Phase 2.5: Category Filter Tiles ❌ CANCELLED

**Goal:** Allow visitors to filter case studies by category (Product Design, Engineering, Systems, 0→1/Founder)
**Status:** Attempted, then removed and replaced with static category badges

#### Reason for Cancellation:
- Filter buttons only affected "Featured Projects" section, not "Side Projects"
- Would require moving TokTix from Side Projects to Featured Projects
- Dynamic filtering created confusing UX (cards disappearing/appearing)
- **Better solution:** Static category badges (implemented in Phase 2) provide same information without interaction complexity

#### What Was Built & Removed:
- [x] Built filter HTML with 5 buttons (All Work, Product Design, Engineering, Systems, 0→1/Founder)
- [x] Built filter CSS (gold active state, hover effects)
- [x] Built JavaScript filtering logic with active state management
- [x] Built PostHog tracking for filter interactions
- [x] **All code removed** - replaced with static category badges instead

#### Lessons Learned:
- Interactive filtering works best when all filterable items are in same container
- For small portfolios (4 cards), static badges > dynamic filters
- Simplicity > complexity when information is already scannable

---

### Phase 3: Feature Best Work 📋 PENDING

**Goal:** Guide visitors to strongest case study first (NYCNewYears.com)

#### Visual Hierarchy
- [ ] **Add "Featured Work" label to NYCNewYears card**
  - [ ] Create `<span class="card__label">Featured Work</span>`
  - [ ] Position absolutely (top-left corner)
  - [ ] Style with gold background
- [ ] **Add featured card styling**
  - [ ] Gold border (`border: 2px solid var(--gabe-gold)`)
  - [ ] Slightly larger on desktop
  - [ ] Increase z-index to appear "elevated"
- [ ] **Adjust Featured Projects section heading**
  - [ ] Consider "Featured Work" instead of "Featured Projects"?
  - [ ] Or keep as-is for consistency

#### CSS Implementation
- [ ] **Create `.card--featured` modifier class**
  - [ ] Gold border
  - [ ] Larger image height on desktop (400px)
  - [ ] Larger title font size (1.5rem on desktop)
  - [ ] Box shadow for depth effect
- [ ] **Create `.card__label` styles**
  - [ ] Position absolute (top: 1rem, left: 1rem)
  - [ ] Gold background, black text
  - [ ] Small padding, uppercase, bold
  - [ ] z-index above image

#### PostHog Tracking
- [ ] **Track featured card vs non-featured clicks**
  - [ ] Add `is_featured: true/false` to click events
  - [ ] Measure if featured card gets >40% of clicks
- [ ] **Track click order** (do they click featured first?)

#### Testing & Validation
- [ ] **Visual QA:**
  - [ ] Featured card stands out clearly
  - [ ] Label doesn't obscure image
  - [ ] Works on mobile/tablet/desktop
- [ ] **Analytics QA:**
  - [ ] Featured card click % tracked
  - [ ] Compare featured vs non-featured engagement

#### Success Criteria (Phase 3)
- [ ] **NYCNewYears is visually featured** ✅
- [ ] **Featured card gets >40% of case study clicks** ✅
- [ ] **No negative impact on other cards** ✅

---

## 🎯 Week 2: Social Proof & Hierarchy

### Phase 4: Reposition Testimonials 📋 PENDING

**Goal:** Move social proof above case studies to validate claims earlier

#### Implementation
- [ ] **Locate testimonials section** (currently line 177)
- [ ] **Cut testimonials HTML** (entire `<section class="testimonials">`)
- [ ] **Paste testimonials after hero** (before line 97 - cases section)
- [ ] **Update section order:**
  1. Hero (with A/B test)
  2. **Testimonials** ← NEW POSITION
  3. Featured Projects
  4. Side Projects

#### CSS Adjustments
- [ ] **Check existing testimonials CSS** (should work as-is)
- [ ] **Adjust spacing if needed**
  - [ ] Padding top/bottom
  - [ ] Margin relative to new neighbors (hero above, cases below)
- [ ] **Test responsive layout** (grid should still work)

#### PostHog Tracking
- [ ] **Track testimonial visibility** (scroll depth)
  - [ ] What % of visitors scroll past testimonials to case studies?
- [ ] **Compare click-through rates:**
  - [ ] Before testimonial move
  - [ ] After testimonial move
  - [ ] Does social proof increase confidence/clicks?

#### Testing & Validation
- [ ] **Visual QA:**
  - [ ] Testimonials look good in new position
  - [ ] Spacing appropriate above/below
  - [ ] Mobile layout still works (2-column grid)
- [ ] **Flow QA:**
  - [ ] Hero → Testimonials → Cases feels natural
  - [ ] No jarring transitions
- [ ] **Analytics QA:**
  - [ ] Scroll depth to testimonials tracked
  - [ ] Impact on case study clicks measured

#### Success Criteria (Phase 4)
- [ ] **Testimonials repositioned above cases** ✅
- [ ] **Scroll depth to testimonials >60%** ✅
- [ ] **Click-through rate maintains or increases** ✅

---

### Phase 5: Quick Wins Strip (OPTIONAL) 📋 PENDING

**Goal:** Surface all key achievements in scannable number format

**Decision Point:** Only implement if Phase 1-4 don't hit >25% CTR

#### Implementation (If Needed)
- [ ] **Create Quick Wins HTML section**
  - [ ] Insert after Testimonials, before Featured Projects
  - [ ] 4-column grid of achievements
  - [ ] Large numbers with small labels
- [ ] **Define 4 key metrics:**
  - [ ] Metric 1: "48%" - Code Reduction
  - [ ] Metric 2: "10%" - YOY Conversion Lift
  - [ ] Metric 3: "30%" - Faster Deployment
  - [ ] Metric 4: "0→1" - Platform Launch
- [ ] **Create Quick Wins CSS**
  - [ ] Grid layout (4 columns desktop, 2 on mobile)
  - [ ] Large gold numbers
  - [ ] Dark background with gold top border
  - [ ] Responsive padding/spacing

#### PostHog Tracking
- [ ] **Track Quick Wins visibility**
- [ ] **Track scroll past Quick Wins to cases**
- [ ] **A/B test:** Quick Wins vs No Quick Wins

#### Testing & Validation
- [ ] **Visual QA:**
  - [ ] Numbers clear and prominent
  - [ ] Labels readable
  - [ ] Responsive grid works
- [ ] **Analytics QA:**
  - [ ] Visibility tracked
  - [ ] Impact on CTR measured

#### Success Criteria (Phase 5)
- [ ] **Quick Wins section visible** ✅
- [ ] **Scroll-through rate >80%** (don't stop users)
- [ ] **CTR increases by additional 5%** ✅

---

## 📊 Analytics & Tracking Checklist

### PostHog Events to Implement

#### Existing Events (Keep)
- [x] `homepage_variant_viewed` (A/B test)
- [x] `case_study_clicked` (with variant)
- [x] `about_page_clicked` (with variant)
- [x] `resume_link_clicked` (with location + variant) ← NEW

#### New Events to Add
- [ ] `card_hovered` - Track hover time on cards
  - [ ] Parameters: `card_name`, `hover_duration_ms`, `variant`
- [ ] `card_clicked` - Enhanced case study click tracking
  - [ ] Parameters: `card_name`, `card_position`, `is_featured`, `variant`
- [ ] `scroll_depth_milestone` - Track engagement
  - [ ] Parameters: `depth_percent` (25, 50, 75, 100), `variant`
- [ ] `testimonial_viewed` - Track social proof visibility
  - [ ] Parameters: `testimonials_visible`, `variant`
- [ ] `quick_wins_viewed` - If Phase 5 implemented
  - [ ] Parameters: `variant`

### PostHog Funnels to Create

#### Funnel 1: Homepage → Case Study Engagement
- [ ] Step 1: Homepage view
- [ ] Step 2: Scroll >50% (past hero + testimonials)
- [ ] Step 3: Case study click
- [ ] Step 4: Case study engagement >60s

#### Funnel 2: Featured Card Performance
- [ ] Step 1: Homepage view
- [ ] Step 2: Featured card (NYCNewYears) clicked
- [ ] Step 3: Case study scroll >75%
- [ ] Step 4: Related project click OR resume click

#### Funnel 3: Multi-Case Study Journey
- [ ] Step 1: Homepage view
- [ ] Step 2: First case study click
- [ ] Step 3: Return to homepage OR next case study
- [ ] Step 4: Second case study click

### Analytics Dashboard Setup
- [ ] **Create PostHog dashboard:** "Homepage Optimization"
  - [ ] Widget: Case study CTR by variant
  - [ ] Widget: Featured vs non-featured card clicks
  - [ ] Widget: Scroll depth distribution
  - [ ] Widget: Testimonial visibility rate
  - [ ] Widget: Time on case studies (by source)
- [ ] **Create Google Analytics goals:**
  - [ ] Goal: Case study view from homepage
  - [ ] Goal: Multiple case studies in one session
  - [ ] Goal: Resume download after case study

---

## 🧪 Testing & QA Checklist

### Cross-Browser Testing
- [ ] **Desktop Browsers:**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)
- [ ] **Mobile Browsers:**
  - [ ] iOS Safari
  - [ ] Chrome Mobile (Android)
  - [ ] Samsung Internet

### Device Testing
- [ ] **Desktop:** 1920x1080, 1440x900, 1366x768
- [ ] **Tablet:** iPad (1024x768), iPad Pro (1366x1024)
- [ ] **Mobile:** iPhone 12/13/14 (390x844), Pixel (412x915)

### Accessibility Testing
- [ ] **Keyboard navigation** works for all interactive elements
- [ ] **Screen reader** announces badges/labels correctly
- [ ] **Color contrast** meets WCAG AA (badges, text)
- [ ] **Focus indicators** visible on all clickable cards

### Performance Testing
- [ ] **Lighthouse score** maintained (>90 performance)
- [ ] **Image loading** optimized (lazy load below fold)
- [ ] **No layout shift** from badge additions
- [ ] **Time to Interactive** not significantly impacted

---

## 📈 Success Metrics & Targets

### Week 1 Targets (Phase 1-2)
- [ ] **Case study clicks:** 6 → **>12** (2x improvement)
- [ ] **Click-through rate:** 10% → **>20%**
- [ ] **Card hover time:** Track baseline → **>3s average**
- [ ] **Mobile CTR:** Track separately (should match or exceed desktop)

### Week 2 Targets (Phase 3-4)
- [ ] **Case study clicks:** >12 → **>15** (2.5x from baseline)
- [ ] **Click-through rate:** >20% → **>25%**
- [ ] **Featured card clicks:** **>40%** of all case study clicks
- [ ] **Time on case studies:** 2-30s → **>60s**

### Overall Success (After 2 Weeks)
- [ ] **Case study views >20** (3x improvement from 6)
- [ ] **Click-through rate >25%** (2.5x improvement from 10%)
- [ ] **Featured card >40%** of clicks (proves hierarchy works)
- [ ] **Time on case studies >60s** (proves quality engagement)
- [ ] **Bounce rate <75%** (down from 91%)
- [ ] **A/B test winner identified** (remove losing variants)

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] **Backup current site** (git commit on main branch)
- [ ] **Test all changes on branch:** `homepage-optimization`
- [ ] **Get approval on copy changes** (card descriptions)
- [ ] **Verify PostHog events work** (test in dev console)
- [ ] **Run full QA checklist** (browsers, devices, accessibility)

### Deployment
- [ ] **Merge branch to main:** `git merge homepage-optimization`
- [ ] **Deploy to production** (push to live server)
- [ ] **Verify live site:**
  - [ ] All cards display correctly
  - [ ] Badges render properly
  - [ ] PostHog events fire
  - [ ] No console errors
  - [ ] Mobile layout works

### Post-Deployment
- [ ] **Monitor PostHog real-time** (first hour)
- [ ] **Check error logs** (any JavaScript errors?)
- [ ] **Verify A/B test still works** (clear cookies, test variants)
- [ ] **Set up daily alert** (if CTR drops below 15%)
- [ ] **Schedule Week 1 review** (48 hours post-deploy)

---

## 📅 Timeline & Milestones

### Week 1: Prove Claims on Homepage
- **Day 1:** Phase 1 - Rewrite card descriptions
- **Day 2:** Phase 2 - Add impact badges
- **Day 3:** Testing, QA, deploy
- **Day 4-5:** Collect baseline data (48+ hours)
- **Day 6-7:** Analyze data, prepare Week 2

### Week 2: Hierarchy & Social Proof
- **Day 1:** Phase 3 - Feature best work
- **Day 2:** Phase 4 - Reposition testimonials
- **Day 3:** Testing, QA, deploy
- **Day 4-7:** Collect data, analyze results

### Week 3: Analysis & Iteration
- **Day 1-2:** Analyze A/B test results, identify winner
- **Day 3-4:** Remove losing variants, optimize
- **Day 5:** Decide: Phase 5 (Quick Wins) needed?
- **Day 6-7:** Plan Phase 2 (case study content optimization)

---

## ✅ Completion Criteria

### Phase 1: COMPLETE ✅
- [x] All 4 card descriptions rewritten
- [x] Metrics visible on all cards
- [x] Mobile responsive
- [x] PostHog tracking working
- [ ] 48 hours of data collected - PENDING
- [ ] CTR improvement >5% measured - PENDING

### Phase 2: COMPLETE ✅ (Modified - Category Badges)
- [x] All 4 cards have category badges
- [x] Badges clearly identify work type
- [x] Mobile responsive
- [ ] CTR >20% measured - PENDING

### Phase 2.5: CANCELLED ❌
- [x] Filter functionality built and tested
- [x] Determined static badges are better UX
- [x] All filter code removed cleanly

### Phase 3: COMPLETE when...
- [ ] Featured card visually distinct
- [ ] Featured card >40% of clicks
- [ ] Other cards not negatively impacted

### Phase 4: COMPLETE when...
- [ ] Testimonials repositioned
- [ ] Scroll depth to testimonials >60%
- [ ] CTR maintains or increases

### Phase 5: COMPLETE when... (if implemented)
- [ ] Quick Wins section live
- [ ] Visibility tracked
- [ ] CTR increases additional 5%

### OVERALL PROJECT: COMPLETE when...
- [ ] **All phases implemented and tested**
- [ ] **CTR >25% sustained for 1 week**
- [ ] **A/B test winner declared**
- [ ] **Case study views >20 per week**
- [ ] **Time on case studies >60s**
- [ ] **Documented learnings for next phase**

---

**Checklist Version:** 1.0
**Last Updated:** September 30, 2025
**Next Update:** After Phase 1 completion