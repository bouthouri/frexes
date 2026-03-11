---
phase: 2
slug: static-content
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser testing + build validation |
| **Config file** | none |
| **Quick run command** | `bun build` |
| **Full suite command** | `bun build` + visual check at 375px / 768px / 1440px |
| **Estimated runtime** | ~5 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `bun build`
- **After every plan wave:** Run `bun build` + visual check at 375px / 768px / 1440px
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | HERO-01 | manual | `bun build` | N/A | ⬜ pending |
| 2-01-02 | 01 | 1 | TECH-02 | manual | `bun build` + view source | N/A | ⬜ pending |
| 2-02-01 | 02 | 1 | APPS-01 | manual | `bun build` | N/A | ⬜ pending |
| 2-02-02 | 02 | 1 | APPS-02 | manual | `bun build` | N/A | ⬜ pending |
| 2-02-03 | 02 | 1 | APPS-03 | manual | `bun build` | N/A | ⬜ pending |
| 2-02-04 | 02 | 1 | APPS-04 | manual | `bun build` | N/A | ⬜ pending |
| 2-03-01 | 03 | 2 | ABOUT-01 | manual | `bun build` | N/A | ⬜ pending |
| 2-03-02 | 03 | 2 | FOOT-01 | manual | `bun build` | N/A | ⬜ pending |
| 2-03-03 | 03 | 2 | TECH-01 | manual | `bun build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* No automated test framework needed for static content phase. Build validation (`bun build`) is sufficient.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero shows "Frexes" + tagline above fold | HERO-01 | Visual content check | Open dev server, verify text visible without scrolling at 375px and 1440px |
| 4 app cards in 2-col grid on desktop | APPS-01 | Visual layout check | Open at 768px+, verify 2x2 grid layout |
| Card shows icon, name, tagline, badge | APPS-02 | Visual content check | Inspect each card for all 4 elements |
| Coming Soon badge on Voila/Karv | APPS-03 | Visual content check | Verify amber badge on Voila and Karv cards |
| Links open correct external sites | APPS-04 | External link check | Click Energy XP → energyxp.app, Progres → progres.ing |
| About section readable | ABOUT-01 | Visual content check | Scroll to about section, verify text readable |
| Footer with X + LinkedIn links | FOOT-01 | Visual + link check | Verify icons present, links open correct profiles |
| Responsive at all viewports | TECH-01 | Visual layout check | Check 375px, 768px, 1440px — no overflow, readable |
| OG + SEO meta tags present | TECH-02 | Source inspection | View page source, verify og:title, og:description, og:url, twitter:card tags |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
