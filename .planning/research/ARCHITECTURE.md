# Architecture Research

**Domain:** Indie app maker portfolio / single-page showcase site (Astro)
**Researched:** 2026-03-11
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Astro Build Layer                         │
│  .astro pages compile to static HTML + minimal JS bundles       │
├─────────────────────────────────────────────────────────────────┤
│                        Page Layer (src/pages/)                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     index.astro (single page)             │  │
│  └───────────────────────────────┬───────────────────────────┘  │
├──────────────────────────────────┼──────────────────────────────┤
│                        Section Layer (src/components/sections/)  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Hero    │  │ AppsGrid │  │  About   │  │  Footer  │        │
│  │ .astro   │  │ .astro   │  │ .astro   │  │ .astro   │        │
│  └────┬─────┘  └────┬─────┘  └──────────┘  └──────────┘        │
├───────┼─────────────┼────────────────────────────────────────────┤
│       │             │   UI / Island Layer                        │
│  ┌────▼──────┐  ┌───▼──────────┐  ┌──────────────────────┐     │
│  │ HeroAnim  │  │   AppCard    │  │   shadcn/ui prims     │     │
│  │ (React +  │  │  (React +    │  │  Badge, Button, etc.  │     │
│  │  GSAP)    │  │  FM hover)   │  │                       │     │
│  └───────────┘  └──────────────┘  └──────────────────────┘     │
├─────────────────────────────────────────────────────────────────┤
│                        Asset / Data Layer                        │
│  ┌─────────────┐  ┌───────────────┐  ┌──────────────────┐      │
│  │ public/     │  │ src/data/     │  │ src/assets/      │      │
│  │ (favicons,  │  │ apps.ts       │  │ (SVGs, icons)    │      │
│  │  OG images) │  │ (app records) │  │                  │      │
│  └─────────────┘  └───────────────┘  └──────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `index.astro` | Single page root, assembles all sections, sets head/SEO | Astro page file, static HTML shell |
| `BaseLayout.astro` | HTML shell, meta tags, OG tags, font loading, global styles | Astro layout component |
| `sections/Hero.astro` | Headline, tagline, brand positioning above fold | Astro + React island for animations |
| `sections/AppsGrid.astro` | Grid of AppCard components, section heading | Astro, maps over `src/data/apps.ts` |
| `sections/About.astro` | Maker identity, philosophy | Astro, mostly static copy |
| `sections/Footer.astro` | Social links (X, LinkedIn), copyright | Astro, static |
| `ui/AppCard.tsx` | Single app entry: icon, name, one-liner, status badge, link | React island (FM hover micro-interaction) |
| `ui/HeroAnimation.tsx` | SVG/scroll entrance animation above fold | React island (GSAP ScrollTrigger) |
| `src/data/apps.ts` | Static array of app records (name, desc, url, status, icon) | TypeScript const, no runtime dependency |
| `src/assets/` | App icons, SVG decorations | Astro Image optimized at build |

## Recommended Project Structure

```
src/
├── pages/
│   └── index.astro          # Only page (v1 single-page)
├── layouts/
│   └── BaseLayout.astro     # HTML shell, <head>, SEO meta, OG
├── components/
│   ├── sections/
│   │   ├── Hero.astro        # Above-fold hero section
│   │   ├── AppsGrid.astro    # App showcase grid
│   │   ├── About.astro       # Maker bio/philosophy
│   │   └── Footer.astro      # Links, copyright
│   ├── ui/
│   │   ├── AppCard.tsx       # React island — interactive card
│   │   ├── StatusBadge.tsx   # "Live" / "Coming Soon" badge
│   │   └── HeroAnimation.tsx # React island — GSAP hero anim
│   └── shared/
│       └── SectionHeading.astro  # Reusable section title
├── data/
│   └── apps.ts              # Static app records (source of truth)
├── assets/
│   ├── icons/               # App icons (PNG/SVG, Astro-optimized)
│   └── svg/                 # Decorative SVGs for animations
└── styles/
    └── global.css           # Tailwind base, CSS custom properties
public/
├── favicon.svg
└── og-image.png             # Open Graph preview image
astro.config.mjs
tailwind.config.mjs
components.json              # shadcn/ui config
```

### Structure Rationale

