# Project State: Slug Portfolio v2

**Last updated:** 2026-03-02
**Session:** Initial roadmap creation

---

## Project Reference

**Core value:** Present Slug Macro's work clearly and beautifully — premium layout, fluid animations, easy-to-update content.

**Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS v4 + React Router v7 + Framer Motion v12 + pnpm

**Key constraint:** Brownfield rebuild — v1 lives on `v1-backup` branch. Main branch is the clean v2 target.

---

## Current Position

**Current phase:** Phase 1 (Foundation) — planned, awaiting execution
**Current plan:** 01-01 through 01-03
**Status:** Phase 1 planned (3 plans in 2 waves)

**Progress:**
```
Phase 1 [Foundation]          [~] Planned (3 plans, 2 waves)
Phase 2 [Layout & Content]    [ ] Not started
Phase 3 [Animation Layer]     [ ] Not started
Phase 4 [Polish & Distribution] [ ] Not started
```

**Overall:** 0% complete (0/4 phases done)

---

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Requirements mapped | 38/38 | 38/38 |
| Phases complete | 4 | 0 |
| Plans complete | TBD | 0 |

---

## Accumulated Context

### Architecture Decisions

- **Content system:** Use `gray-matter` + Vite `?raw` imports + manual Zod validation. Do NOT use `@content-collections` unless the manual loader becomes burdensome. Simpler is correct for < 20 projects.
- **Animation imports:** Migrate all imports to `"motion/react"` (framer-motion v12 = motion v12). Do this before writing any animation code.
- **AnimatePresence pattern:** Use `useOutlet()` + `React.cloneElement(element, { key: location.pathname })` with `mode="wait"`. Must be set up at Phase 3 start before per-page animations.
- **Modal rendering:** `ProjectModal` must render via React Portal to `document.body` to avoid stacking context conflicts with Framer Motion opacity animations.
- **Scroll lock:** Implement centralized `useScrollLock` hook (reference-counted). Eliminate all direct `document.body.style.overflow` writes.
- **Animation properties:** Only animate `transform` + `opacity`. Never animate `width`, `height`, `padding`, `left`, `top` — causes jank.
- **whileInView:** Use `viewport={{ once: true }}` on all `whileInView` animations to prevent replay on scroll-back.
- **Grid isolation:** Apply `isolation: isolate` to the grid container. Keep the fixed hero element outside the animation tree.
- **React keys:** Use `project.slug` as key on project cards. Never use array index.
- **Tailwind v4 borders:** Always write explicit border color classes. `border` alone defaults to `currentColor` (not gray-200 like v3).
- **Tailwind v4 layers:** ALL global resets and base rules go inside `@layer base {}`. Unlayered CSS beats all utilities.

### Known Risks (from research)

1. AnimatePresence exit animations break with `<Outlet>` — prevention: `useOutlet()` pattern (address at Phase 3 start)
2. Unlayered CSS overrides all Tailwind v4 utilities — prevention: enforce `@layer base` from Phase 1
3. Framer Motion opacity creates stacking contexts breaking modal z-index — prevention: Portal (address at Phase 3 start)
4. `gray-matter` returns `any`, frontmatter errors fail silently — prevention: Zod validation at parse time (Phase 1)
5. Scroll lock race condition from v1's `setTimeout(900ms)` — prevention: centralized `useScrollLock` (Phase 1)

### Open Questions

- Tailwind typography plugin v4 compatibility: verify `prose-invert` renders correctly when building `CaseStudyContent` in Phase 2. Small spike, not a blocker.
- OG tag implementation approach for Phase 4: neither `react-helmet` nor Vite HTML plugin deeply researched. Verify before committing to one approach.

### Todos

- [ ] Confirm whether `react-markdown` v10 peer dep warning needs `--legacy-peer-deps` or `pnpm.overrides` workaround (Phase 2)
- [ ] Verify `React.lazy()` on `CaseStudyPage` splits markdown content out of main bundle (`pnpm build` inspection) during Phase 4

---

## Session Continuity

### How to Resume

1. Read this STATE.md file first
2. Read `.planning/ROADMAP.md` for phase structure
3. Check which phase is current (see "Current Position" above)
4. Run `/gsd:plan-phase [N]` for the current phase

### File Index

| File | Purpose |
|------|---------|
| `.planning/PROJECT.md` | Project context, constraints, decisions |
| `.planning/REQUIREMENTS.md` | All v1 requirements with IDs |
| `.planning/ROADMAP.md` | Phase structure with success criteria |
| `.planning/STATE.md` | This file — project memory |
| `.planning/research/SUMMARY.md` | Research findings (stack, features, architecture, pitfalls) |
| `.planning/config.json` | Depth (comprehensive), mode (yolo), parallelization |

---

*State initialized: 2026-03-02*
