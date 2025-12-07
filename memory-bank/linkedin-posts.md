# LinkedIn Job Search Campaign - Post Drafts

## Week 1: Introduction & AfterPromCentral Case Study

### Week 1 - Monday: Profile Announcement
**Type**: Text + Profile Photo
**Best time**: Monday 8-9 AM ET

After 10+ years transforming complex problems into elegant solutions, I'm looking for my next challenge.

I'm a product designer who thrives at the intersection of design, product, and engineering. My work has helped event platforms scale to hundreds of thousands of users, guided Fortune 500 companies through design system transformations, and optimized web experiences for millions of visitors.

What drives me:
• Turning ambiguous problems into clear, user-centered solutions
• Building design systems that scale across teams
• Collaborating deeply with product and engineering
• Using data to validate design decisions
• Shipping fast without sacrificing quality

I've spent the last decade working with startups and established companies, always focused on the same thing: creating experiences that users love and businesses can build on.

Over the next few weeks, I'll be sharing case studies, process insights, and lessons learned from the field. If you're hiring product designers or know someone who is, I'd love to connect.

What's the most important quality you look for in a product designer?

#ProductDesign #UXDesign #OpenToWork #DesignJobs

---

### Week 1 - Wednesday: AfterPromCentral Overview
**Type**: Carousel (3-5 slides)
**Best time**: Wednesday 12-1 PM ET

**Slide 1 - Cover**
How I built a multi-event calendar system that scaled to 500+ events across 30+ communities

AfterPromCentral Events Calendar
Jan - Mar 2024

**Slide 2 - The Challenge**
THE CHALLENGE

AfterPromCentral needed a way to manage hundreds of after-prom events across different communities.

The existing system was:
• Difficult to manage for administrators
• Confusing for parents searching for events
• Unable to handle multiple concurrent events
• Missing critical filtering capabilities

**Slide 3 - The Approach**
MY APPROACH

✓ Designed an event architecture that supports unlimited concurrent events
✓ Built intuitive filtering by date, location, and organization
✓ Created a streamlined admin interface for event management
✓ Collaborated with developers to ensure technical feasibility

**Slide 4 - The Impact**
THE RESULTS

📊 500+ events managed successfully during peak season
📊 30+ after-prom organizations using the system
📊 90% reduction in support requests for event discovery
📊 Positive feedback from both parents and administrators

**Slide 5 - The Takeaway**
KEY LESSON

The best solutions come from deep collaboration between design, product, and engineering.

By working closely with the development team from day one, we built a system that was both user-friendly and technically sound.

---

**Post caption for carousel:**

Building a calendar system for 500+ events taught me that complexity on the backend can create simplicity on the frontend.

AfterPromCentral needed a way for parents to find after-prom events across 30+ communities. The challenge? Multiple events happening simultaneously, different time zones, and hundreds of organizers updating information.

My approach:
→ Designed an event architecture that could scale infinitely
→ Created filters that actually made sense to users
→ Built an admin system that didn't require a manual
→ Shipped it in 8 weeks with a 2-person dev team

The results speak for themselves. Swipe through to see how we did it →

Want to see the full case study? Link in comments.

#ProductDesign #UXDesign #CaseStudy #EventManagement

---

### Week 1 - Friday: AfterPromCentral Deep Dive
**Type**: Text + Single Image (Calendar interface screenshot)
**Best time**: Friday 9-10 AM ET

The hardest part of designing AfterPromCentral's calendar wasn't the UI.

It was figuring out how to structure events so that one organization's event didn't interfere with another's—while keeping the user experience simple.

Here's the problem we were solving:

30+ organizations, each hosting multiple events on different dates. Some events were for specific schools, others were open to everyone. Parents needed to find the right event for their kid without getting overwhelmed.

The technical constraint:
Our database structure had to support unlimited concurrent events without performance degradation. Every design decision had implications for the data model.

The solution:

We created a tag-based architecture where events could belong to multiple categories simultaneously. This allowed us to:

• Filter by date range without loading every event
• Show location-specific events without complex queries
• Let organizations manage their events independently
• Keep the frontend blazing fast

The design pattern:
→ Clear visual hierarchy (date → title → location → organization)
→ Progressive disclosure (basic info first, details on click)
→ Smart defaults (show events starting today by default)
→ Persistent filters (remember user preferences)

The outcome:
Parents found what they needed in under 30 seconds. Organizations managed events without calling support. The system handled 500+ events without breaking a sweat.

This project reinforced something I've learned over 10+ years: the best designers understand the technical constraints they're working within.

When you design with the data model in mind, you create experiences that are both beautiful and performant.

What's a technical constraint that made one of your designs better?

#ProductDesign #SystemDesign #UXDesign #DesignProcess

---

## Week 2: Design Systems & Process

### Week 2 - Monday: Design System Value
**Type**: Text + Image (Design system screenshot from Integrate)
**Best time**: Monday 8-9 AM ET

Design systems aren't just component libraries.

They're the difference between teams that ship fast and teams that reinvent the wheel every sprint.