- **`src/pages/`:** File-based routing. Single `index.astro` for v1; adding `apps/[slug].astro` later is the natural v2 expansion path.
- **`src/layouts/`:** Separates head/SEO concerns from section composition. `BaseLayout` is the one place `<title>`, OG tags, and font links live.
- **`src/components/sections/`:** Each page section is its own file. Sections are `.astro` (no JS overhead); only inner interactive parts become React islands.
- **`src/components/ui/`:** React TSX files — the only files that ship client JS. Kept isolated so hydration cost is explicit and auditable.
- **`src/data/apps.ts`:** All app metadata in one typed file. Sections import from here; changing an app description is a one-file edit with no template hunting.
- **`src/assets/`:** Astro's `<Image>` component optimizes these at build time (WebP/AVIF, responsive sizes, lazy load). Do not put in `public/` or you lose optimization.

## Architectural Patterns

### Pattern 1: Islands for Interactivity Only

**What:** Sections are `.astro` (zero JS), interactive subcomponents are React `.tsx` with `client:visible` or `client:idle`.
**When to use:** Every component decision. Default to `.astro`; only reach for React when animation or event handling is needed.
**Trade-offs:** Minimal JS bundle; slight mental overhead of knowing which files are islands. Worth it for Lighthouse scores.

**Example:**
```astro
<!-- AppsGrid.astro — zero JS, maps data, renders islands -->
---
import { apps } from '../data/apps';
import AppCard from '../ui/AppCard';
---
<section>
  {apps.map(app => (
    <AppCard client:visible app={app} />
  ))}
</section>
```

### Pattern 2: Static Data File as Source of Truth

**What:** All app metadata lives in `src/data/apps.ts` as a typed array. No CMS, no API. Sections and components import from it.
**When to use:** Any time a section needs app data. Never hardcode in components.
**Trade-offs:** Adding a new app = one file edit. Downside: requires a redeploy (acceptable for static site).

**Example:**
```typescript
// src/data/apps.ts
export type AppStatus = 'live' | 'coming-soon';

export interface App {
  name: string;
  description: string;
  url?: string;
  status: AppStatus;
  icon: ImageMetadata;
}

export const apps: App[] = [
  { name: 'Energy XP', description: 'Task & energy management', url: 'https://energyxp.app', status: 'live', icon: energyXpIcon },
  { name: 'Progres', description: 'Goal tracking', url: 'https://progres.ing', status: 'live', icon: progresIcon },
  { name: 'Voila', description: 'Behavior tracking & AI analysis', status: 'coming-soon', icon: voilaIcon },
  { name: 'Karv', description: 'Habit tracking', status: 'coming-soon', icon: karvIcon },
];
```

### Pattern 3: Dual Animation Responsibility Split

**What:** Framer Motion handles declarative React component animations (hover states, entrance fades, card lifts). GSAP handles SVG timelines and scroll-driven sequences that need precise frame control.
**When to use:** FM for anything that maps to React component lifecycle; GSAP for anything requiring a timeline, ScrollTrigger, or SVG path manipulation.
**Trade-offs:** Two animation libraries adds ~30KB total. Justified because they solve different problems; using only one would either limit SVG capability (FM-only) or hurt React DX (GSAP-only).

**Example:**
```tsx
// AppCard.tsx — Framer Motion hover
import { motion } from 'framer-motion';

export function AppCard({ app }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* card content */}
    </motion.div>
  );
}

// HeroAnimation.tsx — GSAP scroll
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function HeroAnimation() {
  useGSAP(() => {
    gsap.from('.hero-svg path', {
      drawSVG: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: 'power2.out',
    });
  });
  return <svg className="hero-svg">...</svg>;
}
```

## Data Flow

### Build-Time Flow (Static Generation)

```
src/data/apps.ts  (source of truth)
    ↓ import
sections/AppsGrid.astro
    ↓ passes props
ui/AppCard.tsx (React island)
    ↓ Astro builds
Static HTML + minimal React bundle
    ↓ deploy
frexes.dev (static CDN)
```

### Runtime Interaction Flow

```
User scrolls into viewport
    ↓ IntersectionObserver (client:visible)
AppCard island hydrates
    ↓ React mounts
Framer Motion activates hover listeners
    ↓ user hovers
Card lifts (y: -4, shadow)
    ↓
No server involved — pure client animation
```

### Key Data Flows

