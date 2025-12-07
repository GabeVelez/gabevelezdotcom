# Calendly Integration Setup Guide

## Why Add Calendly to Your Portfolio

**Problem:** Recruiters interested in talking to you have to email you, wait for response, then coordinate schedules back-and-forth (3-5 day delay).

**Solution:** Calendly link lets them book time with you immediately while they're engaged with your portfolio (reduces friction by 80%).

**Where to add it:**
1. Portfolio hero section (primary CTA)
2. LinkedIn profile summary
3. Email signature
4. Resume (optional - some recruiters prefer it)

---

## Step 1: Create Free Calendly Account

1. Go to https://calendly.com/signup
2. Sign up with **gabe.velez@gmail.com** (use same email as resume/LinkedIn for consistency)
3. Choose **Free plan** (sufficient for job search - no need for paid features)

---

## Step 2: Create Your First Event Type

### Recommended Event: "30-Minute Portfolio Review"

**Settings to configure:**

**Event Name:** "Portfolio Review - 30 Minutes"

**Description:**
```
Hi! Thanks for your interest in my work.

I'm currently seeking Senior Product Designer or Design Engineer roles (IC positions) starting January 2026.

In this 30-minute call, we can discuss:
• My experience managing 200K+ users across 7 event platforms
• Conversion optimization work (69% YoY growth)
• Full-stack development capabilities (React, Next.js, React Native, Firebase)
• Enterprise design systems work at Integrate (Fortune 500 clients)
• 0-1 product ownership (TokTix ticketing platform)

Looking forward to connecting!
```

**Duration:** 30 minutes

**Location:** Google Meet (Calendly will auto-generate meeting link)

