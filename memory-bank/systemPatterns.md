# System Patterns - Gabe Velez Portfolio Website

## Architecture Overview

The portfolio website follows a component-based architecture implemented with vanilla HTML, CSS, and minimal JavaScript, avoiding frameworks while maintaining reusable patterns.

## Core Technical Patterns

### Component Loading System
**Pattern**: Dynamic content injection using jQuery
**Implementation**: 
- `layout.js` loads header and footer components into all pages
- Shared navigation and footer markup prevents duplication
- Enables site-wide updates through central component files

**Files**:
- `/layout/header.html` - Main navigation component
- `/layout/footer.html` - Footer component  
- `/layout.js` - Component loading logic

### Responsive Image Strategy
**Pattern**: Progressive image loading with multiple formats and sizes
**Implementation**:
```html
<picture>
    <source type="image/webp" media="(min-width: 1060px)" srcset="image@2x.webp 1x, image@3x.webp 2x" />
    <source type="image/webp" media="(min-width: 600px)" srcset="image@2x.webp" />
    <img loading="lazy" src="image.webp" srcset="image.webp 1x, image@2x.webp 2x" alt="Description">
</picture>
```
- WebP format for better compression
- Multiple breakpoints (mobile: <600px, tablet: 600-1059px, desktop: 1060px+)
- Lazy loading for performance
- Retina display support with 2x and 3x variants

### CSS Architecture
**Pattern**: Mobile-first responsive design with CSS custom properties
**Structure**:
- Root-level CSS variables for consistent theming
- Block-Element-Modifier (BEM) naming conventions
- Mobile-first media queries with progressive enhancement
- Component-specific stylesheets when needed

## Component Patterns

### Card Component System
**Pattern**: Reusable card layout for different content types
**Variants**:
1. **Case Study Cards** - Traditional portfolio work
2. **Side Project Cards** - Entrepreneurial work 
3. **Testimonial Cards** - Social proof content

**Base Structure**:
```html
<a class="card" href="[link]">
    <picture>[responsive image]</picture>
    <div class="card__textarea">
        <h3 class="card__title"><span class="company__link">[title]</span></h3>
        <p class="card__description">[description]</p>
    </div>
</a>
```

**CSS Pattern**:
- Consistent hover states and transitions
- Responsive image handling within cards
- Typography scaling across breakpoints
- Semantic color usage through CSS variables

### Case Study Layout Pattern
**Pattern**: Structured content blocks with consistent styling
**Components**:
- `casestudy__hero` - Title and date section
- `casestudy__image` - Full-width hero image
- `block` system with semantic color variants
- Summary sections for quick overview

**Block Variants**:
- `block__black` - Role and key information
- `block__gray` - Summary sections
- `block__sage` - Context and background
- `block__red` - Challenge definition
- `block__teal` - Solution explanation
- `block__forrest` - Results and outcomes

### Navigation Pattern
**Pattern**: Responsive navigation with mobile adaptation
**Implementation**:
- Desktop: Horizontal navigation with logo
- Mobile: Simplified navigation structure
- Active state management for current page
- Scroll-based logo visibility controls

## Content Organization Patterns

### Homepage Section Structure
**Pattern**: Progressive disclosure of capabilities and evidence

1. **Hero Section**: Immediate value proposition and professional introduction
2. **Featured Projects**: Traditional case studies demonstrating client work
3. **Side Projects**: Entrepreneurial work showcasing independent capability
4. **Testimonials**: Social proof and professional endorsements

### Directory Structure Pattern
**Pattern**: Content type organization
```
/case-studies/           # Traditional client work
/side-projects/          # Entrepreneurial projects  
/memory-bank/           # Documentation and context
/layout/                # Shared components
/css/                   # Styling
/img/                   # Image assets
```

### URL and Naming Conventions
**Pattern**: Descriptive, SEO-friendly URLs
- Case studies: `/case-studies/project-name.html`
- Side projects: `/side-projects/project-name.html`
- Consistent hyphenated naming
- Semantic file structure

