# TripLion Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-file "coming soon" teaser (`index.html`) with a full, multi-page, SEO-optimized Astro marketing site for TripLion, deployed to `trip-lion.com` via GitHub Pages.

**Architecture:** Astro static site (no server runtime, no client framework). Shared `Layout.astro` (head/SEO/header/footer) wraps every page. Blog posts are Markdown files in an Astro content collection. Forms post to the existing Formspree endpoint (no backend). This is a content site with no business logic to unit-test, so "tests" in this plan are **build + grep smoke checks**: run `npm run build`, then grep the generated HTML in `dist/` for the exact strings/attributes a task is supposed to produce. This matches the project's existing zero-tooling philosophy (no test framework needed for static markup) while still giving every task a real, falsifiable pass/fail check.

**Tech Stack:** Astro (static output), `@astrojs/sitemap`, vanilla CSS (no Tailwind — matches the hand-written CSS approach of the current teaser page), Formspree (forms), Google Analytics 4 (gtag), GitHub Actions + GitHub Pages (deploy).

## Global Constraints

- Domain: `trip-lion.com` (marketing site, this repo). App lives at `app.trip-lion.com` (separate project, out of scope).
- Formspree endpoint: `https://formspree.io/f/mkoalrzq` (reuse for both signup and contact forms, distinguished by a hidden `form-name` field).
- Contact email shown on site: `hello@trip-lion.com` (placeholder — flagged to the user as needing a real inbox before launch).
- GA4 measurement ID is a placeholder: `G-XXXXXXXXXX` — user swaps in their real ID.
- Google Search Console verification is a placeholder meta tag (`google-site-verification` content `REPLACE_WITH_SEARCH_CONSOLE_CODE`) — user swaps in their real verification code.
- Font: Inter, fallback `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Color tokens (from `docs/design-philosophy.md`): `--dark:#160d0a; --glow:#ff8a3d; --cream:#ffe0bd; --muted:rgba(255,224,189,.76); --line:rgba(255,192,130,.28); --tagline:#ffb275; --accent-dot:#ff9149;`.
- No fabricated testimonials, user counts, or screenshots anywhere on the site — the app hasn't launched.
- The 5 launch blog posts must be exactly: "How to Plan a Road Trip Itinerary in Under 30 Minutes", "The Ultimate Road Trip Packing & Prep Checklist", "How to Find Hidden Gems Along Your Road Trip Route", "Road Trip Budget Planner: How Much Does a Road Trip Really Cost?", "Best Road Trip Apps Compared (2026)".
- Privacy Policy / Terms of Service are generic templates, not a substitute for legal review — this must be noted, not hidden.
- Commands in this plan use bash syntax (Git Bash), consistent with the project's existing shell tooling.

---

## File Structure

```
TripLion/
  astro.config.mjs
  package.json
  tsconfig.json
  .gitignore
  public/
    assets/
      logo-lion.png
      raymap-bg.png
    CNAME
    robots.txt
    llms.txt
  src/
    layouts/
      Layout.astro
      BlogPost.astro
    components/
      Header.astro
      Footer.astro
    content/
      config.ts
      blog/
        plan-road-trip-itinerary-30-minutes.md
        road-trip-packing-checklist.md
        hidden-gems-road-trip-route.md
        road-trip-budget-planner.md
        best-road-trip-apps-compared-2026.md
    pages/
      index.astro
      features.astro
      contact.astro
      privacy.astro
      terms.astro
      blog/
        index.astro
        [slug].astro
    styles/
      global.css
  docs/                (unchanged — planning docs, not part of the build)
  .github/
    workflows/
      deploy.yml
```

---

### Task 1: Scaffold the Astro project and move existing assets

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- Create: `src/styles/global.css`
- Create: `public/assets/logo-lion.png` (moved from `assets/logo-lion.png`)
- Create: `public/assets/raymap-bg.png` (moved from `assets/raymap-bg.png`)
- Create: `public/CNAME` (moved from `CNAME`)
- Delete: `index.html`, `assets/` (old root files, superseded)
- Test: build output check (bash)

**Interfaces:**
- Produces: `src/styles/global.css` exposes CSS custom properties `--dark`, `--glow`, `--cream`, `--muted`, `--line`, `--tagline`, `--accent-dot` (used by every later page/component), plus reusable classes `.container`, `.section`, `.section-title`, `.card-grid`, `.feature-card`, `.blog-grid`, `.blog-card`, `.cta-button`, `.prose`.

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "triplion-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.15.0",
    "@astrojs/sitemap": "^3.1.6"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: exits 0, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 3: Create astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://trip-lion.com',
  integrations: [sitemap()],
});
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 5: Create .gitignore**

```
node_modules/
dist/
.astro/
.env
```

- [ ] **Step 6: Move assets and CNAME into public/**

```bash
mkdir -p public/assets
git mv assets/logo-lion.png public/assets/logo-lion.png
git mv assets/raymap-bg.png public/assets/raymap-bg.png
git mv CNAME public/CNAME
rmdir assets 2>/dev/null || true
```

- [ ] **Step 7: Remove the old teaser index.html**

```bash
git rm index.html
```

- [ ] **Step 8: Create src/styles/global.css**

```css
:root {
  --dark: #160d0a;
  --glow: #ff8a3d;
  --cream: #ffe0bd;
  --muted: rgba(255, 224, 189, .76);
  --line: rgba(255, 192, 130, .28);
  --tagline: #ffb275;
  --accent-dot: #ff9149;
}

* { box-sizing: border-box; }

html, body {
  width: 100%;
  min-height: 100%;
  margin: 0;
  background: var(--dark);
  color: var(--cream);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  overflow-x: hidden;
  position: relative;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(90deg, rgba(13, 8, 7, .88) 0%, rgba(28, 13, 8, .68) 42%, rgba(91, 38, 10, .18) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, .12), rgba(0, 0, 0, .44)),
    url("/assets/raymap-bg.png") center / cover no-repeat;
}

body::after {
  content: "";
  position: fixed;
  right: clamp(-110px, -5vw, 0px);
  bottom: clamp(-120px, -7vw, -24px);
  z-index: -1;
  width: min(46vw, 560px);
  aspect-ratio: 1;
  background: url("/assets/logo-lion.png") center / contain no-repeat;
  opacity: .12;
  filter: drop-shadow(0 0 44px rgba(255, 112, 50, .25));
  pointer-events: none;
}

a { color: inherit; text-decoration: none; }

.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.container {
  width: min(1100px, 92vw);
  margin: 0 auto;
}

.section {
  padding: clamp(48px, 7vw, 96px) 0;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 900;
  color: var(--glow);
  text-align: center;
  margin: 0 0 clamp(28px, 4vw, 48px);
}

/* Site header */
.site-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px clamp(20px, 5vw, 64px);
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  letter-spacing: .04rem;
  color: var(--glow);
  font-size: 1.15rem;
}

.brand-mark img { display: block; border-radius: 8px; }
.brand-mark.small { font-size: 1rem; }

.site-nav {
  display: flex;
  gap: clamp(16px, 2vw, 32px);
  font-weight: 600;
}

.site-nav a:hover { color: var(--glow); }