1. **App data propagation:** `apps.ts` → imported by `AppsGrid.astro` → passed as props to `AppCard.tsx` island → rendered as HTML at build, hydrated for interaction at runtime.
2. **SEO metadata:** `BaseLayout.astro` receives page-level props (title, description, OG image path) → renders `<head>` with all meta tags → static in final HTML (crawler-friendly).
3. **Animation triggers:** GSAP ScrollTrigger reads DOM positions after hydration → drives SVG/hero sequences. Framer Motion responds to React synthetic events (hover, tap). Neither flow touches data or server.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| v1 — single page | Current architecture. Zero backend. Static deploy to Cloudflare Pages or Vercel. |
| v2 — per-app pages | Add `src/pages/apps/[slug].astro` dynamic route. `apps.ts` drives slug generation via `getStaticPaths()`. No backend needed. |
| v3 — blog/updates | Add Astro Content Collections (`src/content/posts/`). Still static. MDX for rich posts. |
| If CMS needed | Astro integrates with Contentful/Sanity via build-time fetch. `apps.ts` replaced by CMS query in `getStaticPaths`. Zero architectural change to components. |

### Scaling Priorities

1. **First expansion:** Per-app detail pages (v2). `apps.ts` already structures data for this — add `slug` field and `getStaticPaths()` to unlock.
2. **Second expansion:** Content Collections for blog. Entirely additive — no existing code changes needed.

## Anti-Patterns

### Anti-Pattern 1: React for Static Sections

**What people do:** Write all sections as React components (`HeroSection.tsx`, `Footer.tsx`) because they're familiar with React.
**Why it's wrong:** Every React component ships a JS bundle. A static footer doesn't need React. Lighthouse score suffers, defeating the reason to use Astro.
**Do this instead:** Write sections as `.astro` files. Only reach for `.tsx` when the component has hover/click/animation state.

### Anti-Pattern 2: Hardcoding App Data in Components

**What people do:** Inline app names, descriptions, and URLs directly in `AppsGrid.astro` or `AppCard.tsx`.
**Why it's wrong:** Adding Karv v2 or changing Voila's status to "live" requires hunting through component markup. Brittle and error-prone.
**Do this instead:** All app data lives exclusively in `src/data/apps.ts`. Components receive typed props. One-file changes propagate everywhere.

### Anti-Pattern 3: Putting Optimizable Images in `public/`

**What people do:** Drop app icons in `public/icons/` and reference with `<img src="/icons/energyxp.png">`.
**Why it's wrong:** Bypasses Astro's `<Image>` optimization — no WebP conversion, no responsive sizes, no lazy loading. App icons are a visible perf hit above the fold.
**Do this instead:** Import icons from `src/assets/icons/` and use Astro's `<Image>` component. Astro generates optimized variants at build time.

### Anti-Pattern 4: GSAP Without Cleanup

**What people do:** Register GSAP ScrollTriggers inside `useEffect` without cleanup in React islands.
**Why it's wrong:** On Astro View Transitions (page navigation), islands can remount and ScrollTriggers stack, causing duplicate animations and memory leaks.
**Do this instead:** Use `@gsap/react`'s `useGSAP` hook — it automatically handles cleanup on unmount. Always call `ScrollTrigger.refresh()` after layout shifts.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| energyxp.app / progres.ing | Static `<a href>` links in AppCard | No API needed; just external links |
| Cloudflare Pages / Vercel | `astro build` output → deploy `dist/` | Zero config for static Astro |
| Google Fonts / local fonts | Load in `BaseLayout.astro` `<head>` | Use `font-display: swap`; subset if variable font |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `apps.ts` → sections | Direct TypeScript import | No prop drilling through layouts |
| `.astro` sections → React islands | Props via Astro component syntax | Serialized at build; must be JSON-serializable |
| GSAP ↔ Framer Motion | None — completely independent | They operate on different DOM elements; no shared state |
| BaseLayout ↔ pages | Slot pattern (`<slot />`) | Page content flows into layout via Astro slots |

## Sources

- [Astro Islands Architecture — Official Docs](https://docs.astro.build/en/concepts/islands/)
- [Astro Front-end Frameworks Guide](https://docs.astro.build/en/guides/framework-components/)
- [2025 Astro + shadcn + Framer Motion starter](https://github.com/mwarf/2025-astro-starter)
- [GSAP vs Framer Motion: when to use each](https://medium.com/@toukir.ahamed.pigeon/interactive-ui-animations-with-gsap-framer-motion-f2765ae8a051)
- [Astro in 2026: Performance, Features and Cloudflare Acquisition](https://sitepins.com/blog/astro-sitepins-2026)

---
*Architecture research for: Indie app maker portfolio (Astro + shadcn/ui + Framer Motion + GSAP)*
*Researched: 2026-03-11*
