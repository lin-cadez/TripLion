# TripLion Design Philosophy

Reference doc for anyone building marketing/brand surfaces (landing page, emails, social
assets) for TripLion. Derived from auditing the live teaser page and the TripZone app
codebase (`frontend/`).

TripLion actually has **two coherent but distinct design languages** — don't mix them:

1. **Brand / marketing identity** — the dark, moody "night rally" look. This is what the
   public site (this repo) should use. It's already been used twice (this repo's
   `index.html` and `TripZone/frontend/public/triplion-landing.html` are identical),
   confirming it's the intentional brand identity, not a placeholder.
2. **In-app product UI** — a light, clean SaaS look used inside the actual planner app.
   Marketing pages should *nod* to this (same orange hue family, same font, same icon
   style) but should NOT be light-themed — the brand identity for the public-facing site
   is the dark theme.

## 1. Color Palette

### Brand / marketing (use this for the landing page)

| Token | Value | Use |
|---|---|---|
| `--dark` | `#160d0a` | Page background |
| `--glow` | `#ff8a3d` | Brand/heading color, primary accent |
| `--cream` | `#ffe0bd` | Body text on dark background |
| `--muted` | `rgba(255, 224, 189, .76)` | De-emphasized text |
| `--line` | `rgba(255, 192, 130, .28)` | Dividers, hairlines |
| accent gradient | `linear-gradient(135deg, #ff9d4f, #ff7032 45%, #ff8b3d)` | CTA buttons |
| highlight dot | `#ff9149` | Small glow accents (pulsing dot, route glow) |

Background is never flat — it's built from layered gradients over `raymap-bg.png`
(a warm, dark map texture) plus a large, low-opacity lion mark (`logo-lion.png`) bleeding
off one corner. Text always carries a subtle `text-shadow` for legibility over the
textured background.

### In-app / product UI (for reference — do not use directly on marketing pages)

| Token | Value | Use |
|---|---|---|
| `--background` | `#ffffff` | App background |
| `--foreground` | near-black (`#1f2937`) | Primary text |
| accent | `#fb923c` (Tailwind `orange-400`) | Buttons, links, active states |
| accent hover | `#ea580c` (`orange-600`) | Hover state |
| accent light | `#fed7aa` (`orange-100`) | Subtle highlight backgrounds |
| secondary text | `#6b7280` (`gray-500`) | Muted/secondary copy |
| border | `#e5e7eb` (`gray-200`) | Card/input borders |

A legacy `oxford-blue` / `selective-yellow` / `dutch-white` / `cool-gray` palette exists
in `tailwind.config.ts` and shows up in a couple of older components (Settings, AI Chat)
but is not the dominant, current direction — treat orange as canonical for the product,
and the dark/glow palette as canonical for the brand.

**Takeaway for the landing page:** dark background, warm orange glow as the hero color,
cream/warm-white text. This is consistent and already battle-tested across two files.

## 2. Typography

- **Font:** Inter, falling back to `ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", sans-serif`. Same font is used in-app and on marketing
  pages — keep it.
- **Brand wordmark:** huge, black weight (900), tight line-height (`.86`), wide letter
  spacing, glow color, soft text-shadow bloom. This is the signature move — the logotype
  should always feel oversized and slightly luminous.
- **Taglines / section labels:** small, heavy (900+), uppercase, very wide letter-spacing
  (`.28rem`–`.86rem`), warm orange (`#ffb275`). Used sparingly as eyebrow/kicker text.
- **Body copy:** comfortable size (1–1.3rem), line-height ~1.55, `text-wrap: balance` on
  short pitches, cream color at reduced opacity for hierarchy.
- **In-app UI text scale (for consistency when copy appears in product screenshots):**
  card titles `text-2xl font-semibold`, section headers `text-lg font-semibold`, body
  `text-sm`, labels `text-xs font-semibold`.

## 3. Component Style

- Flat-ish but with soft depth: subtle borders (`1px solid rgba(255,255,255,.1-.4)`),
  soft large-radius corners (`15px`–`18px` on inputs/buttons/badges), soft blurred glass
  panels (`backdrop-filter: blur(10px)`) over the dark background.
- Shadows are large and soft (`0 18-24px 48-58px rgba(...)`), never hard-edged — think
  glow, not drop-shadow.
- Buttons: gradient fill (orange family), uppercase bold label, wide letter-spacing,
  hover = slight lift (`translateY(-1px)`) + brighten + stronger shadow.
- Inputs: dark translucent fill, cream text, glowing focus ring (orange, `0 0 0 4px
  rgba(255,143,70,.12)`).
- Small animated accents are part of the identity: a pulsing dot on dividers, a slowly
  floating light streak ("route glow") — subtle motion suggesting travel/routes, not
  flashy.
- In-app product components (for reference): shadcn/ui defaults — `0.5rem` radius,
  `shadow-sm` cards, `h-10` inputs/buttons, generous `p-6` card padding.

## 4. Iconography & Imagery

- **Icon library (in-app):** lucide-react, sized `h-4 w-4` / `h-5 w-5`, colored to match
  context (orange for actions, gray for secondary).
- **Brand marks:** `logo-lion.png` (icon mark, used small in a bordered badge, and large
  at low opacity as a background watermark bleeding off the bottom-right corner).
  `raymap-bg.png` provides the dark textured backdrop.
- No decorative illustrations — the aesthetic relies on typography, glow/gradient
  effects, and the lion mark rather than custom artwork or stock photography. If real
  photography is introduced (e.g. destination photos for a features section), it should
  be warm-toned and darkened/gradient-overlaid to match the palette, never placed on a
  plain white card.

## 5. Tone / Voice

- Short, confident, evocative headlines: "Road Trip. Reimagined."
- Adventure-forward but not corny: "turn every mile into a memory", "plan the perfect
  route".
- CTAs are imperative and simple: "Notify me" (soon to become the real launch CTA).
- In-app copy is more conversational/helpful ("Hello! I'm your AI travel assistant..."),
  but marketing copy should stay punchier and more aspirational than in-app copy.
- No corporate jargon anywhere in the product.

## 6. Layout Patterns

- Marketing page: single centered column (`min(700px, 92vw)`), generous vertical
  rhythm, full-bleed dark background, content vertically centered in the viewport.
- Responsive: mobile collapses two-column form rows to one column, shrinks the wordmark
  significantly (`clamp(3.25rem, 17vw, 5.15rem)`), reduces the watermark lion's opacity.
- In-app: two-panel layouts (sidebar + main), tab-based navigation, resizable panels —
  not directly relevant to marketing pages but useful if showing app screenshots.

## Source Files Audited

- `TripLion/index.html` (live teaser page)
- `TripZone/frontend/public/triplion-landing.html` (identical duplicate — confirms this
  is the intentional brand identity)
- `TripZone/frontend/app/globals.css`, `TripZone/frontend/styles/globals.css`,
  `TripZone/frontend/tailwind.config.ts`
- `TripZone/frontend/components/settings.tsx`, `ai-chat.tsx`, `explore-panel.tsx`,
  `trip-planner.tsx`, `ui/button.tsx`, `ui/card.tsx`