.open-app-button {
  border: 1px solid rgba(255, 203, 139, .42);
  border-radius: 999px;
  padding: 10px 20px;
  font-weight: 700;
  background: rgba(20, 11, 10, .58);
  transition: border-color .2s ease, background .2s ease;
}

.open-app-button:hover {
  border-color: rgba(255, 143, 70, .82);
  background: rgba(22, 11, 9, .78);
}

/* Hero (reused from original teaser) */
.hero {
  text-align: center;
  padding: clamp(28px, 6vw, 72px) 0 clamp(20px, 4vw, 40px);
  animation: reveal 900ms ease-out both;
}

.mark {
  display: inline-grid;
  place-items: center;
  width: 72px; height: 72px;
  margin-bottom: clamp(18px, 2.8vw, 34px);
  border: 1px solid rgba(255, 203, 139, .42);
  border-radius: 18px;
  background: rgba(20, 11, 10, .58);
  box-shadow: 0 18px 48px rgba(0, 0, 0, .22), inset 0 1px 0 rgba(255, 255, 255, .08);
  backdrop-filter: blur(10px);
}

.mark img { width: 54px; height: 54px; display: block; }

.brand {
  margin: 0;
  color: var(--glow);
  font-size: clamp(3.4rem, 7vw, 6.4rem);
  line-height: .86;
  font-weight: 900;
  letter-spacing: clamp(.08rem, .9vw, .72rem);
  text-shadow: 0 0 28px rgba(255, 104, 41, .2), 0 12px 42px rgba(0, 0, 0, .34);
}

.tagline {
  margin: clamp(20px, 2.6vw, 30px) 0 0;
  color: var(--tagline);
  font-size: clamp(.95rem, 1.45vw, 1.36rem);
  font-weight: 900;
  letter-spacing: clamp(.28rem, 1vw, .76rem);
  text-transform: uppercase;
}

.pitch {
  width: min(560px, 100%);
  margin: clamp(22px, 2.7vw, 34px) auto 0;
  color: rgba(255, 236, 215, .86);
  font-size: clamp(1.02rem, 1.42vw, 1.3rem);
  line-height: 1.55;
  text-wrap: balance;
}

.cta-button {
  display: inline-block;
  margin-top: clamp(28px, 3.4vw, 40px);
  padding: 20px 44px;
  border-radius: 15px;
  font-weight: 950;
  letter-spacing: .08rem;
  text-transform: uppercase;
  color: white;
  background: linear-gradient(135deg, #ff9d4f, #ff7032 45%, #ff8b3d);
  box-shadow: 0 18px 48px rgba(255, 102, 35, .28), inset 0 1px 0 rgba(255, 255, 255, .18);
  transition: transform .2s ease, filter .2s ease, box-shadow .2s ease;
}

.cta-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

/* Signup / contact form */
.signup-section { text-align: center; }

.divider {
  width: min(650px, 100%);
  height: 1px;
  margin: clamp(32px, 4.2vw, 52px) auto 0;
  background: linear-gradient(90deg, transparent, var(--line) 18%, rgba(255, 181, 104, .54) 50%, var(--line) 82%, transparent);
  position: relative;
}

.divider::after {
  content: "";
  position: absolute;
  left: 50%; top: 50%;
  width: 9px; height: 9px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  background: var(--accent-dot);
  box-shadow: 0 0 0 5px rgba(255, 145, 73, .12), 0 0 22px 7px rgba(255, 145, 73, .5);
}

.soon {
  margin: clamp(20px, 2.6vw, 30px) 0 0;
  color: var(--tagline);
  font-size: clamp(1rem, 1.55vw, 1.35rem);
  font-weight: 950;
  letter-spacing: clamp(.36rem, 1.14vw, .86rem);
  text-transform: uppercase;
}

.subcopy {
  margin: clamp(24px, 3vw, 34px) 0 16px;
  color: rgba(255, 236, 215, .84);
  font-size: clamp(1rem, 1.32vw, 1.2rem);
}

.signup { width: min(620px, 100%); margin: 0 auto; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 10px;
  width: 100%;
}

.email-input, .text-input, .textarea-input {
  width: 100%;
  min-height: 60px;
  border: 1px solid rgba(255, 226, 196, .42);
  border-radius: 15px;
  outline: none;
  background: rgba(20, 11, 10, .64);
  color: #fff3e4;
  padding: 0 24px;
  font: inherit;
  font-size: 1.02rem;
}

.textarea-input { min-height: 140px; padding: 16px 24px; resize: vertical; }

.email-input::placeholder, .text-input::placeholder, .textarea-input::placeholder {
  color: rgba(255, 235, 214, .56);
}

.email-input:focus, .text-input:focus, .textarea-input:focus {
  border-color: rgba(255, 143, 70, .82);
  box-shadow: 0 0 0 4px rgba(255, 143, 70, .12);
}

.notify-button {
  min-height: 60px;
  border: 0;
  border-radius: 15px;
  cursor: pointer;
  color: white;
  font: inherit;
  font-weight: 950;
  letter-spacing: .08rem;
  text-transform: uppercase;
  background: linear-gradient(135deg, #ff9d4f, #ff7032 45%, #ff8b3d);
  box-shadow: 0 18px 48px rgba(255, 102, 35, .28), inset 0 1px 0 rgba(255, 255, 255, .18);
}

.notify-button:disabled { opacity: .72; cursor: progress; }

.privacy-note, .status {
  margin: 13px 0 0;
  color: rgba(255, 224, 189, .68);
  font-size: .9rem;
}

.status { min-height: 1.3em; opacity: 0; transition: opacity .2s ease; }
.status.is-visible { opacity: 1; }

/* Card grids (features, blog) */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.feature-card, .blog-card {
  display: block;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(20, 11, 10, .5);
  backdrop-filter: blur(10px);
  transition: border-color .2s ease, transform .2s ease;
}

.feature-card:hover, .blog-card:hover {
  border-color: rgba(255, 143, 70, .6);
  transform: translateY(-2px);
}

.feature-icon { font-size: 2rem; display: block; margin-bottom: 12px; }

.feature-card h3, .blog-card h3, .blog-card h2 {
  margin: 0 0 10px;
  color: var(--glow);
}

.feature-card p, .blog-card p { margin: 0; color: var(--muted); line-height: 1.5; }

.blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 24px; }

.link-more { display: inline-block; font-weight: 700; color: var(--glow); }

/* How it works */
.steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; text-align: center; }

.step-number {
  display: inline-grid;
  place-items: center;
  width: 44px; height: 44px;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff9d4f, #ff7032);
  color: white;
  font-weight: 900;
  margin-bottom: 12px;
}

.final-cta { text-align: center; }

/* Footer */
.site-footer {
  position: relative;
  z-index: 1;
  padding: clamp(40px, 5vw, 64px) clamp(20px, 5vw, 64px) 32px;
  border-top: 1px solid var(--line);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto 32px;
}

.footer-grid h3 { color: var(--glow); font-size: .95rem; margin: 0 0 12px; }
.footer-grid a { display: block; margin-bottom: 8px; color: var(--muted); }
.footer-grid a:hover { color: var(--glow); }
.footer-tagline { color: var(--muted); font-size: .9rem; margin-top: 8px; }

