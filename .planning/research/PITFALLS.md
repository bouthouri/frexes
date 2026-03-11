# Pitfalls Research

**Domain:** Indie app maker portfolio website (Astro + shadcn/ui + Framer Motion + GSAP)
**Researched:** 2026-03-11
**Confidence:** HIGH

---

## Critical Pitfalls

### Pitfall 1: Framer Motion Nukes Astro's Performance Story

**What goes wrong:**
Importing a Framer Motion component as a React island pulls in ~34 KB (minzipped) of JS plus React's runtime. One developer reported 1.2 MB of transferred resources for a single animated component in Astro. Lighthouse performance score that was 95+ before animations can drop to 62–70 after naively adding motion.

**Why it happens:**
Developers treat Framer Motion as a CSS-alternative without accounting for the React runtime cost. Every `client:load` island ships a full React bundle on top of the motion library. Astro's zero-JS-by-default promise evaporates fast.

**How to avoid:**
- Use `LazyMotion` + `m` components instead of `motion.*` — reduces bundle to 4.6 KB.
- Use `client:visible` instead of `client:load` so islands only hydrate when scrolled into view.
- Prefer GSAP (no framework dependency, works in vanilla `.astro` files via `<script>`) for scroll/SVG animations — reserve Framer Motion for interactive React components only.
- For entrance animations that don't need interactivity, CSS `@keyframes` or Astro's native View Transitions are zero-cost alternatives.

**Warning signs:**
- Lighthouse performance score below 85 during development.
- Network tab showing `framer-motion` JS loading on initial page load for non-interactive elements.
- React bundle appearing in devtools when you only expected a simple animation.

**Phase to address:** Project setup / Foundation phase — establish the rule before any animation component is written.

---

### Pitfall 2: GSAP ScrollTrigger Breaks with Astro View Transitions

**What goes wrong:**
ScrollTrigger instances are not destroyed when Astro navigates between pages using View Transitions. On the second visit to a page, ScrollTrigger re-initialises on top of zombie instances from the previous visit. Animations play at random speeds (too fast, too slow, instant) or not at all. Requires hard reload to fix.

**Why it happens:**
Astro View Transitions intercept navigation and swap DOM content without a full page teardown. GSAP's ScrollTrigger attaches to the old DOM scroll listeners. When the new DOM arrives, there are now two conflicting sets of triggers pointing at different element references — one stale, one current.

**How to avoid:**
Since Frexes is a single-page site for v1, this is low risk initially. But if View Transitions are used for any section transitions or future page expansion:
- Kill all ScrollTrigger instances in `document.addEventListener('astro:before-swap', ...)`.
- Re-initialise them in `document.addEventListener('astro:after-swap', ...)`.
- Avoid `ScrollSmoother` entirely with View Transitions — it has an additional incompatibility layer.

**Warning signs:**
- Animations that work on hard reload but break on back-navigation.
- ScrollTrigger markers appearing at wrong positions after navigating.
- Console warnings about duplicate animation contexts.

**Phase to address:** Animation implementation phase — add cleanup hooks the moment ScrollTrigger is introduced.

---

### Pitfall 3: shadcn/ui Components Broken by Islands Architecture

**What goes wrong:**
shadcn/ui is designed for React's continuous component tree. Composable components like `Accordion`, `Popover`, `Dialog`, `DropdownMenu` rely on React Context to communicate between parent and child parts. In Astro, each island is an isolated React root — context does not cross island boundaries. `PopoverTrigger` renders before `Popover` provider, throwing errors or silently doing nothing.

**Why it happens:**
Developers copy shadcn examples directly into `.astro` files, treating islands like regular React imports. The composable API (e.g., `<Accordion.Item>` inside `<Accordion>`) assumes a shared component tree that Astro's isolation model prevents.

**How to avoid:**
- Wrap any compound shadcn component (Accordion, Popover, Dialog, DropdownMenu, etc.) in a single `.tsx` file and export it as one island — never split compound components across multiple islands.
- For Frexes specifically: app cards, status badges, and simple UI elements don't need compound components. Prefer shadcn primitives like `Badge`, `Card`, `Button` used standalone — these are safe.
- If state must be shared between islands (unlikely for a portfolio), use Nano Stores, not React Context.

**Warning signs:**
- Runtime error: "context value cannot be read" or similar in browser console.
- Popover/Dialog/Dropdown opens but trigger does nothing.
- Component works in isolation (`.tsx` file) but breaks when split across `.astro` files.

**Phase to address:** Foundation phase — establish the island composition rule before building any component.

---

### Pitfall 4: "Animations Done" But Reduced Motion Ignored

**What goes wrong:**
Animations ship without respecting `prefers-reduced-motion`. On iOS/macOS, ~26% of users have this enabled due to vestibular disorders or accessibility preferences. The portfolio looks broken or disorienting to a meaningful slice of the audience — exactly the wrong impression for a "crafted" product.

