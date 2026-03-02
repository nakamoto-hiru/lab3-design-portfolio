# Requirements: Slug Portfolio v2

**Defined:** 2026-03-02
**Core Value:** Present Slug Macro's work clearly and beautifully — premium layout, fluid animations, easy-to-update content.

## v1 Requirements

Requirements for the rebuild. Each maps to roadmap phases.

### Architecture

- [ ] **ARCH-01**: Project uses clean folder structure with clear separation of concerns (components, content, lib, pages, data)
- [ ] **ARCH-02**: All project data lives in markdown files with frontmatter, not hardcoded in components
- [ ] **ARCH-03**: About page content sourced from markdown file
- [ ] **ARCH-04**: Contact page data (links, info) sourced from markdown/data file
- [ ] **ARCH-05**: Shared animation variants defined in a central lib file
- [ ] **ARCH-06**: Reusable animation wrapper component (AnimatedSection) for scroll reveals
- [ ] **ARCH-07**: Type-safe frontmatter parsing with Zod validation

### Layout

- [ ] **LAYO-01**: Fixed hero + scrolling grid parallax layout (sam-smith.design pattern)
- [ ] **LAYO-02**: 4-column navbar (SM | Case studies | About | Let's collaborate) with active indicator
- [ ] **LAYO-03**: Staggered 2-column project grid with 1px divider
- [ ] **LAYO-04**: Max-width 1800px, left-aligned container
- [ ] **LAYO-05**: Footer with accent background and branding
- [ ] **LAYO-06**: Project modal via query params for quick-look

### Responsive

- [ ] **RESP-01**: Mobile layout (< 768px) with single-column grid, hamburger or simplified nav
- [ ] **RESP-02**: Tablet layout (768px–1024px) with adapted grid and nav
- [ ] **RESP-03**: Desktop layout (> 1024px) with full 2-column staggered grid
- [ ] **RESP-04**: All text sizes scale appropriately across breakpoints
- [ ] **RESP-05**: Touch-friendly interaction targets on mobile (min 44px)

### Animations

- [ ] **ANIM-01**: Scroll-driven fade-in/slide-up on project cards as they enter viewport
- [ ] **ANIM-02**: Staggered grid animation — cards enter in sequence, not all at once
- [ ] **ANIM-03**: Page transition animations between routes (fade/slide with AnimatePresence)
- [ ] **ANIM-04**: Hero parallax effect using useScroll + useTransform
- [ ] **ANIM-05**: Hover micro-interactions on project cards (scale, shadow, arrow reveal)
- [ ] **ANIM-06**: Hover micro-interactions on nav items (color transition, subtle movement)
- [ ] **ANIM-07**: Respect `prefers-reduced-motion` — disable animations for users who prefer reduced motion
- [ ] **ANIM-08**: Smooth scroll behavior for in-page navigation

### Content

- [ ] **CONT-01**: Project markdown files with frontmatter (title, slug, year, color, tags, description, thumbnail)
- [ ] **CONT-02**: Markdown content renders correctly with proper typography (headings, lists, code blocks, images)
- [ ] **CONT-03**: Frontmatter metadata drives project cards on home page (title, year, color, thumbnail)

### Contact

- [ ] **CTCT-01**: Contact form sends email via Formspree (no backend needed)
- [ ] **CTCT-02**: Form has validation and success/error feedback states

### SEO & Meta

- [ ] **META-01**: Correct browser tab title and favicon
- [ ] **META-02**: Open Graph meta tags for home, about, and contact pages
- [ ] **META-03**: Per-project OG meta tags (title, description, image from frontmatter)

### Theme

- [ ] **THEM-01**: Light theme — bg #fafafa, borders #e0e0e0, text #1a1a1a, accent #4c48ff
- [ ] **THEM-02**: Aeonik Pro font system (400, 500, 700) loaded from local woff2
- [ ] **THEM-03**: Tailwind CSS v4 with @theme custom properties
- [ ] **THEM-04**: CSS variables for all theme values (easy to maintain)

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
| ARCH-01 | — | Pending |
| ARCH-02 | — | Pending |
| ARCH-03 | — | Pending |
| ARCH-04 | — | Pending |
| ARCH-05 | — | Pending |
| ARCH-06 | — | Pending |
| ARCH-07 | — | Pending |
| LAYO-01 | — | Pending |
| LAYO-02 | — | Pending |
| LAYO-03 | — | Pending |
| LAYO-04 | — | Pending |
| LAYO-05 | — | Pending |
| LAYO-06 | — | Pending |
| RESP-01 | — | Pending |
| RESP-02 | — | Pending |
| RESP-03 | — | Pending |
| RESP-04 | — | Pending |
| RESP-05 | — | Pending |
| ANIM-01 | — | Pending |
| ANIM-02 | — | Pending |
| ANIM-03 | — | Pending |
| ANIM-04 | — | Pending |
| ANIM-05 | — | Pending |
| ANIM-06 | — | Pending |
| ANIM-07 | — | Pending |
| ANIM-08 | — | Pending |
| CONT-01 | — | Pending |
| CONT-02 | — | Pending |
| CONT-03 | — | Pending |
| CTCT-01 | — | Pending |
| CTCT-02 | — | Pending |
| META-01 | — | Pending |
| META-02 | — | Pending |
| META-03 | — | Pending |
| THEM-01 | — | Pending |
| THEM-02 | — | Pending |
| THEM-03 | — | Pending |
| THEM-04 | — | Pending |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 0
- Unmapped: 37 ⚠️

---
*Requirements defined: 2026-03-02*
*Last updated: 2026-03-02 after initial definition*
