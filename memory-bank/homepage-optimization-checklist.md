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

### Phase 1: Impact-First Card Descriptions ⏳ IN PROGRESS

**Goal:** Show metrics/results in card descriptions before visitors click

#### NYCNewYears.com Card
- [ ] **Read current description** (index.html line 108)
- [ ] **Rewrite to impact-first:**
  - [ ] Include "48% code reduction (8.2MB → 4.2MB)"
  - [ ] Include "83% mobile traffic"
  - [ ] Mention "thousands of international tourists"
  - [ ] Keep under 200 characters
- [ ] **Add `<strong>` tags** to key metrics
- [ ] **Test on mobile/tablet/desktop** for readability

#### AfterPromCentral Card
- [ ] **Read current description** (index.html line 119)
- [ ] **Rewrite to impact-first:**
  - [ ] Include "3-month end-to-end launch"
  - [ ] Include "boosting conversions"
  - [ ] Mention "eliminated content errors"
  - [ ] Reference "20-30 seasonal events"
  - [ ] Keep under 200 characters
- [ ] **Add `<strong>` tags** to key metrics
- [ ] **Test on mobile/tablet/desktop** for readability

#### Integrate Design System Card
- [ ] **Read current description** (index.html line 130)
- [ ] **Rewrite to impact-first:**
  - [ ] Include "55% color reduction (103→46)"
  - [ ] Include "33% typography simplification"
  - [ ] Mention "unified 3 acquired companies"
  - [ ] Include "WCAG accessibility compliance"
  - [ ] Keep under 200 characters
- [ ] **Add `<strong>` tags** to key metrics
- [ ] **Test on mobile/tablet/desktop** for readability

#### TokTix Card
- [ ] **Read current description** (index.html line 171)
- [ ] **Rewrite to impact-first:**
  - [ ] Include "95% beta-ready in 9 months"
  - [ ] Include "solo development"
  - [ ] Mention "React Native + Next.js + Firebase"
  - [ ] Include "Stripe integration"
  - [ ] Reference "0→1 product"
  - [ ] Keep under 200 characters
- [ ] **Add `<strong>` tags** to key metrics
- [ ] **Test on mobile/tablet/desktop** for readability

#### PostHog Tracking Enhancement
- [ ] **Add hover time tracking** for cards
  - [ ] Track how long users hover over each card
  - [ ] Track by A/B test variant
  - [ ] Track which card gets most hovers
- [ ] **Update case study click tracking** to include card type
  - [ ] Add `card_name` parameter to existing tracking
  - [ ] Track click position in list (1st, 2nd, 3rd, 4th)

#### Testing & Validation
- [ ] **Visual QA:**
  - [ ] Desktop (Chrome, Firefox, Safari)
  - [ ] Tablet (iPad, Android tablet)
  - [ ] Mobile (iPhone, Android phone)
- [ ] **Content QA:**
  - [ ] All numbers accurate (match case studies)
  - [ ] No typos
  - [ ] Descriptions fit within card layout
- [ ] **Analytics QA:**
  - [ ] PostHog events firing correctly
  - [ ] Hover tracking working
  - [ ] Click tracking includes new parameters

#### Success Criteria (Phase 1)
- [ ] **All 4 card descriptions rewritten** ✅
- [ ] **Metrics visible before clicking** ✅
- [ ] **Mobile responsive** ✅
- [ ] **PostHog tracking enhanced** ✅
- [ ] **Baseline data collected** (48 hours)
- [ ] **Click-through rate increases by >5%** (10% → 15%+)

---

### Phase 2: Impact Badges on Cards 📋 PENDING

**Goal:** Make metrics scannable at a glance with colored badges

#### Badge HTML Structure
- [ ] **Create badge HTML template**
  - [ ] Define `<div class="card__badges">` container
  - [ ] Define `<span class="card__badge card__badge--TYPE">` element
  - [ ] Plan badge types: metric, timeline, scale, quality, stage
- [ ] **Add badges to NYCNewYears card** (before description)
  - [ ] Badge 1: "48% Code Reduction" (metric - gold)
  - [ ] Badge 2: "83% Mobile Traffic" (scale - sage green)
- [ ] **Add badges to APCE card** (before description)
  - [ ] Badge 1: "3-Month Launch" (timeline - teal)
  - [ ] Badge 2: "Eliminated Errors" (quality - forest green)
- [ ] **Add badges to Integrate card** (before description)
  - [ ] Badge 1: "55% Color Reduction" (metric - gold)
  - [ ] Badge 2: "WCAG Compliant" (quality - forest green)
- [ ] **Add badges to TokTix card** (before description)
  - [ ] Badge 1: "9 Months, Solo" (timeline - teal)
  - [ ] Badge 2: "95% Beta-Ready" (stage - red)

#### Badge CSS Styling
- [ ] **Create base badge styles** (css/style.css)
  - [ ] `.card__badges` container (flexbox, gap, wrap)
  - [ ] `.card__badge` base styles (padding, font, border-radius)
- [ ] **Create badge type variants**
  - [ ] `.card__badge--metric` (gold background, black text)
  - [ ] `.card__badge--timeline` (teal background, white text)
  - [ ] `.card__badge--scale` (sage background, white text)
  - [ ] `.card__badge--quality` (forest background, white text)
  - [ ] `.card__badge--stage` (red background, white text)