.footer-legal {
  text-align: center;
  color: var(--muted);
  font-size: .85rem;
  max-width: 1100px;
  margin: 0 auto;
}

/* Legal / prose pages */
.prose { max-width: 760px; margin: 0 auto; line-height: 1.7; color: var(--cream); }
.prose h1 { color: var(--glow); }
.prose h2 { color: var(--tagline); margin-top: 2em; }
.prose p, .prose li { color: rgba(255, 236, 215, .9); }

@keyframes reveal {
  from { opacity: 0; transform: translateY(3vh); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 760px) {
  .site-header { flex-wrap: wrap; }
  .form-row { grid-template-columns: 1fr; }
}
```

- [ ] **Step 9: Verify build succeeds with no pages yet**

Since no pages exist, Astro requires at least an `index.astro`. Skip build verification until Task 4 (homepage exists). Instead verify install/config only:

Run: `npx astro check --minimumSeverity error || true`
Expected: no fatal config errors (content-collection/page errors are fine — no pages exist yet).

- [ ] **Step 10: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json .gitignore src/styles/global.css public/assets public/CNAME
git rm index.html
git add -A
git commit -m "Scaffold Astro project, migrate assets and CNAME"
```

---

### Task 2: Header and Footer components

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Test: none yet (no page renders them until Task 3) — verified as part of Task 3's build check.

**Interfaces:**
- Produces: `Header` renders nav links `/features`, `/blog`, `/contact`, and an "Open App" link to `https://app.trip-lion.com`. `Footer` renders links to `/features`, `/blog`, `https://app.trip-lion.com`, `/contact`, `/privacy`, `/terms`, and the text `hello@trip-lion.com`.

- [ ] **Step 1: Create Header.astro**

```astro
---
---
<header class="site-header">
  <a href="/" class="brand-mark" aria-label="TripLion home">
    <img src="/assets/logo-lion.png" alt="" width="36" height="36" />
    <span>TripLion</span>
  </a>
  <nav class="site-nav" aria-label="Primary">
    <a href="/features">Features</a>
    <a href="/blog">Blog</a>
    <a href="/contact">Contact</a>
  </nav>
  <a class="open-app-button" href="https://app.trip-lion.com">Open App</a>
</header>
```

- [ ] **Step 2: Create Footer.astro**

```astro
---
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <a href="/" class="brand-mark small">
        <img src="/assets/logo-lion.png" alt="" width="28" height="28" />
        <span>TripLion</span>
      </a>
      <p class="footer-tagline">Road Trip. Reimagined.</p>
    </div>
    <div>
      <h3>Product</h3>
      <a href="/features">Features</a>
      <a href="/blog">Blog</a>
      <a href="https://app.trip-lion.com">Open App</a>
    </div>
    <div>
      <h3>Company</h3>
      <a href="/contact">Contact</a>
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
    </div>
  </div>
  <p class="footer-legal">© {year} TripLion. All rights reserved. · hello@trip-lion.com</p>
</footer>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "Add site Header and Footer components"
```

---

### Task 3: Shared Layout with SEO meta tags and JSON-LD

**Files:**
- Create: `src/layouts/Layout.astro`
- Test: exercised by Task 4's homepage build+grep check.

**Interfaces:**
- Consumes: `Header.astro`, `Footer.astro` (Task 2), `../styles/global.css` (Task 1).
- Produces: `Layout` accepts props `{ title: string; description: string; path?: string; ogImage?: string }` and renders `<title>`, meta description, canonical link, OG/Twitter tags, three JSON-LD blocks (`Organization`, `WebSite`, `SoftwareApplication`), and wraps `<slot />` with `Header`/`Footer`. Later pages use `<Layout title=... description=... path=...>`.

- [ ] **Step 1: Create Layout.astro**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

export interface Props {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
}

const { title, description, path = '/', ogImage = '/assets/logo-lion.png' } = Astro.props;
const canonical = new URL(path, Astro.site).toString();
const ogImageUrl = new URL(ogImage, Astro.site).toString();

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TripLion',
  url: 'https://trip-lion.com',
  logo: 'https://trip-lion.com/assets/logo-lion.png',
  sameAs: ['https://app.trip-lion.com'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TripLion',
  url: 'https://trip-lion.com',
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TripLion',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Web',
  url: 'https://trip-lion.com',
  description: 'AI-powered road trip planner that helps you plan routes, discover places, and share itineraries.',
};
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta name="theme-color" content="#160d0a" />
  <!-- Replace the content value below with your real Google Search Console verification code -->
  <meta name="google-site-verification" content="REPLACE_WITH_SEARCH_CONSOLE_CODE" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={ogImageUrl} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImageUrl} />
  <link rel="icon" href="/assets/logo-lion.png" />
  <script type="application/ld+json" set:html={JSON.stringify(organizationSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(websiteSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(softwareSchema)} />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
<body>
  <Header />
  <slot />
  <Footer />
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "Add shared Layout with SEO meta tags and JSON-LD schema"
```

---

### Task 4: Homepage

**Files:**
- Create: `src/pages/index.astro`
- Test: build + grep (bash)

**Interfaces:**
- Consumes: `Layout` (Task 3). Reads latest posts via `getCollection('blog')` (collection defined in Task 6 — homepage's blog-preview section will render an empty list until Task 6/7 land; this is fine since Astro's `getCollection` returns `[]` for an empty/undefined collection only after `content/config.ts` exists. **Order note:** run Task 6 (content collection config) before this task's build check if you want the blog preview populated; otherwise build the homepage now with the collection query left in place — it will simply render zero blog cards until posts exist, which is expected and not an error.)
- Produces: route `/`, anchor `#notify` (email capture), CTA button with `href="#notify"` and text `Coming Soon`.

- [ ] **Step 1: Create src/pages/index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import { getCollection } from 'astro:content';

let posts: Awaited<ReturnType<typeof getCollection>> = [];
try {
  posts = (await getCollection('blog'))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 3);
} catch {
  posts = [];
}

const features = [
  { slug: 'ai-chat', icon: '💬', title: 'AI Travel Chat', blurb: 'Ask TripLion anything about your route. Our AI assistant suggests destinations, answers questions, and helps you plan on the fly.' },
  { slug: 'explore-discover', icon: '🧭', title: 'Explore & Discover', blurb: 'Search restaurants, hotels, attractions, and hidden gems along your route, with AI-powered recommendations for every kind of traveler.' },
  { slug: 'interactive-map', icon: '🗺️', title: 'Interactive Map', blurb: 'See your full route on an interactive map with Street View, transit info, photos, and reviews for every stop.' },
  { slug: 'save-organize', icon: '🔖', title: 'Save & Organize', blurb: 'Bookmark places into custom lists right from your search results — must-see attractions, favorite restaurants, anything.' },
  { slug: 'share-trips', icon: '🔗', title: 'Share Trips & Lists', blurb: 'Generate a shareable link for any trip or list, so friends and family can see the plan.' },
  { slug: 'export-print', icon: '📄', title: 'Export & Print', blurb: 'Download a clean PDF, or print a detailed itinerary with maps, routes, and timelines.' },
];
---
<Layout
  title="TripLion | Road Trip. Reimagined."
  description="TripLion is an intelligent AI road trip planner. Discover places, plan the perfect route, and turn every mile into a clear itinerary."
  path="/"
>
  <main class="page">
    <section class="hero container">
      <span class="mark" aria-hidden="true"><img src="/assets/logo-lion.png" alt="" /></span>
      <h1 class="brand">TripLion</h1>
      <p class="tagline">Road Trip. Reimagined.</p>
      <p class="pitch">
        An intelligent road trip planner that helps you discover stunning places,
        plan the perfect route, and turn every mile into a memory.
      </p>
      <a href="#notify" class="cta-button">Coming Soon</a>
    </section>

    <section id="notify" class="signup-section container">
      <div class="divider" aria-hidden="true"></div>
      <p class="soon">Coming Soon</p>
      <p class="subcopy">Be the first to plan your next adventure.</p>
      <form class="signup" action="https://formspree.io/f/mkoalrzq" method="POST" aria-label="TripLion newsletter form">
        <div class="form-row">
          <label class="sr-only" for="email">Your email</label>
          <input
            class="email-input"
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            autocomplete="email"
            required
          />
          <input type="hidden" name="form-name" value="homepage-signup" />
          <input type="hidden" name="message" value="Notify me when TripLion launches." />
          <button class="notify-button" type="submit">Notify me</button>
        </div>
        <p class="privacy-note">We respect your privacy. No spam, ever.</p>
        <p class="status" role="status" aria-live="polite"></p>
      </form>
    </section>

    <section class="section container">
      <h2 class="section-title">Everything you need for the road</h2>
      <div class="card-grid">
        {features.map((f) => (
          <a class="feature-card" href={`/features#${f.slug}`}>
            <span class="feature-icon" aria-hidden="true">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.blurb}</p>
          </a>
        ))}
      </div>
    </section>

    <section class="section container">
      <h2 class="section-title">How it works</h2>
      <div class="steps-grid">
        <div class="step">
          <span class="step-number">1</span>
          <h3>Plan</h3>
          <p>Drop in your stops and let TripLion build the route.</p>
        </div>
        <div class="step">
          <span class="step-number">2</span>
          <h3>Discover</h3>
          <p>Explore AI-picked places along the way — food, sights, hidden gems.</p>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <h3>Go</h3>
          <p>Export, share, and hit the road with your itinerary in hand.</p>
        </div>
      </div>
    </section>

    {posts.length > 0 && (
      <section class="section container">
        <h2 class="section-title">From the blog</h2>
        <div class="blog-grid">
          {posts.map((post) => (
            <a class="blog-card" href={`/blog/${post.slug}/`}>
              <h3>{post.data.title}</h3>
              <p>{post.data.description}</p>
            </a>
          ))}
        </div>
        <a href="/blog" class="link-more">Read the blog →</a>
      </section>
    )}

    <section class="section container final-cta">
      <h2 class="section-title">Don't miss the launch</h2>
      <a href="#notify" class="cta-button">Coming Soon</a>
    </section>
  </main>

  <script>
    const forms = document.querySelectorAll('form.signup');
    forms.forEach((signupForm) => {
      const statusMessage = signupForm.querySelector('.status');
      const submitButton = signupForm.querySelector('button[type="submit"]');
      signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(signupForm);
        const originalButtonText = submitButton.textContent;
        statusMessage.classList.remove('is-visible');
        statusMessage.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        try {
          const response = await fetch(signupForm.action, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' },
          });
          if (!response.ok) throw new Error('Form submission failed');
          signupForm.reset();
          statusMessage.textContent = 'Thank you - you are on the list.';
          statusMessage.classList.add('is-visible');
        } catch (error) {
          statusMessage.textContent = 'Something went wrong. Please try again.';
          statusMessage.classList.add('is-visible');
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
    });
  </script>
