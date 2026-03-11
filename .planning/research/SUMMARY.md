# Project Research Summary

**Project:** Frexes — Indie App Maker Portfolio Website
**Domain:** Static portfolio / app showcase site
**Researched:** 2026-03-11
**Confidence:** HIGH

## Executive Summary

Frexes is a single-page static portfolio showcasing 4 indie apps (Energy XP, Progres, Voila, Karv). The established approach for this type of site is Astro with islands architecture: ship zero JS for static content, hydrate only interactive components as React islands. This keeps Lighthouse scores at 95+ while enabling premium animations via Framer Motion (hover micro-interactions) and GSAP (scroll-triggered reveals, SVG sequences). The stack is well-documented and all versions are stable as of March 2026.

The recommended approach is a single `index.astro` page composed of section-level `.astro` files (Hero, AppsGrid, About, Footer) with React `.tsx` islands only where animation or interactivity is needed. App data lives in a single typed `src/data/apps.ts` file. This separates static content from interactive components cleanly, makes adding/updating apps trivial, and keeps the JS surface auditable. Deploy to Vercel with zero adapter config.

The primary risk is performance regression from naively adding animation libraries. Framer Motion without `LazyMotion` can drop Lighthouse from 95+ to 62. GSAP ScrollTrigger leaks across View Transitions without explicit cleanup. Both are avoidable with rules established at project setup, not after. The secondary risk is over-animating — a portfolio must build trust, not demonstrate animation capability.

## Key Findings

### Recommended Stack

Astro 5.x with the `@tailwindcss/vite` plugin (not the deprecated Astro adapter) is the correct foundation. Tailwind v4 requires no `tailwind.config.js` — CSS-first configuration. shadcn/ui as of Feb 2026 supports Tailwind v4 and React 19; use `new-york` style with OKLCH colors. Motion (formerly framer-motion) v12 is the canonical package — import from `motion/react`, not `framer-motion`. GSAP v3.14.2 with `@gsap/react` v2.1.2 covers scroll and SVG animations; all plugins including ScrollTrigger are now free.

**Core technologies:**
- **Astro 5.18.0**: Static site framework — islands architecture, zero JS by default, file-based routing
- **Tailwind CSS v4**: Utility-first styling — CSS-first config via Vite plugin, 5x faster builds than v3
- **shadcn/ui (latest)**: Copy-paste UI primitives — Tailwind v4 + React 19 compatible, OKLCH colors
- **motion v12**: React component animations — `LazyMotion + m` for minimal bundle (4.6 KB vs 34 KB)
- **GSAP 3.14.2 + @gsap/react**: Scroll and SVG animations — ScrollTrigger, timeline control, `useGSAP` hook for cleanup
- **Bun**: Package manager and runtime — workspace convention, native Astro support
- **Vercel**: Hosting — zero adapter config for static Astro, Git push deploy

### Expected Features

**Must have (table stakes):**
- Hero / identity statement — who you are and what you build, above fold
- App showcase grid — 4 cards (icon, name, one-liner, status badge, store link)
- App Store / Play Store links — for Energy XP and Progres (live apps only)
- Status badges (Live / Coming Soon) — Voila and Karv are in development
- About section — brief, confident, first-person, philosophy focus
- Footer with social links — X (@bouthouri101) and LinkedIn
- Responsive layout — mobile-first, tested at 375px (iPhone SE) and iPad
- SEO basics — title, meta description, OG tags, favicon
- Entrance animations — stagger on app grid, subtle hero reveal

**Should have (competitive):**
- Hover micro-interactions on app cards — lift/scale/shadow via Framer Motion
- Scroll-triggered entrance animations — GSAP ScrollTrigger on grid and about section
- Animated SVG accent element — tasteful, hero or background, GSAP timeline
- Consistent Vercel-inspired design language — sharp type, generous whitespace

**Defer (v2+):**
- Individual app detail pages — when apps need more than a card
- Dark mode — after light aesthetic is fully stable
- Blog / build-in-public updates — after consistent writing habit established
- App ecosystem stats (downloads, ratings) — build-in-public narrative

### Architecture Approach

Single-page architecture with a strict island rule: sections are `.astro` (zero JS overhead), interactive subcomponents are React `.tsx` islands with `client:visible`. All app metadata lives in `src/data/apps.ts` as a typed array — the single source of truth. Framer Motion handles declarative React component animations; GSAP handles scroll sequences and SVG timelines. The two animation libraries operate on different DOM elements and never share state. v2 expansion to per-app detail pages is pre-designed: `apps.ts` already structures data for `getStaticPaths()`.

