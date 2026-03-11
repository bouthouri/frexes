# Phase 3: Animation Layer - Research

**Researched:** 2026-03-11
**Domain:** CSS animations, Motion (Framer Motion) v12, GSAP 3.14, accessibility
**Confidence:** HIGH

## Summary

Phase 3 adds ambient animations and hover micro-interactions to the existing static Astro site. The foundation layer (Phase 1) already set up: `motion` v12 with `LazyMotion` + `domAnimation`, GSAP 3.14 with `matchMedia` scaffolding, and a `usePrefersReducedMotion` hook. The current `AppCard.astro` is a pure Astro component that must become a React island for Framer Motion interactivity.

Two distinct animation types are needed: (1) a hero ambient background using pure CSS `@keyframes` (no JS, zero bundle cost, always running), and (2) React-powered card animations using `motion/react`'s `m.div` with `whileHover` for hover lift+scale plus CSS ambient shimmer for always-on card effects. GSAP is available but unnecessary for these use cases -- CSS handles the ambient effects, Motion handles the interactive hover.

**Primary recommendation:** Use pure CSS animated gradient for hero background, convert AppCard to React island with `m.div` for hover interactions, and CSS keyframe shimmer for ambient card effects. Keep GSAP reserved for future complex animations.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HERO-02 | Ambient background animation (gradient mesh or subtle effect, always running, not scroll-triggered) | CSS `@keyframes` gradient animation on hero section, `background-size: 400% 400%` with position animation, 15s infinite loop. No JS needed. |
| APPS-05 | Hover micro-interaction on cards (lift + subtle scale via Framer Motion) | Convert AppCard to React `.tsx` island, use `m.div` with `whileHover={{ y: -4, scale: 1.02 }}` and spring transition |
| APPS-06 | Ambient card animations (shimmer, gradient shift, or icon animation -- always visible, not scroll-triggered) | CSS `@keyframes` shimmer/gradient-shift on card border or background, uses `accentColor` from app data, runs continuously |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.35.2 | React hover interactions (whileHover, animate) | Already in package.json, LazyMotion provider set up |
| gsap | ^3.14.2 | Reserved for complex timeline animations | Already installed, matchMedia scaffold ready. Not needed this phase. |
| tailwindcss | ^4.2.1 | Utility classes + CSS custom properties | Already driving all styles |

### Supporting (no new installs needed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/react | ^5.0.0 | React island hydration | Already configured, needed for AppCard React conversion |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS gradient animation | GSAP gradient animation | GSAP adds JS for something CSS does natively with zero cost |
| CSS card shimmer | Motion animate prop | Continuous CSS animation is more performant than JS-driven for always-on effects |
| m.div whileHover | CSS :hover + transition | CSS can do lift+scale but loses spring physics and Motion ecosystem consistency |

**Installation:** None needed -- all deps already installed.

## Architecture Patterns

### File Changes
```
src/
├── components/
│   ├── Hero.astro              # ADD: ambient gradient background div + CSS animation
│   ├── AppCard.astro           # CONVERT to AppCard.tsx (React island)
│   ├── AppCard.tsx             # NEW: m.div with whileHover + CSS ambient shimmer
│   ├── AppsGrid.astro          # UPDATE: render AppCard as React island with client:visible
│   └── motion/
│       └── LazyMotionProvider.tsx  # EXISTS: wraps m components
├── styles/
│   └── global.css              # ADD: @keyframes for gradient + shimmer
└── pages/
    └── index.astro             # MAYBE: move LazyMotionProvider wrapping
```

### Pattern 1: CSS Ambient Gradient (Hero Background)
**What:** Pure CSS `@keyframes` animating `background-position` on a gradient
**When to use:** Always-running ambient background effects with no interaction
**Example:**
```css
/* In global.css or Hero.astro <style> */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-gradient {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero-gradient {
    animation: none;
    background-position: 0% 50%;
  }
}
```
**Key details:** Use muted/brand-aligned colors, large background-size for smooth movement, 12-20s duration for subtle feel. The gradient sits as an absolute-positioned div behind hero content with low opacity or as a blurred overlay.

### Pattern 2: React Island AppCard with m.div
**What:** Convert Astro component to React for Motion interactivity
**When to use:** Components needing JS-driven hover/tap interactions
**Example:**
```tsx
// AppCard.tsx
import { m } from "motion/react";
import type { App } from "../data/apps";

export function AppCard({ app }: { app: App }) {
  const Tag = app.url ? "a" : "div";
  const linkProps = app.url
    ? { href: app.url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <m.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="app-card rounded-2xl border border-border bg-background p-6 relative overflow-hidden"
    >
      <Tag {...linkProps} className="flex items-start gap-4">
        {/* card content */}
      </Tag>
    </m.div>
  );
}
```