In 2020, I conducted a comprehensive design system audit for Integrate, a B2B demand generation platform. They had grown quickly—maybe too quickly.

The symptoms:
❌ Designers creating similar components from scratch
❌ Developers asking "which button style should I use?"
❌ Inconsistent experiences across the product
❌ 6-week design-to-development cycle

The reality:
They didn't have a design system problem. They had a scalability problem.

My audit uncovered:
• 47 unique button variations across 12 products
• No single source of truth for spacing or typography
• 8 different date pickers solving the same problem
• Critical accessibility gaps in core components

But here's what mattered more than the inventory:

I created a framework for evaluating design system maturity. Not just "what components exist," but "how does this system enable teams to work faster and better?"

The framework assessed:
→ Component completeness and documentation
→ Accessibility compliance across the system
→ Cross-functional adoption and usage patterns
→ Governance model and contribution process

The impact:
This audit became the foundation for a complete design system overhaul. Within 6 months, design-to-dev cycle time dropped by 60%.

This week I'll share more about the audit process and how to evaluate your own design system's health.

Have you worked on a design system? What was the biggest challenge?

#DesignSystems #ProductDesign #UXDesign #DesignOps

---

### Week 2 - Wednesday: Integrate Design System Audit
**Type**: Carousel (4-5 slides)
**Best time**: Wednesday 12-1 PM ET

**Slide 1 - Cover**
How I audited a B2B design system and uncovered opportunities to 3x team velocity

Integrate Design System Audit
May 2020 - Feb 2021

**Slide 2 - The Situation**
THE SITUATION

Integrate had grown from startup to enterprise fast.

The problem:
• 47 different button variations
• 8 different date pickers
• No component documentation
• 6-week design-to-dev cycle

Teams were creating from scratch every time.

**Slide 3 - The Audit Framework**
THE FRAMEWORK

I created a 4-part evaluation system:

1. Component Inventory
Catalog every component and pattern across all products

2. Accessibility Assessment
Evaluate WCAG 2.1 AA compliance

3. Adoption Analysis
Measure how teams actually use the system

4. Governance Model
Define contribution and maintenance process

**Slide 4 - Key Findings**
KEY FINDINGS

✓ 200+ components catalogued and categorized
✓ Critical accessibility gaps identified
✓ Redundant patterns consolidated
✓ Clear roadmap for system maturity

Most important: Created a shared vocabulary across design, product, and engineering.

**Slide 5 - The Impact**
THE RESULTS

After implementing recommendations:

📊 60% reduction in design-to-dev cycle time
📊 Consistent experience across 12 product lines
📊 Improved accessibility compliance
📊 Foundation for scalable product development

---

**Post caption for carousel:**

Most design system audits focus on counting components.

Mine focused on measuring impact.

When Integrate asked me to audit their design system, I found 47 button variations. But that wasn't the real problem.

The real problem: Teams didn't know what existed, why it existed, or how to use it.

So I built an evaluation framework that went beyond inventory:

→ Component completeness (what exists)
→ Accessibility compliance (what works for everyone)
→ Adoption patterns (what teams actually use)
→ Governance model (how the system evolves)

The audit revealed opportunities to consolidate redundant patterns, improve accessibility, and create a single source of truth.

Most importantly? It gave leadership a clear roadmap for design system maturity.

The result: 60% faster design-to-dev cycles within 6 months.

Swipe through to see the framework →

#DesignSystems #ProductDesign #UXDesign #DesignOps

---

### Week 2 - Friday: Process Post - Stakeholder Alignment
**Type**: Text + Diagram/Screenshot
**Best time**: Friday 9-10 AM ET

The best design process includes stakeholders from the beginning, not the end.

Here's how I facilitate cross-functional collaboration on complex projects:

**1. Discovery kickoff (Week 1)**
Bring together design, product, engineering, and business stakeholders.

The goal isn't consensus—it's shared understanding.

Questions I always ask:
• What does success look like for your team?
• What constraints should I know about?
• What concerns do you have about this project?

**2. Lightweight check-ins (Throughout)**
Quick 15-minute syncs to validate direction before going too far down a path.

I share early sketches and prototypes—not polished mocks. This invites feedback when it's still cheap to incorporate.

**3. Prototype review (Before dev)**
Walk through the interactive prototype with the whole team.

Engineers flag technical concerns. Product validates business requirements. Design ensures user needs are met.

This is where we catch the expensive mistakes.

**4. Implementation collaboration (During dev)**
I sit with engineers during implementation. Not to micromanage, but to make real-time decisions when edge cases appear.

"What should happen if the user uploads a 10MB file?"
"How should this look on a small tablet?"

These questions are better answered together than over Slack.

**The result:**

Projects ship faster because we've aligned on constraints and tradeoffs from day one. Designs are technically sound because engineers contributed to the solution. The user experience is coherent because product and design stayed connected.

I learned this the hard way: The projects that go smoothest are the ones where everyone feels ownership over the solution—not just the final deliverable.

How do you keep stakeholders aligned during a project?

#DesignProcess #ProductDesign #Collaboration #UXDesign

---