**Major components:**
1. `BaseLayout.astro` — HTML shell, `<head>`, SEO meta, OG tags, font loading
2. `sections/` (Hero, AppsGrid, About, Footer) — static `.astro` section files, zero JS
3. `ui/AppCard.tsx` — React island, FM hover micro-interaction, receives typed `App` props
4. `ui/HeroAnimation.tsx` — React island, GSAP ScrollTrigger SVG animation, `useGSAP` hook
5. `src/data/apps.ts` — typed array of all app records, single file for all content changes

### Critical Pitfalls

1. **Framer Motion bundle blowout** — Use `LazyMotion + m` (4.6 KB) instead of `motion.*` (34 KB); use `client:visible` not `client:load`. Establish this rule before writing the first animation component.
2. **GSAP ScrollTrigger + View Transitions zombie instances** — Kill all ScrollTrigger instances on `astro:before-swap`, reinit on `astro:after-swap`. Use `useGSAP` hook (auto-cleanup) in React islands. Low risk for v1 single-page, but set up the pattern immediately.
3. **shadcn compound components broken in islands** — Compound components (Accordion, Popover, Dialog) rely on React Context which doesn't cross island boundaries. For Frexes: stick to standalone primitives (Badge, Card, Button) — they're safe. If compound components are needed, wrap in one `.tsx` island.
4. **Reduced motion ignored** — ~26% of iOS/macOS users have this enabled. Use `useReducedMotion()` in Framer Motion components and `window.matchMedia('(prefers-reduced-motion: reduce)')` guard before GSAP init. Add CSS safety net. Non-negotiable.
5. **Over-animation undermining trust** — Portfolio must build trust, not showcase animation skill. Max 1 signature animation (hero). All others: subtle fade-in 150–300ms, translate-y 8–12px, stagger ≤50ms. No animation > 600ms. No scroll-jacking.

## Implications for Roadmap

Based on research, a 3-phase approach is recommended. Phase 1 establishes rules and static structure (the decisions that are costly to reverse). Phase 2 builds all static content. Phase 3 adds animations as an enhancement layer.

### Phase 1: Foundation and Rules

**Rationale:** The pitfalls that are hardest to fix (island composition rules, LazyMotion setup, reduced motion architecture) are easiest to prevent if established first. Project setup is the right time to encode these constraints.
**Delivers:** Configured Astro project with React integration, Tailwind v4, shadcn/ui; island hydration rules documented; LazyMotion wrapper component created; reduced motion utility function created; `src/data/apps.ts` with all 4 app records; `BaseLayout.astro` with full SEO meta.
**Addresses:** All table-stakes features that are structural (responsive layout, SEO, OG tags, favicon)
**Avoids:** Framer Motion bundle blowout, shadcn context isolation breakage, reduced motion being ignored (Pitfalls 1, 3, 4)

### Phase 2: Static Content and Layout

**Rationale:** Content must be finalized before animations are added — animating placeholder copy creates rework. All section components are `.astro` with no animation dependency, so they can be built and reviewed independently.
**Delivers:** All sections built and responsive (Hero, AppsGrid with 4 AppCard components, About, Footer); store links verified; status badges for all apps; design language consistent across sections; Lighthouse 95+ with no animations yet.
**Addresses:** Hero, app showcase grid, store links, status badges, about section, footer social links, responsive design
**Avoids:** Hardcoding app data in components (all data flows from `apps.ts`), putting images in `public/` (use Astro `<Image>`)

### Phase 3: Animation Layer

**Rationale:** Animations are added last, as an enhancement on top of already-correct structure. This preserves Lighthouse baseline established in Phase 2. Animation decisions informed by seeing the static site first — prevents over-animation.
**Delivers:** Hover micro-interactions on AppCard (Framer Motion `whileHover`); entrance animations on hero and app grid (subtle, ≤300ms); GSAP scroll-triggered reveals on about section; optional SVG accent in hero if time permits; production Lighthouse ≥95.
**Addresses:** Hover micro-interactions, entrance animations, animated SVG elements (v1.x)
**Avoids:** GSAP ScrollTrigger cleanup (useGSAP hook from day 1), over-animation (rules encoded in Phase 1)

### Phase 4: Launch

**Rationale:** Pre-launch checklist items from PITFALLS.md are discrete, verifiable tasks that should be a dedicated phase, not scattered across other phases.
**Delivers:** OG image validated with Facebook OG Debugger (absolute URL); GSAP ScrollTrigger `markers: false` confirmed; all app links verified; mobile tested on 375px viewport; production Lighthouse run (not dev server); site deployed to frexes.dev.
**Addresses:** SEO deployment, frexes.dev live

