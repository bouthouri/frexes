---
phase: 3
slug: animation-layer
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser testing (no automated test framework configured) |
| **Config file** | none |
| **Quick run command** | `bun run build && bun run preview` |
| **Full suite command** | `bun run build` (build success = no type errors) |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bun run build`
- **After every plan wave:** Run `bun run build && bun run preview` + manual visual check
- **Before `/gsd:verify-work`:** Full suite must be green + all 4 manual checks pass
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | HERO-02 | manual | `bun run build` + visual check: gradient animates on load | N/A | ⬜ pending |
| 03-01-02 | 01 | 1 | A11Y | manual | Toggle prefers-reduced-motion, reload, verify hero animation stops | N/A | ⬜ pending |
| 03-02-01 | 02 | 1 | APPS-05 | manual | `bun run build` + hover each card, verify lift+scale | N/A | ⬜ pending |
| 03-02-02 | 02 | 1 | APPS-06 | manual | Open browser, verify card shimmer runs without interaction | N/A | ⬜ pending |
| 03-02-03 | 02 | 1 | A11Y | manual | Toggle prefers-reduced-motion, reload, verify card animations stop | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* No automated test framework needed — this is a small portfolio site with manual visual verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero gradient animation visible on load | HERO-02 | Visual/animation behavior, no DOM assertion possible | Open browser, verify gradient animates immediately |
| App card lift+scale on hover | APPS-05 | Interaction-based visual behavior | Hover each card, verify transform applies |
| App card ambient shimmer | APPS-06 | Continuous CSS animation, visual only | Open page, verify shimmer runs without interaction |
| Animations stop with reduced motion | A11Y | OS-level preference + visual verification | Toggle System Settings > Accessibility > Reduce Motion, reload |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
