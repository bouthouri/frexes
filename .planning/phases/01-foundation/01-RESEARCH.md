# Phase 1: Foundation - Research

**Researched:** 2026-03-11
**Domain:** Astro static site + React islands + animation libraries + Tailwind v4
**Confidence:** HIGH

## Summary

Phase 1 sets up a greenfield Astro portfolio site with React islands architecture. The stack is Astro 5.x (latest stable), Tailwind CSS v4 via `@tailwindcss/vite`, shadcn/ui for React components, Motion v12 (formerly Framer Motion) with LazyMotion for bundle-optimized animations, and GSAP 3.14 for SVG/scroll animations. All run on Bun.

The critical architectural decision is using Astro's `client:visible` directive with Motion's `LazyMotion` + `m` component to ensure zero animation JS hydrates on page load. This gives Lighthouse-friendly performance while allowing rich React interactions. GSAP's `gsap.matchMedia()` and a custom React hook handle `prefers-reduced-motion` across both animation systems.

**Primary recommendation:** Set up Astro with `@tailwindcss/vite` plugin (NOT the deprecated `@astrojs/tailwind`), use `motion` package (not `framer-motion`), and wrap all React islands in a shared `LazyMotion` provider with `domAnimation` features.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Bold geometric "F" lettermark in a sharp square container
- Pure black (#000000) background with white (#FFFFFF) letter
- Both SVG and 32x32 PNG favicon formats
- Favicon typeface and hero "Frexes" wordmark share the same font family/weight -- cohesive brand identity

### Claude's Discretion
- Typography choices (font family for headings/body) -- should be bold and geometric to match favicon decision
- Color palette and shadcn/ui theme tokens -- light/white aesthetic, Vercel-inspired
- App data model field shape in `src/data/apps.ts` -- include icon, name, one-liner, status, URL, and any fields needed for Phase 2 cards
- Tailwind v4 configuration approach
- LazyMotion and GSAP initialization patterns
- prefers-reduced-motion utility implementation

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Astro project with Tailwind v4 + shadcn/ui + motion + GSAP configured | Standard Stack section covers all packages, versions, and config |
| FOUND-02 | LazyMotion + `client:visible` pattern established for all React islands | Architecture Patterns section details LazyMotion wrapper + Astro directives |
| FOUND-03 | `prefers-reduced-motion` utility baked into both FM and GSAP from day one | Code Examples section provides hook + GSAP matchMedia patterns |
| FOUND-04 | `src/data/apps.ts` typed data file driving all app content | Architecture Patterns section covers typed data model |
| HERO-03 | Favicon and site identity (32x32 + SVG) | Architecture Patterns section covers favicon setup in BaseLayout |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^5.18 | Static site framework | Latest stable, island architecture, zero JS by default |
| @astrojs/react | latest | React integration for Astro | Official integration for React islands |
| react / react-dom | ^19 | UI library for interactive islands | Required by motion and shadcn/ui |
| tailwindcss | ^4.x | Utility CSS framework | v4 uses Vite plugin, CSS-first config |
| @tailwindcss/vite | ^4.x | Tailwind v4 Vite integration | Replaces deprecated @astrojs/tailwind |
| motion | ^12.35 | React animations (LazyMotion, m component) | Formerly framer-motion; bundle-optimized with LazyMotion |
| gsap | ^3.14 | SVG/scroll/complex animations | Free license (all plugins), matchMedia for a11y |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui (CLI) | latest | Component scaffolding | `bunx shadcn@latest init -t astro` then `add` components |
| typescript | ^5.x | Type safety | Astro default, strict mode |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @tailwindcss/vite | @astrojs/tailwind | Deprecated for Tailwind v4, do NOT use |
| motion | framer-motion | framer-motion is legacy name, motion is current package |
| Astro 6 beta | Astro 5.18 stable | v6 is beta.19, not production-ready |

**Installation:**
```bash
# Create project
bun create astro@latest . --template basics --install --git

# Add React integration
bunx astro add react

# Tailwind v4 (NOT @astrojs/tailwind)
bun add tailwindcss @tailwindcss/vite

# Animation libraries
bun add motion gsap

# shadcn/ui init
bunx shadcn@latest init -t astro
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    motion/
      LazyMotionProvider.tsx  # Shared LazyMotion wrapper
      MotionDiv.tsx           # Example animated island
    ui/                       # shadcn/ui components (auto-generated)
  data/
    apps.ts                   # Typed app data array
  layouts/
    BaseLayout.astro          # HTML shell, <head>, favicon, global CSS
  lib/
    motion.ts                 # prefers-reduced-motion hook + GSAP init
    utils.ts                  # shadcn cn() utility (auto-generated)
  pages/
    index.astro               # Homepage
  styles/
    global.css                # @import "tailwindcss" + @theme tokens
public/
  favicon.svg                 # SVG favicon
  favicon.png                 # 32x32 PNG favicon
```

### Pattern 1: LazyMotion Provider as React Island
**What:** A single React component wrapping LazyMotion that all animated islands share
**When to use:** Every React island that uses motion animations

```tsx
// src/components/motion/LazyMotionProvider.tsx
import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

export function LazyMotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
```

Usage in Astro:
```astro
---
import { LazyMotionProvider } from "../components/motion/LazyMotionProvider";
import { AnimatedCard } from "../components/motion/AnimatedCard";
---
<LazyMotionProvider client:visible>
  <AnimatedCard />
</LazyMotionProvider>
```

**Key:** `client:visible` means ZERO JS loads until the island scrolls into view. The `m` component inside LazyMotion keeps bundle small (~5kb initial).

### Pattern 2: m Component (NOT motion Component) Inside LazyMotion
**What:** Use `m` from `motion/react` instead of `motion` to get tree-shaking benefits
**When to use:** All animated elements within a LazyMotion boundary

```tsx
// Import m from the same package
import { m } from "motion/react";

export function AnimatedCard() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      Card content
    </m.div>
  );
}
```

**Note:** There was a reported bug with `import * as m from "motion/react-m"` in motion v12.4.3+. Use `import { m } from "motion/react"` instead -- this is the safer path. The `m` component is re-exported from `motion/react` directly.

### Pattern 3: BaseLayout with Favicon
**What:** Astro layout with proper HTML shell, meta tags, and favicon references

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title?: string;
  description?: string;
}
const { title = "Frexes", description = "Building apps that actually help you get things done" } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Pattern 4: Tailwind v4 Config (Vite Plugin, Not @astrojs/tailwind)

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --font-heading: "Inter", sans-serif;
  --font-body: "Inter", sans-serif;
}
```

### Pattern 5: Typed App Data Model

```ts
// src/data/apps.ts
export type AppStatus = "live" | "coming-soon";