### Phase Ordering Rationale

- Foundation before content: island rules and LazyMotion setup are load-bearing; retrofitting them is medium-effort and error-prone.
- Content before animation: animating final copy prevents rework; seeing static layout informs animation restraint.
- Animation before launch: performance audit on final animation set, not intermediate state.
- Animations deferred from v1 (GSAP scroll animations, SVG accent) can be added as v1.x patches after Lighthouse baseline is verified — FEATURES.md explicitly sequences these this way.

### Research Flags

Phases with standard, well-documented patterns (skip `/gsd:research-phase`):
- **Phase 1 (Foundation):** Astro + Tailwind v4 + shadcn + React integration is fully documented with official guides. STACK.md has exact install commands.
- **Phase 2 (Static Content):** Pure layout and content work. No integration complexity.
- **Phase 4 (Launch):** Checklist tasks with known tools (OG Debugger, Lighthouse, Vercel CLI).

Phases that may warrant spot-research during implementation:
- **Phase 3 (Animation Layer):** GSAP + Astro + View Transitions interaction is a known community pain point (MEDIUM confidence sources). If View Transitions are added to v1, verify cleanup pattern against current Astro version before implementing.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm, official changelogs, and official docs. Tailwind v4 + shadcn Feb 2026 compatibility confirmed via official shadcn docs. |
| Features | HIGH | Competitor analysis (david-smith.org, IndiePage) plus established portfolio conventions. Scope decisions from PROJECT.md treated as constraints. |
| Architecture | HIGH | Astro official docs on islands, official framework integration guides, and verified starter patterns. |
| Pitfalls | HIGH (foundational) / MEDIUM (GSAP+ViewTransitions) | Core pitfalls (LazyMotion, reduced motion, shadcn context) sourced from official docs. GSAP + View Transitions sourced from community forums — correct pattern is known but edge cases vary. |

**Overall confidence:** HIGH

### Gaps to Address

- **App icons:** App card development requires final icons at consistent resolution. Gather Energy XP, Progres, Voila, and Karv app icons before building the AppsGrid section.
- **Final copy:** One-liners for each app and hero tagline should be finalized before Phase 2, not after. Placeholder copy causes rework.
- **frexes.dev domain:** OG image absolute URL requires the final domain set in `Astro.site` config. Confirm domain is pointed at Vercel before Phase 4.
- **GSAP + View Transitions on Astro 5.x specifically:** If View Transitions are added (even for future per-app pages), verify the `astro:before-swap` / `astro:after-swap` cleanup pattern against Astro 5's exact event API — sources were written for Astro 3/4.

## Sources

### Primary (HIGH confidence)
- [astro npm](https://www.npmjs.com/package/astro?activeTab=versions) — v5.18.0 current stable
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — stable Jan 2025
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — v4 + React 19 support confirmed Feb 2026
- [shadcn/ui Astro installation](https://ui.shadcn.com/docs/installation/astro) — official integration guide
- [motion changelog](https://motion.dev/changelog) — v12.35.2, LazyMotion bundle docs
- [GSAP npm](https://www.npmjs.com/package/gsap) — v3.14.2, all plugins free
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/) — official pattern documentation
- [Motion Docs: LazyMotion](https://motion.dev/docs/react-reduce-bundle-size) — 4.6 KB bundle size confirmed
- [GSAP ScrollTrigger tips & mistakes](https://gsap.com/resources/st-mistakes/) — official GSAP resource
- [shadcn/ui GitHub Discussion #3740](https://github.com/shadcn-ui/ui/discussions/3740) — Astro island context issue
- [Astro: Sharing state between islands](https://docs.astro.build/en/recipes/sharing-state-islands/) — official recipe

### Secondary (MEDIUM confidence)
- [GSAP community: Astro ViewTransitions breaks ScrollTrigger](https://gsap.com/community/forums/topic/41197-astro-viewtransitions-breaks-scrolltrigger-the-second-time-i-enter-a-page/) — cleanup pattern
- [Framer Motion + Astro islands: 1.2 MB resource transfer](https://thevalleyofcode.com/adding-react-framer-motion-animations-to-an-astro-site/) — bundle size warning
- [Lighthouse portfolio 100/100 keeping it boring](https://dev.to/sushantrahate/i-built-a-100100-google-lighthouse-portfolio-by-keeping-it-boring-2n2l) — performance vs animation tradeoff
- IndiePage (appshowca.se) — competitor feature analysis, direct inspection
- David Smith (david-smith.org) — competitor feature analysis, direct inspection

---
*Research completed: 2026-03-11*
*Ready for roadmap: yes*
