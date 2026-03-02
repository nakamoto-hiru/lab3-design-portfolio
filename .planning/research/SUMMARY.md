# Research Summary

**Project:** Slug Portfolio — Markdown Content + Animations Layer (v2 rebuild)
**Synthesized:** 2026-03-02
**Files synthesized:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md

---

## Executive Summary

The v2 rebuild extends an already-working React 19 + Vite 7 + Tailwind CSS v4 SPA with two new horizontal concerns: a markdown-based content pipeline and a polished Framer Motion animation layer. The existing stack is locked and well-chosen — no re-evaluation needed there. The primary architectural additions are (1) a build-time markdown processing system using `@content-collections/core` or the simpler `?raw` import pattern with `gray-matter` + Zod validation, and (2) a systematic animation layer built around `motion/react` (already installed as `framer-motion` v12) patterns: `whileInView` for scroll reveals, `staggerChildren` for the project grid, and `AnimatePresence` with `useOutlet()` for page transitions.

The recommended approach is content-first: stand up the markdown pipeline and case study detail pages before adding any animation polish. The reason is dependency order — animations layer on top of content, but content does not depend on animations. A broken case study page is a table-stakes regression; a missing stagger animation is a polish gap. The feature research confirms this prioritization: full case study detail pages (not just the existing modal) are the single highest-impact missing feature, and the markdown system is the prerequisite for that page.

The key risks are integration-specific rather than conceptual. The AnimatePresence + React Router Outlet pattern is a known footgun that silently breaks exit animations. The Tailwind v4 cascade layer system will cause mysterious utility failures if any global CSS is written outside `@layer base`. Modal z-index will break during page transitions due to Framer Motion opacity animations creating stacking contexts. All three risks have clear, documented prevention strategies. Address them at setup time, not after observing the bug.

---

## Key Findings

### From STACK.md — Technology Additions

The existing stack requires only additive packages, no replacements.

| Addition | Package | Rationale |
|----------|---------|-----------|
| Content system | `@content-collections/core` + `@content-collections/vite` | Build-time, type-safe, Zod-schema frontmatter. Official Vite plugin. Active. Contentlayer was archived 2024 — do not use. |
| Markdown renderer | `react-markdown` v10 + `remark-gfm` + `rehype-highlight` | Industry standard, safe (no dangerouslySetInnerHTML), unmatched plugin ecosystem. Install with `--legacy-peer-deps` for React 19 peer dep warning (non-functional issue). |
| Schema validation | `zod` | Peer dep of content-collections; validates frontmatter at build time |
| Syntax highlighting | `highlight.js` | Peer dep of rehype-highlight; import only needed languages for bundle size |
| Animation | No new packages | `framer-motion` v12 already installed. Migrate imports to `motion/react`. |

**Critical version notes:**
- `framer-motion` v12 = `motion` v12. Same package. Migrate imports from `"framer-motion"` to `"motion/react"` immediately.
- `react-markdown` v10 has a React 19 peer dep declaration mismatch only — it works functionally. Use `--legacy-peer-deps` or add a `pnpm.overrides` entry.
- Contentlayer is archived as of 2024. Do not reference it in any phase.

**Simpler alternative to `@content-collections`:** Vite's native `import file from './path?raw'` + `gray-matter` + manual Zod validation is a viable alternative that requires zero plugin setup. The architecture research documents both paths. For a portfolio with < 20 projects, the simpler approach is likely sufficient.

---

### From FEATURES.md — What to Build

**Table stakes (non-negotiable):**
- Case study detail pages with full markdown body rendering — the modal-only v1 approach is insufficient for rich content; this is the primary feature gap
- Contact form connected to a working backend (Formspree or equivalent)
- Mobile responsive polish across all breakpoints
- Fast load time (<3s) via WebP images, lazy loading, minimal bundle
- Correct `<title>` and favicon per route (often forgotten in SPAs)

**Differentiators (high signal, worth building):**
- Scroll-triggered fade/slide animations on project cards (`whileInView`)
- Staggered grid entry animation (`staggerChildren`) — creates premium feel
- Page transitions between routes (`AnimatePresence`)
- Hero parallax (`useScroll` + `useTransform`)
- Open Graph meta tags per case study route (for LinkedIn/Slack sharing)
- Hover micro-interactions on cards and nav
- Keyboard-accessible modal (focus trapping, ESC to close)

