# TripLion Light Theme and Blog SEO Design

**Date:** 2026-07-16
**Status:** Approved for planning

## Goal

Turn the TripLion marketing site into a clean, light travel utility and make the blog more useful, engaging, and search-friendly. The result should build trust with travelers, explain TripLion's product strengths without inflated claims, and create a focused six-article search cluster around road trip planning.

## Visual Direction

Use a balanced product-and-editorial approach.

- Marketing pages use white and pale-gray surfaces, near-black text, TripLion orange for primary actions, and restrained green or blue accents for route-related details.
- Borders are thin and neutral. Shadows are subtle and used only where they clarify interactive hierarchy.
- The correct `logo-lion.png` remains the primary brand mark.
- The homepage remains product-first and practical. It should feel like a travel planning tool, not a travel magazine or a generic SaaS landing page.
- Blog pages use a slightly more editorial reading layout while sharing the same tokens, navigation, buttons, and footer as the rest of the site.
- Existing layouts remain responsive, with readable line lengths and no text or control overlap at mobile and desktop widths.

The site will not include a dark-mode toggle in this scope. Light mode is the single visual theme.

## Image Direction

Article visuals will be led by real travel photography, supported by a small number of branded TripLion illustrations when a planning concept is clearer as a diagram.

- Each article receives a relevant lead image.
- Images use descriptive, keyword-relevant filenames and meaningful alt text.
- Local image files are optimized before shipping and include explicit dimensions to prevent layout shift.
- Images below the initial viewport are lazy-loaded.
- Decorative images use empty alt text.
- Branded visuals use the existing TripLion orange and the light-theme route accents.
- Blog cards reuse the article lead image rather than downloading duplicate assets.

## Blog Information Architecture

Keep all five existing articles and add one new article, for six total:

1. **Best Road Trip Apps Compared (2026)** - 1,500-2,000 words.
2. **How to Plan a Road Trip With Friends** - 1,500-2,000 words and the new sixth article.
3. **How to Find Hidden Gems Along Your Road Trip Route** - 800-1,200 words.
4. **How to Plan a Road Trip Itinerary in Under 30 Minutes** - 800-1,200 words.
5. **Road Trip Budget Planner: How Much Does a Road Trip Really Cost?** - 800-1,200 words. This article remains live and is not redirected or positioned as a TripLion product feature.
6. **The Ultimate Road Trip Packing & Prep Checklist** - concise refresh, optimized for quick scanning.

The new article targets `plan a road trip with friends`, `group road trip planner`, and `shared road trip itinerary`. It connects naturally to TripLion's sharing, saved-list, and itinerary organization features.

## Competitor Article Positioning

The comparison names real products and evaluates them honestly. Its ordered shortlist begins:

1. Google Maps
2. TripLion

Other relevant competitors may include Wanderlog, Roadtrippers, and similar established planning products. Every product receives a clear "best for" use case, meaningful strengths, and real limitations. TripLion is presented as the second choice because it combines route-aware discovery, multi-day planning, saved lists, sharing, and export, not because of unsupported superlatives.

Claims that may change, such as current pricing or feature availability, must be verified against first-party product pages during implementation. The article should state the review date and avoid claims that cannot be sourced.

## Editorial Standard

Write for a smart traveler, not for a search crawler.

- Open with a direct answer, useful observation, or relatable planning problem.
- Use short paragraphs, varied sentence length, and a conversational expert voice.
- Avoid corporate filler and robotic transitions.
- Use exactly one H1 per article.
- Organize the body with descriptive H2 and H3 headings.
- Put the primary query naturally in the title, opening paragraph, at least one subheading, and conclusion where it reads naturally.
- Add lists, comparison tables, checklists, examples, or formulas when they make the advice easier to use.
- Include concrete opinions and caveats so the writing feels human and trustworthy.
- End with a contextual next step instead of a generic sales pitch.

Every article must deliver standalone value. TripLion references should explain a relevant workflow and link to a matching product or feature page.

## Shared Blog Experience

Extend the existing Astro content schema and shared blog layout instead of creating per-post templates.

Article frontmatter will support:

- title
- description
- publication date
- optional updated date
- lead image path
- lead image alt text
- category
- primary keyword

The shared layout will provide:

- breadcrumb navigation
- article title and concise description
- publication or updated date
- calculated reading time
- lead image
- generated table of contents from H2 headings
- readable article body
- contextual end-of-article CTA
- related articles chosen from the same six-post collection

The blog index and homepage blog section will show lead images, article metadata, and clear summaries. Cards remain compact, accessible links rather than nested decorative panels.

## SEO Requirements

Each article must have:

- a unique title tag kept near or under 60 characters when practical
- a compelling meta description around 150-160 characters
- a short, descriptive slug
- a self-referencing canonical URL
- one H1 and logical H2/H3 hierarchy
- descriptive internal-link anchor text
- relevant authoritative external references where factual support helps
- Article structured data including headline, description, publication date, modified date when available, author, canonical URL, and lead image
- breadcrumb structured data
- Open Graph and Twitter metadata using the lead image

The site must preserve crawlable HTML content, sitemap generation, and existing legal/contact routes. Placeholder verification and analytics IDs are outside this visual/editorial scope and must not be represented as configured production integrations.

## Performance and Accessibility

- Prefer optimized local raster formats appropriate to browser support.
- Avoid adding a client-side image carousel, theme runtime, or large UI library.
- Maintain visible keyboard focus, sufficient color contrast, semantic headings, and descriptive link text.
- Keep article content server-rendered by Astro.
- Prevent image-driven cumulative layout shift through fixed dimensions or stable aspect ratios.
- Keep the light theme legible in high ambient light and avoid low-contrast pale text.

## Verification

Implementation is complete only when:

- `npm run build` succeeds without content schema or route errors.
- All six article routes are generated.
- The sitemap contains the expected public pages.
- Automated source/build checks confirm unique metadata, one H1 per article, required image metadata, internal-link targets, and structured data fields.
- Browser checks cover the homepage, blog index, competitor article, and one standard article at desktop and mobile sizes.
- Browser checks confirm the correct logo, light theme, readable navigation, non-overlapping text, visible lead images, working tables of contents, and usable CTAs.
- No placeholder article images or broken image requests remain.

## Out of Scope

- A user-selectable dark theme
- A new CMS
- Account or trip-planning application changes
- Fabricated reviews, user counts, ratings, or waitlist statistics
- Positioning TripLion as a budgeting product
- Replacing the production deployment system
