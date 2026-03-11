# Feature Research

**Domain:** Indie app maker portfolio website
**Researched:** 2026-03-11
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features visitors assume exist. Missing these = site feels unprofessional or incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero / identity statement | First impression — who you are and what you build | LOW | One-liner tagline + name; sets tone immediately |
| App showcase cards | Core purpose of the site; visitors came to see the apps | LOW | Icon, name, one-liner, status, store link |
| App Store / Play Store links | Visitors want to download — dead-end without links | LOW | Only for live apps; coming-soon apps omit |
| Status indicators (Live / In Development) | Sets expectations; prevents confusion about availability | LOW | "Coming Soon" badge for Voila & Karv |
| About section | Humanizes the maker; builds trust | LOW | Brief — identity + philosophy, not a resume |
| Social links (X, LinkedIn) | Primary contact method for indie makers | LOW | Footer placement is convention |
| Responsive design | Mobile is majority of web traffic | MEDIUM | Mobile-first layout; cards collapse gracefully |
| SEO basics (title, meta description, OG tags) | Discoverability; social sharing preview | LOW | Static — no dynamic OG generation needed; one OG image sufficient |
| Fast load times | Slow = users bounce; also affects Lighthouse/SEO | MEDIUM | Static site has advantage; animations must not regress this |
| Favicon + site identity | Browser tab + bookmarks; missing feels unfinished | LOW | 32x32 and SVG variants; matches brand |

### Differentiators (Competitive Advantage)

Features that elevate the site above a generic developer portfolio. These reinforce the brand: confident, minimal, crafted.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Micro-interactions on app cards | Communicates craft — the maker's apps feel premium because the site does too | MEDIUM | Hover lift/glow, subtle scale; Framer Motion |
| Scroll-triggered entrance animations | Premium feel without being flashy; engagement signal | MEDIUM | Stagger reveal on app grid; GSAP ScrollTrigger |
| Animated SVG elements | Uniquely expressive; static sites rarely pull this off well | HIGH | Tasteful — background accent or hero illustration; GSAP |
| Consistent design language (Vercel-inspired) | Signals taste; visitors who know good design trust it instantly | LOW | Sharp typography, generous whitespace, near-white palette |
| App icon quality / visual coherence | Strong icons make the grid look intentional, not random | LOW | All four apps should have polished icons at same resolution |
| Live app website deep-links | energyxp.app, progres.ing — shows the ecosystem is real | LOW | External link with subtle "arrow out" icon; target=_blank |
| Unified brand voice in copy | Confident, first-person, short sentences — maker with conviction | LOW | Writing quality is often neglected; worth investing time |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Dark mode toggle | Users ask for it; devs love it | Doubles QA surface for v1; risks inconsistent aesthetic; PROJECT.md explicitly defers | Ship light-only; add dark mode in v2 after design is stable |
| Contact form | Seems professional | Backend required; spam without CAPTCHA; social links are sufficient for indie maker | X and LinkedIn in footer |
| Blog / updates feed | "Build in public" momentum | CMS or markdown pipeline complexity; distracts from core showcase | Defer to v3; tweet threads serve this role now |
| Individual app detail pages | Each app deserves depth | Multi-page routes, content maintenance, nav complexity | Defer to v2; external app websites (energyxp.app) already exist |
| Live download stats / revenue metrics | Build-in-public transparency | Requires API integration (App Store Connect); over-engineering for a static site | IndiePage (appshowca.se) exists for this purpose — link out |
| Testimonials / reviews section | Social proof | Requires curation; looks bad when sparse; carousel is UX debt | App store ratings link is sufficient social proof |
| Filterable / categorized app grid | Makes sense at 10+ apps | Overkill for 4 apps; adds JS complexity | Simple grid is cleaner at current scale |
| Video backgrounds / autoplay media | "Premium feel" | Kills performance, accessibility, and mobile data budgets | SVG animations achieve premium feel without the cost |
| Full-screen loading screen | Dramatic entrance | Delays time-to-content; hurts LCP; users have seen it a thousand times | Entrance animations after content is visible |
| Cookie banner | GDPR compliance | No tracking = no banner needed; invasive and ugly | Don't add analytics that require consent |

## Feature Dependencies

```
App showcase cards
    └──requires──> App icons (quality, consistent resolution)
    └──requires──> App copy (name, one-liner, status)
    └──enhances──> Micro-interactions (hover states)
    └──enhances──> Store links (for live apps)

Hero section
    └──requires──> Identity copy (tagline, brand voice)
    └──enhances──> Animated SVG / entrance animation

Micro-interactions (Framer Motion)
    └──requires──> React component structure in Astro islands
    └──conflicts──> Heavy GSAP usage in same elements (pick one per element)

GSAP scroll animations
    └──requires──> ScrollTrigger plugin
    └──enhances──> Entrance animations on app grid, about section
    └──conflicts──> prefers-reduced-motion (must respect it)

SEO basics
    └──requires──> Final domain (frexes.dev) set before deploy
    └──requires──> OG image (1200x630 static PNG)
    └──enhances──> Social sharing when site URL is shared on X/LinkedIn

Responsive design
    └──requires──> Mobile-first Tailwind breakpoints
    └──conflicts──> Complex SVG animations on mobile (performance risk — lazy/disable)
```