**Anti-features (explicit no-build list):**
- Dark/light theme toggle — commits half the design attention to a second color system for zero hiring signal
- Headless CMS (Contentful, Sanity) — overcomplicated for solo portfolio; markdown in git is correct
- Cursor custom effects — novelty fatigue, signals student-level work
- Parallax on every section — motion sickness; reserve for hero only
- Skills bars / percentage meters — universally mocked
- Backend / SSR — not needed; static Vite build to Vercel/Netlify

**Defer to v2+ or ignore:**
- Image lightbox — basic `<img>` tags work; add only if design feedback requests it
- Analytics — adds complexity and privacy overhead; low ROI for a hiring context
- Blog/writing section — dilutes focus; link externally if writing exists

---

### From ARCHITECTURE.md — How to Structure It

The recommended architecture adds two new layers to the existing SPA structure without changing its core shape:

```
Content Layer:  src/content/{projects/*.md, about.md}  →  loader.ts  →  typed TS data
Animation Layer: src/hooks/{useScrollAnimation, useParallax, useScrollLock}
                 src/lib/animations.ts  (shared Framer Motion variants)
                 src/components/common/AnimatedSection.tsx
```

**New components:**
- `CaseStudyPage.tsx` — route `/case-studies/:slug`, renders full markdown case study
- `CaseStudyContent.tsx` — `react-markdown` + `prose prose-invert` from `@tailwindcss/typography`
- `CaseStudyHeader.tsx` — hero block for case study (title, tags, cover image)
- `AnimatedSection.tsx` — reusable `whileInView` fade-up wrapper; eliminates animation prop duplication

**Key pattern decisions:**
- Use `whileInView` directly on `motion.div` for simple one-off animations. Custom hooks only for reused logic (parallax, stagger) or imperative needs.
- Keep frontmatter strictly for metadata. All prose body goes below the `---` delimiter as standard markdown.
- Use explicit imports in `loader.ts` (not `import.meta.glob`) for `< 20` projects — gives intentional ordering with no performance cost.
- `React.lazy()` on `CaseStudyPage` so markdown body text is code-split out of the main bundle.
- Define shared animation variants in `src/lib/animations.ts` — prevents per-component drift in timing/easing.

**Build order (from architecture research):**
1. `src/lib/markdown.ts` + `src/lib/animations.ts` (pure utilities, no React dependency)
2. `src/content/loader.ts` (depends on typed interfaces from step 1)
3. Animation hooks + `AnimatedSection` (depends on animation variants from step 1)
4. Retrofit existing components with animation (depends on step 3)
5. New case study components + `CaseStudyPage` (depends on steps 2 + 3)
6. Router + navbar updates (depends on `CaseStudyPage` existing)

---

### From PITFALLS.md — Risks and Prevention

**Top 5 pitfalls to address immediately (all rated HIGH confidence):**

1. **AnimatePresence exit animations break with `<Outlet>`** — Use `useOutlet()` + `React.cloneElement(element, { key: location.pathname })`. Must implement from day one before any per-page animations are written. `mode="wait"` prevents overlapping transitions.

2. **Unlayered CSS overrides all Tailwind v4 utilities** — Any CSS written outside a `@layer` block silently beats all Tailwind utilities. All global resets and base rules go inside `@layer base {}`. This is already documented in the project memory but must be enforced in every phase.

3. **Framer Motion opacity animations create stacking contexts, breaking modal z-index** — Render `ProjectModal` via a React Portal to `document.body`. Animate page content sections, not layout wrapper elements. The modal must be outside the animated page subtree.

4. **`gray-matter` returns `any` — frontmatter errors fail silently at runtime** — Add Zod schema validation at parse time using `zod-matter` or a manual Zod `.parse()` call after `gray-matter`. Define the schema before writing any content files.

