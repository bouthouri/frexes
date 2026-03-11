# Phase 2: Static Content - Research

**Researched:** 2026-03-11
**Domain:** Astro static sections + Tailwind v4 responsive layout + SEO meta/OG tags
**Confidence:** HIGH

## Summary

Phase 2 builds all visible content sections on the single-page portfolio: Hero, App Showcase grid, About, and Footer. Everything is static Astro components (no React islands needed yet -- animations come in Phase 3). The data-driven `apps.ts` from Phase 1 feeds the app cards.

Key concerns: (1) OG/SEO meta tags must be wired into BaseLayout's `<head>`, (2) app icon SVGs don't exist yet in `public/icons/` -- need placeholder or real assets, (3) responsive design is mobile-first with Tailwind breakpoints, (4) status badges distinguish Live vs Coming Soon apps.

**Primary recommendation:** Build pure Astro components (`.astro` files) for all sections. No React needed for static content. Use Tailwind's responsive utilities (`sm:`, `md:`, `lg:`) for all breakpoints. Wire OG tags directly in BaseLayout `<head>` -- no need for `astro-seo` package for a single-page site.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HERO-01 | Hero section with "Frexes" name and tagline | Architecture Patterns -- Hero section pattern |
| APPS-01 | Grid of 4 app cards | Architecture Patterns -- AppCard + AppsGrid |
| APPS-02 | Each card shows icon, name, one-liner, status badge | Architecture Patterns -- AppCard component |
| APPS-03 | "Coming Soon" badge for Voila and Karv | Code Examples -- status badge pattern |
| APPS-04 | Links to energyxp.app and progres.ing for live apps | Code Examples -- conditional link wrapping |
| ABOUT-01 | Brief about section | Architecture Patterns -- About section |
| FOOT-01 | Footer with X and LinkedIn links | Architecture Patterns -- Footer section |
| TECH-01 | Responsive design -- mobile-first | Architecture Patterns -- responsive strategy |
| TECH-02 | SEO meta tags, Open Graph tags | Code Examples -- BaseLayout SEO wiring |
</phase_requirements>

## Standard Stack

### Core (already installed from Phase 1)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| astro | ^6.0.2 | Static site framework | Installed |
| tailwindcss | ^4.2.1 | Utility-first CSS | Installed |
| @tailwindcss/vite | ^4.2.1 | Tailwind Vite plugin | Installed |

### No New Dependencies Needed

Phase 2 is pure static content. All sections are Astro components using Tailwind classes. No new packages required.

**Do NOT install:**
- `astro-seo` -- overkill for a single-page site; hand-write the 10 meta tags
- `@astrojs/sitemap` -- save for Phase 4 deployment
- Any icon library -- use inline SVGs for X/LinkedIn icons

## Architecture Patterns

### Project Structure After Phase 2
```
src/
  components/
    Hero.astro            # Hero section
    AppCard.astro         # Single app card
    AppsGrid.astro        # Grid of AppCards (imports apps.ts)
    StatusBadge.astro     # Live / Coming Soon badge
    About.astro           # About section
    Footer.astro          # Footer with social links
    motion/               # (from Phase 1, untouched)
    ui/                   # (from Phase 1, untouched)
  data/
    apps.ts               # (from Phase 1, drives AppCard)
  layouts/
    BaseLayout.astro      # Extended with OG/SEO meta tags
  pages/
    index.astro           # Composes all sections
  styles/
    global.css            # (from Phase 1)
public/
  icons/
    energy-xp.svg         # App icon (needs creation)
    progres.svg           # App icon (needs creation)
    voila.svg             # App icon (needs creation)
    karv.svg              # App icon (needs creation)
```

### Pattern 1: Data-Driven App Cards
**What:** `AppsGrid.astro` imports `apps` array, maps over it, renders `AppCard.astro` for each entry.
**When to use:** Anywhere content comes from `src/data/`.

The `apps.ts` data model already has all fields needed:
- `name`, `tagline` -- card content
- `status` ("live" | "coming-soon") -- drives badge
- `url` (string | null) -- conditional link wrapping
- `icon` -- path to SVG in public/
- `accentColor` -- can be used for card accent

### Pattern 2: Conditional Link Wrapping
**What:** Live apps wrap entire card in `<a>`, coming-soon apps render as `<div>`.
**When to use:** When link presence depends on data.