**Why it happens:**
Developers test on their own machines with motion enabled, ship, and never check. Both GSAP and Framer Motion require explicit opt-in to honour reduced motion.

**How to avoid:**
- Framer Motion: Use `useReducedMotion()` hook — conditionally disable or swap animations.
- GSAP: Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before registering ScrollTrigger or timelines; wrap in a utility function called once at init.
- CSS: Add `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }` as a safety net.
- Test with macOS Accessibility > Display > Reduce Motion enabled.

**Warning signs:**
- No `useReducedMotion` import anywhere in animation components.
- No `prefers-reduced-motion` media query in global CSS.
- GSAP init not wrapped in a motion preference check.

**Phase to address:** Animation implementation phase — add the check immediately when writing the first animated component.

---

### Pitfall 5: Over-Animating a Portfolio That Should Communicate Trust

**What goes wrong:**
The portfolio becomes a demo reel instead of a trust-building page. Too many simultaneous entrance animations, staggered delays that make content feel slow to appear, scroll-jacking, or animations that demand attention compete with the app showcase content. Visitors leave before reading about the apps.

**Why it happens:**
Developers (especially with GSAP + Framer Motion available) want to show off technical skill. The portfolio becomes about the animation library, not the products. This is the #1 UX failure mode for developer portfolios in 2025.

**How to avoid:**
- Animations should be felt, not noticed. If a visitor is watching the animation, it's too prominent.
- Max 1 "signature" animation (hero section). Everything else: subtle fade-in (150–300ms, 8–12px translate-y), no stagger > 50ms between items.
- No scroll-jacking. GSAP ScrollTrigger should reveal content at natural scroll speed, never control scroll position.
- App cards: hover micro-interaction only (scale 1.02, shadow lift). No entrance choreography that delays reading the card.
- Rule: if removing the animation makes content clearer, remove it.

**Warning signs:**
- Any animation over 600ms duration.
- More than 3 distinct animation types on the page.
- Content is invisible for >200ms on page load before animating in.
- GSAP timeline with more than 4 sequential elements.

**Phase to address:** Design/animation phase — encode the rules before implementation begins, not after.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `client:load` on all animated components | Simpler mental model | React runtime ships on every island, destroying Lighthouse score | Never — use `client:visible` for below-fold content |
| `motion.*` instead of `LazyMotion + m` | Less boilerplate | ~30 KB extra JS per animated section | Never for Frexes — too small a site to justify the weight |
| Splitting shadcn compound components across islands | Cleaner-looking `.astro` files | Silent breakage of context-dependent components | Never — always wrap compound components |
| Inline GSAP in `<script>` without cleanup | Quick to write | Memory leaks and zombie ScrollTriggers if View Transitions ever added | Acceptable for v1 single-page if no View Transitions |
| Skipping `prefers-reduced-motion` | Faster to ship | Broken/disorienting experience for ~26% of users | Never |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GSAP in Astro | Putting GSAP in React island to "keep it with the component" | Use vanilla `<script>` in `.astro` files — GSAP needs no React |
| Framer Motion in Astro | `import { motion } from 'framer-motion'` directly | `import { LazyMotion, m, domAnimation } from 'framer-motion'` with `client:visible` |
| shadcn/ui in Astro | Composing compound components across `.astro` template and island | Wrap entire compound component in one `.tsx` island |
| GSAP + View Transitions | No lifecycle cleanup | Kill ScrollTriggers on `astro:before-swap`, reinit on `astro:after-swap` |
| Open Graph images | Forgetting the `og:image` absolute URL (relative paths break) | Always use `Astro.site` to build absolute URLs; test with og:debugger |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized app icon PNGs | Images cause CLS and slow LCP | Use Astro's `<Image>` component for all icons; WebP/AVIF output | Immediately on any device > 50ms latency |
| Full `motion` bundle without `LazyMotion` | Lighthouse performance < 80, large JS chunk in devtools | Use `LazyMotion` + dynamic import of `domAnimation` | From the first animated component |
| GSAP ScrollTrigger without `markers: false` in production | Visible debug markers in production | Always set `markers: false` (or remove `markers` key) before deploy | On first production deploy |
| SVG animations via JS when CSS suffices | CPU-heavy animation, battery drain on mobile | Use CSS `stroke-dashoffset` animation for line draws; only use GSAP for complex SVG paths | Always noticeable on mid-range Android |
| Multiple GSAP contexts without cleanup | Duplicate animations, console warnings | One GSAP context per page (or per island), always call `.revert()` on unmount | With React strict mode double-invoke |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| App status badges ("Coming Soon") too subtle | Users don't know which apps are live vs unreleased; may click dead links | Use high-contrast badge colour (not grey) — amber/orange for Coming Soon, clear green for Live |
| No visible link to live apps from cards | Users interested in Energy XP or Progres leave to search elsewhere | App card must have a visible CTA ("View App" or direct URL), not just implied clickability |
| Hero section unclear who Frexes is | Visitors don't understand this is an app maker's portfolio, confuse it with an app itself | First visible text must answer: who built this, what they build, where to find it |
| Hover-only interactions on mobile | Micro-interactions invisible on touch devices | All hover states must have a tap equivalent; test on real iOS device, not simulator |
| Light text on near-white backgrounds | Fails WCAG AA contrast, especially in direct sunlight | Minimum 4.5:1 contrast ratio for all text; use Tailwind's `text-neutral-800` not `text-neutral-400` for body |

