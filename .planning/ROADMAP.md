# Roadmap: Slug Portfolio v2

**Project:** Slug Portfolio — Markdown Content + Animations Rebuild
**Created:** 2026-03-02
**Depth:** Comprehensive
**Total Phases:** 4
**Requirements Coverage:** 38/38 v1 requirements mapped

---

## Phases

- [x] **Phase 1: Foundation** - Establish theme, architecture, and project scaffold with typed markdown pipeline
- [x] **Phase 2: Layout & Content** - Deliver every page with real content, responsive layouts, and working contact form
- [x] **Phase 3: Animation Layer** - Layer Framer Motion animations across all components with accessibility support
- [ ] **Phase 4: Polish & Distribution** - Add SEO meta tags, OG images, and finalize for deployment

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-03-02 |
| 2. Layout & Content | 4/4 | Complete | 2026-03-02 |
| 3. Animation Layer | 3/3 | Complete | 2026-03-02 |
| 4. Polish & Distribution | 1/2 | In progress | - |

---

## Phase Details

### Phase 1: Foundation

**Goal**: The project scaffold is clean, typed, and ready for feature work — theme variables are applied, folder structure is in place, and the markdown pipeline parses and validates frontmatter at load time.

**Depends on**: Nothing (first phase)

**Requirements**: THEM-01, THEM-02, THEM-03, THEM-04, ARCH-01, ARCH-02, ARCH-03, ARCH-04, ARCH-05, ARCH-06, ARCH-07

**Success Criteria** (what must be TRUE):
  1. Opening the dev server shows the correct light theme — `#fafafa` background, `#e0e0e0` borders, `#1a1a1a` text, `#4c48ff` accent — without any Tailwind utility conflicts
  2. Aeonik Pro renders at weights 400, 500, and 700 on screen; no fallback system font is visible in the browser devtools font inspector
  3. Adding a new markdown file under `src/content/projects/` with correct frontmatter causes it to appear in the project list without any component code changes
  4. Adding a markdown file with invalid or missing frontmatter fields throws a Zod validation error at parse time (visible in console or build output), not a silent runtime failure
  5. `AnimatedSection`, animation variants in `lib/animations.ts`, and the `useScrollLock` hook exist as importable modules with TypeScript types intact

**Plans:** 3/3 plans executed

Plans:
- [x] 01-01-PLAN.md -- Theme verification, package install, folder structure, TypeScript declarations
- [x] 01-02-PLAN.md -- Animation variants, AnimatedSection component, useScrollLock hook
- [x] 01-03-PLAN.md -- Markdown content pipeline (Zod schemas, loader, seed markdown files, contact data)

---

### Phase 2: Layout & Content

**Goal**: Every page of the site works end-to-end with real content — the home grid shows real project cards from markdown, case study pages render full markdown bodies, the about and contact pages pull from data files, and all layouts are polished across mobile, tablet, and desktop.

**Depends on**: Phase 1

**Requirements**: LAYO-01, LAYO-02, LAYO-03, LAYO-04, LAYO-05, LAYO-06, CONT-01, CONT-02, CONT-03, CTCT-01, CTCT-02, RESP-01, RESP-02, RESP-03, RESP-04, RESP-05

**Success Criteria** (what must be TRUE):
  1. Visiting `/` shows the fixed hero behind a scrolling project grid; scrolling up reveals the hero, scrolling down covers it with the grid
  2. Clicking a project card navigates to `/case-studies/:slug` and renders the full markdown body — headings, lists, code blocks, and images display with correct typography
  3. Visiting the site on a phone (< 768px) shows a single-column layout with a simplified nav and all tap targets at least 44px tall
  4. Submitting the contact form with a valid email sends the message via Formspree and shows a success confirmation; submitting with an empty required field shows an inline validation error
  5. The project modal opens via `?project=slug` query param and closes without a page reload; modal content matches the project's frontmatter data

**Plans:** 4 plans

Plans:
- [x] 02-01-PLAN.md -- Install packages, activate typography plugin, migrate home page to content loader data
- [x] 02-02-PLAN.md -- Build CaseStudyPage with markdown rendering, add route, update Navbar and ProjectModal
- [x] 02-03-PLAN.md -- Migrate AboutPage to markdown, wire Formspree contact form
- [x] 02-04-PLAN.md -- Responsive audit and visual verification across all breakpoints

---

### Phase 3: Animation Layer

