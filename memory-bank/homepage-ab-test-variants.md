# Homepage A/B Test Variants - Senior Product Designer That Ships

## Current Homepage Content (Control)
**Title:** "Gabe Velez - Product Designer & Front End Developer"
**Hero Headline:** "Hi, My Name is Gabe - I'm a multi-disciplined designer and developer with over 15 years of experience."
**Supporting Text:** "Currently I serve as the Chief Technology Officer for A&N Online Marketing working as their entire design & engineering department. I'm based in Queens, New York."

## Variant A: Problem-Solver Focus

**Title:** "Gabe Velez - Senior Product Designer That Ships"
**Hero Headline:** "Hi, My Name is Gabe - I solve real user problems and deliver products that work."
**Supporting Text:** "Over 15 years helping companies turn complex challenges into simple, effective experiences. Currently leading design and engineering at A&N Online Marketing. Based in Queens, New York, working with teams who need someone who can design it, build it, and ship it."

**Meta Description:** "Senior Product Designer with 15+ years solving complex user problems and shipping products that work. From user research to live deployment in Queens, NY."

## Variant B: Impact-Driven Focus

**Title:** "Gabe Velez - Senior Product Designer That Ships"
**Hero Headline:** "Hi, My Name is Gabe - I design and deliver products that thousands of people actually use."
**Supporting Text:** "From user research to live deployment - I handle the full journey. 15+ years turning messy problems into clean solutions. Currently Chief Technology Officer at A&N Online Marketing, where I run the entire design and engineering process. Based in Queens, New York."

**Meta Description:** "Senior Product Designer shipping products used by thousands. 15+ years experience from user research to deployment. Based in Queens, NY."

## Variant C: Technical-Strategic Balance

**Title:** "Gabe Velez - Senior Product Designer That Ships"
**Hero Headline:** "Hi, My Name is Gabe - I get products from idea to user's hands."
**Supporting Text:** "Multi-disciplined designer and developer who's been solving complex UX challenges for over 15 years. Right now I serve as Chief Technology Officer for A&N Online Marketing, working as their complete design and engineering department. Based in Queens, New York."

**Meta Description:** "Senior Product Designer & developer getting products from idea to users' hands. 15+ years solving complex UX challenges in Queens, NY."

## PostHog Implementation Notes

### Feature Flag Setup
```javascript
// Add to PostHog configuration
const variant = posthog.getFeatureFlag('homepage-redesign-test')

if (variant === 'variant-a') {
    // Show Problem-Solver version
} else if (variant === 'variant-b') {
    // Show Impact-Driven version
} else if (variant === 'variant-c') {
    // Show Technical-Strategic version
} else {
    // Show original (control)
}
```

### Event Tracking
- `homepage_variant_viewed`: Track which variant user sees
- `case_study_clicked`: Primary conversion metric
- `about_page_clicked`: Secondary metric
- `contact_clicked`: Ultimate conversion metric

### Test Configuration
- **Traffic Split:** 25% control, 25% each variant
- **Primary Metric:** Homepage → Case study click-through rate
- **Secondary Metrics:** Time on page, scroll depth, session duration
- **Test Duration:** 2-3 weeks minimum for statistical significance

## Key Messaging Changes

### From Current (CTO Focus):
- "Chief Technology Officer"
- "design & engineering department"
- Technical leadership emphasis

### To New (Design Focus):
- "Senior Product Designer That Ships"
- "solve real user problems" / "deliver products" / "idea to user's hands"
- Design outcome emphasis with technical credibility

## Writing Style Maintained:
- Direct, conversational tone ("Hi, My Name is Gabe")
- Specific experience metrics ("15+ years")
- Practical, no-nonsense language
- Geographic anchor ("Queens, New York")
- Real problems and constraints focus

---
*Created: September 27, 2025*
*Ready for PostHog A/B testing implementation*