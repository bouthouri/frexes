# Stack Research

**Domain:** Indie portfolio / app showcase — static website
**Researched:** 2026-03-11
**Confidence:** HIGH (versions verified via npm, official docs, and changelogs)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | 5.18.0 (stable) | Static site framework | Ships zero JS by default; islands architecture lets you add React exactly where needed (Framer Motion components) without paying SSR overhead across the full page. Correct choice for a content-first portfolio. |
| React | 19.x (via @astrojs/react) | JS runtime for interactive islands | Required for Framer Motion. Astro's React integration hydrates only opted-in components (`client:visible`), keeping the JS bundle minimal. |
| Tailwind CSS | 4.x (stable as of Jan 2025) | Utility-first styling | v4 ships CSS-first config, zero-JS, automatic content detection. 5x faster full builds, 100x faster incremental. No `tailwind.config.js` needed — configure directly in CSS. |
| shadcn/ui | latest (Feb 2026 supports Tailwind v4) | Copy-paste UI primitives | Updated for Tailwind v4 + React 19. Use `new-york` style (default going forward). Components are owned code — copy in, customize without framework lock-in. OKLCH colors by default. |
| TypeScript | 5.x | Type safety | Astro has first-class TS support; tsconfig auto-configured on project init. Non-negotiable for maintainability. |

### Animation Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| motion (formerly framer-motion) | 12.x (12.35.2 current) | React component animations | Use for all React island animations: entrance transitions, hover micro-interactions, AnimatePresence for exit animations. Import from `motion/react`. |
| framer-motion | 12.x | Legacy alias | Identical API to `motion`. Only use if you already have it. New projects: use `motion` package directly. |
| gsap | 3.14.2 | Timeline-based JS animations | Use for SVG animations, scroll-triggered reveals (ScrollTrigger), and anything requiring precise sequencing that Framer Motion can't express declaratively. All plugins including ScrollTrigger, SplitText, MorphSVG are now free. |
| @gsap/react | 2.1.2 | GSAP React hook | Provides `useGSAP()` hook for safe GSAP usage inside React components. Handles cleanup automatically. Use whenever GSAP runs inside a React island. |

### Infrastructure & Tooling

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| Bun | latest | Package manager + runtime | Workspace convention. `bun install`, `bun run dev`. Astro supports Bun natively. |
| Vercel | N/A | Hosting | Static Astro sites deploy to Vercel with zero adapter config — just `vercel` CLI or Git push. No `@astrojs/vercel` adapter needed for static-only. |
| @astrojs/react | latest | React integration | Installed via `bunx astro add react`. Enables React component hydration with client directives. |
| @astrojs/tailwind | deprecated | Tailwind integration | Tailwind v4 integrates via `@tailwindcss/vite` Vite plugin directly, not the Astro-specific package. |

## Installation

```bash
# Create Astro project
bunx create-astro@latest frexes -- --template minimal --typescript strict

# Add React integration
bunx astro add react

# Tailwind CSS v4 (via Vite plugin, not the old Astro adapter)
bun add tailwindcss @tailwindcss/vite

# shadcn/ui
bunx shadcn@latest init

# Motion (Framer Motion v12)
bun add motion

# GSAP (all plugins free)
bun add gsap @gsap/react
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro | Next.js | Only if you need SSR, API routes, or server components. Portfolio is static — Next.js adds unnecessary complexity and larger JS bundles. |
| Astro | Vite + React (SPA) | Only for highly interactive apps. Static portfolio loses SEO and performance benefits of MPA approach. |
| motion (npm) | framer-motion (npm) | Never for new projects — `motion` is the rebranded canonical package. APIs are identical; `framer-motion` is a re-export. |
| Tailwind v4 | Tailwind v3 | Use v3 only if forced by existing shadcn@2.3.0 workflows. All new projects should use v4. |
| Vercel (static) | Cloudflare Pages | Either works for static Astro. Vercel has better Astro DX and zero config. Use Cloudflare if you want edge functions later. |
| GSAP ScrollTrigger | Intersection Observer API | Only for simple fade-ins. Any scroll-sequenced animation with timing control needs ScrollTrigger. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@astrojs/tailwind` adapter | Deprecated for Tailwind v4 — the Vite plugin (`@tailwindcss/vite`) is the correct integration path. Old adapter targets v3. | `@tailwindcss/vite` Vite plugin |
| CSS Modules | Redundant when Tailwind v4 is present. Adds cognitive overhead with no benefit for this project size. | Tailwind utility classes |
| Framer Motion `<AnimatePresence>` in `.astro` files | Astro components are not React — Framer Motion's React API only works inside `.tsx` islands. Using it in `.astro` will silently fail or throw. | Wrap animated components in `.tsx` island files with `client:visible` |
| GSAP inside `.astro` `<script>` tags without DOMContentLoaded guard | Elements may not exist at script execution time in Astro's MPA model. ScrollTrigger especially breaks on page re-entry with View Transitions. | Wrap in `document.addEventListener('astro:page-load', ...)` for View Transitions compatibility |
| View Transitions API + GSAP ScrollTrigger (naively) | ScrollTrigger instances persist across route changes, causing ghost triggers. Requires explicit `ScrollTrigger.kill()` on `astro:before-swap`. Known issue in Astro community. | Kill/revert ScrollTrigger on `astro:before-swap`, re-init on `astro:page-load` |
| React for non-interactive content | Every React island ships React runtime (~50KB gzipped). Static text, cards, and layout should be `.astro` components. | `.astro` components for static content |
| CSS animations for GSAP's use cases | CSS keyframes lack ScrollTrigger integration and timeline control. | GSAP for any scroll or timeline animation |