</Layout>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: exits 0, creates `dist/index.html`.

- [ ] **Step 3: Grep for the hero CTA and signup anchor**

Run: `grep -c 'href="#notify"' dist/index.html && grep -c 'Coming Soon' dist/index.html`
Expected: both counts ≥ 2 (hero CTA + final CTA).

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "Add homepage with hero, features overview, and signup form"
```

---

### Task 5: Blog content collection and blog routes

**Files:**
- Create: `src/content/config.ts`
- Create: `src/layouts/BlogPost.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`
- Test: build + grep (bash)

**Interfaces:**
- Produces: content collection `blog` with schema `{ title: string; description: string; pubDate: Date }`. Route `/blog` lists all posts. Route `/blog/[slug]` renders each post through `BlogPost.astro`, which emits `Article` JSON-LD.
- Consumes: `Layout` (Task 3).

- [ ] **Step 1: Create src/content/config.ts**

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create a placeholder post so routes can build (real posts land in Task 6)**

```bash
mkdir -p src/content/blog
```

```markdown
---
title: "Placeholder Post"
description: "Placeholder — replaced in Task 6."
pubDate: 2026-01-01
---

Placeholder content.
```

Save as `src/content/blog/_placeholder.md`.

- [ ] **Step 3: Create src/layouts/BlogPost.astro**

```astro
---
import Layout from './Layout.astro';

export interface Props {
  title: string;
  description: string;
  pubDate: Date;
}

const { title, description, pubDate } = Astro.props;
const formattedDate = pubDate.toISOString().split('T')[0];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  datePublished: pubDate.toISOString(),
  author: { '@type': 'Organization', name: 'TripLion' },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trip-lion.com/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://trip-lion.com/blog' },
    { '@type': 'ListItem', position: 3, name: title },
  ],
};
---
<Layout title={`${title} | TripLion Blog`} description={description} path="/blog/">
  <script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
  <article class="section container">
    <p class="footer-tagline">{formattedDate}</p>
    <div class="prose">
      <h1>{title}</h1>
      <slot />
    </div>
  </article>
</Layout>
```

- [ ] **Step 4: Create src/pages/blog/index.astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog'))
  .filter((p) => p.slug !== '_placeholder')
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---
<Layout
  title="Blog | TripLion"
  description="Road trip planning guides, tips, and inspiration from TripLion."
  path="/blog"
>
  <section class="section container">
    <h1 class="section-title">The TripLion Blog</h1>
    <div class="blog-grid">
      {posts.map((post) => (
        <a class="blog-card" href={`/blog/${post.slug}/`}>
          <h2>{post.data.title}</h2>
          <p>{post.data.description}</p>
        </a>
      ))}
    </div>
  </section>
</Layout>
```

- [ ] **Step 5: Create src/pages/blog/[slug].astro**

```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<BlogPost title={post.data.title} description={post.data.description} pubDate={post.data.pubDate}>
  <Content />
</BlogPost>
```

- [ ] **Step 6: Build and verify**

Run: `npm run build`
Expected: exits 0, creates `dist/blog/index.html` and `dist/blog/_placeholder/index.html`.

- [ ] **Step 7: Grep for Article schema on the placeholder post**

Run: `grep -c '"@type":"Article"' dist/blog/_placeholder/index.html`
Expected: count ≥ 1.

- [ ] **Step 8: Remove the placeholder post (real posts added next task)**