5. **Scroll lock race condition from v1 codebase** — The existing `setTimeout(900ms)` scroll lock and modal scroll lock operate independently on the same DOM property. Implement `useScrollLock` (reference-counted centralized hook) and eliminate all direct `document.body.style.overflow` manipulations.

**Additional moderate-risk pitfalls:**
- Animate only `transform` + `opacity`, never layout properties (`width`, `height`, `padding`, `left`, `top`) — layout animations cause jank
- Prefer `whileInView` over `useInView` + `useState` — the latter triggers React re-render storms at scroll time
- Fixed hero + Framer Motion `will-change` on grid cards can create stacking context conflicts — add `isolation: isolate` to grid container, keep hero outside animation tree
- Always write explicit border color classes — Tailwind v4 `border` defaults to `currentColor` (not gray-200 as in v3)
- Use `project.slug` as React key on project cards, never array index

---

## Implications for Roadmap

Based on the combined research, three phases are suggested. The feature dependency graph from FEATURES.md and the build order from ARCHITECTURE.md are in strong agreement on sequencing.

### Phase 1 — Content Foundation

**Rationale:** The markdown pipeline and case study detail pages are the highest-impact missing features. Everything else layers on top of this. Animation work on the grid is meaningless if the grid still serves only stub data.

**Delivers:** Working markdown content system; full case study pages; project cards sourced from frontmatter data; mobile-polished layouts; working contact form.

**Features from FEATURES.md:**
- Markdown content system (prerequisite for everything)
- Case study detail pages at `/case-studies/:slug`
- Project grid sourced from frontmatter (title, tags, thumbnail, role, outcome, year)
- Contact form connected to Formspree
- Mobile responsive polish
- Correct page titles + favicon per route

**Pitfalls to address in this phase:**
- Pitfall 4: Zod frontmatter validation (define schema first)
- Pitfall 9: Centralized `useScrollLock` hook (replaces v1 race condition)
- Pitfall 11: `project.slug` as React key on cards
- Pitfall 10: Explicit border color classes in all new components

**Research flag:** LOW — markdown pipeline with `gray-matter` + Vite `?raw` imports is a well-documented pattern. No additional research needed. Follow the implementation patterns in ARCHITECTURE.md directly.

---

### Phase 2 — Animation Layer

**Rationale:** Animations are differentiators, not table stakes. They should only be added once the underlying content and routing are stable. Adding animations to unstable components generates rework.

**Delivers:** Scroll-triggered card animations; staggered grid entry; hero parallax; page transitions between routes; hover micro-interactions.

**Features from FEATURES.md:**
- `whileInView` fade/slide on project cards
- `staggerChildren` on grid container
- `AnimatePresence` page transitions
- Hero parallax (`useScroll` + `useTransform`)
- Hover micro-interactions on cards and nav buttons

**Pitfalls to address in this phase:**
- Pitfall 1: `useOutlet()` + `cloneElement` for AnimatePresence (address at phase start)
- Pitfall 3: Modal via React Portal; animate content not wrappers (address at phase start)
- Pitfall 5: Only animate `transform` + `opacity` throughout
- Pitfall 6: Prefer `whileInView` with `viewport={{ once: true }}` over `useInView` + state
- Pitfall 7: `isolation: isolate` on grid container; hero outside animation tree
- Pitfall 12: Standardize all imports on `"motion/react"` before writing any animation code

**Research flag:** LOW — Framer Motion patterns are extensively documented. The `AnimatePresence` + React Router v7 integration is the one area with a known gotcha (covered in Pitfall 1), and the prevention is clear.

---

### Phase 3 — Polish and Distribution

**Rationale:** Distribution-layer features (OG tags, image optimization, performance) are highest value when the content and animations are finalized. Doing them earlier means redoing them after content changes.

**Delivers:** OG meta tags per case study; optimized images (WebP, lazy loading); performance budget validation; accessibility polish; `prefers-reduced-motion` support.

**Features from FEATURES.md:**
- Open Graph meta tags per route (react-helmet or Vite HTML plugin)
- WebP image optimization + lazy loading
- `prefers-reduced-motion` media query in animation hooks
- Keyboard-accessible modal (focus trapping, ARIA labels)
- Verified external links (no 404s on deploy)

