# Portfolio Homepage Hero Section - Updated Copy

## Current Hero Section (Lines 157-166 in index.html)

```html
<h1 class="hero__text" id="hero-headline">
    <span class="hero__hi">Hi, My Name is</span>
    <span class="hero__hidden">Gabe - </span><br>
    [SVG GABE logo]
    <br>
    <span class="hero__break" id="hero-subtext">I'm a multi-disciplined designer and developer with over <strong>10 years of experience.</strong></span>
</h1>
<h2 class="hero__text" id="hero-supporting">
    <span class="hero__break">Currently I serve as the Lead Product Designer & Product Developer for <a class="company__link" href="https://anom.group/" rel="nofollow">A&N Online Marketing</a> working as their entire design & engineering department.</span>
    <span class="hero__break">I'm based in Queens, New York.</span>
</h2>
```

---

## NEW Hero Section - Option 1: Direct Scale Emphasis

```html
<h1 class="hero__text" id="hero-headline">
    <span class="hero__hi">Hi, I'm</span>
    <span class="hero__hidden">Gabe - </span><br>
    [SVG GABE logo]
    <br>
    <span class="hero__break" id="hero-subtext">Senior Product Designer who ships code.</span>
</h1>
<h2 class="hero__text" id="hero-supporting">
    <span class="hero__break">10+ years building products from design to deployment. Currently managing 7 event platforms serving <strong>200K+ annual users</strong> with <strong>69% YoY conversion growth</strong>.</span>
    <span class="hero__break"><strong>Previously:</strong> Product Designer at <a class="company__link" href="https://integrate.com" rel="nofollow">Integrate</a> following their acquisition of ListenLoop. Designed enterprise B2B experiences for Fortune 500 clients and led design system initiatives.</span>
    <span class="hero__break"><strong>What I do:</strong> 0-1 product ownership, conversion optimization, design systems, and full-stack development (React, Next.js, React Native, Firebase).</span>
    <span class="hero__break"><strong>Seeking:</strong> Senior Product Designer or Design Engineer roles where I can contribute as an IC driving measurable impact.</span>
</h2>
```

