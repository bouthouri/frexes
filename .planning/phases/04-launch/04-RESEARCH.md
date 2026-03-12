# Phase 4: Launch - Research

**Researched:** 2026-03-11
**Domain:** Astro performance optimization + Vercel static deployment
**Confidence:** HIGH

## Summary

Phase 4 covers two tasks: hitting Lighthouse 95+ and deploying to frexes.dev via Vercel. The site is a static Astro 6 project with Tailwind v4, Framer Motion (via `motion` v12), and GSAP. Current build is ~316KB total with the main JS bundles being Framer Motion client (~186KB) and LazyMotionProvider (~68KB). These are loaded via `client:visible` which is already optimal.

The primary Lighthouse risk is Google Fonts loaded via external stylesheet (`fonts.googleapis.com`). This adds render-blocking network requests and will tank Performance score. Self-hosting Inter or using `font-display: swap` with preload is mandatory. Secondary concern: no OG image exists yet (`/og.png` referenced in meta tags but missing from `public/`).

Vercel deployment for static Astro is zero-config -- push to GitHub, import in Vercel, done. No adapter needed for static output.

**Primary recommendation:** Self-host Inter font (or use fontsource), add preload hint, create static OG image, then run Lighthouse on `astro preview` to verify 95+ before deploying.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TECH-03 | Lighthouse Performance score 95+ | Font optimization, bundle analysis, Lighthouse CLI audit workflow |
| TECH-04 | Deployed to frexes.dev | Vercel static deployment (zero-config), OG image creation |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| lighthouse | latest | CLI performance audit | Google's official tool, matches Chrome DevTools |
| @fontsource/inter | latest | Self-hosted Inter font | Eliminates external Google Fonts requests |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| Vercel CLI / Dashboard | Deploy static site | Push to GitHub, auto-deploy |
| astro preview | Local production server | Test Lighthouse against production build |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @fontsource/inter | Manual WOFF2 download | Fontsource is simpler, auto-subsetting |
| Lighthouse CLI | PageSpeed Insights | CLI runs locally against preview, no deploy needed |

## Architecture Patterns

### Current Build Analysis

```
dist/_astro/
  client.DIQWfPlE.js       186KB  (Framer Motion core - loaded client:visible, OK)
  LazyMotionProvider.*.js    68KB  (LazyMotion features - loaded client:visible, OK)
  index.*.js                  8KB  (Page island code)
  index@_@astro.*.css        18KB  (Tailwind CSS)
dist/index.html              11KB  (Static HTML)
Total:                      ~316KB
```

**Assessment:** JS bundle is reasonable for a site with Framer Motion animations. The `client:visible` directive means these scripts don't block initial render -- they load when the AppsGrid scrolls into view. This is already optimal.

### Performance Optimization Checklist

1. **Self-host Inter font** -- Replace Google Fonts `<link>` with local `@fontsource/inter` import
2. **Add font-display: swap** -- Prevent FOIT (flash of invisible text)
3. **Preload critical font weights** -- Only 400, 500, 600, 700 are used
4. **Create OG image** -- 1200x630 PNG at `public/og.png`
5. **Verify no unused CSS/JS** -- Tailwind v4 already tree-shakes

### Vercel Deployment (Static)

No adapter needed. Astro outputs static HTML by default.

**Deployment options (simplest first):**
1. **Vercel Dashboard** -- Import GitHub repo, auto-detects Astro, zero config
2. **Vercel CLI** -- `vercel` from project root, follows prompts
3. **vercel.json** -- Optional, only if custom headers/redirects needed

**Domain setup:** Add `frexes.dev` as custom domain in Vercel dashboard. DNS: point to Vercel nameservers or add CNAME record.

### OG Image

Meta tags already reference `https://frexes.dev/og.png` but the file doesn't exist. Need to create a 1200x630 PNG. For a simple portfolio site, a static image is fine (no dynamic generation needed).

**Quick creation options:**
- Design in Figma/Canva and export
- Generate programmatically with `@vercel/og` or `satori`
- Use a simple canvas script

For this project: a minimal OG image with "Frexes" title + tagline on a clean background matching the site aesthetic (white bg, dark text, maybe gradient accent).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font hosting | Download/serve WOFF2 manually | @fontsource/inter | Handles subsetting, formats, font-face declarations |
| OG image generation | Dynamic server-side generation | Static PNG file | Only 1 page, 1 image needed |
| Deployment pipeline | Custom CI/CD | Vercel auto-deploy from GitHub | Zero config for static Astro |
| Performance testing | Manual Chrome DevTools checks | Lighthouse CLI (`lighthouse --only-categories=performance`) | Reproducible, scriptable |

## Common Pitfalls

### Pitfall 1: Google Fonts Render-Blocking
**What goes wrong:** External Google Fonts stylesheet blocks rendering, kills FCP and LCP
**Why it happens:** `<link href="fonts.googleapis.com/...">` is render-blocking by default
**How to avoid:** Self-host with @fontsource/inter, remove the Google Fonts `<link>` tags entirely
**Warning signs:** Lighthouse flags "Eliminate render-blocking resources" pointing to fonts.googleapis.com