## New Component Patterns (Recent Additions)

### Side Projects Section
**Pattern**: Entrepreneurial work showcase
**Purpose**: Demonstrate independent development capability
**Structure**:
```html
<section class="side-projects">
    <h2 class="side-projects__title">Side Projects</h2>
    <div class="side-projects__container">
        [card components for entrepreneurial work]
    </div>
</section>
```

**Key Features**:
- Same card component system as featured projects
- Distinct section for non-client work
- Emphasis on technical leadership and business understanding

### Testimonials Section  
**Pattern**: Social proof component system
**Purpose**: Provide credibility through colleague endorsements
**Structure**:
```html
<section class="testimonials">
    <h2 class="testimonials__title">Kind Words</h2>
    <div class="testimonials__container">
        <div class="testimonial-card">
            <blockquote class="testimonial-card__quote">[quote text]</blockquote>
            <div class="testimonial-card__author">
                <img class="testimonial-card__avatar" src="[image]" alt="[name]">
                <div class="testimonial-card__details">
                    <div class="testimonial-card__name">[name]</div>
                    <div class="testimonial-card__title">[title]</div>
                </div>
            </div>
        </div>
    </div>
</section>
```

**Design Principles**:
- Clear attribution with photo and professional title
- Quotation formatting for easy scanning
- Responsive layout adapting to different screen sizes
- Professional aesthetic consistent with overall site design

## Dynamic Behavior Patterns

### Scroll-Based Interactions
**Pattern**: Progressive enhancement through scroll events
**Implementations**:
1. **Logo Visibility**: Logo appears/disappears based on scroll position
2. **Dynamic Backgrounds**: Case study backgrounds transition based on scroll
3. **Lazy Loading**: Images load as they enter viewport

### Color Transition System
**Pattern**: Dynamic background color changes in case studies
**Implementation**: `dynamic-background.js` creates smooth transitions between sections
**Purpose**: Enhanced visual experience and brand consistency

## Performance Patterns

### Image Optimization Strategy
**Pattern**: Multi-format, multi-resolution image delivery
**Implementation**:
- WebP format as primary with fallbacks
- Responsive image sizes based on viewport
- Lazy loading for below-fold content
- Retina display optimization

### JavaScript Minimization
**Pattern**: Selective JavaScript enhancement
**Philosophy**: Progressive enhancement with minimal dependencies
**Usage**:
- jQuery for component loading (will be reconsidered for modernization)
- Custom scripts for specific enhancements
- No large framework dependencies

## Accessibility Patterns

### Semantic HTML Structure
**Pattern**: Proper heading hierarchy and semantic elements
**Implementation**:
- Logical heading structure (h1 → h2 → h3)
- Semantic sectioning elements
- Proper alt text for all images
- Keyboard navigation support

### Screen Reader Considerations
**Pattern**: Content structure optimized for assistive technologies
**Implementation**:
- Descriptive link text
- Image alt attributes
- Proper form labeling (when contact form is implemented)
- Skip navigation options

## Scalability Patterns

### Content Management Approach
**Current State**: Manual HTML editing
**Consideration**: Template-based approach for easier content updates
**Future Pattern**: Potential static site generator integration while maintaining current aesthetic

### Component Extensibility
**Pattern**: Modular component design allows for easy expansion
**Examples**:
- Additional card types for new content categories
- New block types for different case study sections
- Additional testimonial sources and formats

## Technical Debt Management

### Current Technical Choices
**jQuery Dependency**: Used for component loading, targeted for future modernization
**Manual Content Updates**: Direct HTML editing, manageable for current scale
**No Build Process**: Intentional simplicity, may add optimization tooling

### Future Modernization Considerations
**Component Loading**: Transition from jQuery to vanilla JavaScript
**Build Process**: Consider minimal build system for optimization
**Content Management**: Evaluate static site generators or headless CMS options

The system demonstrates careful balance between simplicity and sophistication, enabling rapid development while maintaining professional quality and scalability for future growth.
