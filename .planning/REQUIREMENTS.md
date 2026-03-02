# Requirements: Slug Portfolio v2

**Defined:** 2026-03-02
**Core Value:** Present Slug Macro's work clearly and beautifully — premium layout, fluid animations, easy-to-update content.

## v1 Requirements

Requirements for the rebuild. Each maps to roadmap phases.

### Architecture

- [x] **ARCH-01**: Project uses clean folder structure with clear separation of concerns (components, content, lib, pages, data)
- [ ] **ARCH-02**: All project data lives in markdown files with frontmatter, not hardcoded in components
- [ ] **ARCH-03**: About page content sourced from markdown file
- [ ] **ARCH-04**: Contact page data (links, info) sourced from markdown/data file
- [ ] **ARCH-05**: Shared animation variants defined in a central lib file
- [ ] **ARCH-06**: Reusable animation wrapper component (AnimatedSection) for scroll reveals
- [ ] **ARCH-07**: Type-safe frontmatter parsing with Zod validation

### Layout

- [x] **LAYO-01**: Fixed hero + scrolling grid parallax layout (sam-smith.design pattern)
- [ ] **LAYO-02**: 4-column navbar (SM | Case studies | About | Let's collaborate) with active indicator
- [x] **LAYO-03**: Staggered 2-column project grid with 1px divider
- [x] **LAYO-04**: Max-width 1800px, left-aligned container
- [ ] **LAYO-05**: Footer with accent background and branding
- [ ] **LAYO-06**: Project modal via query params for quick-look

### Responsive

- [x] **RESP-01**: Mobile layout (< 768px) with single-column grid, hamburger or simplified nav
- [x] **RESP-02**: Tablet layout (768px–1024px) with adapted grid and nav
- [x] **RESP-03**: Desktop layout (> 1024px) with full 2-column staggered grid
- [x] **RESP-04**: All text sizes scale appropriately across breakpoints
- [x] **RESP-05**: Touch-friendly interaction targets on mobile (min 44px)

### Animations

- [x] **ANIM-01**: Scroll-driven fade-in/slide-up on project cards as they enter viewport
- [x] **ANIM-02**: Staggered grid animation — cards enter in sequence, not all at once
- [x] **ANIM-03**: Page transition animations between routes (fade/slide with AnimatePresence)
- [x] **ANIM-04**: Hero parallax effect using useScroll + useTransform
- [x] **ANIM-05**: Hover micro-interactions on project cards (scale, shadow, arrow reveal)
- [x] **ANIM-06**: Hover micro-interactions on nav items (color transition, subtle movement)
- [x] **ANIM-07**: Respect `prefers-reduced-motion` — disable animations for users who prefer reduced motion
- [x] **ANIM-08**: Smooth scroll behavior for in-page navigation

### Content

- [x] **CONT-01**: Project markdown files with frontmatter (title, slug, year, color, tags, description, thumbnail)
- [ ] **CONT-02**: Markdown content renders correctly with proper typography (headings, lists, code blocks, images)
- [x] **CONT-03**: Frontmatter metadata drives project cards on home page (title, year, color, thumbnail)

### Contact

- [ ] **CTCT-01**: Contact form sends email via Formspree (no backend needed)
- [ ] **CTCT-02**: Form has validation and success/error feedback states

### SEO & Meta

- [x] **META-01**: Correct browser tab title and favicon
- [x] **META-02**: Open Graph meta tags for home, about, and contact pages
- [x] **META-03**: Per-project OG meta tags (title, description, image from frontmatter)

### Theme

- [x] **THEM-01**: Light theme — bg #fafafa, borders #e0e0e0, text #1a1a1a, accent #4c48ff
- [x] **THEM-02**: Aeonik Pro font system (400, 500, 700) loaded from local woff2
- [x] **THEM-03**: Tailwind CSS v4 with @theme custom properties
- [x] **THEM-04**: CSS variables for all theme values (easy to maintain)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content Expansion

- **CSDP-01**: Full case study detail pages with rich markdown content (Problem → Process → Outcome)
- **CSDP-02**: Image lightbox/zoom for case study screenshots
- **CSDP-03**: Scroll-to-section navigation within case studies

### Polish

- **PLSH-01**: Keyboard-accessible modal with focus trapping and ARIA labels
- **PLSH-02**: Testimonials section on About page
- **PLSH-03**: Minimal analytics (Plausible or Fathom)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dark/light theme toggle | Single light theme executed well; toggle adds complexity without hiring signal |
| Headless CMS | Markdown files are sufficient; zero infra overhead |
| Blog/writing section | Dilutes focus; portfolio = case studies only |
| Intro splash screen / heavy loading animation | Delays content access; anti-pattern for portfolios |
| Custom cursor effects | Novelty fatigue; feels like student project |
| Parallax on every section | Motion sickness risk; reserve for hero only |
| Infinite scroll on grid | Hides work; show all projects at once |
| Skills bars / percentage meters | Universally mocked; list technologies in prose instead |
| Backend / SSR | No dynamic content; pure static SPA |
| Authentication / gated content | Portfolio must be fully public |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ARCH-01 | Phase 1 | Complete |
| ARCH-02 | Phase 1 | Pending |
| ARCH-03 | Phase 1 | Pending |
| ARCH-04 | Phase 1 | Pending |
| ARCH-05 | Phase 1 | Pending |
| ARCH-06 | Phase 1 | Pending |
| ARCH-07 | Phase 1 | Pending |
| THEM-01 | Phase 1 | Complete |
| THEM-02 | Phase 1 | Complete |
| THEM-03 | Phase 1 | Complete |
| THEM-04 | Phase 1 | Complete |
| LAYO-01 | Phase 2 | Complete |
| LAYO-02 | Phase 2 | Pending |
| LAYO-03 | Phase 2 | Complete |
| LAYO-04 | Phase 2 | Complete |
| LAYO-05 | Phase 2 | Pending |
| LAYO-06 | Phase 2 | Pending |
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Complete |
| CTCT-01 | Phase 2 | Pending |
| CTCT-02 | Phase 2 | Pending |
| RESP-01 | Phase 2 | Complete |
| RESP-02 | Phase 2 | Complete |
| RESP-03 | Phase 2 | Complete |
| RESP-04 | Phase 2 | Complete |
| RESP-05 | Phase 2 | Complete |
| ANIM-01 | Phase 3 | Complete |
| ANIM-02 | Phase 3 | Complete |
| ANIM-03 | Phase 3 | Complete |
| ANIM-04 | Phase 3 | Complete |
| ANIM-05 | Phase 3 | Complete |
| ANIM-06 | Phase 3 | Complete |
| ANIM-07 | Phase 3 | Complete |
| ANIM-08 | Phase 3 | Complete |
| META-01 | Phase 4 | Complete |
| META-02 | Phase 4 | Complete |
| META-03 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 38
- Unmapped: 0

---
*Requirements defined: 2026-03-02*
*Last updated: 2026-03-02 after roadmap creation — traceability complete*