---

## "Looks Done But Isn't" Checklist

- [ ] **Open Graph image:** Verify with [Facebook OG Debugger](https://developers.facebook.com/tools/debug/) — the `og:image` must be an absolute URL and at least 1200x630px
- [ ] **Mobile responsiveness:** Test app cards grid on 375px viewport (iPhone SE) — cards must not overflow or truncate app names
- [ ] **Reduced motion:** Verify with macOS Accessibility > Reduce Motion — page must be fully readable with all animations disabled
- [ ] **App links:** Verify `energyxp.app` and `progres.ing` links open correctly — both `_blank` with `rel="noopener noreferrer"`
- [ ] **Coming Soon badges:** Confirm Voila and Karv cards are non-clickable or clearly indicate no live link exists
- [ ] **GSAP ScrollTrigger markers:** Confirm `markers` is absent or `false` in production build
- [ ] **Lighthouse score:** Run against production build (not dev server) — target 95+ Performance, 100 Accessibility
- [ ] **Social sharing preview:** Share the URL on iMessage/Slack and verify the OG card renders correctly with title + image

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Framer Motion bundle blew out Lighthouse | MEDIUM | Migrate `motion.*` to `LazyMotion + m`; switch `client:load` to `client:visible`; audit with Bundlephobia |
| GSAP ScrollTrigger zombie instances | LOW | Add `ScrollTrigger.killAll()` before re-init; move to context pattern |
| shadcn compound component broken | LOW | Consolidate split islands into one `.tsx` wrapper file |
| Over-animated page feeling chaotic | LOW | Remove animations one section at a time until page "disappears" — then add back at 50% intensity |
| Missing OG image on launch | LOW | Add `og:image` pointing to a static `/og.png` (1200x630) in `<head>`; redeploy |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Framer Motion bundle size | Foundation (project setup) | Bundlephobia audit before first animation component merged |
| GSAP + View Transitions cleanup | Animation implementation | Navigate to page, use browser back, confirm animations replay correctly |
| shadcn island context isolation | Foundation (component architecture) | Run compound shadcn component in Astro — no console errors |
| Prefers-reduced-motion ignored | Animation implementation | Test with macOS Reduce Motion enabled — page readable |
| Over-animation | Design/animation | Usability check: can a non-technical person read all content without waiting? |
| Missing Open Graph | Pre-launch / SEO phase | Facebook OG Debugger returns correct title + image |
| Coming Soon badge UX | UI implementation | User test: ask someone to identify which apps are available without prompting |

---

## Sources

- [GSAP community: Astro ViewTransitions breaks ScrollTrigger](https://gsap.com/community/forums/topic/41197-astro-viewtransitions-breaks-scrolltrigger-the-second-time-i-enter-a-page/) — MEDIUM confidence (community forum)
- [GSAP community: ScrollTrigger tips & mistakes (official)](https://gsap.com/resources/st-mistakes/) — HIGH confidence (official GSAP docs)
- [shadcn/ui GitHub Discussion #3740: Astro island context issue](https://github.com/shadcn-ui/ui/discussions/3740) — HIGH confidence (official repo discussion)
- [Astro Docs: Sharing state between islands](https://docs.astro.build/en/recipes/sharing-state-islands/) — HIGH confidence (official docs)
- [Motion Docs: Reduce bundle size with LazyMotion](https://motion.dev/docs/react-reduce-bundle-size) — HIGH confidence (official docs)
- [Framer Motion Astro integration: 1.2MB resource transfer reported](https://thevalleyofcode.com/adding-react-framer-motion-animations-to-an-astro-site/) — MEDIUM confidence (community article)
- [Dev portfolio mistake: Lighthouse dropped to 62 from animations](https://dev.to/sushantrahate/i-built-a-100100-google-lighthouse-portfolio-by-keeping-it-boring-2n2l) — MEDIUM confidence (community post)
- [5 Mistakes Developers Make in Portfolio Websites](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites) — MEDIUM confidence
- [GSAP forum: AstroJS animations playing at random speeds (March 2025)](https://gsap.com/community/forums/topic/44255-astrojs-and-gsap-not-animating-properly/) — MEDIUM confidence (community forum)

---
*Pitfalls research for: Frexes — indie app maker portfolio (Astro + shadcn/ui + Framer Motion + GSAP)*
*Researched: 2026-03-11*