```bash
rm src/content/blog/_placeholder.md
```

- [ ] **Step 9: Commit**

```bash
git add src/content/config.ts src/layouts/BlogPost.astro src/pages/blog
git commit -m "Add blog content collection, blog index, and post routes"
```

---

### Task 6: Write the 5 launch blog posts

**Files:**
- Create: `src/content/blog/plan-road-trip-itinerary-30-minutes.md`
- Create: `src/content/blog/road-trip-packing-checklist.md`
- Create: `src/content/blog/hidden-gems-road-trip-route.md`
- Create: `src/content/blog/road-trip-budget-planner.md`
- Create: `src/content/blog/best-road-trip-apps-compared-2026.md`
- Test: build + grep (bash)

**Interfaces:**
- Consumes: `blog` collection schema (Task 5).
- Produces: 5 posts fulfilling the Global Constraints' required list of exact titles.

- [ ] **Step 1: Create plan-road-trip-itinerary-30-minutes.md**

```markdown
---
title: "How to Plan a Road Trip Itinerary in Under 30 Minutes"
description: "A fast, no-nonsense process for turning a rough road trip idea into a day-by-day itinerary you can actually follow."
pubDate: 2026-06-01
---

Most road trip itineraries fall apart for the same reason: people try to plan every detail before they've even picked a route. Here's a faster way to do it.

## Step 1: Pick your anchor stops first (5 minutes)

Before anything else, decide on 2-4 "anchor" stops — the places you're building the trip around. Everything else gets filled in around these. If you don't have anchors yet, start with the two furthest-apart places you want to see; the stops between them will often suggest themselves once you look at the route.

## Step 2: Let the route decide your days (5 minutes)

Once you have anchors, map the driving time between them. A good rule of thumb: don't plan more than 5-6 hours of driving in a single day if you also want time to actually stop anywhere. Divide your total drive time by that number to get a rough day count — this is your itinerary's skeleton before you've added a single restaurant or trail.

## Step 3: Fill in one "why we're stopping here" per day (10 minutes)

For each day, pick exactly one thing that's the reason you're stopping in that town or area — a hike, a landmark, a specific restaurant. Don't try to plan every meal or every attraction up front. One solid reason per day is enough to keep momentum; everything else can be decided the day of.

## Step 4: Add a buffer stop or two (5 minutes)

Build in one or two "optional" stops you can skip if you're running behind. This is the step people skip, and it's the reason so many road trips end up feeling rushed on day 3.

## Step 5: Put it somewhere you'll actually check (5 minutes)

An itinerary that lives in seven different browser tabs doesn't survive contact with an actual trip. Put your anchor stops, rough days, and "why we're stopping here" notes into a single place you'll pull up from your phone — a tool like [TripLion](/) builds the day-by-day structure and route automatically once you've dropped in your stops, so this last step takes a minute instead of an evening.

That's it — a workable itinerary in under half an hour. The details (which restaurant, which trailhead) are much easier to fill in once the skeleton exists, and they're exactly the kind of decisions that are fine to make one or two days out instead of weeks in advance.
```

- [ ] **Step 2: Create road-trip-packing-checklist.md**

```markdown
---
title: "The Ultimate Road Trip Packing & Prep Checklist"
description: "Everything worth packing and prepping before a multi-day road trip, organized so you can actually use it the night before you leave."
pubDate: 2026-06-08
---

Packing for a road trip is different from packing for a flight — you've got trunk space, no weight limit, and a vehicle that needs its own prep. Here's a checklist organized by category so you can move through it fast.

## Vehicle prep

- Oil, tire pressure (including the spare), and fluid levels checked
- Wiper blades and washer fluid topped up
- Roadside emergency kit: jumper cables, flashlight, basic tools, tire inflator
- Phone mount and charging cables for the car
- Physical paper map or downloaded offline maps, in case of dead zones

## Documents

- Driver's license, registration, insurance card
- Any reservation confirmations (hotels, campsites, timed-entry parks)
- A printed or saved copy of your itinerary that doesn't rely on signal

## Comfort & convenience

- A cooler with drinks and snacks that don't need refrigeration as backup
- Reusable water bottles for everyone in the car
- A trash bag or small bin — car trash multiplies fast on multi-day trips
- Sunglasses, a phone charger for every seat, and something to keep kids or passengers entertained on long stretches

## Clothing

- Layers over bulk — road trips often cross multiple climates in one day
- One "worst case weather" outfit even if the forecast looks clear
- Comfortable shoes for whatever hikes or walks you've built into the itinerary

## The night-before 15-minute check

The night before you leave, do one final pass: confirm your first day's stops, check the weather along your route (not just at your destination), and charge everything that has a battery. This is also the moment to double check your itinerary is saved somewhere accessible offline — export it as a PDF or make sure it's synced to your phone, so a dead signal on day one doesn't leave you guessing where you're headed next.

Packing well isn't about bringing more — it's about not having to think about logistics once you're actually on the road, so the trip can just be the trip.
```

- [ ] **Step 3: Create hidden-gems-road-trip-route.md**

```markdown
---
title: "How to Find Hidden Gems Along Your Road Trip Route"
description: "Practical techniques for discovering the small, unmarked, worth-the-detour places that never show up in the first page of search results."
pubDate: 2026-06-15
---

The best road trip stops are rarely the ones with the biggest parking lot. Here's how to actually find the smaller, less-obvious places worth a detour.

## Search for what you want, not just where you are

"Restaurants in [town]" surfaces the same chains everywhere. Searching for what you actually want — "quiet lake swimming spot," "best pie stop on the way to X," "family-friendly hike under 2 hours" — surfaces very different, more specific results. This is exactly the kind of query an AI-powered search handles better than a plain map search, because it can understand intent instead of just matching keywords.

## Bias your search to the route, not the destination

A lot of great stops get missed because people only search near their final destination, not the towns they're driving through to get there. Widening your search to cover the whole route — not just the endpoints — is often the single biggest unlock for finding places you'd otherwise drive right past.

## Ask locals-adjacent sources, not just review aggregates

Star ratings are useful for avoiding bad experiences, but they're not great at surfacing hidden gems — a genuinely excellent 40-seat diner and a mediocre chain restaurant can have similar review counts. Look for specific mentions in local blogs, town tourism pages, or ask an AI assistant that can synthesize across sources for a plain-language recommendation like "best hidden gem stop between Denver and Moab."

## Leave room in the schedule to actually stop

None of this matters if your itinerary is packed tight enough that there's no time to pull off. Build slack into at least one stretch of driving per day specifically so a surprising find — a roadside sign, a scenic overlook, a town that looks more interesting than expected — has somewhere to go.

## Save what you find for next time

Not every hidden gem gets visited on the trip you find it during. Bookmarking interesting spots into a saved list as you research — rather than trying to remember them — means the next road trip through the same region starts with a head start instead of from scratch. [TripLion's](/features#save-organize) saved lists and route-biased AI search are built around exactly this workflow.
```

- [ ] **Step 4: Create road-trip-budget-planner.md**

