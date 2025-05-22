# Technical Context - Gabe Velez Portfolio Website

## Technologies Used

### Core Web Technologies
- **HTML5**: Structural foundation of the site
- **CSS3**: Styling with custom properties (CSS variables)
- **JavaScript**: Minimal client-side functionality
- **jQuery 3.7.1**: Used for DOM manipulation and component loading

### Optimization Technologies
- **WebP Images**: Modern image format for improved compression
- **Responsive Images**: Using the `<picture>` element with multiple sources
- **Lazy Loading**: Via the `loading="lazy"` attribute on images
- **Async Decoding**: Using the `decoding="async"` attribute

### Font Technologies
- **Adobe Fonts**: Via Typekit for typography (lho8sph.css)
- **Poppins**: Primary sans-serif typeface used throughout the site

### Development Approach
- **Framework-Free**: Intentionally avoiding frontend frameworks
- **Mobile-First Responsive Design**: Base styles for mobile with progressive enhancement
- **Component-Based Structure**: Despite not using a framework, follows component principles
- **Progressive Enhancement**: Core content works without JS, enhanced with JS
- **Dynamic Visual Elements**: Scroll-based interactions for enhanced user experience

## Development Setup

### Local Development
The site is built using a simple static file structure that can be served locally:
- No build tools or preprocessors required
- No server-side dependencies
- Can be viewed directly in a browser from the filesystem

### File Organization
```
/
├── index.html               # Homepage
├── about.html               # About page
├── 404.html                 # Custom error page
├── favicon.ico              # Site favicon
├── CNAME                    # DNS configuration for GitHub Pages
├── layout.js                # Component loading script
├── scroll.js                # Scroll-based interactions
├── dynamic-background.js    # Background color transitions for case studies
├── case-studies/            # Case study pages
│   ├── afterpromcentral-events-calendar.html
│   ├── integrate-abm-web-analytics.html
│   ├── integrate-asset-library-redesign.html
│   └── integrate-design-system-audit.html
├── css/                     # Stylesheet files
│   ├── style.css            # Main stylesheet
│   └── textfield.css        # Additional styles
├── layout/                  # Reusable layout components
│   ├── footer.html          # Site footer
│   ├── nav.html             # Navigation for internal pages
│   └── nav_index.html       # Navigation for homepage
└── img/                     # Image assets
    └── [various image files]
```

## Technical Constraints

### Browser Compatibility
- **Modern Browsers**: Optimized for current versions of Chrome, Firefox, Safari, Edge
- **Limited IE Support**: Basic fallback for older browsers (note IE warning comment in HTML)
- **Mobile Browsers**: Full support for iOS Safari and Android Chrome

### Performance Targets
- **Minimal JavaScript**: Reducing runtime overhead
- **Optimized Images**: Multiple formats and sizes for efficient loading
- **Component Reuse**: Reducing duplicate code and maintenance overhead
- **No External Dependencies**: Except for jQuery and Adobe Fonts

### Content Management
- **Manual Updates**: Site content updated via direct HTML editing
- **No CMS**: Intentionally static without a content management system
- **GitHub Pages Compatible**: Structure works with GitHub Pages hosting

## Dependencies

### External Libraries
- **jQuery 3.7.1**: Used for DOM manipulation and AJAX component loading
  ```html
  <script src="https://code.jquery.com/jquery-3.7.1.min.js" 
      integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
      crossorigin="anonymous"></script>
  ```

### Typography
- **Adobe Fonts**: Via Typekit
  ```html
  <link rel="stylesheet" href="https://use.typekit.net/lho8sph.css">
  ```

### Internal Dependencies
- **layout.js**: Handles dynamic component loading
- **scroll.js**: Manages scroll-based interactions and animations
- **dynamic-background.js**: Controls background color transitions in case studies based on scroll position

## Deployment Strategy

### Hosting
The site appears to be hosted on GitHub Pages or similar static hosting:
- **CNAME File**: Indicates custom domain configuration
- **Static Structure**: Compatible with static site hosting platforms

### Deployment Process
- Manual deployment via pushing changes to the repository
- No build step or automated deployment pipeline
- Simple update process: edit files and commit changes

## Technical Debt & Considerations

### Current Technical Debt
- **jQuery Dependency**: Modern sites often use native JS or lighter alternatives
- **Manually Coded Components**: No templating system for more efficient component creation
- **Limited Automation**: No build tools for minification or other optimizations

### Future Technical Opportunities
- **CSS Preprocessing**: Could benefit from Sass/Less for more maintainable styling
- **JavaScript Modules**: Moving from monolithic JS files to ES modules
- **Image Automation**: Build process for automatic image optimization and format conversion
- **HTML Templating**: Introduction of a simple templating system to reduce duplication
