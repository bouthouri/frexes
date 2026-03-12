---
phase: 4
slug: launch
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Lighthouse CLI |
| **Config file** | none — CLI flags suffice |
| **Quick run command** | `npx lighthouse http://localhost:4321 --only-categories=performance --output=json --quiet` |
| **Full suite command** | `bun run build && npx lighthouse http://localhost:4321 --only-categories=performance --view` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx lighthouse http://localhost:4321 --only-categories=performance --output=json --quiet`
- **After every plan wave:** Run `bun run build && npx lighthouse http://localhost:4321 --only-categories=performance --view`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | TECH-03 | smoke | `npx lighthouse http://localhost:4321 --only-categories=performance --output=json --quiet` | N/A (CLI) | ⬜ pending |
| 04-02-01 | 02 | 2 | TECH-04 | manual | Visit https://frexes.dev in browser | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `bun add -d lighthouse` — install Lighthouse CLI for performance auditing
- [ ] `bun add @fontsource/inter` — self-hosted font package
- [ ] `public/og.png` — OG image file (1200x630)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Site loads at frexes.dev | TECH-04 | Requires live deployment + DNS | Visit https://frexes.dev, verify no errors in console |
| OG image preview correct | TECH-04 | Requires social media debugger | Paste URL in Facebook Sharing Debugger or Twitter Card Validator |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