### Pattern 3: Mobile-First Responsive
**What:** Default styles target mobile, breakpoints add desktop enhancements.
**Breakpoints:**
- Default: mobile (< 640px) -- single column
- `sm:` (640px+): minor adjustments
- `md:` (768px+): 2-column grid
- `lg:` (1024px+): max-width container, larger typography

### Pattern 4: Section Composition in index.astro
**What:** Each section is a self-contained `.astro` component. `index.astro` stacks them vertically.
**Structure:**
```astro
<BaseLayout>
  <Hero />
  <AppsGrid />
  <About />
  <Footer />
</BaseLayout>
```

### Anti-Patterns to Avoid
- **React for static content:** Every section here is pure HTML/CSS. No `client:` directives needed. React islands are only for Phase 3 hover animations.
- **Hardcoded app data in components:** Always import from `apps.ts`. Never duplicate app names/URLs in components.
- **Desktop-first responsive:** Write mobile styles as defaults, add breakpoints for larger screens.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Social icons (X, LinkedIn) | Icon component library | Inline SVG paths | Only 2 icons, no need for a dependency |
| OG meta tags | Custom head management | Direct `<meta>` tags in BaseLayout | Single page, 10 tags total |
| Grid layout | Custom flexbox grid | Tailwind `grid grid-cols-1 md:grid-cols-2` | Built-in, responsive, zero custom CSS |
| Status badge | Complex component | Simple conditional `<span>` with Tailwind classes | Two states, not worth abstraction |

## Common Pitfalls

### Pitfall 1: Missing App Icons
**What goes wrong:** `apps.ts` references `/icons/energy-xp.svg` etc. but `public/icons/` doesn't exist yet.
**Why it happens:** Phase 1 blocker note says "App icons needed before Phase 2."
**How to avoid:** Create simple placeholder SVG icons in `public/icons/` during plan 02-02. Use colored circles with app initials as placeholders. Replace with real icons later.
**Warning signs:** Broken images in the app cards.

### Pitfall 2: OG Image Missing
**What goes wrong:** `og:image` meta tag points to an image that doesn't exist.
**How to avoid:** Either create a simple OG image or omit `og:image` until Phase 4. At minimum set `og:title`, `og:description`, `og:type`, `og:url`.
**Warning signs:** Social media preview shows no image.

### Pitfall 3: External Links Missing `rel` Attributes
**What goes wrong:** External links without `rel="noopener noreferrer"` and `target="_blank"`.
**How to avoid:** All external links (app URLs, social links) must have `target="_blank" rel="noopener noreferrer"`.

### Pitfall 4: Font Not Loading
**What goes wrong:** Inter font referenced in CSS theme but no `@font-face` or Google Fonts link.
**How to avoid:** Check if Inter is loaded. If not, add a `<link>` to Google Fonts in BaseLayout's `<head>`, or use Astro's built-in font optimization if available.
**Warning signs:** Text renders in system fallback font.

### Pitfall 5: LazyMotionProvider Blocking Layout
**What goes wrong:** Current `index.astro` has `LazyMotionProvider` wrapping a comment. Phase 2 sections should NOT go inside it.
**How to avoid:** Place all static sections directly in `<BaseLayout>`, keep `LazyMotionProvider` separate for Phase 3 animated islands.

## Code Examples

### BaseLayout SEO/OG Meta Tags
```astro
---
interface Props {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

const {
  title = "Frexes",
  description = "Building apps that actually help you get things done",
  url = "https://frexes.dev",
  image = "https://frexes.dev/og.png",
} = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />

    <link rel="canonical" href={url} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
    <title>{title}</title>
  </head>
  <body class="bg-background text-foreground font-sans antialiased">
    <slot />
  </body>
</html>
```

### AppCard with Conditional Linking
```astro
---
import type { App } from "../data/apps";
import StatusBadge from "./StatusBadge.astro";

interface Props {
  app: App;
}

const { app } = Astro.props;
const Tag = app.url ? "a" : "div";
const linkProps = app.url
  ? { href: app.url, target: "_blank", rel: "noopener noreferrer" }
  : {};
---
<Tag {...linkProps} class="group rounded-2xl border border-border bg-background p-6 transition-colors">
  <div class="flex items-start gap-4">
    <img src={app.icon} alt={`${app.name} icon`} width="48" height="48" class="rounded-xl" />
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-semibold font-heading">{app.name}</h3>
        <StatusBadge status={app.status} />
      </div>
      <p class="mt-1 text-sm text-muted-foreground">{app.tagline}</p>
    </div>
  </div>
</Tag>
```

