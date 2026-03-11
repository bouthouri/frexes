# Phase 1: Foundation - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Astro project configured with Tailwind v4 + shadcn/ui + Framer Motion + GSAP. Animation safety structurally enforced (LazyMotion, client:visible, prefers-reduced-motion). Typed app data model. Favicon and BaseLayout shell.

</domain>

<decisions>
## Implementation Decisions

### Favicon & Branding
- Bold geometric "F" lettermark in a sharp square container
- Pure black (#000000) background with white (#FFFFFF) letter
- Both SVG and 32x32 PNG favicon formats
- Favicon typeface and hero "Frexes" wordmark share the same font family/weight — cohesive brand identity

### Claude's Discretion
- Typography choices (font family for headings/body) — should be bold and geometric to match favicon decision
- Color palette and shadcn/ui theme tokens — light/white aesthetic, Vercel-inspired
- App data model field shape in `src/data/apps.ts` — include icon, name, one-liner, status, URL, and any fields needed for Phase 2 cards
- Tailwind v4 configuration approach
- LazyMotion and GSAP initialization patterns
- prefers-reduced-motion utility implementation

</decisions>

<specifics>
## Specific Ideas

- Design inspiration: Vercel (white/clean), Linear (typography), Stripe (whitespace)
- Favicon should feel "authoritative, dev-tool-like" — not friendly/rounded
- Brand voice: Confident, minimal, crafted. Not corporate. Not flashy.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- Bun runtime (workspace convention)
- All sibling projects use TypeScript strictly

### Integration Points
- frexes.dev domain (Vercel deployment target in Phase 4)
- App icons needed before Phase 2 (Energy XP, Progres, Voila, Karv)
- Copy for app one-liners should be finalized before Phase 2

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-11*
