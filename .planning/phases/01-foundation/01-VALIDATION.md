---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual verification + `bun build` smoke test |
| **Config file** | none — Phase 1 is structural setup |
| **Quick run command** | `bun build` |
| **Full suite command** | `bun build` + manual browser verification |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bun build`
- **After every plan wave:** Run `bun build` + manual browser check
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | FOUND-01 | smoke | `bun build` | N/A | ⬜ pending |
| 01-02-01 | 02 | 1 | FOUND-02 | manual | Browser DevTools: verify no motion JS in initial load | N/A | ⬜ pending |
| 01-02-02 | 02 | 1 | FOUND-03 | manual | Toggle OS reduce-motion, verify behavior | N/A | ⬜ pending |
| 01-03-01 | 03 | 1 | FOUND-04 | smoke | `bun run --bun -e "import {apps} from './src/data/apps'; console.log(apps.length)"` | N/A | ⬜ pending |
| 01-03-02 | 03 | 1 | HERO-03 | manual | Open localhost, check tab icon | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. Phase 1 is foundational setup — `bun build` success is the primary automated gate.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| LazyMotion + client:visible loads no JS initially | FOUND-02 | Requires browser DevTools network inspection | Open DevTools Network tab, verify no motion chunk on initial load |
| prefers-reduced-motion wired into both systems | FOUND-03 | Requires OS accessibility setting toggle | Toggle "Reduce motion" in OS settings, verify animations stop |
| Favicon renders in browser tab | HERO-03 | Visual verification only | Open localhost, check browser tab for "F" favicon |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