### StatusBadge
```astro
---
import type { AppStatus } from "../data/apps";

interface Props {
  status: AppStatus;
}

const { status } = Astro.props;
const isLive = status === "live";
---
<span class:list={[
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  isLive ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800",
]}>
  {isLive ? "Live" : "Coming Soon"}
</span>
```

### Responsive Grid
```astro
<section class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    {apps.map((app) => <AppCard app={app} />)}
  </div>
</section>
```

### Inter Font Loading
```html
<!-- In BaseLayout <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `astro-seo` package | Hand-write meta tags | Fewer deps, full control, simpler for single page |
| `@astrojs/tailwind` | `@tailwindcss/vite` | Already set up in Phase 1; direct Vite plugin |
| CSS Modules for layout | Tailwind utility classes | Consistent with Phase 1 setup |
| `framer-motion` package | `motion` package (v12) | Already installed; Phase 3 will use it |

## Open Questions

1. **App icon SVGs**
   - What we know: `apps.ts` references `/icons/{id}.svg`, `public/icons/` dir doesn't exist
   - Recommendation: Create simple colored circle + initial letter placeholder SVGs. User can replace with real icons later.

2. **OG image**
   - What we know: No `og.png` exists. Domain frexes.dev not yet pointed.
   - Recommendation: Set the meta tag URL now (`https://frexes.dev/og.png`), create a simple placeholder or omit image tag until Phase 4. The URL will be correct once deployed.

3. **Inter font loading**
   - What we know: `global.css` declares `--font-sans: "Inter"` but no font load detected in BaseLayout.
   - Recommendation: Add Google Fonts `<link>` in BaseLayout `<head>`. Verify with browser devtools that Inter loads (not system fallback).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser testing (no automated test framework) |
| Config file | none |
| Quick run command | `bun dev` + browser inspect |
| Full suite command | `bun build` (validates no build errors) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HERO-01 | Hero shows "Frexes" + tagline | manual | `bun build` (build passes) | N/A |
| APPS-01 | 4 app cards in grid | manual | `bun build` | N/A |
| APPS-02 | Card shows icon, name, tagline, badge | manual | `bun build` | N/A |
| APPS-03 | Coming Soon badge on Voila/Karv | manual | `bun build` | N/A |
| APPS-04 | Links to energyxp.app, progres.ing | manual | `bun build` | N/A |
| ABOUT-01 | About section readable | manual | `bun build` | N/A |
| FOOT-01 | Footer with X + LinkedIn links | manual | `bun build` | N/A |
| TECH-01 | Responsive mobile/tablet/desktop | manual | `bun build` | N/A |
| TECH-02 | SEO + OG meta tags present | manual | `bun build` + view source | N/A |

### Sampling Rate
- **Per task commit:** `bun build` (zero build errors)
- **Per wave merge:** `bun build` + visual check at 375px / 768px / 1440px
- **Phase gate:** Build passes + all sections visible + OG tags in source

### Wave 0 Gaps
None -- no automated test infrastructure needed for static content phase. Build validation is sufficient.

## Sources

### Primary (HIGH confidence)
- Phase 1 codebase inspection -- `apps.ts`, `BaseLayout.astro`, `global.css`, `index.astro`
- Phase 1 research and summaries -- established patterns and decisions

### Secondary (MEDIUM confidence)
- [Astro imports/aliases docs](https://docs.astro.build/en/guides/imports/)
- [Astro SEO patterns](https://eastondev.com/blog/en/posts/dev/20251202-astro-seo-complete-guide/) -- OG tag structure
- [astro-seo package](https://github.com/jonasmerlin/astro-seo) -- reviewed, decided against for single-page

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new deps, all from Phase 1
- Architecture: HIGH -- standard Astro component composition
- Pitfalls: HIGH -- identified from codebase inspection (missing icons, font loading)

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (stable domain, no fast-moving deps)