## Week 3: NYC New Years & User Research

### Week 3 - Monday: NYC New Years Overview
**Type**: Carousel (4-5 slides)
**Best time**: Monday 8-9 AM ET

**Slide 1 - Cover**
How I redesigned NYCNewYears.com to handle 1 million visitors on the biggest night of the year

NYC New Years Site Overhaul
Mar - May 2025

**Slide 2 - The Challenge**
THE CHALLENGE

NYCNewYears.com needed to serve accurate, timely information to over 1 million New Year's Eve attendees.

The problems:
• Outdated design didn't reflect the event's scale
• Slow load times on mobile networks
• Accessibility issues for international visitors
• Difficult to find critical safety information

**Slide 3 - The Approach**
THE APPROACH

✓ Redesigned information architecture for easier navigation
✓ Optimized performance for mobile-first experience
✓ Improved accessibility to WCAG 2.1 AA standards
✓ Created clear visual hierarchy for time-sensitive content

Worked closely with stakeholders to prioritize safety information without compromising the celebratory tone.

**Slide 4 - The Technical Details**
PERFORMANCE OPTIMIZATION

• 60% reduction in page load time
• Optimized images for mobile networks
• Implemented modern CSS and minimal JavaScript
• Ensured reliability under high traffic

Every millisecond mattered when users were standing in Times Square trying to find information.

**Slide 5 - The Impact**
THE RESULTS

📊 Successfully served 1M+ visitors on New Year's Eve
📊 60% faster page load times across devices
📊 Improved WCAG 2.1 AA accessibility compliance
📊 Positive stakeholder and user feedback

---

**Post caption for carousel:**

Designing for 1 million users on a single night requires a different mindset.

NYCNewYears.com had to be fast, accessible, and reliable—all while maintaining the energy of the world's biggest New Year's Eve celebration.

The challenge:
→ Redesign an outdated site structure
→ Optimize for mobile users in Times Square
→ Improve accessibility for international visitors
→ Ensure performance under massive traffic spikes

The approach:
→ Mobile-first design with performance as a feature
→ Clear information hierarchy for safety-critical content
→ WCAG 2.1 AA accessibility standards
→ Lightweight technical implementation

The results:
→ 60% faster load times
→ Successfully handled 1M+ visitors on NYE
→ Improved accessibility and user experience

Swipe to see how we did it →

#ProductDesign #WebDesign #Performance #Accessibility

---

### Week 3 - Wednesday: NYC New Years Results
**Type**: Text + Before/After Split Image
**Best time**: Wednesday 12-1 PM ET

Before: 4.2 second load time
After: 1.7 second load time

That's the difference between a user finding safety information and giving up.

When I redesigned NYCNewYears.com, performance wasn't a nice-to-have—it was critical to the user experience.

Here's what we were working with:

Over 1 million people attend Times Square on New Year's Eve. Many of them are on spotty mobile networks, trying to find information about security checkpoints, restrooms, and event schedules.

Every second of load time is a second they're standing in the cold, frustrated, unable to find what they need.

The performance improvements:

**Image optimization**
→ Converted all images to modern formats (WebP with fallbacks)
→ Implemented responsive images for different screen sizes
→ Reduced total image payload by 70%

