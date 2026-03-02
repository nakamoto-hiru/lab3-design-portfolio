# Feature Landscape

**Domain:** Personal portfolio — product designer / builder showcase
**Project:** Slug Portfolio (v2 rebuild)
**Researched:** 2026-03-02
**Research mode:** Ecosystem

---

## Context

This research covers features for a product-builder portfolio (trading infrastructure, AI-native products). The site uses a fixed-hero + scrolling-grid layout inspired by sam-smith.design, with Markdown-based content and Framer Motion animations. The primary audience is recruiters and hiring managers who spend ~60 seconds per case study. Secondary audience is collaborators/clients discovering via social sharing.

---

## Table Stakes

Features visitors expect. Missing = portfolio feels broken or unprofessional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Project/case study list on home page | Primary discovery mechanism; first thing any visitor looks for | Low | Already exists in v1; grid layout |
| Case study detail page | Recruiters need depth after scanning the grid — modal-only is insufficient for rich content | Medium | v1 used modal; v2 must add full detail pages with markdown rendering |
| About / bio page | Establishes identity, specialization, and professional context | Low | Already exists in v1 |
| Contact mechanism | Required for any professional inquiry or job application follow-up | Low | Form exists in v1; needs working submission via Formspree or similar |
| Mobile responsiveness | 40-60% of traffic is mobile; broken mobile = immediate bounce | Medium | v1 has mobile; v2 must polish breakpoints |
| Fast load time (<3s) | Slow sites signal inattention to craft — especially damaging for a product builder | Medium | Image optimization (WebP, lazy load), minimal bundle |
| Readable typography | Content legibility is non-negotiable; poor type = unreadable case studies | Low | Aeonik Pro already set up |
| Consistent navigation | Visitors need to move between pages without confusion | Low | 4-column navbar already in v1 |
| Legible case study structure | Problem → Process → Outcome; recruiters skim and need clear sections | Medium | Markdown headings + visual hierarchy in renderer |
| Working external links | GitHub, LinkedIn, or other social proof links must not 404 | Low | Verify on deploy |
| Correct browser tab title + favicon | Professionalism signal; required for bookmarking and sharing | Low | Often forgotten in SPAs |

---

## Differentiators

Features that set a portfolio apart. Not universally expected, but high signal to the right audience.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Scroll-driven fade/slide animations on project cards | Creates perceived polish and cinematic quality; signals attention to motion craft | Medium | Framer Motion `whileInView` + `useScroll`; must respect `prefers-reduced-motion` |
| Page transition animations between routes | Makes the SPA feel native and designed; rare enough to be memorable | Medium | Framer Motion `AnimatePresence` wrapping React Router `Outlet`; key on `location.pathname` |
| Fixed-hero + scrolling-grid parallax | Distinctive layout pattern that creates depth and visual interest beyond standard scrolling | High | Already in v1; must be preserved and made robust in v2 |
| Markdown-based content system | Enables fast iteration on project content without touching code; demonstrates engineering discipline | Medium | Vite + `react-markdown` + `gray-matter`; frontmatter for metadata, body for rich content |
| Rich case study pages with structured sections | Shows process depth; differentiates from designers who only show screenshots | High | Hero image + Overview + Role + Problem + Process + Outcome sections; rendered from Markdown |
| Hover micro-interactions on cards and nav | Subtle interactivity reinforces that the builder cares about UX details | Low-Medium | CSS + Framer Motion `whileHover`; scale, shadow, color transitions |
| Open Graph meta tags per case study | Controls appearance when shared on LinkedIn/Slack/iMessage; improves discoverability and social proof | Low | `react-helmet` or Vite `html-meta` plugin; per-route OG image, title, description |
| Staggered grid animation (cards enter in sequence) | Creates a premium "designed" feel on page load; signal of motion literacy | Medium | Framer Motion `staggerChildren` on grid container |
| Project role/outcome callout blocks | Scannable summary at top of each case study; recruiters get the essential info in <10 seconds | Low | Markdown frontmatter fields rendered into a structured metadata block |
| Image lightbox or zoom for case study screenshots | Lets viewers inspect design details without leaving the page | Medium | `yet-another-react-lightbox` or `medium-zoom`; low-weight libraries, accessible |
| Keyboard-accessible modal/navigation | Signals accessibility awareness — a real differentiator for product roles that own UX | Low-Medium | Focus trapping on modal, ESC to close, ARIA labels |
| Smooth scroll-to-section within case study | Allows navigation within long case studies without full page reload | Low | `scroll-behavior: smooth` or Framer Motion scroll utilities |

---

## Anti-Features

Features to explicitly NOT build. Each represents scope creep, performance cost, or user experience degradation.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Dark/light theme toggle | Adds complexity with no hiring signal; splits design attention between two color systems | Commit to single light theme; execute it perfectly |
| Headless CMS (Contentful, Sanity) | Overcomplicated for a solo portfolio; adds API dependency and cost | Markdown files in `/content/projects/` — tracked in git, zero infra |
| Blog / writing section | Dilutes focus; portfolios lose impact when they try to be everything | Case studies only; external link to Substack/Medium if writing exists |
| Heavy intro animations / splash screens | Delays access to actual content; hiring managers have 60 seconds total | Entry animations on existing content (stagger), not blocking screens |
| Cursor custom effects | High novelty fatigue; feels like student project rather than senior product work | Subtle hover states on interactive elements instead |
| Parallax on every section | Induces motion sickness; becomes noise when overused | Reserve parallax for hero only (already the design intent) |
| Full-screen video autoplay | Slow load, disruptive UX, accessibility problem | Use static mockup images; link to demo video if needed |
| Infinite scroll on project grid | Hides work behind interaction; portfolio should show all projects at once | Show all projects in grid (currently ~3-6 projects; no pagination needed) |
| Skills bars / percentage meters | Visually misleading, universally mocked by senior engineers and designers | List technologies in prose or tag form in About page |
| Testimonials carousel | Adds JS weight for low-signal social proof; carousels have poor UX | Static 2-3 quotes in About page if testimonials exist |
| Backend / server-side rendering | No dynamic content need; adds deployment complexity | Static Vite build; deploy to Vercel/Netlify as pure SPA |
| Authentication or gated content | Portfolio must be fully public; gatekeeping signals insecurity about work | Full public access; password-protect only if NDA requires it |
| Excessive third-party scripts (analytics, hotjar, etc.) | Page weight, privacy concerns, slower load | Minimal analytics (Plausible or Fathom if needed) or none at all |