```markdown
---
title: "Road Trip Budget Planner: How Much Does a Road Trip Really Cost?"
description: "A breakdown of the real cost categories in a road trip — gas, lodging, food, and the expenses people forget — plus how to estimate your own trip's total."
pubDate: 2026-06-22
---

Road trips have a reputation for being the "cheap" way to travel, and per-mile they usually are — but the total cost adds up faster than people expect if you don't budget for every category up front.

## Gas

Estimate this first since it scales directly with distance. Take your total mileage, divide by your vehicle's average MPG, and multiply by the current price per gallon along your route (prices vary regionally, so check a route-wide average rather than your local price). Add 10-15% as a buffer for detours and idling in traffic.

## Lodging

This is usually the single biggest cost category, and the one with the most room to control. Options span a huge range: camping (cheapest, but requires gear), budget motels, mid-range hotels, or vacation rentals (cost-effective for groups). Decide your lodging tier before you start planning stops — it affects both your budget and how far you can realistically drive each day.

## Food

Budget separately for "on the road" meals (usually more expensive, less healthy, chosen for convenience) versus meals at longer stops where you can seek out something better. A rough rule: expect to spend noticeably more per meal than you would at home, simply because you're paying for convenience and you're not cooking.

## The expenses people forget

- Parking fees at national parks, downtown areas, or paid attractions
- Tolls, especially on interstate corridors
- Vehicle wear — an oil change or tire issue on a long trip is common enough to budget a contingency for
- Souvenirs and "impulse stops" — the roadside attraction, the local specialty food stand — these add up and are also, often, the best part of the trip

## Putting it together

A simple way to estimate total cost: (gas) + (lodging per night × nights) + (food per day × days × people) + (10% contingency for the unplanned). Building this out day-by-day against your actual itinerary — rather than as one lump estimate — makes it much easier to see where a trip is running over budget while there's still time to adjust the plan, not after you're already home.
```

- [ ] **Step 5: Create best-road-trip-apps-compared-2026.md**

```markdown
---
title: "Best Road Trip Apps Compared (2026)"
description: "An honest comparison of what different road trip planning apps are actually good at, and where each one falls short."
pubDate: 2026-06-29
---

There's no single "best" road trip app — it depends on what part of planning is actually giving you trouble. Here's a category-by-category comparison of what to look for.

## Pure navigation apps

Standard map/navigation apps are excellent at turn-by-turn directions and live traffic, but they're not built for multi-day itinerary planning — there's no persistent "day 2, day 3" structure, and searching for places is a plain keyword match with no sense of what you're actually looking for or which stops make sense given your whole route.

## Spreadsheet and document planning

Some travelers plan trips in a shared spreadsheet or document. This works for people who want full manual control, but it means doing route calculation, place research, and formatting entirely by hand — and it doesn't travel well; a spreadsheet isn't something you pull up at a gas station to see "what's 10 minutes from here."

## Review-aggregator apps

Great for checking ratings once you already know where you're going, but weak at discovery — they're built around searching a specific place name or category near your current location, not around "what's along my route that matches what I'm looking for."

## Where an AI-powered, route-aware planner fits in

This is the gap TripLion is built for: a single itinerary that understands your whole multi-day route (not just your current location), an AI search that can answer plain-language questions like "best family stop between here and the coast" instead of just keyword matching, the ability to save discovered places into shareable lists, and a one-click export to a PDF or shareable link once the plan is done. It's not trying to replace turn-by-turn navigation — it's the layer above that, for the actual planning part.

## The honest takeaway

If you already know exactly where you're going and just need directions, a navigation app is all you need. If the hard part of your trip is figuring out what to do and where to stop across multiple days — and keeping all of that organized somewhere you and your travel companions can actually see — that's the problem worth using a dedicated planner for.
```

- [ ] **Step 6: Build and verify all 5 posts render**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 7: Grep for all 5 post routes**

```bash
test -f dist/blog/plan-road-trip-itinerary-30-minutes/index.html && \
test -f dist/blog/road-trip-packing-checklist/index.html && \
test -f dist/blog/hidden-gems-road-trip-route/index.html && \
test -f dist/blog/road-trip-budget-planner/index.html && \
test -f dist/blog/best-road-trip-apps-compared-2026/index.html && \
echo "ALL_5_POSTS_PRESENT"
```

Expected: prints `ALL_5_POSTS_PRESENT`.

- [ ] **Step 8: Grep the blog index links to all 5 posts**

Run: `grep -c 'href="/blog/' dist/blog/index.html`
Expected: count ≥ 5.

- [ ] **Step 9: Commit**

```bash
git add src/content/blog
git commit -m "Add 5 launch blog posts"
```

---

### Task 7: Features page

**Files:**
- Create: `src/pages/features.astro`
- Test: build + grep (bash)

**Interfaces:**
- Consumes: `Layout` (Task 3). Anchor ids must match the homepage's feature-card links from Task 4 (`ai-chat`, `explore-discover`, `interactive-map`, `save-organize`, `share-trips`, `export-print`).

- [ ] **Step 1: Create src/pages/features.astro**

```astro
---
import Layout from '../layouts/Layout.astro';

const features = [
  {
    slug: 'ai-chat',
    icon: '💬',
    title: 'AI Travel Chat',
    body: "TripLion's built-in AI assistant knows the difference between \"find me a quiet beach\" and \"find me a fast food stop 10 minutes off the highway.\" Ask it natural questions about your trip — best stops, kid-friendly detours, budget picks — and get answers grounded in real places along your actual route, not generic search results.",
  },
  {
    slug: 'explore-discover',
    icon: '🧭',
    title: 'Explore & Discovery',
    body: 'Search by category — restaurants, cafes, hotels, museums, parks, shopping, bars, and attractions — or let TripLion detect what you\'re really looking for from a plain-language query like "best romantic dinner spot" or "hidden gem hiking trail." Results are automatically biased toward your current route, so you\'re not scrolling through places three hours away.',
  },
  {
    slug: 'interactive-map',
    icon: '🗺️',
    title: 'Interactive Map',
    body: 'Every stop lives on a full interactive map. Switch to satellite view or drop into Street View before you arrive, check transit routes for stops with public transport, and see photos, ratings, hours, and contact info without leaving the planner.',
  },
  {
    slug: 'save-organize',
    icon: '🔖',
    title: 'Save & Organize',
    body: 'Found ten places you love and can only visit three? Save them all into custom lists — "Must-see attractions," "Backup restaurants," whatever makes sense for your trip — directly from search results or the map.',
  },
  {
    slug: 'share-trips',
    icon: '🔗',
    title: 'Share Trips & Lists',
    body: 'Every trip and every saved list can become a shareable link with a clean, custom URL. Send it to whoever you\'re traveling with so everyone can see the plan — no account required to view, sign-in only needed if you want to edit or create your own.',
  },
  {
    slug: 'export-print',
    icon: '📄',
    title: 'Export & Print',
    body: 'When it\'s time to hit the road, export your itinerary as a PDF in a Detailed layout (maps, routes, addresses, timelines) or a Clean layout (just the schedule) — or print it directly. Perfect for the parts of a road trip where you don\'t want to be staring at a phone.',
  },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trip-lion.com/' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://trip-lion.com/features' },
  ],
};
---
<Layout
  title="Features | TripLion"
  description="Everything TripLion does to help you plan, discover, and share the perfect road trip."
  path="/features"
>
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
  <section class="section container">
    <h1 class="section-title">Everything you need to plan the perfect road trip</h1>
    {features.map((f) => (
      <div id={f.slug} class="feature-card" style="margin-bottom: 20px;">
        <span class="feature-icon" aria-hidden="true">{f.icon}</span>
        <h2>{f.title}</h2>
        <p>{f.body}</p>
      </div>
    ))}
    <div class="final-cta">
      <a href="/#notify" class="cta-button">Coming Soon</a>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: exits 0, creates `dist/features/index.html`.

- [ ] **Step 3: Grep for all 6 anchor ids**

```bash
for id in ai-chat explore-discover interactive-map save-organize share-trips export-print; do
  grep -q "id=\"$id\"" dist/features/index.html || echo "MISSING: $id"