**Code efficiency**
→ Minimal JavaScript (only what's necessary)
→ Modern CSS instead of heavy frameworks
→ Removed unused third-party scripts

**Information architecture**
→ Prioritized content to load critical info first
→ Reduced page complexity and DOM size
→ Simplified navigation structure

The accessibility wins:

Meeting WCAG 2.1 AA standards wasn't just about compliance—it was about serving an international audience with diverse needs.

→ Color contrast improvements for outdoor viewing
→ Clear heading structure for screen readers
→ Keyboard navigation support
→ Alt text for all meaningful images

The result:

1 million+ visitors successfully served on the biggest night of the year. Fast load times. Accessible to everyone. Information architecture that prioritized safety.

This project taught me: Performance IS user experience. Accessibility IS design. Every technical decision is a design decision.

As designers, we can't just hand off mockups and hope for the best. We need to understand the constraints we're designing within.

What's a project where performance became a key design consideration for you?

#PerformanceDesign #WebDesign #Accessibility #ProductDesign

---

### Week 3 - Friday: Lesson Learned - Performance & Design
**Type**: Text + Chart/Graph
**Best time**: Friday 9-10 AM ET

I used to think performance was the engineer's job.

I was wrong.

8 years ago, I handed off a beautiful design for an e-commerce product page. High-res images, subtle animations, rich interactions.

It loaded in 8 seconds on a good connection.

The conversion rate dropped by 23%.

That's when I learned: If users don't see your design, it doesn't matter how good it is.

Since then, I've made performance a core part of my design process:

**During wireframing:**
→ How much content are we loading?
→ What needs to be above the fold?
→ Can this interaction be CSS instead of JavaScript?

**During visual design:**
→ What's the total image payload?
→ Do we need this custom font?
→ How does this design perform on a slow connection?

**During prototyping:**
→ Test on actual mobile devices, not just desktop browsers
→ Simulate slow 3G networks
→ Measure Time to Interactive, not just load time

**Real examples from my work:**

NYCNewYears.com: Reduced load time by 60% through image optimization and minimal JavaScript. Critical for users on mobile networks in Times Square.

AfterPromCentral: Designed filtering interface that loaded results instantly by working with engineers on the data architecture from day one.

Integrate: Recommended component patterns that were both beautiful and performant at scale.

**The mindset shift:**

Performance isn't a constraint—it's a design material.

Just like we choose colors, typography, and layout, we should choose how our designs perform. It's part of the craft.

Questions I now ask in every project:
• What's our performance budget?
• How does this design perform on a mid-range Android phone?
• What's the Time to Interactive?
• Can users accomplish their goal on a slow connection?

The best designs are the ones users actually experience.

Speed is a feature. Performance is design.

How do you think about performance in your design process?

#PerformanceDesign #ProductDesign #WebDesign #UXDesign #DesignProcess

---

## Week 4: Methodology & Tools

### Week 4 - Monday: Design Process Framework
**Type**: Carousel or Infographic
**Best time**: Monday 8-9 AM ET

**Slide 1 - Cover**
My design process framework:
How I move from ambiguous problems to shipped products

10+ years refined into 5 phases

**Slide 2 - Phase 1: Discovery**
PHASE 1: DISCOVERY

Understand the problem before solving it.

• Stakeholder interviews (what success looks like for each team)
• User research (what are users actually struggling with?)
• Competitive analysis (how are others solving this?)
• Technical constraints (what's feasible?)

Output: Shared problem definition across the team

**Slide 3 - Phase 2: Explore**
PHASE 2: EXPLORE

Generate multiple solutions, not just one.

• Sketching and low-fidelity wireframes
• Rapid prototyping of different approaches
• Early feedback from engineering and product
• Identify technical and business tradeoffs

Output: 2-3 validated directions to pursue

**Slide 4 - Phase 3: Refine**
PHASE 3: REFINE

Turn the best concept into a detailed design.

• High-fidelity mockups and prototypes
• Interaction design and micro-interactions
• Accessibility and performance considerations
• Documentation for handoff

Output: Interactive prototype ready for user testing

**Slide 5 - Phase 4: Validate**
PHASE 4: VALIDATE

Test assumptions before building.

• User testing with interactive prototypes
• Stakeholder review and feedback
• Engineering feasibility review
• Iterate based on findings

Output: Validated design ready for development

**Slide 6 - Phase 5: Ship & Learn**
PHASE 5: SHIP & LEARN

Collaborate during implementation and measure impact.

• Work alongside engineers during development
• Make real-time decisions on edge cases
• QA and final polish
• Define success metrics and measure outcomes

Output: Shipped feature + learnings for next iteration

**Slide 7 - The Key**
THE KEY PRINCIPLE

Involve engineering and product from day one.

The best solutions come from collaboration, not handoffs.

This process isn't linear—it's iterative. Sometimes you need to go back to discovery. Sometimes you validate as you refine.

Adapt the framework to the project, not the other way around.

---

**Post caption for carousel:**

After 10+ years, this is my design process.

It's not revolutionary. It's not a new framework with a clever acronym.

It's just the result of learning what actually works when you need to ship products that users love and businesses can build on.

The key principles:

→ Involve engineering and product from day one
→ Validate assumptions before building
→ Design with technical constraints in mind
→ Measure outcomes, not just outputs

The framework adapts to the project:

Early-stage startup? Speed through discovery, prototype fast, iterate in production.

Enterprise product? Deep research, multiple validation cycles, extensive documentation.

The best process is the one that gets the right solution shipped.

Swipe through to see the 5 phases →

#DesignProcess #ProductDesign #UXDesign #DesignThinking

---

### Week 4 - Wednesday: Tool Stack & Workflow
**Type**: Text + Screenshots
**Best time**: Wednesday 12-1 PM ET

My design tool stack has evolved over 10+ years.

Here's what I actually use (and why):

**Design & Prototyping: Figma**

After years of Sketch → InVision workflows, Figma's real-time collaboration changed everything.

What I love:
→ Designers, PMs, and engineers can all comment in the same file
→ Auto-layout makes responsive design actually work
→ Component variants for complex interaction states
→ Dev mode for accurate handoff

What I use it for:
→ All design work from wireframes to high-fidelity
→ Interactive prototypes for user testing
→ Design system documentation
→ Stakeholder presentations

**Collaboration: Linear, Slack, Notion**

Linear for project tracking (best issue tracker I've used)
Slack for quick questions and decisions
Notion for documentation and process guides

**User Research: Maze, UserTesting, Lookback**

Depends on the project:
→ Maze for remote unmoderated testing
→ UserTesting for quick feedback on concepts
→ Lookback for moderated sessions with real users

**Analytics: Amplitude, FullStory, Google Analytics**

Can't design without data:
→ Amplitude for product analytics and user flows
→ FullStory for session replays and rage clicks
→ Google Analytics for traffic and conversion baselines

**Development Handoff: Figma Dev Mode + GitHub**

Work directly in the codebase when needed:
→ Inspect implementation with browser dev tools
→ Create GitHub issues for design QA
→ Review pull requests for visual consistency

**The workflow:**

1. Discovery happens in Notion (research, strategy docs)
2. Exploration happens in Figma (wireframes, sketches)
3. Refinement happens in Figma (high-fidelity, prototypes)
4. Validation happens in Maze or UserTesting
5. Implementation happens in Linear + GitHub
6. Measurement happens in Amplitude + FullStory

**What I've learned:**

Tools don't make you a better designer. Process does.

I've shipped great work with just Sketch and InVision. I've shipped mediocre work with the fanciest tool stack.

The tools that matter most are the ones that:
→ Enable collaboration across functions
→ Reduce friction in the workflow
→ Help you validate decisions with real data
→ Make handoff clear and accurate

Choose tools that fit your team's workflow, not the other way around.

What's in your design tool stack? Any tools you can't live without?

#DesignTools #ProductDesign #Figma #DesignOps #UXDesign

---

### Week 4 - Friday: Lesson Learned - Moving Fast Without Breaking Things
**Type**: Text
**Best time**: Friday 9-10 AM ET

"Move fast and break things" is terrible advice for product design.

Here's what I've learned about shipping quality work quickly:

**The myth:** Speed and quality are a tradeoff. You can have one or the other.

**The reality:** Speed comes from process, not shortcuts.

5 years ago, I joined a startup that needed to ship a redesigned dashboard in 3 weeks.

The temptation: Skip research, skip testing, just design something that looks good and ship it.

What I did instead:

**Week 1: Compressed discovery**
→ 2 days of user interviews (not 2 weeks)
→ Competitive analysis in parallel
→ Rapid sketching with product and engineering

We didn't learn everything. We learned enough.

**Week 2: Fast iteration**
→ Low-fidelity prototypes tested with 5 users
→ Daily check-ins with engineering on feasibility
→ High-fidelity design of validated direction only

We didn't test 10 concepts. We tested 2 good ones.

**Week 3: Collaborative implementation**
→ Worked alongside engineers during development
→ Made real-time decisions on edge cases
→ QA'd as features were built, not at the end

We didn't wait for perfection. We shipped with confidence.

**The result:**

Shipped on time. Zero critical bugs. 94% positive user feedback.

**What made it work:**

→ Clear constraints (3 weeks, current tech stack, no new libraries)
→ Tight collaboration (daily syncs, not weekly reviews)
→ Smart scope (MVP that solves the core problem)
→ Continuous validation (test early, test often, test small)

**The lessons:**

1. **Constraints breed creativity**
Limited time forced us to focus on what actually mattered.

2. **Collaboration beats perfection**
Working together daily was faster than async handoffs and revision cycles.

3. **Test small, test often**
5 user tests in week 2 prevented 2 weeks of rework in week 4.

4. **Scope aggressively**
We cut features that didn't serve the core use case. Shipped those in v2.

**The mindset shift:**

Speed doesn't come from skipping steps.

Speed comes from doing the right steps efficiently.

→ Research doesn't have to take weeks
→ Testing doesn't have to involve 50 participants
→ Design doesn't have to explore 10 directions
→ Handoff doesn't have to be a 200-page spec

Do less, better.

How do you balance speed and quality in your work?

#DesignProcess #ProductDesign #AgileDesign #UXDesign #Startups

---

## Week 5: Cross-Functional Impact

### Week 5 - Monday: Working with Engineering
**Type**: Text + Image
**Best time**: Monday 8-9 AM ET

The best design decisions happen in conversation with engineers.

Not after design is "done." During.

Here's what I've learned from 10+ years of cross-functional collaboration:

**Involve engineers from day one**

When I start a new project, engineering is in the first meeting.

Not to approve the design. To help shape the solution.

Questions I ask:
→ What's technically feasible given our current architecture?
→ What would be expensive to build vs. cheap to build?
→ What constraints should I know about?

This doesn't limit creativity—it directs it toward solutions we can actually ship.

**Prototype with real constraints in mind**

Early in my career, I designed a beautiful data visualization dashboard.

Then I found out our API couldn't support real-time updates.

Now I ask about the data before designing the interface.

→ What's the data structure?
→ What's the update frequency?
→ What happens when there's no data?
→ What happens when there's too much data?

These questions lead to better designs.

**Collaborate during implementation**

I don't "hand off" designs to engineering.

I sit with them during implementation. In Slack, in GitHub, in pairing sessions.

When edge cases appear (and they always do), we solve them together.

"What should happen when the user uploads a 10MB file?"
"How should this look with a really long username?"

These aren't engineering questions. They're design questions that benefit from engineering perspective.

**Speak the same language**

I've learned to:
→ Read basic HTML, CSS, and JavaScript
→ Understand common technical constraints (API limits, browser compatibility)
→ Use developer tools to inspect implementations
→ Write GitHub issues that engineers can action

I'm not trying to be an engineer. But I am trying to work in the same reality they do.

**The outcome:**

Designs that ship. Respect across teams. Solutions that work for users and engineers.

The best compliment I've received: "It's easy to build your designs because you think about how they'll be implemented."

That's not luck. It's collaboration.

How do you work with engineering? What's made your collaboration successful?

#ProductDesign #CrossFunctional #Engineering #Collaboration #UXDesign

---

### Week 5 - Wednesday: Data-Driven Design Decisions
**Type**: Text + Chart/Metrics
**Best time**: Wednesday 12-1 PM ET

Designers who ignore data miss half the picture.

Here's a real example from my work:

**The situation:**

We were redesigning a B2B SaaS onboarding flow. The existing flow had a 42% completion rate.

**The opinions:**

Designer (me): "The form is too long. We should reduce fields."
Product: "We need that information for sales qualification."
Engineering: "We can make it a multi-step wizard."
Sales: "Don't change anything that affects lead quality."

Everyone had a theory. No one had data.

**What I did:**

Instrumented the existing flow with analytics to understand where and why users dropped off.

The findings:

📊 68% of users who started the form completed the first step
📊 89% of those completed the second step
📊 Only 47% completed the third step

The third step asked for company size, industry, and use case. All required fields.

I dug deeper with session replay tools:

→ Users spent an average of 47 seconds on step 3
→ Many toggled between fields multiple times
→ The "industry" dropdown had 40+ options

**The hypothesis:**

The problem wasn't the number of fields. It was the cognitive load of choosing from 40 industries while trying to sign up.

**The solution:**

→ Reduced industry dropdown to 8 top-level categories
→ Added "Other" with optional text input
→ Made "company size" a simple range selector instead of exact number
→ Kept all the fields sales needed

**The validation:**

Tested the new flow with 12 users. All completed it in under 2 minutes.

**The result:**

📊 Completion rate increased from 42% to 71%
📊 Time to complete decreased by 34%
📊 Lead quality remained the same (sales was happy)
📊 Zero negative feedback on the new flow

**What I learned:**

→ Opinions are starting points, not solutions
→ Data tells you where the problem is
→ User research tells you why it's a problem
→ Design solves it

I could have redesigned based on gut feeling. Maybe it would have worked.

But data gave us confidence that we were solving the right problem in the right way.

**My process now:**

1. Identify the metric we're trying to move
2. Understand the current state with analytics
3. Form hypotheses based on data + user research
4. Design solutions that address the root cause
5. Validate with testing before building
6. Measure the impact after shipping

Data doesn't replace design intuition. It informs it.

How do you use data in your design process?

#DataDrivenDesign #ProductDesign #Analytics #UXResearch #DesignProcess

---

### Week 5 - Friday: Case Study Highlight Reel
**Type**: Video or Carousel
**Best time**: Friday 9-10 AM ET

**Slide 1 - Cover**
3 projects. 10+ years of experience. One approach.

Transforming complex problems into elegant solutions

**Slide 2 - AfterPromCentral**
AFTERPROMCENTRAL EVENTS CALENDAR

Built a multi-event calendar system that scaled to 500+ concurrent events across 30+ communities

Impact:
📊 500+ events managed successfully
📊 90% reduction in support requests
📊 Streamlined admin experience

Timeline: 8 weeks

**Slide 3 - Integrate**
INTEGRATE DESIGN SYSTEM AUDIT

Audited an enterprise B2B design system and created a roadmap for team scalability

Impact:
📊 60% reduction in design-to-dev cycle time
📊 200+ components catalogued and optimized
📊 Improved accessibility compliance

Timeline: 9 months

**Slide 4 - NYC New Years**
NYC NEW YEARS SITE OVERHAUL

Redesigned NYCNewYears.com to serve 1 million+ visitors on the biggest night of the year

Impact:
📊 60% reduction in page load time
📊 1M+ visitors served successfully
📊 Improved accessibility and mobile experience

Timeline: 12 weeks

**Slide 5 - Common Threads**
WHAT CONNECTS THESE PROJECTS

→ Deep cross-functional collaboration
→ Data-driven decision making
→ Focus on scalability and performance
→ User-centered design with business impact

This is the work I love doing.

**Slide 6 - CTA**
WANT TO SEE THE FULL CASE STUDIES?

Visit gabevelez.com to explore these projects in detail

→ Process walkthroughs
→ Detailed outcomes
→ Lessons learned

---

**Post caption for carousel:**

Three projects. Different industries. Different challenges.

But the same approach:

→ Understand the problem deeply
→ Collaborate across functions
→ Validate with data and research
→ Ship solutions that scale

AfterPromCentral: Built an event calendar system that handles 500+ concurrent events

Integrate: Audited an enterprise design system and cut design-to-dev time by 60%

NYC New Years: Redesigned a high-traffic event site to serve 1M+ visitors with 60% faster load times

What connects them all? A focus on solving real problems for real users while delivering business impact.

Swipe through to see the highlights →

Full case studies at gabevelez.com (link in comments)

#ProductDesign #CaseStudy #Portfolio #UXDesign #DesignImpact

---

## Week 6: Expertise & Call to Action

### Week 6 - Monday: 10 Years of Product Design Lessons
**Type**: Text (Thread-style if needed)
**Best time**: Monday 8-9 AM ET

10 years. Dozens of products. Hundreds of features.

Here are the 7 most important lessons I've learned:

**1. Involve engineering from day one**

Early in my career, I "finished" designs before talking to engineering.

Result: Beautiful mockups that were impossible to build.

Now: Engineering is in the first meeting. We solve problems together, not sequentially.

**2. Constraints breed better solutions**

I used to see constraints as limitations.

Now I see them as guardrails that focus creativity.

Limited time? Scope aggressively.
Limited tech resources? Design with the existing stack.
Limited data? Start with qualitative research.

The best solutions work within reality, not around it.

**3. Performance is a design material**

If users don't experience your design, it doesn't matter how good it is.

I've learned to design with load time, Time to Interactive, and perceived performance in mind.

Speed isn't the engineer's job. It's everyone's job.

**4. Data without context is just numbers**

Analytics tell you where users struggle.
User research tells you why.

You need both.

I've shipped failed features because I trusted data without talking to users.
I've shipped successful features because I combined data with research.

**5. Design systems are about people, not components**

A design system isn't a Figma library.

It's a shared vocabulary. A collaboration model. A way for teams to move faster together.

The best design systems I've worked on had strong governance, clear contribution processes, and cross-functional adoption.

**6. Scope is a competitive advantage**

The teams that ship fastest aren't the ones with unlimited resources.

They're the ones that ruthlessly prioritize.

Ship the MVP that solves the core problem. Learn. Iterate.

Perfect is the enemy of shipped.

**7. Collaboration beats individual brilliance**

The best solutions I've shipped came from collaboration with product, engineering, and users.

The worst solutions came from designing in isolation.

Great design is a team sport.

---

After 10 years, I'm not done learning.

But I know this: The designers who succeed are the ones who collaborate deeply, validate constantly, and ship relentlessly.

I'm looking for my next challenge—a team that values these principles and wants to build products that matter.

What's the most important lesson you've learned in your career?

#ProductDesign #CareerLessons #DesignLessons #UXDesign #DesignCareer

---

### Week 6 - Wednesday: What I'm Looking For
**Type**: Text + Brand Image
**Best time**: Wednesday 12-1 PM ET

After 10+ years, I know what kind of work energizes me.

Here's what I'm looking for in my next role:

**The problems:**

I'm drawn to complex, ambiguous challenges that require deep collaboration to solve.

→ Building design systems that scale across teams
→ Redesigning core experiences that impact thousands (or millions) of users
→ Creating 0-to-1 products where the problem is clear but the solution isn't
→ Optimizing user flows with measurable business impact

I don't want to make landing pages prettier. I want to solve problems that matter.

**The team:**

I thrive in cross-functional environments where design, product, and engineering work as partners.

What I'm looking for:
→ Designers who challenge each other and collaborate openly
→ Product managers who value research and validation
→ Engineers who contribute to design solutions, not just implement them
→ Leadership that understands design's strategic value

I want to work with people who are smarter than me and push me to grow.

**The culture:**

→ Bias toward shipping (done is better than perfect)
→ Data-driven decision making (opinions backed by evidence)
→ Focus on outcomes, not outputs (impact over deliverables)
→ Commitment to accessibility and inclusive design

I want to work somewhere that values craft and urgency in equal measure.

**The role:**

I'm open to:
→ Senior Product Designer roles where I'm driving key product initiatives
→ Design System roles where I'm building foundations for scale
→ Lead roles where I'm mentoring designers and setting design direction

I'm particularly interested in:
→ B2B SaaS products
→ Tools that solve real problems for users
→ Companies that are scaling and need design systems thinking
→ Teams that ship frequently and iterate based on data

**What I bring:**

→ 10+ years of product design experience
→ Deep collaboration with engineering and product
→ Design systems expertise and scalability thinking
→ Data-driven approach to design decisions
→ Track record of shipping products that users love

**What I don't want:**

→ Roles where design is just making things pretty
→ Companies that don't value research or validation
→ Teams where design doesn't have a seat at the table
→ Environments where politics matter more than outcomes

---

If this resonates with you (or someone you know), I'd love to connect.

I'm looking for my next challenge where I can bring 10+ years of experience to a team that's building something meaningful.

What's the most important factor in your ideal role?

#OpenToWork #ProductDesign #DesignJobs #HiringDesigners #UXDesign

---

### Week 6 - Friday: Portfolio Showcase
**Type**: Text + Link to Website
**Best time**: Friday 9-10 AM ET

Over the past 6 weeks, I've shared:

→ Case studies from AfterPromCentral, Integrate, and NYC New Years
→ Process insights and frameworks
→ Lessons learned from 10+ years in product design
→ How I collaborate with engineering and product
→ What I'm looking for in my next role

If you want to see more of my work, explore the full case studies at:

**gabevelez.com**

Each case study includes:

✓ Detailed problem statements and context
✓ My design process and methodology
✓ Collaboration approaches with cross-functional teams
✓ Measurable outcomes and business impact
✓ Lessons learned and key takeaways

**What you'll find:**

→ **AfterPromCentral Events Calendar**: How I built a multi-event calendar system that scaled to 500+ concurrent events across 30+ communities

→ **Integrate Design System Audit**: How I evaluated an enterprise design system and created a roadmap that reduced design-to-dev cycle time by 60%

→ **NYC New Years Site Overhaul**: How I redesigned a high-traffic event site to serve 1M+ visitors with 60% faster load times

**Why I built this portfolio:**

I wanted to show not just what I designed, but how I think about problems, collaborate with teams, and measure success.

These aren't just pretty screenshots. They're stories about solving real problems for real users.

**I'm actively looking for my next role.**

If you're hiring product designers (or know someone who is), I'd love to connect.

I'm looking for:
→ Senior Product Designer or Design Lead roles
→ Teams that value cross-functional collaboration
→ Companies building products that solve meaningful problems
→ Environments where design has strategic impact

**Let's connect:**

→ Visit gabevelez.com to see the full case studies
→ Connect with me here on LinkedIn
→ Share this post if you know teams that are hiring

Thank you to everyone who's engaged with my posts over the past 6 weeks. The conversations, feedback, and connections have been incredible.

Now let's find the next challenge to tackle together.

#ProductDesign #Portfolio #OpenToWork #DesignJobs #HiringDesigners #UXDesign

---

## Bonus Posts (Use as needed)

### Bonus: Sunday Engagement Post
**Type**: Text
**Best time**: Sunday 6-7 PM ET

Sunday evening question for product designers:

What's one thing you wish you knew when you started your design career?

For me: I wish I'd learned earlier that the best solutions come from collaboration, not isolation.

Drop your answer below 👇

#ProductDesign #DesignCareer #SundayThoughts

---

### Bonus: Mid-Week Engagement
**Type**: Text
**Best time**: Wednesday 12-1 PM ET

Quick poll for product designers:

What's the biggest challenge in your current role?

A) Getting stakeholder buy-in
B) Balancing speed vs. quality
C) Working with engineering
D) Measuring design impact

