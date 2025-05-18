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

Our legacy website, while functional, had accumulated significant technical debt over the years. It was built on an aging WordPress Genesis child theme with hand-coded HTML elements scattered throughout widgets and custom fields. This created multiple bottlenecks in our workflow - the team would often need to manually update dozens of event listings with crucial details like venue changes, sold-out status, or pricing updates. Without a streamlined system, human error became inevitable during our busiest season, exactly when we could least afford it.

From a customer perspective, our site had fallen behind modern UX standards. User research and heatmap analysis showed visitors struggled to effectively compare different venues and event types. The mobile experience was particularly problematic, with important information buried beneath multiple clicks and non-responsive elements making navigation frustrating. This was particularly concerning given that over 65% of our traffic comes from mobile devices, often from international visitors using cellular connections.

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

The first major decision was to maintain WordPress as our foundation while completely rebuilding the theme architecture. I designed a component-based structure that would separate concerns, making the codebase more maintainable and reducing the technical complexity for our team members.

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

### User Experience Redesign

For the frontend redesign, I started with mobile-first wireframes that prioritized crucial information for decision-making:

- Clear event categories and filtering options
- Prominent date and pricing information
- Venue highlights with visual indicators
- Straightforward comparison capabilities
- Streamlined checkout process with fewer steps

The new homepage featured a completely redesigned hero section that immediately communicated our value proposition and built credibility. I implemented a location-based navigation system that allowed users to quickly filter events based on NYC neighborhoods, catering to both tourists familiar with the city and those who wanted events near their accommodations.

For the event listing pages, I created a card-based design with consistent information hierarchy:

- Event name and venue prominently displayed
- Price range with clear "starting at" indicators
- Visual badges for special features (ball drop views, open bar, etc.)
- Availability status with urgency indicators when appropriate
- High-quality venue images optimized for all devices

One particularly effective improvement was the implementation of a comparison feature that allowed users to save events to a shortlist for side-by-side evaluation. This addressed a key pain point we'd identified in user interviews, where people struggled to remember details across multiple venues.

### Trust and Social Proof

To address the credibility challenge, I integrated several trust-building elements throughout the site:

- Verified venue badges with years in operation
- Customer testimonials with demographic information
- Transparency about pricing (clearly showing what's included)
- Photo galleries from previous years' events
- Clear FAQ sections addressing common concerns
- Trust signals (secure payment icons, reviews, years in business)

I also redesigned the concierge section to better highlight our personalized service option, which was previously underutilized despite being a significant value-add for group bookings and special requests.

### Testing and Iteration

Before full deployment, I set up A/B testing on critical conversion pathways to validate our design decisions. This allowed us to make data-driven refinements to button placement, form fields, and call-to-action copy that measurably improved conversion rates.

## Results

The site redesign launched in May 2025, just as our early-bird sales period began, and the impact was immediate and significant. Internal workflow efficiency improved by over 70%, with our team reporting that tasks that previously took hours now required just minutes through the new admin interface. On the customer side, mobile conversion rates increased by 45% compared to the previous year, and our average session duration extended by 2.3 minutes – indicating more engaged browsing. Most notably, our early bookings from international customers saw a 38% increase, with customer surveys specifically mentioning the improved transparency and trust signals as factors in their purchase decision. While the true test will come during our peak season (October-December), the initial metrics strongly validate our approach. Looking ahead, we're planning to expand the system to include personalized recommendations based on browsing behavior and to enhance post-purchase communication with event-specific mobile guides.
