# TripLion Marketing Site — Full Landing Page Design

## Goal

Replace the single-file "coming soon" teaser (`index.html`) with a full, SEO-optimized
marketing site for TripLion (an AI road trip planner), deployed to `trip-lion.com`. The
hero CTA reads "Coming Soon" today and will become the real link to the app
(`app.trip-lion.com`) after launch — built so that swap is a one-line change.

Design language: see [docs/design-philosophy.md](../../design-philosophy.md) — dark
"night rally" brand theme (warm orange glow on near-black, `logo-lion.png` watermark,
Inter typeface, glowing gradient buttons).

## Tech Stack

- **Astro** (static output, no server runtime needed). Chosen over plain HTML so blog
  posts can be authored as Markdown via an Astro content collection, and shared
  layout/header/footer avoid duplicating markup across ~10 pages.
- Deployed the same way as today: static build output pushed to GitHub Pages, custom
  domain via `CNAME` (`trip-lion.com`).
- No client-side framework (React/Vue) needed — pages are static; the only interactive
  bits (email form submit, smooth-scroll CTA) are vanilla `<script>` blocks, matching the
  existing teaser page's approach.
- Forms: **Formspree** (already in use, endpoint `https://formspree.io/f/mkoalrzq`),
  reused for both the email-capture form and the contact page form, distinguished by a
  hidden `form-name` field so submissions are identifiable in the Formspree dashboard.
- Analytics: **Google Analytics 4** via a single gtag snippet in the shared layout,
  behind an easily-removable placeholder measurement ID (`G-XXXXXXXXXX`) that you'll
  swap for your real one.

## Site Structure (multi-page, not single-scroll)

Chosen for SEO: each page targets distinct search intent and is independently
indexable — a single long homepage can only realistically rank for one or two queries,
while dedicated URLs (especially blog posts) each become their own ranking surface.

```
/                Home
/features        Feature deep-dive
/blog            Blog index
/blog/[slug]     Individual posts (5 seed posts at launch)
/privacy         Privacy Policy
/terms           Terms of Service
/contact         Contact form
```

Shared `Layout.astro` provides: `<head>` SEO/meta boilerplate, sticky header (logo +
nav: Features / Blog / Contact / "Open App" placeholder), footer (nav links + legal
links + copyright), and the dark background/watermark treatment on every page.

## Page-by-Page Content

### Home (`/`)

1. **Header/nav** — logo mark, links to Features / Blog / Contact, and an "Open App"
   nav button (styled like a secondary button) pointing at `app.trip-lion.com` —
   present from day one so Google can start associating the two domains, even though
   the app isn't public yet (it can 404 or show its own coming-soon state; not this
   project's concern).
2. **Hero** — existing wordmark, tagline, pitch copy, kept largely as-is. Adds a new
   large primary CTA button below the pitch: label **"Coming Soon"**, styled as the
   prominent gradient button from the design system, clicking it smooth-scrolls to the
   email capture section (`#notify`). After launch, this becomes a real link.
3. **Email capture** (`#notify`) — the existing signup form, kept largely as-is
   (Formspree), positioned right under the hero CTA's scroll target.
4. **Features overview** — 6 cards summarizing real capabilities pulled from the actual
   app (not invented): AI Travel Chat, Explore & Discovery (AI-powered search by
   category), Interactive Map (Street View, transit info), Save Places to Collections,
   Share Trips & Lists, Export/Print Itinerary (PDF). Each card links to the relevant
   anchor on `/features`.
5. **How it works** — 3-step strip: Plan → Discover → Go (or similar), giving a quick
   mental model before asking for the email.
6. **Blog preview** — latest 3 post cards, "Read the blog" link to `/blog`.
7. **Final CTA** — repeat of the email capture, right before the footer (standard
   high-conversion pattern: capture people who scrolled the whole page without
   converting at the top).
8. **Footer** — logo, nav links, legal links (Privacy/Terms), contact link, copyright.

No fabricated testimonials or fake user counts — the app hasn't launched. Pre-launch
social proof (if desired later) should be real (e.g., "X people already signed up") or
omitted.

### Features (`/features`)