Comment with your letter and why!

#ProductDesign #DesignChallenges #UXDesign

---

### Bonus: Industry Trend Commentary
**Type**: Text
**Best time**: Friday afternoon

Everyone's talking about AI in design.

But here's what I think matters more:

Learning to collaborate better with the humans you work with.

AI can generate mockups. It can't facilitate alignment between product, design, and engineering.

AI can analyze data. It can't synthesize user research into insights.

AI can suggest patterns. It can't understand the unique constraints of your users and business.

The designers who will thrive aren't the ones who use the fanciest AI tools.

They're the ones who:
→ Collaborate deeply across functions
→ Validate assumptions with real users
→ Ship solutions that solve actual problems
→ Measure outcomes and iterate

Technology changes. Fundamentals don't.

What's your take on AI in design?

#ProductDesign #AIDesign #DesignThinking #UXDesign

---

## Post Publishing Checklist

For each post:

- [ ] Copy post text to LinkedIn
- [ ] Add relevant image/carousel (if applicable)
- [ ] Include 3-5 hashtags
- [ ] Post at optimal time
- [ ] Add case study link to comments (when relevant)
- [ ] Engage with first 3-5 comments within 30 minutes
- [ ] Monitor engagement throughout the day
- [ ] Track impressions and engagement rate