**Date Range:**
- Start accepting meetings: [Today's date]
- No end date (keep open until you're employed)

**Availability:**

Set your interview availability based on your schedule. Recommended:
- **Monday-Friday:** 10:00 AM - 5:00 PM EST (exclude lunch 12-1 PM)
- **Buffer time:** 15 minutes before events (prep time)
- **Max meetings per day:** 3-4 (to avoid burnout)

**Important:** Since you're currently employed, you may want to limit availability to:
- Early mornings (8-9 AM before work)
- Lunch breaks (12-1 PM)
- Late afternoons (5-6 PM after work)
- This signals you're currently employed (positive signal) without causing work conflicts

---

## Step 3: Configure Calendar Settings

**Your Calendar Connection:**
1. Connect your **Google Calendar** (gabe.velez@gmail.com)
2. This ensures Calendly checks for conflicts with your existing meetings

**Confirmation Email:**
- Enable "Send calendar invitation" ✓
- Enable "Send email confirmation" ✓

**Reminders:**
- 24 hours before (email + SMS if phone number provided)
- 1 hour before (email)

**Time Zone Display:**
- Set to "Eastern Time (US/Canada)"
- Allow invitees to see times in their own timezone ✓

---

## Step 4: Customize Your Calendly Profile

**Profile Settings (calendly.com/settings/my-link):**

**Name:** Gabe Velez

**Welcome Message:**
```
👋 Hi! I'm Gabe, a Senior Product Designer who ships code.

I'm currently managing 7 event platforms serving 200K+ annual users and seeking my next role starting January 2026.

Book time below to discuss how my experience might fit your team's needs.
```

**Custom URL:** `calendly.com/gabevelez` (if available)
- If taken, try: `calendly.com/gabe-velez` or `calendly.com/gabevelez-portfolio`

**Profile Photo:** Use same professional headshot from your portfolio/LinkedIn

**Language:** English

---

## Step 5: Add Calendly to Portfolio Homepage

### Option A: Text Link in Hero Section (Recommended)

Update your hero section (index.html line ~164-166) to include:

```html
<span class="hero__break"><strong>Available:</strong> January 2026 | <a class="company__link" href="https://calendly.com/gabevelez/portfolio-review-30-minutes" rel="nofollow" target="_blank">Let's talk</a></span>
```

**Result:** "Available: January 2026 | Let's talk"

### Option B: Prominent CTA Button (More Aggressive)

Add below the hero section text:

```html
<div style="margin-top: 2rem;">
    <a href="https://calendly.com/gabevelez/portfolio-review-30-minutes"
       target="_blank"
       rel="nofollow"
       style="display: inline-block;
              background: #fff;
              color: #000;
              padding: 1rem 2rem;
              text-decoration: none;
              font-weight: 600;
              border-radius: 4px;
              transition: transform 0.2s;">
        Schedule a Call
    </a>
</div>
```

**Pros:** More visible, clear call-to-action
**Cons:** May feel too aggressive for portfolio site (better for landing pages)

**Recommendation:** Start with Option A (subtle text link). If you're getting profile views but no outreach, upgrade to Option B.

---

## Step 6: Add Calendly to LinkedIn Profile

### LinkedIn Summary Section

Add to the end of your updated summary (from strategy document):

```
📅 Open to discussions about Senior IC opportunities starting January 2026.
Schedule time: calendly.com/gabevelez
```

### LinkedIn Featured Section (Optional)

1. Go to your LinkedIn profile
2. Click "Add profile section" → "Featured"
3. Add link: `https://calendly.com/gabevelez/portfolio-review-30-minutes`
4. Title: "Schedule a Call"
5. Description: "Let's discuss how my experience managing 200K+ users and driving 69% YoY conversion growth could benefit your team."

---

## Step 7: Add Calendly to Email Signature

Update your email signature (Gmail settings):

```
Gabe Velez
Senior Product Designer & Engineer
📧 gabe.velez@gmail.com
📱 347.661.3842
🌐 gabevelez.com
💼 linkedin.com/in/gabevelez
📅 calendly.com/gabevelez
```

Or simpler version:

```
Gabe Velez
gabe.velez@gmail.com | 347.661.3842
Portfolio: gabevelez.com | Schedule: calendly.com/gabevelez
```

---

## Step 8: Update Resume (Optional)

**Conservative approach (recommended for most applications):**
Add to contact info section:

```
Gabriel Velez
Product Design + Product Development
gabevelez.com • gabe.velez@gmail.com • linkedin.com/in/gabevelez • 347.661.3842
```

**Aggressive approach (for startup/fast-moving companies):**
Add calendar link to contact info:

```
Gabriel Velez
Product Design + Product Development
gabevelez.com • gabe.velez@gmail.com • calendly.com/gabevelez • 347.661.3842
```

**Recommendation:** Don't add to resume unless applying to very casual/fast-moving startups. Most corporate recruiters prefer traditional contact methods on resumes.

---

## Calendly Best Practices for Job Search

### DO:

✅ **Keep availability realistic** - Don't offer 8 AM - 8 PM slots (looks desperate)
✅ **Use 30-minute default** - Long enough for substantive conversation, short enough to not be intimidating
✅ **Enable timezone detection** - Shows you're considerate of remote candidates
✅ **Send confirmation emails** - Reduces no-shows by 50%+
✅ **Add to Google Calendar** - Prevents double-booking
✅ **Include your portfolio link** in confirmation email (reminds them of your work)

### DON'T:

❌ **Don't offer 15-minute calls** - Too rushed for meaningful conversation
❌ **Don't offer 60+ minute calls** - Intimidating, suggests you're too eager
❌ **Don't use branded/custom colors** - Keep it professional (default Calendly blue)
❌ **Don't require too much info upfront** - Name, email, and company is enough
❌ **Don't block out weird times** - Offering only 2-3 PM on Tuesdays looks suspicious
❌ **Don't add payment gates** - This is job search, not consulting

---

## Calendly Analytics to Track

Calendly Free plan gives you basic analytics:

**Monitor:**
1. **Link clicks** - How many people clicked your Calendly link
2. **Scheduled meetings** - How many actually booked
3. **No-show rate** - If >20%, add more reminder emails
4. **Peak booking times** - Adjust availability based on when recruiters prefer

**Success metrics:**
- If getting link clicks but no bookings → Your availability is too limited
- If getting bookings → Success! You've reduced friction
- If getting no clicks → Your positioning/portfolio needs work (not Calendly's fault)

---

## Calendly Confirmation Email Customization

Calendly lets you customize the confirmation email. **Recommended custom message:**

**Subject:** "Confirmed: 30-Min Call with Gabe Velez"

**Body:**
```
Hi [Invitee Name],

Thanks for booking time to discuss my work! I'm looking forward to our conversation on [Date] at [Time].

In preparation:
• Portfolio: gabevelez.com
• LinkedIn: linkedin.com/in/gabevelez
• Recent work: TokTix ticketing platform (side-projects/toktix-ticketing-platform.html)

Feel free to review my case studies beforehand, and come with any questions about:
- Scaling platforms to 200K+ users
- Conversion optimization (69% YoY growth)
- Full-stack development (React, Next.js, React Native, Firebase)
- Enterprise design systems (Integrate/ListenLoop experience)

If you need to reschedule, you can do so using the link below.

See you soon!
Gabe

---
Google Meet link: [Auto-generated by Calendly]
Reschedule: [Auto-generated by Calendly]
Cancel: [Auto-generated by Calendly]
```

---

## Troubleshooting

**Problem:** "I'm getting Calendly clicks but no bookings"

**Solutions:**
- Expand your availability (offer more time slots)
- Reduce meeting duration (try 20 minutes instead of 30)
- Simplify description (too much text intimidates people)
- Check timezone settings (maybe showing wrong timezone)

**Problem:** "I'm not getting any Calendly link clicks"

**Solutions:**
- This is a positioning problem, not a Calendly problem
- Focus on resume/LinkedIn updates first
- Calendly only helps AFTER you've gotten their attention

**Problem:** "People are booking but not showing up"

**Solutions:**
- Add more reminder emails (24hr + 1hr before)
- Enable SMS reminders (if available)
- Send personal confirmation email after they book
- In confirmation, reiterate what you'll discuss (sets expectations)

**Problem:** "I'm booked solid with unqualified calls"

**Solutions:**
- Add screening question: "What role are you hiring for?" (required)
- Add company name field (required)
- Limit max meetings per week to 5-7
- Increase buffer time between meetings

---

## Timeline

**Week 1:**
- [ ] Create Calendly account
- [ ] Configure "Portfolio Review - 30 Minutes" event
- [ ] Connect Google Calendar
- [ ] Set realistic availability

**Week 2:**
- [ ] Add Calendly link to portfolio hero section
- [ ] Add to LinkedIn summary
- [ ] Add to email signature
- [ ] Test booking flow yourself (use friend's email)

**Week 3:**
- [ ] Monitor analytics (clicks, bookings, no-shows)
- [ ] Adjust availability if needed
- [ ] Refine description based on questions you're getting

**Month 2-3:**
- [ ] Track conversion: Portfolio views → Calendly clicks → Bookings → Offers
- [ ] Adjust based on data

---

## Success Benchmarks

**Good outcome:**
- 5-10% of portfolio visitors click Calendly link
- 30-50% of link clicks result in bookings
- <10% no-show rate
- 1-2 recruiter calls per week (10-15% of applications → phone screen)

**Excellent outcome:**
- 10%+ portfolio visitors click Calendly
- 50%+ conversion to bookings
- Recruiters mention "loved how easy it was to schedule"
- 15-20% application → phone screen rate

**If not working:**
- <1% click rate → Positioning problem (focus on resume/LinkedIn)
- High clicks, low bookings → Availability problem (expand time slots)
- High no-shows → Reminder problem (add more notifications)

---

## Alternative: If You Don't Want Calendly

**Reason you might skip it:**
- Don't want to appear too "salesy"
- Prefer traditional email coordination (shows you're not desperate)
- Already getting plenty of recruiter outreach

**In that case:**
Just add this to hero section instead:

```html
<span class="hero__break"><strong>Available:</strong> January 2026 | gabe.velez@gmail.com</span>
```

**Calendly is helpful but not required.** The resume/LinkedIn positioning changes will have 10x more impact than adding Calendly.