One section per feature, each with a short heading, 2-3 sentences of real detail (from
the feature research), and an icon (lucide icon set, matching in-app iconography per
the design-philosophy doc). No fabricated screenshots — icon + copy only, since no real
app screenshots exist yet. Ends with a CTA back to the email capture.

### Blog (`/blog`, `/blog/[slug]`)

Astro content collection (`src/content/blog/*.md`), rendered through a shared
`BlogPost.astro` layout with `Article` JSON-LD, a byline, publish date, and reading
time. 5 seed posts at launch:

1. **How to Plan a Road Trip Itinerary in Under 30 Minutes** — targets "road trip
   itinerary planner" / "how to plan a road trip."
2. **The Ultimate Road Trip Packing & Prep Checklist** — targets "road trip checklist" /
   "road trip packing list"; list-format for AI-answer-engine extraction.
3. **How to Find Hidden Gems Along Your Road Trip Route** — targets "hidden gems road
   trip" / "off the beaten path road trip stops"; ties to the Explore/Discovery feature.
4. **Road Trip Budget Planner: How Much Does a Road Trip Really Cost?** — targets "road
   trip budget" / "road trip cost calculator."
5. **Best Road Trip Apps Compared (2026)** — targets "best road trip apps"; honest
   comparison piece that naturally positions TripLion's differentiators.

Each post is genuinely useful long-form content (not keyword-stuffed), with one natural
mention of TripLion partway through linking back to `/` or `/features`.

### Privacy Policy (`/privacy`) & Terms of Service (`/terms`)

Generic solo-developer/small-project templates (not a substitute for real legal
review), covering:

- What's collected: email (signup + contact forms via Formspree), standard analytics
  data (GA4: pages viewed, approximate location, device type), and — once the app
  ships — trip/location data the user explicitly enters.
- Third parties used: Formspree (form processing), Google Analytics (usage
  analytics), Google Maps Platform (maps/places, once the app is live).
- No data selling; cookies disclosure for GA4.
- "TripLion" referred to as a project/product, not a named legal company (no entity
  assumed) — contact via email for data requests.
- Standard ToS boilerplate: acceptable use, no warranty, liability limitation, changes
  to terms notice, governing content ownership of user-generated trip data.

### Contact (`/contact`)

Simple Formspree-backed form (name, email, message) plus a displayed contact email:
**`hello@trip-lion.com`** (placeholder — flagged for you to confirm this inbox exists
or swap for a different address before launch).

## SEO & AI-Search Plan

Full technical kit, applied site-wide via the shared layout and Astro integrations:

- **`@astrojs/sitemap`** integration — auto-generates `sitemap.xml` covering every page
  and blog post.
- **`robots.txt`** — allow all, points to the sitemap.
- **Structured data (JSON-LD)**:
  - `Organization` + `WebSite` schema on the homepage (with `sameAs` referencing
    `app.trip-lion.com` and social profiles if/when they exist).
  - `SoftwareApplication` schema describing TripLion itself.
  - `Article` schema on every blog post (headline, datePublished, author).
  - `BreadcrumbList` on `/features` and blog posts.
- **Open Graph + Twitter Card** meta tags on every page (title/description/image),
  reusing the existing OG pattern from the current teaser page.
- **Canonical URLs** on every page to avoid duplicate-content issues.
- **`llms.txt`** at the site root — a plain-language summary of what TripLion is and a
  site map of key pages, formatted for AI crawlers (ChatGPT/Perplexity/Claude-style
  answer engines) to parse easily. This is an emerging, low-cost convention worth
  adopting early.
- **Google Search Console** verification — a placeholder meta tag/verification file
  slot; you'll need to add your own verification code post-deploy.
- Per the earlier sitelinks discussion: prominent "Open App" nav/footer links to
  `app.trip-lion.com` on every page, to build the internal-linking signal Google uses
  for sitelinks over time (not something achievable at launch, but set up correctly
  from day one).

## What's explicitly out of scope

- Building or modifying the actual TripZone app — this project only touches the
  marketing site (`TripLion` repo).
- Real user testimonials/social proof (none exist pre-launch).
- A CMS or admin UI for blog posts — posts are Markdown files edited directly in the
  repo.
- Legal review of the Privacy Policy/ToS text — templates only, flagged as such.