### Dependency Notes

- **App cards require copy and icons before development:** Placeholder content creates rework; gather final app icons and one-liners before building the grid component.
- **Framer Motion requires Astro island hydration:** Use `client:visible` or `client:load` directives; without this, animations won't run.
- **GSAP conflicts with Framer Motion on the same element:** Use FM for UI hover/tap interactions; use GSAP for scroll-driven and SVG animations. Never mix on the same DOM node.
- **prefers-reduced-motion must be respected:** Both GSAP and Framer Motion support this — bake it in from the start, not as an afterthought.
- **OG image depends on finalized design:** Generate OG image after the visual identity is locked; premature generation wastes effort.

## MVP Definition

### Launch With (v1)

- [ ] Hero section — name, tagline, maker identity statement
- [ ] App showcase grid — 4 cards (Energy XP, Progres, Voila, Karv) with icons, one-liners, status badges, store links for live apps
- [ ] About section — brief, confident, first-person
- [ ] Footer — X (@bouthouri101) and LinkedIn links
- [ ] Responsive layout — mobile-first, tested on iPhone SE and iPad viewport
- [ ] SEO basics — title, meta description, OG tags, favicon
- [ ] Entrance animations — stagger on app grid, subtle hero reveal (Framer Motion)
- [ ] Hover micro-interactions on app cards — lift, scale, or subtle glow
- [ ] Deployed to frexes.dev

### Add After Validation (v1.x)

- [ ] GSAP scroll-triggered animations — only after v1 ships and Lighthouse score is verified green
- [ ] Animated SVG accent element — after core layout is locked; high effort, defer until solid foundation exists
- [ ] OG image refinement — after social sharing testing reveals how it renders on X/LinkedIn

### Future Consideration (v2+)

- [ ] Individual app detail pages — when apps need more than a card (screenshots, features, press kit)
- [ ] Blog / build-in-public updates — when consistent writing habit is established
- [ ] Dark mode — after light aesthetic is fully stable and proven
- [ ] App ecosystem stats (downloads, ratings) — if build-in-public narrative becomes part of brand

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| App showcase grid | HIGH | LOW | P1 |
| Hero / identity | HIGH | LOW | P1 |
| Store links (live apps) | HIGH | LOW | P1 |
| Status badges (coming soon) | HIGH | LOW | P1 |
| Responsive design | HIGH | MEDIUM | P1 |
| SEO / OG tags | HIGH | LOW | P1 |
| Footer social links | MEDIUM | LOW | P1 |
| Hover micro-interactions | MEDIUM | LOW | P1 |
| Entrance animations | MEDIUM | MEDIUM | P1 |
| Animated SVG elements | MEDIUM | HIGH | P2 |
| GSAP scroll animations | MEDIUM | MEDIUM | P2 |
| App detail pages | HIGH | HIGH | P3 |
| Blog / updates | MEDIUM | HIGH | P3 |
| Dark mode | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | David Smith (david-smith.org) | IndiePage (appshowca.se) | Frexes (our approach) |
|---------|-------------------------------|--------------------------|----------------------|
| App grid / list | Narrative blog posts per app | Auto-imported app cards with metrics | Curated cards — icon, one-liner, status, store link |
| Status indication | Implied by recency | Revenue/download numbers | Explicit "Live" / "Coming Soon" badge |
| About section | Full about page | Minimal profile bio | Brief section on single page — philosophy focus |
| Social links | Mastodon, RSS | Inline on profile | X and LinkedIn in footer |
| Analytics / metrics | None visible | Core feature (revenue, downloads) | Deliberately absent — IndiePage does this better |
| Animations | None | None | Differentiator — micro-interactions + scroll |
| App websites | Separate sites per app | App Store links | External links to energyxp.app and progres.ing |
| Blog | Design Diary, Craft series | No | Deferred to v3 |
| Dark mode | No | No | Deferred to v2 |

## Sources

- IndiePage (appshowca.se) — indie app developer showcase platform analyzed directly
- David Smith (david-smith.org) — independent iOS developer portfolio, fetched directly
- Indie Hackers community discussion on personal websites
- Colorlib developer portfolio examples (23 Best Developer Portfolios 2026)
- Smashing Magazine — animation performance pitfalls
- Chrome Developers — Lighthouse performance scoring
- Justinmind — micro-interaction best practices 2025
- PROJECT.md — scope decisions (out-of-scope items treated as anti-features)

---
*Feature research for: Indie app maker portfolio website*
*Researched: 2026-03-11*
