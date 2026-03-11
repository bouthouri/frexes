# Requirements: Frexes

**Defined:** 2026-03-11
**Core Value:** Visitors instantly understand what Frexes builds and feel confident these are high-quality, well-crafted apps.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: Astro project with Tailwind v4 + shadcn/ui + motion + GSAP configured
- [x] **FOUND-02**: LazyMotion + `client:visible` pattern established for all React islands
- [x] **FOUND-03**: `prefers-reduced-motion` utility baked into both FM and GSAP from day one
- [x] **FOUND-04**: `src/data/apps.ts` typed data file driving all app content

### Hero

- [ ] **HERO-01**: Hero section with "Frexes" name and tagline ("Building apps that actually help you get things done")
- [ ] **HERO-02**: Ambient background animation (gradient mesh or subtle animated effect, always running, not scroll-triggered)
- [x] **HERO-03**: Favicon and site identity (32x32 + SVG)

### App Showcase

- [ ] **APPS-01**: Grid of 4 app cards — Energy XP, Progres, Voila, Karv
- [ ] **APPS-02**: Each card shows icon, name, one-liner description, status badge
- [ ] **APPS-03**: "Coming Soon" badge for Voila and Karv
- [ ] **APPS-04**: Links to energyxp.app and progres.ing for live apps
- [ ] **APPS-05**: Hover micro-interaction on cards (lift + subtle scale via Framer Motion)
- [ ] **APPS-06**: Ambient card animations (subtle background shimmer, gradient shift, or icon animation — always visible, not scroll-triggered)

### About

- [ ] **ABOUT-01**: Brief about section — indie maker identity, confident first-person voice

### Footer

- [ ] **FOOT-01**: Footer with X (@bouthouri101) and LinkedIn links

### Technical

- [ ] **TECH-01**: Responsive design — mobile-first, tested on mobile/tablet/desktop viewports
- [ ] **TECH-02**: SEO meta tags, Open Graph tags, structured data
- [ ] **TECH-03**: Lighthouse Performance score 95+
- [ ] **TECH-04**: Deployed to frexes.dev

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### App Detail Pages

- **DETAIL-01**: Individual page per app with screenshots, features, philosophy
- **DETAIL-02**: App-specific OG images for social sharing

### Visual Enhancements

- **VIS-01**: Animated SVG accent elements (hero or section dividers)
- **VIS-02**: Dark mode toggle with full theme support

### Blog

- **BLOG-01**: Blog/updates section with markdown-driven posts
- **BLOG-02**: RSS feed for subscribers

### About Page

- **BIO-01**: Full about/philosophy page — background, approach, values

## Out of Scope

| Feature | Reason |
|---------|--------|
| Contact form | Social links sufficient; backend complexity for no return |
| Live download stats / revenue | Over-engineering; IndiePage exists for this |
| Testimonials / reviews | Looks bad when sparse; App Store ratings suffice |
| Video backgrounds | Kills performance, accessibility, mobile data |
| Cookie banner | No tracking = no banner needed |
| Filterable app grid | Overkill for 4 apps |
| Loading screen | Delays time-to-content; hurts LCP |
| Scroll-triggered show/hide | User dislikes reveal-on-scroll; prefer ambient animations |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| HERO-03 | Phase 1 | Complete |
| HERO-01 | Phase 2 | Pending |
| APPS-01 | Phase 2 | Pending |
| APPS-02 | Phase 2 | Pending |
| APPS-03 | Phase 2 | Pending |
| APPS-04 | Phase 2 | Pending |
| ABOUT-01 | Phase 2 | Pending |
| FOOT-01 | Phase 2 | Pending |
| TECH-01 | Phase 2 | Pending |
| TECH-02 | Phase 2 | Pending |
| HERO-02 | Phase 3 | Pending |
| APPS-05 | Phase 3 | Pending |
| APPS-06 | Phase 3 | Pending |
| TECH-03 | Phase 4 | Pending |
| TECH-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---
*Requirements defined: 2026-03-11*
*Last updated: 2026-03-11 — traceability filled after roadmap creation*