done
echo "CHECK_DONE"
```

Expected: no `MISSING:` lines printed, ends with `CHECK_DONE`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/features.astro
git commit -m "Add features page with detailed feature descriptions"
```

---

### Task 8: Contact page

**Files:**
- Create: `src/pages/contact.astro`
- Test: build + grep (bash)

**Interfaces:**
- Consumes: `Layout` (Task 3). Reuses the Formspree endpoint `https://formspree.io/f/mkoalrzq` with hidden field `form-name=contact`.

- [ ] **Step 1: Create src/pages/contact.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout
  title="Contact | TripLion"
  description="Get in touch with the TripLion team."
  path="/contact"
>
  <section class="section container">
    <h1 class="section-title">Get in touch</h1>
    <p class="subcopy" style="text-align:center;">
      Prefer email? Reach us directly at <a href="mailto:hello@trip-lion.com" style="color:var(--glow);">hello@trip-lion.com</a>.
    </p>
    <form class="signup" id="contact-form" action="https://formspree.io/f/mkoalrzq" method="POST" aria-label="Contact form">
      <input type="hidden" name="form-name" value="contact" />
      <div style="display:grid; gap:12px; margin-bottom:12px;">
        <label class="sr-only" for="name">Your name</label>
        <input class="text-input" id="name" type="text" name="name" placeholder="Your name" required />
        <label class="sr-only" for="contact-email">Your email</label>
        <input class="text-input" id="contact-email" type="email" name="email" placeholder="Your email address" required />
        <label class="sr-only" for="message">Your message</label>
        <textarea class="textarea-input" id="message" name="message" placeholder="How can we help?" required></textarea>
      </div>
      <button class="notify-button" type="submit" style="width:100%;">Send message</button>
      <p class="status" role="status" aria-live="polite"></p>
    </form>
  </section>

  <script>
    const form = document.getElementById('contact-form');
    if (form) {
      const statusMessage = form.querySelector('.status');
      const submitButton = form.querySelector('button[type="submit"]');
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const originalButtonText = submitButton.textContent;
        statusMessage.classList.remove('is-visible');
        statusMessage.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        try {
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' },
          });
          if (!response.ok) throw new Error('Form submission failed');
          form.reset();
          statusMessage.textContent = 'Thanks — we will get back to you soon.';
          statusMessage.classList.add('is-visible');
        } catch (error) {
          statusMessage.textContent = 'Something went wrong. Please try again.';
          statusMessage.classList.add('is-visible');
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
    }
  </script>
</Layout>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: exits 0, creates `dist/contact/index.html`.

- [ ] **Step 3: Grep for the Formspree endpoint and hidden form-name field**

Run: `grep -c 'formspree.io/f/mkoalrzq' dist/contact/index.html && grep -c 'name="form-name" value="contact"' dist/contact/index.html`
Expected: both counts ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/pages/contact.astro
git commit -m "Add contact page with Formspree-backed form"
```

---

### Task 9: Privacy Policy page

**Files:**
- Create: `src/pages/privacy.astro`
- Test: build + grep (bash)

**Interfaces:**
- Consumes: `Layout` (Task 3).

- [ ] **Step 1: Create src/pages/privacy.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout
  title="Privacy Policy | TripLion"
  description="How TripLion collects, uses, and protects your information."
  path="/privacy"
>
  <section class="section container prose">
    <h1>Privacy Policy</h1>
    <p><em>Last updated: July 2026. This is a general-purpose policy for an early-stage project and is not a substitute for legal advice specific to your jurisdiction.</em></p>

    <h2>What we collect</h2>
    <p>
      When you sign up for launch updates or contact us through this site, we collect the
      information you provide directly: your name (if given), email address, and any
      message you send. This is processed through our form provider, Formspree, and
      is used only to respond to you or notify you about TripLion's launch.
    </p>
    <p>
      We use Google Analytics to understand overall site traffic — this collects
      standard, non-identifying usage data such as pages viewed, approximate location
      (city/country level), device type, and referring site. We do not use this data to
      identify individual visitors.
    </p>
    <p>
      Once the TripLion app itself is live, using it will involve providing trip-related
      information you choose to enter (destinations, saved places, itineraries) so the
      app can function. That data is used to power the features you're using and is not
      sold to third parties.
    </p>

    <h2>Third parties we use</h2>
    <ul>
      <li><strong>Formspree</strong> — processes form submissions (signup and contact forms).</li>
      <li><strong>Google Analytics</strong> — website usage analytics.</li>
      <li><strong>Google Maps Platform</strong> — powers maps, places, and routing once the app is live.</li>
    </ul>

    <h2>Cookies</h2>
    <p>
      This site uses cookies set by Google Analytics to distinguish visitors for
      aggregate traffic reporting. You can disable cookies in your browser settings at
      any time; this will not affect your ability to use the site.
    </p>

    <h2>Data retention and deletion</h2>
    <p>
      Signup and contact form data is retained only as long as needed to respond to you
      or maintain our launch notification list. If you'd like your information deleted
      at any time, email us at <a href="mailto:hello@trip-lion.com">hello@trip-lion.com</a>
      and we will remove it.
    </p>

    <h2>No sale of data</h2>
    <p>We do not sell, rent, or trade your personal information to third parties.</p>

    <h2>Changes to this policy</h2>
    <p>
      We may update this policy as TripLion evolves, particularly once the app itself
      launches and collects trip-related data. Material changes will be reflected on
      this page with an updated "last updated" date.
    </p>

    <h2>Contact</h2>
    <p>
      Questions about this policy or your data can be sent to
      <a href="mailto:hello@trip-lion.com">hello@trip-lion.com</a>.
    </p>
  </section>
</Layout>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: exits 0, creates `dist/privacy/index.html`.

- [ ] **Step 3: Grep for required disclosures**

Run: `grep -c 'Formspree' dist/privacy/index.html && grep -c 'Google Analytics' dist/privacy/index.html && grep -c 'do not sell' dist/privacy/index.html`
Expected: all counts ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/pages/privacy.astro
git commit -m "Add Privacy Policy page"
```

---

### Task 10: Terms of Service page

**Files:**
- Create: `src/pages/terms.astro`
- Test: build + grep (bash)

**Interfaces:**
- Consumes: `Layout` (Task 3).