**Pitfalls to address in this phase:**
- Pitfall 8: Verify `React.lazy()` on `CaseStudyPage` is splitting markdown content out of main bundle (`pnpm build` inspection)

**Research flag:** LOW for most items. MEDIUM for OG tag implementation — verify which approach is cleanest with React Router v7 and Vite's HTML plugin system. May warrant a targeted research spike if the chosen approach is unclear.

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|------------|-------|
| Stack additions | HIGH | Official docs verified for all recommended packages. One known React 19 peer dep warning on `react-markdown` is non-blocking and has documented workaround. |
| Features | MEDIUM-HIGH | Table stakes and anti-features are well-established. Differentiator priority ordering is based on portfolio patterns and hiring context analysis — directionally correct but not empirically validated. |
| Architecture | HIGH | Data flow patterns verified against Vite official docs, Framer Motion official docs, and gray-matter documentation. Build order is dependency-graph derived. |
| Pitfalls | HIGH | All critical pitfalls verified against library GitHub issues, official changelogs, and existing codebase analysis (CONCERNS.md). |

**Overall confidence: HIGH**

The domain (React SPA + markdown content + scroll animations) is mature and well-documented. No novel or experimental territory. Pitfalls are known and preventable. Recommended stack choices are actively maintained with official documentation.

---

## Gaps to Address

1. **Tailwind typography plugin v4 compatibility** — ARCHITECTURE.md flags this as MEDIUM confidence. The `@plugin "@tailwindcss/typography";` integration in Tailwind v4 is documented but has reported quirks. Verify that `prose-invert` renders correctly against the dark background theme during Phase 1 case study component build. Small spike, not a blocker.

2. **OG tag implementation approach** — Neither `react-helmet` nor Vite's HTML meta plugin integration with React Router v7 was deeply researched. If per-route OG tags are prioritized in Phase 3, do a brief implementation check before committing to an approach.

3. **Content-collections vs gray-matter choice** — STACK.md recommends `@content-collections` as primary and `gray-matter` + `?raw` as a simpler alternative. ARCHITECTURE.md documents the simpler approach in its code patterns. The roadmap should pick one at the start of Phase 1 and not switch mid-phase. Recommendation: start with the simpler `gray-matter` + `?raw` approach since it requires zero plugin configuration and the portfolio will never exceed 20 projects. Adopt `@content-collections` only if the manual loader becomes burdensome.

---

## Sources (Aggregated)

**HIGH confidence:**
- [Motion for React — Official Docs](https://motion.dev/docs/react)
- [Motion scroll animations](https://motion.dev/docs/react-scroll-animations)
- [Content Collections — Vite Quickstart](https://www.content-collections.dev/docs/quickstart/vite)
- [react-markdown GitHub](https://github.com/remarkjs/react-markdown)
- [Vite official features docs (glob, ?raw)](https://vite.dev/guide/features)
- [gray-matter documentation](https://github.com/jonschlinkert/gray-matter)
- [Tailwind CSS v4 official release blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
- [Framer Motion opacity stacking context issue #1885](https://github.com/framer/motion/issues/1885)
- [AnimatePresence + React Router Outlet pattern](https://medium.com/@antonio.falcescu/animating-react-pages-with-react-router-dom-outlet-and-framer-motion-animatepresence-bd5438b3433b)
- [Existing codebase CONCERNS.md](/.planning/codebase/CONCERNS.md)
- [React documentation on keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)

**MEDIUM confidence:**
- [Page Transitions in React Router with Framer Motion — Seth Corker](https://blog.sethcorker.com/page-transitions-in-react-router-with-framer-motion/)
- [React Markdown Complete Guide 2025 — Strapi](https://strapi.io/blog/react-markdown-complete-guide-security-styling)
- [No Backend? Handling Forms with Formspree in React](https://medium.com/@imeudani/no-backend-no-problem-handling-forms-with-formspree-in-html-react-and-next-js-64307ba4c7af)
- [Tailwind v4 + typography plugin integration](https://github.com/tailwindlabs/tailwindcss/discussions/17645)
- [zod-matter — typesafe frontmatter](https://github.com/HiDeoo/zod-matter)
