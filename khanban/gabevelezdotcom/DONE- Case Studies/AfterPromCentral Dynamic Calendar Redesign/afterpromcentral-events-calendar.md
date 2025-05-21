# AfterPromCentral Events Calendar

## Client/Company/Project Type
AfterPromCentral

## Project Date
January 2024 - March 2024

## My Role
Throughout this entire process I held many hats. I started as the sole UX Designer that gathered research to present to the CEO & COO for deliberation. I then created & reiterated designs. After this I took on the role of the only Wordpress Plugin Engineer. I devised a solution via coding, deploying & testing in-house on both mobile & desktop.

## Context
For over a decade, AfterPromCentral dot com has sold tickets to their after-prom parties to thousands of high school kids in the New York / New Jersey metro area. Their prom season consists of 20-30 parties, running between March and June, and are held in a variety of different venues.

The goal of this project is twofold:
1. To create a calendar list view that would lead to a sales page for that event.
2. To make a dynamic component with an interface for ease of use internally by team members to add, delete, or edit events.

## The Challenge
The site beforehand had a calendar list view present, but it was literally hand-coded HTML in a widget in the backend of Wordpress. This was messy - the people on the team that manage this are not developers, and accidents would be prone to occur.

![Wordpress Widget filled completely with raw HTML](/img/casestudy_APCEManualHTMLcode.webp)

*Manually editing HTML only causes human error!*

The target audience here is two-fold: it consists of the high school kids that are looking to find the same date as their prom to have an after-party attached to it, and their parents who most likely are making the credit card purchase.

In the past, the list view tiles were designed to be venue-focused, instead of focused by the date of the actual event. They also were linked to a venue page which gave information to the page, but then they would have to on that page look for their date again.

There also was the development chasm - I've been designing and building Wordpress sites for a while, but only ever kept completely on the front-end. Plugin development was never something I would consider to venture into.

## Solution
As the adage goes: Always Be Closing. The decision was made to have these tiles link directly to the sales page instead of the venue page.

![Diagram of the small yet significant change in the user journey](/img/casestudy_APCWireframe.webp)

*Diagram of the small yet significant change in the user journey.*

Also, the design would be more focused on the date instead of the venue, so the user can immediately go buy those tickets for that date they need. We also decided to still show the venue logo strictly for branding purposes.

![Showing iterations of calendar tiles for list view](/img/casestudy_APCETilesFigma.webp)

*Original vs New Calendar Tile design.*

I learned to build a Wordpress plugin and used that hand-coded HTML as a guide. I also used ChatGPT 3.5 to help me write the code for the plugin, and to my surprise it was very helpful. It did hiccup from time to time, so I had to spend time learning how to manage its limits.

![APCE Events backend dashboard with table](/img/casestudy_APCEDashboard.webp)

*One place now to see all events.*

![APCE Modal form to add events](/img/casestudy_APCEModal.webp)

*No more HTML - a simple form does it all.*

![APCE Alert Dialog to delete events](/img/caseStudy_APCEDeleteModal.webp)

*Team can now delete events without any human error.*

The plugin basically sets up an admin page section in the Wordpress backend where you can see a new table, pulled from the database, that would show all these events. There team members can add an event using a modal. The event would then be added to the database, where the tabbed calendar area found in the homepage and calendar page can pull data from.

![Before and after of mobile view of Homepage Calendar, tabbed monthly](/img/caseStudy_APCEHomepageCalendarMobile.webp)

*Calendar before & after on the homepage.*

I also remodeled the venue pages so that calendar data can also be pulled from the database and show only the dates of that venue.

![Before and after of mobile view of actual venue page showing improved calendar buttons](/img/caseStudy_APCEVenuepageCalendarMobile.webp)

*Before and after showing how users can now see the dates related to their prom better.*

There is also a feature created so a team member can delete an event from the backend. An editing feature is currently in the works, which is scheduled to be added in the off-season.

## Results
Deployed in March, right before the season started, the team was more than satisfied with the results. There was always a grimace when it came to making these edits. Now, those edits are simple and easy to handle.

![Screenshot of heatmap showing high use of calendar tabs](/img/caseStudy_APCEHeatmap.webp)

We've already seen through our Heatmaps that the homepage tabbed interface is being used as conversions are coming in.