- [ ] **Step 1: Create src/pages/terms.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout
  title="Terms of Service | TripLion"
  description="The terms that govern your use of the TripLion website and app."
  path="/terms"
>
  <section class="section container prose">
    <h1>Terms of Service</h1>
    <p><em>Last updated: July 2026. This is a general-purpose terms template for an early-stage project and is not a substitute for legal advice specific to your jurisdiction.</em></p>

    <h2>Acceptance of terms</h2>
    <p>
      By using this website or, once launched, the TripLion app, you agree to these
      Terms of Service. If you do not agree, please do not use the site or app.
    </p>

    <h2>Acceptable use</h2>
    <p>
      You agree to use TripLion only for lawful purposes, and not to attempt to
      disrupt, reverse-engineer, or misuse the site, the app, or the services (including
      third-party services like Google Maps Platform) that power them.
    </p>

    <h2>Your content</h2>
    <p>
      Any trip data, itineraries, saved places, or lists you create in the TripLion app
      remain yours. By choosing to share a trip or list via a shareable link, you
      understand that anyone with that link can view its contents.
    </p>

    <h2>No warranty</h2>
    <p>
      TripLion, its website, and its app are provided "as is," without warranties of
      any kind, express or implied. We do not guarantee that route information, place
      data, hours, or pricing shown are accurate or up to date — always confirm
      time-sensitive details (like business hours) independently before relying on them.
    </p>

    <h2>Limitation of liability</h2>
    <p>
      To the maximum extent permitted by law, TripLion is not liable for any indirect,
      incidental, or consequential damages arising from your use of the site or app,
      including reliance on route, place, or itinerary information.
    </p>

    <h2>Third-party services</h2>
    <p>
      The app relies on third-party services, including Google Maps Platform, to
      provide maps, places, and routing data. Your use of those features is also subject
      to the relevant third party's own terms.
    </p>

    <h2>Changes to these terms</h2>
    <p>
      We may update these terms as TripLion evolves. Continued use of the site or app
      after changes are posted constitutes acceptance of the updated terms.
    </p>

    <h2>Contact</h2>
    <p>
      Questions about these terms can be sent to
      <a href="mailto:hello@trip-lion.com">hello@trip-lion.com</a>.
    </p>
  </section>
</Layout>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: exits 0, creates `dist/terms/index.html`.

- [ ] **Step 3: Grep for required sections**

Run: `grep -c 'No warranty' dist/terms/index.html && grep -c 'Limitation of liability' dist/terms/index.html`
Expected: both counts ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/pages/terms.astro
git commit -m "Add Terms of Service page"
```

---

### Task 11: robots.txt and llms.txt

**Files:**
- Create: `public/robots.txt`
- Create: `public/llms.txt`
- Test: build + grep (bash) — sitemap itself is auto-generated by `@astrojs/sitemap` (configured in Task 1) and verified here too.

**Interfaces:**
- Produces: `dist/robots.txt`, `dist/llms.txt`, `dist/sitemap-index.xml` (from the sitemap integration).

- [ ] **Step 1: Create public/robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://trip-lion.com/sitemap-index.xml
```

- [ ] **Step 2: Create public/llms.txt**

```markdown
# TripLion

> TripLion is an AI-powered road trip planner. Plan routes, discover places with
> AI-driven search, save and organize favorite stops, share trip itineraries, and
> export or print a finished plan.

## Key pages

- Home: https://trip-lion.com/
- Features: https://trip-lion.com/features
- Blog: https://trip-lion.com/blog
- Contact: https://trip-lion.com/contact
- App (product): https://app.trip-lion.com

## About

TripLion helps travelers plan road trips end-to-end: build a day-by-day itinerary,
discover restaurants, attractions, and hidden gems along the route using AI-powered
search, save places into shareable lists, and export the final plan as a PDF or
shareable link. The product is in pre-launch; the website collects email signups for
launch notifications.
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: exits 0, creates `dist/robots.txt`, `dist/llms.txt`, `dist/sitemap-index.xml`.

- [ ] **Step 4: Grep for sitemap reference in robots.txt and confirm sitemap file exists**

```bash
grep -c 'sitemap-index.xml' dist/robots.txt
test -f dist/sitemap-index.xml && echo "SITEMAP_EXISTS"
```

Expected: count ≥ 1, prints `SITEMAP_EXISTS`.

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt public/llms.txt
git commit -m "Add robots.txt and llms.txt for search/AI crawlers"
```

---

### Task 12: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Test: manual verification (cannot be grep-tested locally — requires a push and GitHub Pages configuration, called out explicitly below).

**Interfaces:**
- Produces: a workflow that builds the Astro site and deploys `dist/` to GitHub Pages on every push to `main`.

- [ ] **Step 1: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow to build and deploy to GitHub Pages"
```

- [ ] **Step 3: Flag the required manual repo setting change**

This workflow requires the repository's Pages source to be set to "GitHub Actions"
instead of "Deploy from a branch." This is a repository settings change that affects
the live site's deployment — **do this manually in GitHub, in Settings → Pages → Build
and deployment → Source → GitHub Actions**, after this PR/branch is merged. Do not
attempt to change this via the GitHub API without the user's explicit go-ahead, since
it affects how the currently-live site deploys.

---

### Task 13: Full-site verification

**Files:**
- None created — this task verifies the whole site end-to-end.
- Test: build + grep (bash) + manual local preview.

**Interfaces:**
- Consumes: every previous task's output.

- [ ] **Step 1: Clean build from scratch**

```bash
rm -rf dist .astro
npm run build
```

Expected: exits 0.

- [ ] **Step 2: Verify every route exists**

```bash
for route in index features contact privacy terms blog/index; do
  test -f "dist/$route.html" -o -f "dist/$route/index.html" && echo "OK: $route" || echo "MISSING: $route"
done
```

Expected: `OK:` printed for every route, no `MISSING:` lines. (Note: `dist/index.html` is a file, others are `dist/<route>/index.html` directories — the `-o` check handles both.)

- [ ] **Step 3: Verify all internal nav links resolve to real routes**

```bash
grep -o 'href="/[a-z/-]*"' dist/index.html | sort -u
```

Expected: every path printed corresponds to a route verified in Step 2, plus `/`, `/#notify` fragments, and `/blog/<slug>/` paths matching the 5 posts from Task 6.

- [ ] **Step 4: Local preview smoke test**

```bash
npm run preview &
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/features
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/blog
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/contact
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/privacy
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/terms
kill %1
```

Expected: every curl prints `200`.

- [ ] **Step 5: Commit any final fixes found during verification**

```bash
git add -A
git commit -m "Fix issues found during full-site verification" --allow-empty
```

(Use `--allow-empty` only if verification passed with zero fixes needed — otherwise commit the real fix.)

---

## Post-Launch Note

The hero and final CTA buttons (`<a href="#notify" class="cta-button">Coming Soon</a>`
in `src/pages/index.astro` and `src/pages/features.astro`) are the only places that need
to change when the app launches: swap `href="#notify"` for
`href="https://app.trip-lion.com"` and the label from `Coming Soon` to something like
`Start Planning`. Everything else (nav, footer, JSON-LD `sameAs`) already points at
`app.trip-lion.com`.