---

## First Comment Templates (for case study posts)

**For AfterPromCentral posts:**
```
Want to see the full case study? Check out gabevelez.com/case-studies/afterpromcentral-events-calendar

Includes detailed process, technical decisions, and lessons learned.
```

**For Integrate posts:**
```
The complete design system audit framework and findings are available at:
gabevelez.com/case-studies/integrate-design-system-audit

Includes the evaluation framework and detailed recommendations.
```

**For NYC New Years posts:**
```
See the full before/after transformation and technical deep dive:
gabevelez.com/case-studies/nycnewyears-dot-com-site-overhaul

Includes performance metrics and accessibility improvements.
```

---

## Analytics Tracking Sheet

| Week | Post | Date | Impressions | Engagement Rate | Comments | Shares | Profile Views | New Connections |
|------|------|------|-------------|-----------------|----------|--------|---------------|-----------------|
| 1 | Mon | | | | | | | |
| 1 | Wed | | | | | | | |
| 1 | Fri | | | | | | | |
| 2 | Mon | | | | | | | |
| 2 | Wed | | | | | | | |
| 2 | Fri | | | | | | | |
| 3 | Mon | | | | | | | |
| 3 | Wed | | | | | | | |
| 3 | Fri | | | | | | | |
| 4 | Mon | | | | | | | |
| 4 | Wed | | | | | | | |
| 4 | Fri | | | | | | | |
| 5 | Mon | | | | | | | |
| 5 | Wed | | | | | | | |
| 5 | Fri | | | | | | | |
| 6 | Mon | | | | | | | |
| 6 | Wed | | | | | | | |
| 6 | Fri | | | | | | | |