**Key Changes:**
- Removed "My Name is" (too casual for senior IC positioning)
- Changed "multi-disciplined designer and developer" → "Senior Product Designer who ships code" (clearer IC signal)
- Lead with scale: "200K+ annual users" and "69% YoY conversion growth" in second sentence
- Added Integrate context with "Fortune 500 clients" for credibility
- Explicitly states "0-1 product ownership" and modern tech stack
- Clear job search signal: "Seeking: Senior Product Designer or Design Engineer roles"
- Removed A&N company link (recruiters don't care about unknown company, they care about scale)

---

## NEW Hero Section - Option 2: Metrics-First Hook

```html
<h1 class="hero__text" id="hero-headline">
    <span class="hero__hi">Hi, I'm</span>
    <span class="hero__hidden">Gabe - </span><br>
    [SVG GABE logo]
    <br>
    <span class="hero__break" id="hero-subtext">I build products that <strong>200K+ people</strong> use every year.</span>
</h1>
<h2 class="hero__text" id="hero-supporting">
    <span class="hero__break">Senior Product Designer and Engineer with 10+ years designing, building, and scaling digital platforms. Currently driving <strong>69% YoY conversion growth</strong> across 7 event platforms.</span>
    <span class="hero__break"><strong>Background:</strong> Product Designer at <a class="company__link" href="https://integrate.com" rel="nofollow">Integrate</a> (post-ListenLoop acquisition) serving Fortune 500 clients including Microsoft and Oracle. Led design systems, enterprise UX, and accessibility initiatives.</span>
    <span class="hero__break"><strong>Technical:</strong> React, Next.js, React Native, Firebase, WordPress. I own the full product lifecycle from user research through deployment.</span>
    <span class="hero__break"><strong>Available:</strong> January 2026 for Senior IC roles in Product Design or Design Engineering.</span>
</h2>
```

**Key Changes:**
- Opens with user impact: "200K+ people use" (more human-centered hook)
- "Senior Product Designer and Engineer" (clearer than multi-disciplined)
- Emphasizes "69% YoY conversion growth" in first paragraph
- Name-drops Microsoft and Oracle for B2B credibility
- Explicit availability date: "January 2026"
- Clear IC positioning: "Senior IC roles"

---

## NEW Hero Section - Option 3: Story-Driven (Warmer)

```html
<h1 class="hero__text" id="hero-headline">
    <span class="hero__hi">Hi, I'm</span>
    <span class="hero__hidden">Gabe - </span><br>
    [SVG GABE logo]
    <br>
    <span class="hero__break" id="hero-subtext">A designer who learned to code so I could ship my own work.</span>
</h1>
<h2 class="hero__text" id="hero-supporting">
    <span class="hero__break">Over the past decade, I've designed for Fortune 500 companies at <a class="company__link" href="https://integrate.com" rel="nofollow">Integrate</a> and scaled event platforms to <strong>200K+ annual users</strong> with <strong>69% YoY conversion growth</strong>.</span>
    <span class="hero__break">I believe the best products come from designers who understand code and engineers who appreciate design. My work spans UX research, interface design, design systems, and full-stack development (React, Next.js, React Native, Firebase).</span>
    <span class="hero__break">Currently seeking Senior Product Designer or Design Engineer roles where I can drive measurable impact as an individual contributor. Available January 2026.</span>
</h2>
```

**Key Changes:**
- More narrative hook: "learned to code so I could ship my own work" (shows initiative)
- Scale metrics still prominent but woven into story
- Philosophy statement: "best products come from designers who understand code"
- Softer positioning while still emphasizing IC focus
- Clear availability and job target

---

## RECOMMENDED: Option 1

**Why Option 1 is best for your situation:**

1. **Most ATS-friendly**: Uses clear keyword phrases like "Senior Product Designer," "200K+ annual users," "69% YoY conversion growth" that ATS systems will parse

2. **Fastest time-to-value**: Recruiters spending 40 seconds on your site will immediately see the scale and impact metrics in the second sentence

3. **Clear IC signal**: "Seeking: Senior Product Designer or Design Engineer roles where I can contribute as an IC" explicitly addresses age/overqualification concerns

4. **Technical credibility**: Mentioning React, Next.js, React Native, Firebase shows you're current and hands-on, not legacy

5. **Structured for scanning**: The **bold headers** (Previously, What I do, Seeking) make it easy to skim

---

## Implementation Instructions

### Step 1: Update the HTML (index.html lines 157-166)

Replace the existing hero section with Option 1 content.

### Step 2: Update Schema.org Structured Data (index.html line 39)

**Current:**
```json
"jobTitle": "Lead Product Designer & Product Developer",
"description": "Multi-disciplined product designer and front-end developer with over 10 years of experience",
```

**New:**
```json
"jobTitle": "Senior Product Designer & Engineer",
"description": "Senior Product Designer who ships code. Managing 7 event platforms serving 200K+ annual users with 69% YoY conversion growth.",
```

### Step 3: Update Meta Descriptions (index.html lines 7-10)

**Current:**
```html
<title id="page-title">Gabe Velez - Product Designer & Front End Developer</title>
<meta id="page-description" name="description" content="Product designer and front-end engineer based in NYC. Case studies in design systems, events, and ticketing platforms. 10+ years of UX and development experience.">
<meta property="og:title" content="Gabe Velez - Product Designer & Front End Developer" />
<meta property="og:description" content="Product designer and front-end engineer based in NYC. Case studies in design systems, events, and ticketing platforms. 10+ years of UX and development experience." />
```

**New:**
```html
<title id="page-title">Gabe Velez - Senior Product Designer & Engineer | 200K+ Users</title>
<meta id="page-description" name="description" content="Senior Product Designer managing 7 platforms with 200K+ annual users and 69% YoY conversion growth. Previously at Integrate (acquired ListenLoop). Available January 2026.">
<meta property="og:title" content="Gabe Velez - Senior Product Designer & Engineer | 200K+ Users" />
<meta property="og:description" content="Senior Product Designer managing 7 platforms with 200K+ annual users and 69% YoY conversion growth. Previously at Integrate (acquired ListenLoop). Available January 2026." />
```

### Step 4: Add Calendly Link (Optional - Do After Setup)

Once you've set up your Calendly account, add this line to the hero section:

```html
<span class="hero__break"><strong>Available:</strong> January 2026 | <a class="company__link" href="https://calendly.com/gabevelez" rel="nofollow">Let's talk</a></span>
```

---

## Copy for Easy Pasting

### Option 1 Hero Text (Plain Text for Reference)

**H1:** Hi, I'm GABE. Senior Product Designer who ships code.

**H2 Paragraph 1:** 10+ years building products from design to deployment. Currently managing 7 event platforms serving 200K+ annual users with 69% YoY conversion growth.

**H2 Paragraph 2:** Previously: Product Designer at Integrate following their acquisition of ListenLoop. Designed enterprise B2B experiences for Fortune 500 clients and led design system initiatives.

**H2 Paragraph 3:** What I do: 0-1 product ownership, conversion optimization, design systems, and full-stack development (React, Next.js, React Native, Firebase).

**H2 Paragraph 4:** Seeking: Senior Product Designer or Design Engineer roles where I can contribute as an IC driving measurable impact.

---

## A/B Testing Recommendation

Since you already have PostHog session recording set up, you could A/B test Option 1 vs Option 2 to see which gets more case study clicks. However, given your low traffic volume (12 visitors/30 days), it would take months to get statistical significance.

**Better approach:** Just ship Option 1 and focus on getting more applications out with the updated resume/LinkedIn positioning. The portfolio changes are secondary to fixing the application filtering problem.