export interface App {
  id: string;
  name: string;
  tagline: string;
  status: AppStatus;
  url: string | null;
  icon: string;           // path to icon in public/
  accentColor: string;    // for card theming in Phase 2
}

export const apps: App[] = [
  {
    id: "energy-xp",
    name: "Energy XP",
    tagline: "Task & energy management",
    status: "live",
    url: "https://energyxp.app",
    icon: "/icons/energy-xp.svg",
    accentColor: "#...",
  },
  {
    id: "progres",
    name: "Progres",
    tagline: "Goal tracking your way",
    status: "live",
    url: "https://progres.ing",
    icon: "/icons/progres.svg",
    accentColor: "#...",
  },
  {
    id: "voila",
    name: "Voila",
    tagline: "Behavior tracking & AI analysis",
    status: "coming-soon",
    url: null,
    icon: "/icons/voila.svg",
    accentColor: "#...",
  },
  {
    id: "karv",
    name: "Karv",
    tagline: "Habit tracking, simplified",
    status: "coming-soon",
    url: null,
    icon: "/icons/karv.svg",
    accentColor: "#...",
  },
];
```

### Anti-Patterns to Avoid
- **Using `motion` component instead of `m` inside LazyMotion:** Defeats the purpose of lazy-loading, loads full bundle
- **Using `@astrojs/tailwind` integration:** Deprecated for Tailwind v4, will break
- **Using `client:load` for animation islands:** Loads JS immediately on page load, hurting performance. Use `client:visible` instead
- **Importing from `framer-motion`:** Legacy package name, `motion` is the current package
- **Using `import * as m from "motion/react-m"`:** Known bug in motion v12.4.3+, use `import { m } from "motion/react"` instead

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS utility merging | String concatenation | `cn()` from shadcn/ui (clsx + twMerge) | Tailwind class conflicts are subtle |
| Reduced motion detection | Manual matchMedia | Custom hook + GSAP matchMedia (see Code Examples) | Must handle SSR, listener cleanup, both systems |
| Animation bundle splitting | Manual code splitting | LazyMotion + domAnimation | Handles feature loading, tree-shaking, async import |
| Favicon generation | Manual PNG export | Design SVG first, export PNG from that | SVG is source of truth, PNG derived |
| Component styling | Custom CSS-in-JS | shadcn/ui + Tailwind classes | Consistent, accessible, copy-paste ownership |

## Common Pitfalls

### Pitfall 1: @astrojs/tailwind with Tailwind v4
**What goes wrong:** Using the old Astro Tailwind integration breaks with v4
**Why it happens:** @astrojs/tailwind targets Tailwind v3 config format
**How to avoid:** Use `@tailwindcss/vite` plugin in `astro.config.mjs` vite.plugins
**Warning signs:** `tailwind.config.js` file exists (v4 uses CSS-first config)

### Pitfall 2: motion vs framer-motion Package Name
**What goes wrong:** Installing `framer-motion` instead of `motion`
**Why it happens:** Old tutorials reference `framer-motion`
**How to avoid:** Always `bun add motion`, import from `motion/react`
**Warning signs:** `framer-motion` in package.json

### Pitfall 3: LazyMotion m Import Path Bug
**What goes wrong:** `import * as m from "motion/react-m"` causes symbol mismatch in motion v12.4.3+
**Why it happens:** Module distribution changed, entry points don't share symbols correctly
**How to avoid:** Use `import { m } from "motion/react"` instead
**Warning signs:** TypeScript errors about MotionStyle/MotionValue incompatibility

### Pitfall 4: client:load Instead of client:visible
**What goes wrong:** All animation JS loads immediately, hurting LCP/TBT
**Why it happens:** Devs default to client:load for "it just works"
**How to avoid:** Use `client:visible` for below-fold islands, `client:idle` for above-fold
**Warning signs:** Large JS bundle in Lighthouse, poor TBT score

### Pitfall 5: GSAP Not Registering Plugins Before Use
**What goes wrong:** ScrollTrigger or other plugins silently fail
**Why it happens:** GSAP requires explicit `gsap.registerPlugin()` calls
**How to avoid:** Create a centralized GSAP init module that registers all plugins
**Warning signs:** Animations don't trigger, no console errors

### Pitfall 6: shadcn/ui Components Without client Directive
**What goes wrong:** Interactive shadcn components (Button, Dialog) render as static HTML
**Why it happens:** Astro renders React components as static HTML by default
**How to avoid:** Add `client:visible` or `client:load` to interactive React islands
**Warning signs:** Click handlers don't fire, state doesn't update

## Code Examples

### prefers-reduced-motion React Hook

```tsx
// src/lib/motion.ts
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setPrefersReduced(mql.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
```

### GSAP prefers-reduced-motion via matchMedia

```ts
// src/lib/gsap-init.ts
import gsap from "gsap";

export function initGsap() {
  const mm = gsap.matchMedia();

  mm.add(
    {
      motionOk: "(prefers-reduced-motion: no-preference)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { motionOk } = context.conditions!;

      if (motionOk) {
        // Full animations
        gsap.to(".hero-bg", { rotation: 360, duration: 20, repeat: -1 });
      } else {
        // Static or very subtle
        gsap.set(".hero-bg", { opacity: 0.5 });
      }

      return () => {
        // Cleanup runs automatically when conditions change
      };
    }
  );
}
```

### Astro Island with LazyMotion + client:visible

```astro
---
// src/pages/index.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import { LazyMotionProvider } from "../components/motion/LazyMotionProvider";
---
<BaseLayout>
  <main>
    <h1>Frexes</h1>
    <!-- This React island loads ZERO JS until scrolled into view -->
    <LazyMotionProvider client:visible>
      <!-- animated children go here -->
    </LazyMotionProvider>
  </main>
</BaseLayout>
```

### shadcn/ui Initialization

```bash
# From project root
bunx shadcn@latest init -t astro
# Follow prompts: TypeScript, default style, neutral base color
# This creates: components.json, src/lib/utils.ts, src/components/ui/

# Add components as needed
bunx shadcn@latest add button
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @astrojs/tailwind | @tailwindcss/vite plugin | Tailwind v4 (2025) | CSS-first config, no tailwind.config.js |
| framer-motion package | motion package | Motion v12 (2024) | New package name, same API |
| GSAP paid plugins | GSAP all-free license | 2024 (Webflow acquisition) | SplitText, MorphSVG etc now free |
| tailwind.config.js | @theme in CSS | Tailwind v4 | Design tokens defined in CSS, not JS |
| Astro 4 | Astro 5.18 stable | 2025 | Content Layer, Server Islands |

**Deprecated/outdated:**
- `@astrojs/tailwind`: Do not use with Tailwind v4
- `framer-motion` package name: Redirects to `motion`, but use `motion` directly
- `tailwind.config.js`: Tailwind v4 uses CSS `@theme` directives

## Open Questions

1. **motion/react-m Import Path Status**
   - What we know: Bug reported Feb 2025, import * as m from "motion/react-m" broken in v12.4.3+
   - What's unclear: Whether it's been fixed in v12.35. The issue was still open.
   - Recommendation: Use `import { m } from "motion/react"` which is confirmed working. Test at install time.

2. **shadcn/ui Astro + Tailwind v4 Init Flow**
   - What we know: `bunx shadcn@latest init -t astro` is the official command
   - What's unclear: Whether it auto-configures @tailwindcss/vite or expects manual setup
   - Recommendation: Install Tailwind v4 manually first, then run shadcn init. Verify generated files.

3. **Font Choice for Geometric Brand**
   - What we know: User wants bold, geometric, dev-tool aesthetic matching favicon
   - What's unclear: Best specific font pairing
   - Recommendation: Inter (body) + Geist or Inter Tight (headings) -- both are geometric, clean, and commonly used by Vercel/Linear. Available via Google Fonts or Fontsource.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual verification (no test runner for static site Phase 1) |
| Config file | none -- Phase 1 is structural setup |
| Quick run command | `bun dev` + manual browser check |
| Full suite command | `bun build` (zero errors = pass) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | Astro + Tailwind + shadcn + motion + GSAP configured | smoke | `bun build` | N/A -- build success |
| FOUND-02 | LazyMotion + client:visible pattern in place | manual | Browser DevTools: verify no motion JS in initial load | N/A |
| FOUND-03 | prefers-reduced-motion utility exists and wired | manual | Toggle OS reduce-motion setting, verify behavior | N/A |
| FOUND-04 | apps.ts exports typed array with 4 records | smoke | `bun run --bun -e "import {apps} from './src/data/apps'; console.log(apps.length)"` | Wave 0 |
| HERO-03 | Favicon renders in browser tab | manual | Open localhost, check tab icon | N/A |

### Sampling Rate
- **Per task commit:** `bun build` (must complete without errors)
- **Per wave merge:** `bun build` + manual browser verification
- **Phase gate:** All 5 success criteria checked manually

### Wave 0 Gaps
None -- Phase 1 is foundational setup. Test infrastructure would be premature for a static site scaffold. `bun build` success is the primary automated gate.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS official Astro guide](https://tailwindcss.com/docs/guides/astro) - v4 setup with @tailwindcss/vite
- [shadcn/ui Astro installation](https://ui.shadcn.com/docs/installation/astro) - official init command
- [Motion LazyMotion docs](https://motion.dev/docs/react-lazy-motion) - LazyMotion + m component API
- [Motion bundle size docs](https://motion.dev/docs/react-reduce-bundle-size) - domAnimation vs domMax
- [GSAP matchMedia docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()) - prefers-reduced-motion pattern
- [Astro islands architecture](https://docs.astro.build/en/concepts/islands/) - client directives

### Secondary (MEDIUM confidence)
- [Motion GitHub issue #3091](https://github.com/motiondivision/motion/issues/3091) - motion/react-m bug report
- [Josh Comeau prefers-reduced-motion hook](https://www.joshwcomeau.com/snippets/react-hooks/use-prefers-reduced-motion/) - hook pattern
- [Astro + Bun recipe](https://docs.astro.build/en/recipes/bun/) - Bun runtime setup

### Tertiary (LOW confidence)
- Astro 5.18 as "latest stable" -- search results mention 5.18 and 6.0-beta, needs verification at install time

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all packages verified via official docs and npm
- Architecture: HIGH - Astro islands + LazyMotion is well-documented pattern
- Pitfalls: HIGH - known issues verified via GitHub issues and official docs
- motion/react-m import: MEDIUM - bug confirmed but fix status unclear

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (30 days, stable ecosystem)
