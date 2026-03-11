# Frexes

## What This Is

Frexes is a portfolio website for an indie app maker showcasing a suite of productivity and wellness apps. The site targets potential users, communicating mastery and craftsmanship through a minimalist-but-refined single-page design. Built with Astro + shadcn/ui, featuring tasteful micro-interactions (Framer Motion + GSAP) and animated SVGs.

## Core Value

Visitors instantly understand what Frexes builds and feel confident these are high-quality, well-crafted apps.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Single-page website with hero, apps grid, brief about, footer
- [ ] Light/white aesthetic inspired by modern Vercel — clean, sharp typography, generous whitespace
- [ ] App showcase cards for Energy XP, Progres, Voila, and Karv with icons, one-liners, and status badges
- [ ] "Coming Soon" badges for Voila and Karv
- [ ] Links to energyxp.app and progres.ing for live apps
- [ ] Micro-interactions and animations (Framer Motion for UI, GSAP for SVG/scroll)
- [ ] SVG animations that feel premium without hurting performance
- [ ] Brief about section — indie app maker identity, philosophy of building focused tools
- [ ] Footer with X (@bouthouri101) and LinkedIn links
- [ ] Responsive design — mobile-first, works perfectly on all screen sizes
- [ ] SEO basics — meta tags, Open Graph, structured data
- [ ] Deployed to frexes.dev

### Out of Scope

- Individual app detail pages — v2 priority
- Blog/updates section — v3 priority
- Full about/philosophy page — v4 priority
- Backend/CMS — static site, no server
- Contact form — social links sufficient for v1
- Dark mode — light-only for v1 to nail one aesthetic

## Context

- **Apps in portfolio:**
  - **Energy XP** — Task & energy management app. Live on stores. Website: energyxp.app
  - **Progres** — Goal tracking with path/list/number modes. Live on stores. Website: progres.ing
  - **Voila** — Behavior tracking & AI-powered analysis. In development.
  - **Karv** — Habit tracking. In development.
- All apps built with Expo/React Native, TypeScript, Zustand
- Owner: Bouthouri — indie app maker, ships real products
- Brand voice: Confident, minimal, crafted. Not corporate. Not flashy.
- Design inspiration: Modern Vercel (white), Linear's typography, Stripe's whitespace
- Animation inspiration: Subtle entrance animations, hover micro-interactions, scroll-triggered SVG reveals

## Constraints

- **Tech stack**: Astro + shadcn/ui + Tailwind CSS — chosen for performance and static-first approach
- **Animations**: Framer Motion (UI interactions) + GSAP (SVG/scroll animations) — both, not either/or
- **Performance**: Animations must not degrade Lighthouse scores; lazy-load heavy assets
- **Runtime**: Bun (per workspace convention)
- **Phased delivery**: v1 is single-page only; multi-page comes later

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Static portfolio site doesn't need React SSR overhead; Astro ships less JS | — Pending |
| shadcn/ui components | Consistent, customizable UI primitives; user requested | — Pending |
| Framer Motion + GSAP | FM for declarative React animations, GSAP for SVG/scroll precision | — Pending |
| Light-only for v1 | Nail one aesthetic before adding theme toggle complexity | — Pending |
| Single-page first | Ship fast, validate positioning, then expand to multi-page | — Pending |

---
*Last updated: 2026-03-11 after initialization*