**Goal**: The site feels premium and fluid — project cards animate in as they scroll into view, the grid staggers its entries, page transitions are smooth, the hero has parallax depth, and hover states on cards and nav feel tactile. Users who prefer reduced motion see none of it.

**Depends on**: Phase 2

**Requirements**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, ANIM-06, ANIM-07, ANIM-08

**Success Criteria** (what must be TRUE):
  1. Scrolling down the home page causes project cards to fade and slide up into view one after another in sequence — not all at once
  2. Navigating between pages (home -> about -> contact) shows a visible transition animation; the outgoing page exits before the incoming page enters
  3. On a device or browser with `prefers-reduced-motion: reduce` enabled, all scroll and page transition animations are absent; the content still renders correctly
  4. Hovering over a project card shows a visible scale or shadow change and reveals the arrow indicator; hovering a nav item shows a color transition
  5. Slowly scrolling up and down while the hero is visible causes the hero content to move at a different rate than the scrolling grid, creating a parallax depth effect

**Plans:** 3 plans

Plans:
- [x] 03-01-PLAN.md -- Fix RootLayout imports, add MotionConfig + ScrollRestoration, page transitions, reduced-motion CSS, Portal modal
- [x] 03-02-PLAN.md -- Staggered scroll-reveal on project grid, hero parallax with useScroll + useTransform
- [x] 03-03-PLAN.md -- Hover micro-interactions on project cards and nav items

---

### Phase 4: Polish & Distribution

**Goal**: The site is ready to share — every page has the correct browser title and favicon, social sharing previews show the right image and description for each case study, and the build is verified clean for deployment.

**Depends on**: Phase 3

**Requirements**: META-01, META-02, META-03

**Success Criteria** (what must be TRUE):
  1. Each route (home, about, contact, and each case study) shows a distinct, descriptive title in the browser tab — not a generic "Slug Portfolio" on every page
  2. Pasting a case study URL into a Slack or LinkedIn message preview shows the correct project title, description, and thumbnail image from the project's frontmatter
  3. Running `pnpm build` completes without errors and the output `dist/` folder contains the site with correct asset references; opening `dist/index.html` locally loads the site without broken links

**Plans:** 2 plans

Plans:
- [x] 04-01-PLAN.md -- SEO data layer, favicon, React 19 runtime title tags for all pages
- [ ] 04-02-PLAN.md -- Wire vite-plugin-react-meta-map for build-time OG HTML, verify production build

---

## Coverage Map

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEM-01 | Phase 1 | Pending |
| THEM-02 | Phase 1 | Pending |
| THEM-03 | Phase 1 | Pending |
| THEM-04 | Phase 1 | Pending |
| ARCH-01 | Phase 1 | Pending |
| ARCH-02 | Phase 1 | Done |
| ARCH-03 | Phase 1 | Done |
| ARCH-04 | Phase 1 | Done |
| ARCH-05 | Phase 1 | Done |
| ARCH-06 | Phase 1 | Done |
| ARCH-07 | Phase 1 | Done |
| LAYO-01 | Phase 2 | Done |
| LAYO-02 | Phase 2 | Done |
| LAYO-03 | Phase 2 | Done |
| LAYO-04 | Phase 2 | Done |
| LAYO-05 | Phase 2 | Pending |
| LAYO-06 | Phase 2 | Done |
| CONT-01 | Phase 2 | Done |
| CONT-02 | Phase 2 | Done |
| CONT-03 | Phase 2 | Done |
| CTCT-01 | Phase 2 | Pending |
| CTCT-02 | Phase 2 | Pending |
| RESP-01 | Phase 2 | Done |
| RESP-02 | Phase 2 | Done |
| RESP-03 | Phase 2 | Done |
| RESP-04 | Phase 2 | Done |
| RESP-05 | Phase 2 | Done |
| ANIM-01 | Phase 3 | Done |
| ANIM-02 | Phase 3 | Done |
| ANIM-03 | Phase 3 | Done |
| ANIM-04 | Phase 3 | Done |
| ANIM-05 | Phase 3 | Done |
| ANIM-06 | Phase 3 | Done |
| ANIM-07 | Phase 3 | Done |
| ANIM-08 | Phase 3 | Done |
| META-01 | Phase 4 | Pending |
| META-02 | Phase 4 | Pending |
| META-03 | Phase 4 | Pending |

**Coverage: 38/38 v1 requirements mapped. No orphans.**

---

*Roadmap created: 2026-03-02*
*Last updated: 2026-03-02 -- Phase 4 planned (2 plans created)*