- [ ] **Mobile responsive adjustments**
  - [ ] Smaller font size on mobile
  - [ ] Adjust padding for smaller screens
  - [ ] Ensure badges wrap properly

#### PostHog Tracking for Badges
- [ ] **Track badge visibility** (scroll depth to badges)
- [ ] **Track badge clicks** (if we make them clickable)
- [ ] **A/B test:** Badges vs No Badges (split traffic)

#### Testing & Validation
- [ ] **Visual QA:**
  - [ ] Badge colors match design system
  - [ ] Badges readable on all devices
  - [ ] Badges don't overlap with text
- [ ] **Layout QA:**
  - [ ] Badges display before description
  - [ ] Proper spacing between badges and title/description
  - [ ] Badges wrap correctly on narrow screens
- [ ] **Analytics QA:**
  - [ ] Badge visibility tracked
  - [ ] Impact on click-through rate measured

#### Success Criteria (Phase 2)
- [ ] **All 4 cards have impact badges** ✅
- [ ] **Badges color-coded by type** ✅
- [ ] **Mobile responsive** ✅
- [ ] **Click-through rate >20%** (from baseline 10%)

---

### Phase 2.5: Category Filter Tiles 📋 PENDING

**Goal:** Allow visitors to filter case studies by category (Product Design, Engineering, Systems, 0→1/Founder)

#### Filter Tiles HTML
- [ ] **Create filter section** (before Featured Projects heading)
  - [ ] Add `<div class="cases__filters">` container
  - [ ] Add filter buttons: All Work, Product Design 🎨, Engineering 💻, Systems 🧩, 0→1/Founder 🚀
  - [ ] Set "All Work" as default active state
- [ ] **Add data-categories to case study cards**
  - [ ] NYCNewYears: `data-categories="design,engineering,systems"`
  - [ ] APCE: `data-categories="design,engineering"`
  - [ ] Integrate: `data-categories="design,systems"`
  - [ ] TokTix: `data-categories="design,engineering,founder"`

#### Filter CSS Styling
- [ ] **Create `.cases__filters` container styles**
  - [ ] Flexbox layout with gap
  - [ ] Center alignment
  - [ ] Margin bottom for spacing from cards
- [ ] **Create `.filter-button` base styles**
  - [ ] Padding, border-radius, font-size
  - [ ] Background color (dark with opacity)
  - [ ] Hover state (gold border or background)
  - [ ] Active state (gold background, black text)
- [ ] **Mobile responsive adjustments**
  - [ ] Wrap buttons on smaller screens
  - [ ] Smaller font size on mobile
  - [ ] Touch-friendly button sizing

#### JavaScript Filtering Logic
- [ ] **Add filter click event listeners**
  - [ ] Attach to all `.filter-button` elements
  - [ ] Get `data-filter` attribute from clicked button
- [ ] **Implement filtering logic**
  - [ ] If "all" → show all cards
  - [ ] Else → show only cards with matching `data-categories`
  - [ ] Hide/show cards with CSS class toggle (`.card--hidden`)
- [ ] **Update active button state**
  - [ ] Remove `.filter-button--active` from all buttons
  - [ ] Add `.filter-button--active` to clicked button

#### PostHog Tracking
- [ ] **Track filter clicks**
  - [ ] Event: `category_filter_clicked`
  - [ ] Parameters: `filter_type`, `variant`, `timestamp`
- [ ] **Track filtered card clicks**
  - [ ] Add `active_filter` parameter to existing `case_study_clicked` event
  - [ ] Measure which filters lead to most clicks

#### Testing & Validation
- [ ] **Visual QA:**
  - [ ] Filters display correctly above case studies
  - [ ] Active state clearly visible
  - [ ] Hover states work on desktop
  - [ ] Mobile layout responsive (buttons wrap)
- [ ] **Functionality QA:**
  - [ ] "All Work" shows all 4 cards
  - [ ] "Product Design" shows all 4 cards (all have design)
  - [ ] "Engineering" shows NYCNewYears, APCE, TokTix (3 cards)
  - [ ] "Systems" shows NYCNewYears, Integrate (2 cards)
  - [ ] "0→1/Founder" shows TokTix only (1 card)
  - [ ] Active state switches correctly
- [ ] **Analytics QA:**
  - [ ] Filter clicks tracked in PostHog
  - [ ] Filtered card clicks include filter context

#### Success Criteria (Phase 2.5)
- [ ] **Filter tiles functional and responsive** ✅
- [ ] **Filtering works correctly for all categories** ✅
- [ ] **PostHog tracking captures filter usage** ✅
- [ ] **No negative impact on CTR** ✅

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

### Phase 1: COMPLETE when...
- [x] All 4 card descriptions rewritten
- [x] Metrics visible on all cards
- [x] Mobile responsive
- [x] PostHog tracking working
- [x] 48 hours of data collected
- [x] CTR improvement >5% measured

### Phase 2: COMPLETE when...
- [ ] All 4 cards have badges
- [ ] Badges color-coded correctly
- [ ] Mobile responsive
- [ ] CTR >20% measured

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