### Pitfall 2: Missing OG Image Returns 404
**What goes wrong:** Social previews show blank/broken image
**Why it happens:** `og:image` meta tag points to `/og.png` which doesn't exist in `public/`
**How to avoid:** Create `public/og.png` (1200x630) before deploy
**Warning signs:** Facebook Sharing Debugger or Twitter Card Validator shows no image

### Pitfall 3: Lighthouse Score Variance
**What goes wrong:** Score fluctuates between runs (92 one time, 97 next)
**Why it happens:** Lighthouse simulates throttling but results vary by system load
**How to avoid:** Run 3+ times, take median. Use `--only-categories=performance` flag. Test against local `astro preview` (production build), not `astro dev`
**Warning signs:** Scores vary by more than 5 points between runs

### Pitfall 4: Font Preconnect Hints Left Behind
**What goes wrong:** After removing Google Fonts link, leftover `<link rel="preconnect" href="fonts.googleapis.com">` tags cause unnecessary DNS lookups
**Why it happens:** Forgot to remove the preconnect hints when switching to self-hosted
**How to avoid:** Remove ALL Google Fonts related tags from BaseLayout.astro (preconnect + stylesheet)

### Pitfall 5: Vercel Build Command Wrong
**What goes wrong:** Vercel doesn't know to use `bun` instead of `npm`
**Why it happens:** Vercel auto-detects but may default to npm
**How to avoid:** Vercel auto-detects `bun.lock` file and uses Bun. Verify in build settings.

## Code Examples

### Self-Hosting Inter with Fontsource

```typescript
// In BaseLayout.astro frontmatter or global.css
// After: bun add @fontsource/inter

// Option A: Import in BaseLayout.astro frontmatter
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
```

```html
<!-- REMOVE these from BaseLayout.astro <head>: -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Running Lighthouse CLI

```bash
# Install
bun add -d lighthouse

# Build + preview
bun run build && bun run preview &

# Run audit (in another terminal)
npx lighthouse http://localhost:4321 --only-categories=performance --output=json --output-path=./lighthouse-report.json

# Or quick check
npx lighthouse http://localhost:4321 --only-categories=performance --view
```

### Vercel Deployment

```bash
# Option 1: CLI deploy
bunx vercel

# Option 2: Just push to GitHub, import in Vercel dashboard
# Vercel auto-detects Astro, runs `astro build`, serves `dist/`
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Fonts `<link>` | Self-hosted via fontsource | 2023+ | Eliminates 2-3 network requests, better LCP |
| Lighthouse v10 | Lighthouse v12 | 2024 | INP replaces FID, scoring changes |
| `@astrojs/vercel` adapter for all | No adapter for static | Always | Static sites never needed adapter |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Lighthouse CLI |
| Config file | none -- CLI flags suffice |
| Quick run command | `npx lighthouse http://localhost:4321 --only-categories=performance --output=json --quiet` |
| Full suite command | `bun run build && npx lighthouse http://localhost:4321 --only-categories=performance --view` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TECH-03 | Lighthouse score 95+ | smoke | `npx lighthouse http://localhost:4321 --only-categories=performance --output=json --quiet` | N/A (CLI tool) |
| TECH-04 | Site loads at frexes.dev | manual | Visit https://frexes.dev in browser | N/A |

### Sampling Rate
- **Per task commit:** Build + Lighthouse CLI on preview server
- **Per wave merge:** N/A (only 2 plans)
- **Phase gate:** Lighthouse 95+ confirmed, frexes.dev loads without errors, OG preview correct

### Wave 0 Gaps
- [ ] `bun add -d lighthouse` -- install Lighthouse CLI
- [ ] `bun add @fontsource/inter` -- self-hosted font package
- [ ] `public/og.png` -- OG image file (1200x630)

## Open Questions

1. **Domain DNS configuration**
   - What we know: frexes.dev needs to point at Vercel
   - What's unclear: Whether user has already configured DNS or needs to do it during this phase
   - Recommendation: Include DNS verification step in deploy plan, note from STATE.md says "frexes.dev domain must be pointed at Vercel before Phase 4"

2. **OG image design**
   - What we know: Needs to be 1200x630, should match site aesthetic
   - What's unclear: Whether user has a design ready or wants it generated
   - Recommendation: Create a simple programmatic OG image or provide a placeholder, user can swap later

## Sources

### Primary (HIGH confidence)
- [Astro Deploy to Vercel docs](https://docs.astro.build/en/guides/deploy/vercel/) -- static sites need no adapter, zero config
- [Astro Performance Guide](https://eastondev.com/blog/en/posts/dev/20251202-astro-performance-optimization/) -- 8 optimization techniques for Lighthouse 95+
- Project source code analysis -- BaseLayout.astro, package.json, dist/ build output

### Secondary (MEDIUM confidence)
- [Lighthouse npm](https://www.npmjs.com/package/lighthouse) -- CLI installation and usage
- [fontsource](https://fontsource.org/) -- self-hosted font packages (well-established project)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Astro + Vercel is well-documented, fontsource is mature
- Architecture: HIGH -- Build output analyzed directly, optimization path clear
- Pitfalls: HIGH -- Google Fonts render-blocking is a known, documented issue

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (stable domain, unlikely to change)
