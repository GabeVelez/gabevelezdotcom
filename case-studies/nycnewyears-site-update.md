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

1. Internally we needed to better automate our workflow in building and maintaining our multiple events. 
2. We needed to better serve our online customers with an improved overall User Experience.
3. We found that we needed to improve our overall social proof with new potential customers, most of which that travel great distances for an optimal New Year's Eve experience.

What came of this was a completely redesigned site with a completely overhauled homepage that addressed who we are and what we provide, as well as backend tooling to improve overall event workflows.

## The Challenge

Our legacy website, while functional, had accumulated significant technical debt over the years. We wanted to approach this site update as a complete overhaul, focusing on reducing the actual code coverage and making the engineering much more efficient while improving the site itself. It was built on an aging WordPress Genesis child theme with hand-coded HTML elements scattered throughout widgets and custom fields. This created multiple bottlenecks in our workflow - the team would often need to manually update dozens of event listings with crucial details like new venues becoming sold out, and old venues either unavailable or closed. Without a streamlined system, human error became inevitable during our busiest season, exactly when we could least afford it.

From a customer perspective, our site had fallen behind modern UX standards. User research and heatmap analysis showed visitors struggled to effectively compare different venues and event types. The mobile experience was particularly problematic, with important information buried beneath multiple clicks and non-responsive elements making navigation frustrating. This was particularly concerning given that over 83% of our traffic comes from mobile devices, often from international visitors using cellular connections.

When analyzing our Crazy Egg heatmaps, we discovered an interesting pattern - we had significantly more bounces on mobile compared to desktop, despite having higher mobile engagement overall:

![Heatmap showing mobile vs desktop engagement patterns](/img/caseStudy_nycnyHomepageHeatmap1.webp)

The issue became clear when we spoke with prospective customers. Many mobile users would ask via phone or chat: "Is this real? Is this a real site? Does it sell real events?" We realized that on desktop, users saw a descriptive paragraph at the top of the homepage explaining our business, but for sales optimization reasons, we had previously removed this paragraph from the mobile view. This critical context was missing for our largest user segment.

Our third challenge involved trust and credibility. For international tourists planning a once-in-a-lifetime New Year's Eve in NYC, spending hundreds or thousands of dollars on tickets requires significant trust. Our previous design lacked adequate social proof elements like customer testimonials, venue credentials, and transparent pricing. Analytics showed high abandonment rates during the consideration phase, indicating users were leaving to seek validation elsewhere before making purchasing decisions - with many never returning to complete their purchase.

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

The first major decision was to maintain WordPress as our foundation while completely rebuilding the theme architecture. I designed a component-based structure that would separate concerns, making the codebase more maintainable and reducing overall technical complexity.

```
Theme
 ├── Header Component
 ├── Footer Component
 ├── Event Grid Component
 ├── Venue Page Component
 ├── Category Filters Component
 └── Location Navigation Component
```

For the event management system, I created a custom database structure and corresponding admin interface that allowed team members to:

- Update event details in a single location
- Set various status flags (available, limited tickets, sold out)
- Manage pricing tiers and special promotions
- Upload optimized images for different device sizes
- Schedule automatic status changes based on inventory

The most technically challenging aspect was integrating with multiple ticketing platforms (TicketSauce, Eventbrite, Tixr, and Crave) through a unified interface. I developed a standardized API wrapper that normalized data across these disparate systems, allowing us to maintain consistent user experience regardless of the backend ticketing provider.

A key focus of our technical overhaul was reducing the actual code coverage to make the site more efficient. Through refactoring and component-based architecture, we significantly reduced the theme's file size and complexity. By eliminating redundant code and creating reusable components, we not only improved maintainability but also enhanced the site's performance and loading times.

One significant challenge we addressed was the inefficient structure of our category and status pages. Previously, if we had events that were closed, sold out, or unavailable, we needed separate template pages for each category-status combination. This resulted in approximately 36 different page templates (twelve categories × 3 status types), creating unnecessary complexity and maintenance overhead.

We completely restructured this system, reducing it to just three template types that were managed via categories in the WordPress backend. Editors could simply check a category from a checklist in the editing area rather than selecting from dozens of templates. This streamlined approach dramatically reduced the amount of code, saved considerable time in content management, and eliminated numerous opportunities for human error in our internal workflows.

### User Experience Redesign

For the frontend redesign, I started with mobile-first wireframes that prioritized crucial information for decision-making:

- Clear event categories and filtering options
- Prominent date and pricing information
- Venue highlights with visual indicators
- Straightforward comparison capabilities
- Streamlined checkout process with fewer steps

Based on our Crazy Egg findings, we decided to completely change the homepage structure, transforming it into more of a landing page format. The new homepage featured a completely redesigned hero section with a fun, engaging statement about what we do, immediately communicating our value proposition and building credibility. Below this, we added social proof elements to ease visitors' concerns about legitimacy, showcasing the venues we work with to provide credibility to our inventory.

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

### Trust and Social Proof

Based on our customer interactions and the "Is this real?" questions we frequently received, creating a sense of social proof became a critical priority. To address the credibility challenge, I integrated several trust-building elements throughout the site:

- Verified venue badges with years in operation to establish credibility
- Prominent display of venue partnerships to show we have legitimate relationships with recognizable NYC establishments
- Customer testimonials with demographic information to build peer trust
- Transparency about pricing (clearly showing what's included)
- Photo galleries from previous years' events showing real people at real venues
- Clear FAQ sections addressing common concerns about legitimacy and ticket delivery
- Trust signals (secure payment icons, reviews, years in business)

These elements were strategically placed on both the homepage and throughout the user journey to continually reinforce credibility at key decision points. The goal was to give visitors confidence that they could look up our partner venues independently and verify our inventory's authenticity, easing concerns particularly for international customers making significant investments in their NYC New Year's Eve experience.

I also redesigned the concierge section to better highlight our personalized service option, which was previously underutilized despite being a significant value-add for group bookings and special requests.

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

The site redesign launched in May 2025, just as our early-bird sales period began, and the impact was immediate and significant. 

[ALL METRICS BELOW ARE FICTIONAL - REPLACE WITH ACTUAL DATA]
- Internal workflow efficiency improved by over 70%, with our team reporting that tasks that previously took hours now required just minutes through the new admin interface. 
- Through our component-based architecture and code refactoring, we reduced the overall code base by over 50%, significantly improving site performance and maintainability.
- On the customer side, mobile conversion rates increased by 45% compared to the previous year
- Average session duration extended by 2.3 minutes – indicating more engaged browsing. 
- Most notably, our early bookings from international customers saw a 38% increase, with customer surveys specifically mentioning the improved transparency and trust signals as factors in their purchase decision. 

![Comparison of theme file size before and after optimization](/img/caseStudy_nycnyThemeFilesizeCompare.webp)

The file size reduction not only improved page load times but also simplified future maintenance and updates, making our development workflow more efficient for the long term.

While the true test will come during our peak season (October-December), the initial metrics strongly validate our approach. Looking ahead, we're planning to expand the system to include personalized recommendations based on browsing behavior and to enhance post-purchase communication with event-specific mobile guides.