---

## Feature Dependencies

```
Markdown content system
  → Case study detail pages (needs parsed markdown + frontmatter)
  → Project metadata on cards (title, tags, thumbnail from frontmatter)
  → OG meta tags per case study (description + image from frontmatter)

Case study detail pages
  → Rich content sections (hero, overview, role, outcome)
  → Image lightbox (needs images loaded in page context)
  → Scroll-to-section (needs sections to exist)

Page transition animations
  → React Router v7 route structure (needs AnimatePresence at route level)
  → All page components must be motion-compatible (no layout-breaking fixed elements)

Scroll-driven animations
  → Framer Motion whileInView (works independently per component)
  → Staggered grid (needs grid container as orchestrator)
  → parallax hero (needs useScroll + useTransform on hero element)

Contact form
  → Formspree account or similar (zero-backend form handling)
  → No dependency on other features
```

---

## MVP Recommendation

For the v2 rebuild, prioritize in this order:

**Phase 1 — Foundation (Table Stakes + Content System):**
1. Markdown content system with `react-markdown` + `gray-matter` + Vite glob imports
2. Project frontmatter schema (title, slug, tags, thumbnail, role, outcome, year)
3. Project grid rendering from markdown frontmatter
4. Case study detail pages rendering full markdown body
5. Mobile-responsive layouts polished to breakpoints

**Phase 2 — Animation Layer (Differentiators):**
6. Scroll-driven card fade/slide with `whileInView`
7. Staggered grid entry animation with `staggerChildren`
8. Page transition animations with `AnimatePresence`
9. Hover micro-interactions on cards, nav, and buttons
10. Hero parallax with `useScroll` + `useTransform`

**Phase 3 — Polish + Distribution (Differentiators):**
11. OG meta tags per case study route
12. Image lightbox for case study screenshots
13. Contact form connected to Formspree
14. Performance: WebP images, lazy loading, prefers-reduced-motion support

**Defer indefinitely:**
- Image lightbox (nice to have; basic img tags work)
- Analytics integration (adds complexity, low ROI for hiring scenario)

---

## Complexity Reference

| Level | Meaning for This Project |
|-------|--------------------------|
| Low | < half day; straightforward React component or config change |
| Medium | Half day to 1 day; requires integration work or careful state handling |
| High | 1-2 days; architectural concern, affects multiple components, needs testing |

---

## Sources

- [Product Design Portfolio: Best Practices and Real Examples — uxfol.io](https://blog.uxfol.io/product-design-portfolio/) — MEDIUM confidence (WebSearch, site returned mostly CSS)
- [Portfolio Website Anti-Patterns — Interaction Design Foundation](https://www.interaction-design.org/literature/article/avoid-design-portfolio-mistakes-costing-jobs) — MEDIUM confidence
- [The Ultimate UX Case Study Template & Structure 2026 — uxfol.io](https://blog.uxfol.io/ux-case-study-template/) — MEDIUM confidence
- [Page Transitions in React Router with Framer Motion — Seth Corker](https://blog.sethcorker.com/page-transitions-in-react-router-with-framer-motion/) — HIGH confidence (established pattern with code examples)
- [Framer Motion + React Router page transitions — Medium, 2025](https://medium.com/@genildocs/framer-motion-react-router-the-page-transition-strategy-that-made-my-spa-feel-native-6813aefcef7f) — MEDIUM confidence
- [How to load and render Markdown files into Vite React app — Medium](https://onticdani.medium.com/how-to-load-and-render-markdown-files-into-your-vite-react-app-using-typescript-ba5f79822350) — HIGH confidence (technical, matches project stack exactly)
- [vite-plugin-markdown — GitHub](https://github.com/hmsk/vite-plugin-markdown) — HIGH confidence (official repository)
- [React Markdown Complete Guide 2025 — Strapi](https://strapi.io/blog/react-markdown-complete-guide-security-styling) — HIGH confidence (well-maintained source)
- [10 Scroll Animations to Make Your Website Stand Out — Framer University](https://framer.university/blog/10-scroll-animations-to-make-your-website-stand-out) — MEDIUM confidence
- [CSS / JS Animation Trends 2026 — Web Peak](https://webpeak.org/blog/css-js-animation-trends/) — MEDIUM confidence (industry overview)
- [Portfolio Website Optimization: SEO & Performance Tips — DEV Community](https://dev.to/john_andrewsanvictores_/portfolio-website-optimization-seo-performance-tips-that-actually-work-i70) — MEDIUM confidence
- [No Backend? No Problem! Handling Forms with Formspree — Medium](https://medium.com/@imeudani/no-backend-no-problem-handling-forms-with-formspree-in-html-react-and-next-js-64307ba4c7af) — HIGH confidence (current, technical, specific to React)