### Pattern 3: CSS Ambient Card Shimmer
**What:** Subtle always-on shimmer/gradient-shift on card backgrounds
**When to use:** Ambient visual life without user interaction
**Example:**
```css
@keyframes card-shimmer {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.08; }
}

.app-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--card-accent) 0%, transparent 60%);
  animation: card-shimmer 4s ease-in-out infinite;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .app-card::before {
    animation: none;
    opacity: 0.05;
  }
}
```
**Key detail:** Use each app's `accentColor` as a CSS variable (`--card-accent`) to give each card a unique ambient glow.

### Pattern 4: LazyMotion Island Wrapping
**What:** Wrap AppCards in LazyMotionProvider for m.div to work
**When to use:** Any component using `m.*` instead of `motion.*`
**Implementation options:**
- Option A: Wrap each AppCard individually (simpler but more providers)
- Option B: Create an `AppsGrid.tsx` React component that wraps all cards in one LazyMotionProvider
- **Recommended: Option B** -- single provider, single island, cleaner

### Anti-Patterns to Avoid
- **JS-driven continuous animations:** Don't use Motion's `animate` prop for always-on effects -- CSS `@keyframes` is GPU-accelerated and zero JS cost
- **client:load for below-fold:** Use `client:visible` for the apps grid since it's below the hero fold
- **Animating layout properties:** Don't animate `width`, `height`, `margin` -- stick to `transform` and `opacity`
- **scroll-triggered anything:** User explicitly forbids scroll-triggered show/hide animations

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Hover spring physics | Manual JS spring math | `m.div whileHover` with spring transition | Motion handles interrupted animations, spring math, RAF batching |
| Reduced motion detection | Custom JS media query listener | CSS `@media (prefers-reduced-motion)` for CSS anims, `usePrefersReducedMotion` hook for React | Already built in Phase 1, battle-tested |
| GPU-accelerated ambient loops | JS requestAnimationFrame loop | CSS `@keyframes` with `transform`/`opacity` | Browser compositor handles it, zero main thread cost |

## Common Pitfalls

### Pitfall 1: Astro to React Conversion Breaks Styling
**What goes wrong:** Converting `.astro` to `.tsx` loses Tailwind scoped styles
**Why it happens:** Astro `<style>` blocks are scoped; React components use className strings
**How to avoid:** Use Tailwind utility classes in className (already the pattern), not Astro `<style>` blocks
**Warning signs:** Styles missing after conversion

### Pitfall 2: m.div Without LazyMotionProvider
**What goes wrong:** Runtime error -- `m` components require LazyMotion ancestor
**Why it happens:** `m.div` is the tree-shakeable version that needs feature injection
**How to avoid:** Ensure `<LazyMotionProvider>` wraps any component using `m.*`. Use AppsGrid.tsx as single React island with provider.
**Warning signs:** Console error about missing motion features

### Pitfall 3: CSS Animation Performance on Mobile
**What goes wrong:** Gradient animation causes jank on low-end mobile
**Why it happens:** Animating `background-position` doesn't always get composited
**How to avoid:** Keep gradient animation subtle (large background-size = slow movement), use `will-change: background-position` sparingly, test on mobile. Alternative: use `transform: translateX()` on a pseudo-element instead.
**Warning signs:** Dropped frames on mobile Safari