## Stack Patterns by Variant

**For React-based interactive components (cards, hover states, modals):**
- Use `.tsx` file with `motion` from `motion/react`
- Add `client:visible` directive in `.astro` parent to lazy-hydrate
- Keep animation props in `initial/animate/whileHover` declaratively

**For SVG scroll animations and reveal sequences:**
- Use GSAP in a `<script>` tag or `.ts` utility file
- Register `ScrollTrigger` plugin: `gsap.registerPlugin(ScrollTrigger)`
- Target elements with `document.querySelector` after `astro:page-load`

**For shadcn/ui components:**
- Run `bunx shadcn@latest add [component]` to copy into `src/components/ui/`
- Components are React — they live in `.tsx` islands with appropriate `client:` directive
- Static shadcn components (just styling, no JS) can be converted to `.astro` equivalents manually

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| astro@5.18.0 | @astrojs/react@latest, tailwindcss@4.x | Astro 5 is current stable. Astro 6 is in beta (Jan 2026) — do NOT use for production yet. |
| tailwindcss@4.x | shadcn@latest | shadcn added Tailwind v4 support Feb 2026. New projects init with v4 by default. |
| motion@12.x | react@19, @astrojs/react@latest | Tested against React 19. Import from `motion/react`, not `framer-motion`. |
| gsap@3.14.2 | @gsap/react@2.1.2 | These versions are released together; keep them in sync. |
| shadcn@latest | tailwindcss@4.x, react@19 | Uses `new-york` style and OKLCH colors by default as of Feb 2026. |

## Sources

- [astro - npm](https://www.npmjs.com/package/astro?activeTab=versions) — verified v5.18.0 as current stable (HIGH confidence)
- [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — stable release Jan 22 2025 (HIGH confidence)
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — Feb 2026 Tailwind v4 + React 19 support (HIGH confidence)
- [shadcn/ui Astro installation](https://ui.shadcn.com/docs/installation/astro) — official integration guide (HIGH confidence)
- [motion changelog](https://motion.dev/changelog) — v12.35.2 current, rebranded from framer-motion (HIGH confidence)
- [gsap - npm](https://www.npmjs.com/package/gsap) — v3.14.2, 2.77M weekly downloads, all plugins free (HIGH confidence)
- [@gsap/react - npm](https://www.npmjs.com/package/@gsap/react) — v2.1.2, useGSAP() hook (HIGH confidence)
- [Astro deploy to Vercel docs](https://docs.astro.build/en/guides/deploy/vercel/) — static Astro needs no adapter (HIGH confidence)
- [GSAP + Astro View Transitions known issue](https://gsap.com/community/forums/topic/40950-compatibility-with-gsap-scrolltrigger-astro-view-transitiosn-api/) — ScrollTrigger cleanup required (MEDIUM confidence — community forum)
- [Framer Motion + Astro islands pattern](https://thevalleyofcode.com/adding-react-framer-motion-animations-to-an-astro-site/) — client:visible pattern verified (MEDIUM confidence)

---
*Stack research for: Frexes — indie app portfolio website*
*Researched: 2026-03-11*
