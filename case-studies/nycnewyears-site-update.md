# NYCNewYears.com Site Overhaul

## Client/Company/Project Type
A&N Online Marketing

## Project Date
March-May 2025

## My Role
As their sole dedicated Design & Development head, I work closely with the CEO & COO to ensure that the product meets their desired needs as well as work closely with actual customers during our sales season as a way to better understand their needs directly.

## Context
As our flagship business, NYCNewYears.com serves thousands of tourists each year to sell online tickets for New Year's Eve events in New York City. 

With that in mind, there was a need to update and overhaul the site:

1. Internally we needed to better automate our workflow in building and maintaining our numerous events. 
2. We needed to better serve our online customers with an improved overall User Experience.
3. We needed to establish stronger trust and credibility with potential customers, particularly international tourists investing significant sums for a once-in-a-lifetime New Year's Eve experience.

What came of this was a completely redesigned site with a completely overhauled homepage that addressed who we are and what we provide, as well as backend tooling to improve overall event workflows.

## The Challenge

Our legacy website, while functional, had accumulated significant technical debt over the years. We wanted to approach this site update as a complete overhaul, focusing on reducing the actual code coverage and making the engineering much more efficient while improving the site itself. It was built on an aging WordPress Genesis child theme with hand-coded HTML elements scattered throughout widgets and custom fields. This created multiple bottlenecks in our workflow - the team would often need to manually update dozens of event listings with crucial details like new venues becoming sold out, and old venues either unavailable or closed. Without a streamlined system, human error became inevitable during our busiest season, exactly when we could least afford it.

From a customer perspective, our site had fallen behind modern UX standards. User research and heatmap analysis showed visitors struggled to effectively compare different venues and event types. The mobile experience was particularly problematic, with important information buried beneath multiple clicks and non-responsive elements making navigation frustrating. This was particularly concerning given that over 83% of our traffic comes from mobile devices.

### The Trust Challenge

When analyzing our Crazy Egg heatmaps, we discovered an interesting pattern - we had significantly more bounces on mobile compared to desktop, despite having higher mobile engagement overall:

![Heatmap showing mobile vs desktop engagement patterns](/img/caseStudy_nycnyHomepageHeatmap1.webp)

The trust issue became evident through customer feedback, particularly from mobile users who frequently asked, "Is this real?" This question revealed a fundamental credibility gap in our digital presence. International tourists planning a once-in-a-lifetime New Year's Eve in NYC were being asked to spend significant sums on tickets through a website that didn't adequately establish its legitimacy.

The root cause was identified through user testing: the absence of key trust elements throughout the purchase journey. On mobile specifically, a critical descriptive paragraph that established our business context had been removed during previous sales optimization efforts. Without these trust signals, potential customers lacked confidence in our authenticity, especially those traveling from overseas who had no way to verify our legitimacy through local knowledge.