### Pitfall 4: Hydration Mismatch in Astro Islands
**What goes wrong:** Server HTML doesn't match client React render
**Why it happens:** Motion's `m.div` renders extra attributes on hydration
**How to avoid:** Use `client:visible` (not SSR'd) or `client:only="react"` to skip SSR entirely for animated components
**Warning signs:** Console hydration warnings

### Pitfall 5: prefers-reduced-motion Gaps
**What goes wrong:** Some animations still run with reduced motion enabled
**Why it happens:** Forgot to add media query for one animation type
**How to avoid:** CSS animations use `@media (prefers-reduced-motion: reduce)` to set `animation: none`. React components check `usePrefersReducedMotion()` to skip whileHover.
**Warning signs:** Enable reduce motion in System Settings and verify ALL animations stop

## Code Examples

### Hero Ambient Background (CSS-only)
```html
<!-- Hero.astro -->
<section class="relative overflow-hidden py-24 sm:py-32 lg:py-40 px-4 sm:px-6">
  <div class="hero-gradient absolute inset-0 -z-10 opacity-20 blur-3xl" aria-hidden="true"></div>
  <div class="flex flex-col items-center text-center max-w-4xl mx-auto relative">
    <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight">Frexes</h1>
    <p class="text-lg sm:text-xl text-muted-foreground mt-4 sm:mt-6 max-w-2xl">
      Building apps that actually help you get things done
    </p>
  </div>
</section>
```

### AppCard React Island with Hover + Ambient
```tsx
// AppCard.tsx
import { m } from "motion/react";
import { usePrefersReducedMotion } from "../lib/motion";
import type { App } from "../data/apps";

interface Props {
  app: App;
}

export function AppCard({ app }: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const Tag = app.url ? "a" : "div";
  const linkProps = app.url
    ? { href: app.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <m.div
      whileHover={prefersReduced ? undefined : { y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="app-card rounded-2xl border border-border bg-background p-6 relative overflow-hidden"
      style={{ "--card-accent": app.accentColor } as React.CSSProperties}
    >
      <Tag {...linkProps} className="flex items-start gap-4">
        <img src={app.icon} alt={`${app.name} icon`} width={48} height={48} className="rounded-xl" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{app.name}</h3>
            {/* StatusBadge inline or as React component */}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{app.tagline}</p>
        </div>
      </Tag>
    </m.div>
  );
}
```

### AppsGrid as Single React Island
```tsx
// AppsGrid.tsx
import { LazyMotionProvider } from "./motion/LazyMotionProvider";
import { AppCard } from "./AppCard";
import type { App } from "../data/apps";

export function AppsGrid({ apps }: { apps: App[] }) {
  return (
    <LazyMotionProvider>
      <section id="apps" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold sm:text-3xl">
          What I'm Building
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {apps.map((app) => <AppCard key={app.id} app={app} />)}
        </div>
      </section>
    </LazyMotionProvider>
  );
}
```

```astro
<!-- In index.astro -->
<AppsGrid apps={apps} client:visible />
```

### Global CSS Animations
```css
/* global.css additions */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes card-shimmer {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.08; }
}

.hero-gradient {
  background: linear-gradient(-45deg, #6366f1, #ec4899, #22c55e, #f59e0b);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

.app-card {
  position: relative;
  overflow: hidden;
}

.app-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--card-accent, #6366f1) 0%, transparent 60%);
  animation: card-shimmer 4s ease-in-out infinite;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .hero-gradient { animation: none; }
  .app-card::before { animation: none; opacity: 0.05; }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package (v12) | Feb 2025 | Import from `motion/react`, same API |
| `motion.div` everywhere | `m.div` + LazyMotion | motion v10+ | 34KB -> 4.6KB bundle |
| JS gradient animation | CSS @property + @keyframes | 2024-2025 | Zero JS, GPU composited |
| ScrollTrigger reveal | Ambient always-on animation | Project decision | No scroll-triggered show/hide |

## Open Questions

1. **StatusBadge conversion**
   - What we know: Currently `StatusBadge.astro`, needs to work inside React AppCard
   - What's unclear: Convert to React component or inline the badge JSX?
   - Recommendation: Inline the badge logic in AppCard.tsx -- it's simple enough (just a span with conditional text/color)

2. **Hero gradient color palette**
   - What we know: App accent colors are `#6366f1`, `#22c55e`, `#f59e0b`, `#ec4899`
   - What's unclear: Should the gradient use these exact colors or more muted/brand tones?
   - Recommendation: Use the app accent colors at low opacity (15-25%) for brand cohesion

3. **LazyMotionProvider placement**
   - What we know: Currently empty in index.astro, needs to wrap m.div components
   - What's unclear: Keep in index.astro or move into AppsGrid.tsx?
   - Recommendation: Move into AppsGrid.tsx as self-contained React island (Pattern 4, Option B)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser testing (no automated test framework configured) |
| Config file | none |
| Quick run command | `bun run build && bun run preview` |
| Full suite command | `bun run build` (build success = no type errors) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HERO-02 | Hero has visible ambient gradient animation on load | manual | Open browser, verify gradient animates | N/A |
| APPS-05 | App cards lift+scale on hover | manual | Hover each card in browser, verify transform | N/A |
| APPS-06 | App cards have ambient shimmer without interaction | manual | Open browser, verify card shimmer runs | N/A |
| A11Y | All animations stop with prefers-reduced-motion | manual | Toggle System Settings > Accessibility > Reduce Motion, reload page | N/A |

### Sampling Rate
- **Per task commit:** `bun run build` (catches type errors and import issues)
- **Per wave merge:** `bun run build && bun run preview` + manual visual check
- **Phase gate:** Build green + all 4 manual checks pass

### Wave 0 Gaps
- No automated visual regression testing -- acceptable for a 4-page portfolio
- Manual testing protocol is sufficient given small surface area

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/lib/motion.ts`, `src/lib/gsap-init.ts`, `src/components/motion/LazyMotionProvider.tsx`
- [Motion for React docs](https://motion.dev/docs/react) - m.div, LazyMotion, whileHover API
- [Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide) - v12 migration, import paths

### Secondary (MEDIUM confidence)
- [GSAP matchMedia docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) - prefers-reduced-motion pattern
- [CSS Gradient Animation techniques](https://blenderdeluxe.com/en/css-tutorials/how-to-create-an-animated-gradient-background-with-pure-css-in-2025-863) - background-size animation pattern
- [Astro Islands architecture](https://docs.astro.build/en/concepts/islands/) - client directives, hydration strategies

### Tertiary (LOW confidence)
- None -- all patterns verified against official sources or existing codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libs already installed and configured in Phase 1
- Architecture: HIGH - patterns follow established Astro island + Motion conventions
- Pitfalls: HIGH - common issues well-documented, existing codebase patterns inform solutions

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (stable libraries, no fast-moving concerns)
