# Roadmap: Frexes

## Overview

Four phases from zero to live portfolio. Phase 1 establishes the load-bearing architecture decisions (animation safety, island rules, data model). Phase 2 builds all static content to a reviewable, responsive state. Phase 3 adds the animation layer on top of finalized content. Phase 4 verifies performance and deploys to frexes.dev.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Astro project configured with animation safety rules and typed app data
- [ ] **Phase 2: Static Content** - All sections built, responsive, and link-verified — no animations yet
- [ ] **Phase 3: Animation Layer** - Ambient and hover animations added as enhancement on top of static content
- [ ] **Phase 4: Launch** - Lighthouse 95+ confirmed, deployed to frexes.dev

## Phase Details

### Phase 1: Foundation
**Goal**: A running Astro project where animation safety is structurally enforced, not a convention
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, HERO-03
**Success Criteria** (what must be TRUE):
  1. `bun dev` starts without errors and renders a blank page at localhost
  2. `LazyMotion` wrapper and `client:visible` pattern are in place — no motion component hydrates on load
  3. `prefers-reduced-motion` utility exists and is wired into both FM and GSAP init paths
  4. `src/data/apps.ts` exports a typed array with all 4 app records (Energy XP, Progres, Voila, Karv)
  5. Favicon renders in browser tab and `BaseLayout.astro` has HTML shell with `<head>` structure
**Plans**: 3 plans

Plans:
- [ ] 01-01: Astro + Tailwind v4 + shadcn/ui + React integration setup
- [ ] 01-02: Animation infrastructure (LazyMotion, GSAP, reduced-motion utility)
- [ ] 01-03: App data model + BaseLayout with favicon

### Phase 2: Static Content
**Goal**: Visitors can read every section, click every link, and view the site correctly on any screen size — with no animations
**Depends on**: Phase 1
**Requirements**: HERO-01, APPS-01, APPS-02, APPS-03, APPS-04, ABOUT-01, FOOT-01, TECH-01, TECH-02
**Success Criteria** (what must be TRUE):
  1. Hero section shows "Frexes" name and tagline above the fold on mobile and desktop
  2. App grid shows all 4 cards with icon, name, one-liner, and correct status badge (Live vs Coming Soon)
  3. energyxp.app and progres.ing links open the correct external sites; Voila and Karv cards have no broken links
  4. About section and footer with X and LinkedIn links are present and readable at all viewport sizes
  5. SEO meta tags and Open Graph tags are set with correct title, description, and site URL
**Plans**: 3 plans

Plans:
- [ ] 02-01: Hero and BaseLayout SEO wiring
- [ ] 02-02: AppCard component + AppsGrid section (data-driven from apps.ts)
- [ ] 02-03: About section + Footer + responsive QA

### Phase 3: Animation Layer
**Goal**: The site feels alive and premium through ambient animations and hover micro-interactions, without any scroll-triggered show/hide
**Depends on**: Phase 2
**Requirements**: HERO-02, APPS-05, APPS-06
**Success Criteria** (what must be TRUE):
  1. Hero background has an always-running ambient animation (gradient mesh or equivalent) visible on page load without any scroll
  2. App cards have a continuously running ambient effect (shimmer, gradient shift, or icon motion) that doesn't require user interaction
  3. Hovering an app card produces a lift + scale micro-interaction via Framer Motion
  4. All animations respect `prefers-reduced-motion` — enabling it disables motion without breaking layout
**Plans**: 3 plans

Plans:
- [ ] 03-01: Hero ambient background animation (GSAP or CSS)
- [ ] 03-02: AppCard hover micro-interaction + ambient card animation (Framer Motion)

### Phase 4: Launch
**Goal**: frexes.dev is live, fast, and correct
**Depends on**: Phase 3
**Requirements**: TECH-03, TECH-04
**Success Criteria** (what must be TRUE):
  1. Lighthouse Performance score is 95 or above on a production build (not dev server)
  2. frexes.dev loads the site in a browser without errors
  3. OG image preview is correct when the URL is pasted into a social media debugger
**Plans**: 3 plans

Plans:
- [ ] 04-01: Performance audit + Lighthouse pass
- [ ] 04-02: Deploy to frexes.dev via Vercel

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/3 | Not started | - |
| 2. Static Content | 0/3 | Not started | - |
| 3. Animation Layer | 0/2 | Not started | - |
| 4. Launch | 0/2 | Not started | - |