Our analysis identified several critical trust barriers:
- Insufficient venue verification (customers couldn't easily confirm we had legitimate relationships with NYC establishments)
- Lack of social validation from previous customers
- Limited transparency around our business history and reputation
- Missing evidence of previous successful events
- Unclear pricing and inclusion details

These trust gaps directly impacted our conversion rates, with heat mapping showing users abandoning the site precisely when they should have been making purchase decisions.

## Solution

### Discovery & Planning

I began with a comprehensive audit of our existing system, documenting both technical architecture and user flows. Working with the CEO and COO, we established clear priorities: improving the internal event management workflow, enhancing the mobile user experience, and building stronger trust signals throughout the purchase journey.

Using the insights from our analytics and customer feedback, I created user personas representing our core audience segments:

- International tourists planning months in advance
- Domestic visitors making last-minute decisions
- Group organizers coordinating for multiple people
- Luxury experience seekers wanting premium options
- Budget-conscious customers seeking value

### Technical Architecture Overhaul

The first major decision was continue to maintain WordPress as our foundation because of the overall SEO strength of our brand that existed for decades. What was decided though was to completely rebuild the theme architecture. With this in mind I designed a component-based structure that would separate concerns, making the codebase more maintainable and reducing overall technical complexity.

```
Theme
 ├── Header Component
 ├── Footer Component
 ├── Event Grid Component
 ├── Venue Page Component
 ├── Category Filters Component
 └── Location Navigation Component
```

For the actual post editing in the admin, the previous system was a lot of Custom Fields to be manually inputed with custom IDs, html embeds, and links. 

![Custom Fields inputs that were confusing](/img/casestudy_nycnyOldCustomFields.webp)

Instead, all that was removed and replaced with an actual user interface dropdowns and inputs for team members to go into and edit more easily without having to remember the custom field IDs.

![Revised Event Details Admin Section](/img/casestudy_nycnyEventDetails.webp)

Our previous site used actual Google Map embeds that worked well, but were taxing on actual page load time. Also, we would still have to input the venue name and address as well as the map embed via Custom Fields. Instead what was built was an actual interface in the admin section that would draw from Google Places and Google Maps API to show a static map with the Name and address of the venue with linkage to the google map page when clicked. This becomes a definite page load boost. 

![New API-driven Map Interface](/img/casestudy_nycnyGMapInterface.webp)

The most technically challenging aspect was integrating with multiple ticketing platforms (TicketSauce, Eventbrite, Tixr, and Crave) through a unified interface. I developed a standardized API wrapper that normalized data across these disparate systems, allowing us to maintain consistent user experience regardless of the backend ticketing provider.

![New Unified Ticketing Interface](/img/casestudy_nycnyTicketing.webp)

A key focus of our technical overhaul was reducing the actual code coverage to make the site more efficient. Through refactoring and component-based architecture, we significantly reduced the theme's file size and complexity. By eliminating redundant code and creating reusable components, we not only improved maintainability but also enhanced the site's performance and loading times.

One significant challenge we addressed was the inefficient structure of our category and status pages. Previously, if we had events that were closed, sold out, or unavailable, we needed separate template pages for each category-status combination. This resulted in approximately 36 different page templates (twelve categories × 3 status types), creating unnecessary complexity and maintenance overhead.

We completely restructured this system, reducing it to just three template types that were managed via categories in the WordPress backend. Editors could simply check a category from a checklist in the editing area rather than selecting from dozens of templates. This streamlined approach dramatically reduced the amount of code, saved considerable time in content management, and eliminated numerous opportunities for human error in our internal workflows.

### User Experience Redesign

For the frontend redesign, I started with mobile-first wireframes that prioritized crucial information for decision-making:

- Clear event categories and filtering options
- Prominent date and pricing information
- Venue highlights with visual indicators

Based on our Crazy Egg findings, we decided to completely change the homepage structure, transforming it into more of a landing page format. The new homepage featured a completely redesigned hero section with a fun, engaging statement about what we do, immediately communicating our value proposition and building credibility. On a design level we actually took numeric balloon images and dynamically made them represent the new year and animated them top float to create some visual flair. These ballons are programmatic - when the new year comes, they dynamically change to show next year in balloon form!

![Dynamic floating New Years Balloons](/img/casestudy_nycnyBalloons.webp)

Rather than keeping all events on the homepage as we had previously done, we moved them to a dedicated events page that maintained the familiar layout but without the descriptive copy that now appeared prominently on the homepage for all device sizes. I also implemented a location-based navigation system that allowed users to quickly filter events based on NYC neighborhoods, catering to both tourists familiar with the city and those who wanted events near their accommodations.

Another significant challenge was the site's inadequate search functionality. Previously, we only offered limited dropdown menus: "find by name," "find by location," and "find by type" on desktop, while mobile users had access to just "find by name" and "find by type" options. This created a confusing and difficult navigation experience, especially for mobile users who comprise our largest audience segment.

![Previous confusing dropdown navigation system](/img/caseStudy_nycnyDropdownMess.webp)

To address this, we completely reimagined our search approach:

1. We transformed "find by type" into a prominent category bar that appears on nearly every page, featuring intuitive categories like "best cruises" or "fun rooftops" that match how users actually think about their event preferences.

![New category navigation bar showing event type categories](/img/caseStudy_nycnyCategories.webp)

2. For mobile users, we implemented this category system as a carousel-style interface similar to Instagram's navigation bar, creating a familiar and touch-friendly experience.

3. We replaced the limited "find by name" dropdown with a full-featured search bar enhanced with fuzzy logic, significantly improving the likelihood of users finding what they're looking for even with partial or approximate queries.

4. For location-based searches, we added a dedicated location icon in the header of every page (both mobile and desktop), which opens a modal with geographical filtering options when tapped.

These improvements made the site dramatically more intuitive while simultaneously offering more powerful search capabilities, reducing the steps required for users to find relevant events.

For the event listing pages, I created a card-based design with consistent information hierarchy:

- Event name and venue prominently displayed
- Price range with clear "starting at" indicators
- Visual badges for special features (ball drop views, open bar, etc.)
- Availability status with urgency indicators when appropriate
- High-quality venue images optimized for all devices

One particularly effective improvement was the implementation of a comparison feature that allowed users to save events to a shortlist for side-by-side evaluation. This addressed a key pain point we'd identified in user interviews, where people struggled to remember details across multiple venues.

### Comprehensive Trust & Social Proof Strategy

To address the "Is this real?" concerns we frequently received, we developed a comprehensive trust-building strategy that was integrated throughout the entire user journey. This wasn't just about adding a few testimonials—it required a systematic approach to credibility:

#### Homepage Trust Elements
We added a moving logo carousel featuring our venue partners prominently on the homepage. This immediately communicated our legitimate relationships with recognizable NYC establishments that customers could independently verify.

![Social proof through venue partnerships](/img/caseStudy_nycnySocial.webp)

#### Consistent Trust Signals Throughout
Rather than isolating social proof to a single section, we strategically placed trust elements at key decision points across the purchase journey:

1. **Early Exploration Phase**
   - Clear "About Us" information establishing our company history and NYC expertise
   - Media mentions and press coverage highlighting our reputation
   - Customer testimonials with demographic information for relatability

2. **Venue Consideration Phase**
   - Photo galleries from previous years' events showing real people at actual venues
   - Venue partnership verifications with direct links to venue websites
   - Location details with historical information about venues

3. **Purchase Decision Phase**
   - Transparent pricing with detailed breakdowns of what's included
   - Security badges and payment protection information
   - Concierge service highlighting personalized support

4. **Post-Purchase Reinforcement**
   - Clear communication about ticket delivery and event details
   - FAQ sections proactively addressing concerns about legitimacy

These elements were designed to progressively build trust as users moved through the site, with each touchpoint reinforcing our legitimacy and answering the "Is this real?" question before it could even arise.

The trust strategy wasn't just about aesthetics—it was a deliberate response to specific user concerns identified in our research, with each element addressing a particular aspect of the credibility gap.

### Testing and Iteration

Before full deployment, I set up A/B testing on critical conversion pathways to validate our design decisions. This allowed us to make data-driven refinements to button placement, form fields, and call-to-action copy that measurably improved conversion rates.

### Development Methodology

My technical approach to building the site followed a lean, iterative process that leveraged modern tools and practices:

1. I began by creating a standalone prototype using basic HTML, CSS, and JavaScript – completely independent of WordPress. This lightweight prototype focused on just three key page types: the homepage, events listing page, and a single venue page layout.

2. This prototype was hosted on Netlify, allowing the CEO, COO, and team members to quickly interact with the new design concepts and provide feedback before committing to full development.

3. Once the prototype received approval, I utilized VS Code alongside AI tools (Cline and Anthropic Claude 3.7 Sonnet) to rapidly develop the full WordPress implementation. The AI assistance was particularly valuable for generating boilerplate code, refactoring repetitive patterns, and solving complex integration challenges.

4. This approach allowed me to accomplish something I had wanted to do for a long time: dramatically reduce the complexity and redundancy in our codebase. The power of AI-assisted development enabled us to rebuild the site with significantly less code while maintaining all functionality.

The combination of rapid prototyping, team feedback, and AI-assisted development allowed us to complete the project in a compressed timeframe while achieving dramatically improved code quality.

## Results

The site redesign launched in May 2025, just as our early-bird sales period began. The technical achievements were immediately apparent, with a significant 48% reduction in code size from 8.2 MB to 4.2 MB.

![Comparison of theme file size before and after optimization](/img/caseStudy_nycnyThemeFilesizeCompare.webp) - note under image: From 8.2 MB to 4.2 MB - a 48% percent in code reduction

This file size reduction not only improved page load times but also simplified future maintenance and updates, making our development workflow more efficient for the long term.

The team has expressed high satisfaction with the new admin interface improvements, with the content editing experience transformed from a complex, error-prone process into a streamlined workflow. What previously required specialized knowledge of custom field IDs and HTML embedding is now accessible through an intuitive interface with dropdowns and visual controls.

### Expected Outcomes

As we enter our peak season (October-December 2025), we anticipate several positive outcomes from this redesign:

- Improved trust signals will likely reduce "Is this real?" customer service inquiries
- The mobile-optimized experience should lead to higher conversion rates on devices that represent over 83% of our traffic
- Our international customers (over 65% of our audience) will benefit from clearer information architecture
- The unified ticketing platform integration will provide consistent customer experiences regardless of the backend provider
- Content maintenance time will be dramatically reduced during our busiest period

Based on the technical improvements and positive internal feedback, we're already planning to expand these interface enhancements and trust-building strategies to our other web properties. The component-based architecture we've developed will make this expansion more efficient, as we can now reuse standardized elements across multiple sites.

Looking further ahead, we're planning to enhance the system with personalized recommendations based on browsing behavior and to improve post-purchase communication with event-specific mobile guides.
