# Architecture Patterns

**Domain:** React SPA portfolio with markdown content and scroll-driven animations
**Researched:** 2026-03-02
**Overall Confidence:** HIGH — based on existing codebase analysis + verified library documentation

---

## Recommended Architecture

The v2 rebuild extends the existing layered SPA architecture with two new horizontal concerns:
a **content pipeline** (markdown files → typed data → rendered components) and an
**animation system** (scroll-triggered + page-transition Framer Motion patterns).

```
┌──────────────────────────────────────────────────────────────────────┐
│  CONTENT LAYER (new)                                                  │
│  src/content/{projects,about}.md  →  gray-matter  →  typed TS data   │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ Project[], AboutData (typed)
┌────────────────────────────▼─────────────────────────────────────────┐
│  DATA LAYER (evolve from src/data/)                                   │
│  src/content/loader.ts  —  loadProjects(), loadAbout()               │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ Props passed down
┌────────────────────────────▼─────────────────────────────────────────┐
│  PAGE LAYER  (src/pages/)                                             │
│  HomePage  |  AboutPage  |  ContactPage  |  CaseStudyPage (new)      │
└──────┬──────────────────────────────────────────────────────────────┘
       │ Component composition
┌──────▼──────────────────────────────────────────────────────────────┐
│  FEATURE COMPONENTS (src/components/)                                 │
│  home/  →  Hero, ProjectGrid, ProjectCard, ProjectModal              │
│  case-study/ (new) →  CaseStudyContent, CaseStudyHeader             │
│  common/ (new)     →  AnimatedSection, AnimatedCard                  │
│  layout/           →  RootLayout, Navbar, Footer                     │
└──────┬──────────────────────────────────────────────────────────────┘
       │ Animation primitives
┌──────▼──────────────────────────────────────────────────────────────┐
│  ANIMATION LAYER (src/hooks/ + src/lib/)                             │
│  useScrollAnimation, useParallax, AnimatedSection wrapper            │
│  Framer Motion: whileInView, useScroll, useTransform, stagger        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

### Layer 1 — Content (new, src/content/)

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `src/content/projects/` | Raw .md files for each case study | Loader only |
| `src/content/about.md` | About page body text in markdown | Loader only |
| `src/content/loader.ts` | Parses frontmatter + body; returns typed TS objects | Page layer (imported at module level) |

Content files are pure data — they have no knowledge of React, routing, or animations.
The loader is a pure TypeScript module (no React); it uses `gray-matter` to separate
frontmatter metadata from markdown body content.

---

### Layer 2 — Data (evolve from src/data/)

`src/data/` currently holds TypeScript constants. In v2, it stays but is fed by the
loader rather than being authored directly in TS files.

| Module | Responsibility | Communicates With |
|--------|---------------|-------------------|
| `src/content/loader.ts` | `loadProjects()`, `loadProject(slug)`, `loadAbout()` | Pages, CaseStudyPage |
| `src/lib/markdown.ts` (new) | Wraps gray-matter + typed schema; exports parsed result | Loader |

**Why this split is better than the current pattern:**
Content updates require editing `.md` files only, not TypeScript source. Non-developers
(or future-you in 12 months) can update case study text without touching component code.

---

### Layer 3 — Pages (src/pages/)

| Page | Route | New Responsibilities |
|------|-------|---------------------|
| `HomePage.tsx` | `/` | Feeds typed `Project[]` to `ProjectGrid`; manages modal query param (unchanged) |
| `AboutPage.tsx` | `/about` | Renders markdown body from `loadAbout()` via `react-markdown` |
| `ContactPage.tsx` | `/contact` | Unchanged from v1 |
| `CaseStudyPage.tsx` (new) | `/case-studies/:slug` | Loads single project by slug; renders full markdown body |

**Decision: Case study as full page, not only modal.**
The PROJECT.md requirement explicitly calls for "case study detail pages with rich markdown content
(not just modal)." The modal remains for quick-look but the full route `/case-studies/:slug` renders
the complete case study with prose content. Both can coexist.

---

### Layer 4 — Feature Components (src/components/)

#### Existing components (modify in place)

| Component | Change Required |
|-----------|----------------|
| `Hero.tsx` | Add `whileInView` or `useInView` fade-in on mount; add parallax on scroll |
| `ProjectCard.tsx` | Wrap in `AnimatedCard` or apply `whileInView` stagger directly |
| `ProjectGrid.tsx` | Apply `stagger()` to card children via Framer Motion variants |
| `ProjectModal.tsx` | Content already animated; add `prose` class wrapper for rich markdown rendering if body added |
| `Navbar.tsx` | Micro-interaction on hover; active indicator animation |

#### New components

| Component | Location | Responsibility |
|-----------|----------|---------------|
| `AnimatedSection` | `src/components/common/AnimatedSection.tsx` | Reusable scroll-triggered fade-up wrapper; accepts `delay`, `once` props |
| `AnimatedCard` | `src/components/common/AnimatedCard.tsx` | Card with hover micro-interaction + `whileInView` entry |
| `CaseStudyContent` | `src/components/case-study/CaseStudyContent.tsx` | Renders markdown body via `react-markdown` + `prose` typography |
| `CaseStudyHeader` | `src/components/case-study/CaseStudyHeader.tsx` | Hero section for case study page (title, tags, image) |

---

### Layer 5 — Animation Hooks (src/hooks/)

Centralising animation logic in hooks keeps components declarative and prevents copy-paste.

| Hook | Responsibility | Used By |
|------|---------------|---------|
| `useScrollAnimation` | Returns `ref + controls`; triggers `animate("visible")` when ref enters viewport | `AnimatedSection`, any section component |
| `useParallax` | Wraps `useScroll` + `useTransform`; returns `y` motion value for parallax offset | `Hero`, `ProjectGrid` background layer |
| `useScrollLock` | Centralises `document.body.style.overflow` management (fixes existing bug) | `ProjectModal`, `HomePage` |

**Why custom hooks over inline `whileInView`:**
For simple one-off animations, `whileInView` directly on `motion.div` is fine and preferred.
Custom hooks are only warranted for reused patterns (parallax, stagger orchestration) or
cases that require imperative control (e.g., triggering animation after fetch completes).

---

## Data Flow

### 1. Markdown → Rendered Component (Case Study)

```
src/content/projects/my-project.md
  │  (YAML frontmatter: title, slug, tags, color, summary)
  │  (Markdown body: full case study content)
  ▼
src/content/loader.ts  →  gray-matter(rawFile)
  │  returns: { data: ProjectMeta, content: string }
  │  validates against TypeScript interface ProjectMeta
  ▼
CaseStudyPage.tsx  (imports loader, calls loadProject(slug))
  │  receives: { meta: ProjectMeta, body: string }
  ▼
CaseStudyHeader.tsx  ← meta (title, tags, image, color)
CaseStudyContent.tsx ← body (raw markdown string)
  │
  ▼
react-markdown + remark-gfm
  │  renders: <article className="prose prose-invert"> ... </article>
  ▼
Browser — styled via @tailwindcss/typography plugin
```

**Confidence:** HIGH — verified pattern from Kristian Hannula's Vite+React+Tailwind article and gray-matter official documentation.

---

### 2. Project List → Home Page Grid

```
src/content/projects/*.md
  │  (frontmatter only — no full body needed for grid cards)
  ▼
loadProjects()  →  import.meta.glob('./content/projects/*.md', { eager: true })
  │  or: explicit imports listed in loader.ts
  │  returns: ProjectMeta[]  (sorted, typed)
  ▼
HomePage.tsx  →  <ProjectGrid projects={projects} />
  ▼
ProjectGrid.tsx  →  stagger variant on parent, maps to <ProjectCard>
  ▼
ProjectCard.tsx  →  renders title, tags, image placeholder (or real image)
```

**Vite glob caveat:** `import.meta.glob` with `{ eager: true }` loads all files immediately
(no lazy splitting). For a portfolio with < 20 projects, this is fine. The performance concern
raised in research (glob slows dev) only matters at 50+ files — not applicable here.
**Confidence:** HIGH — from Vite official docs on glob import feature.

---

### 3. Scroll Animation Flow

```
Browser scroll event
  │
  ▼ (Framer Motion IntersectionObserver — pooled, low overhead)
useInView / whileInView detects element entering viewport
  │
  ▼
Framer Motion animates from "hidden" → "visible" variant
  │  { opacity: 0, y: 20 } → { opacity: 1, y: 0 }
  │  with stagger for list children
  ▼
React re-renders motion.div with new animation state
```

For parallax specifically:

```
Browser scroll position
  │
  ▼  useScroll({ target: containerRef })
scrollYProgress (0 → 1 motion value, no re-render)
  │
  ▼  useTransform(scrollYProgress, [0, 1], [0, -100])
parallaxY (motion value streamed to style)
  │
  ▼  <motion.div style={{ y: parallaxY }}>
CSS transform applied at 60fps via browser compositor (no JS re-render)
```

**Confidence:** HIGH — from Framer Motion official scroll animations documentation.

---

### 4. Page Transition Flow (existing, verified)

```
User clicks navbar link
  │
  ▼  React Router useLocation pathname changes
AnimatePresence key={location.pathname} detects key change
  │
  ▼  Exiting page: opacity 1 → 0 (0.3s)
  │  AnimatePresence mode="wait" blocks new page mount until exit completes
  ▼  Entering page: opacity 0 → 1 (0.3s)
RootLayout Outlet renders new page
```

This is the existing pattern from v1. It works. No change needed to the flow, only
potential polish to timing/easing values.

---

## Patterns to Follow

### Pattern 1: AnimatedSection wrapper

**What:** A reusable `motion.div` that applies `whileInView` fade-up to any section.

**When:** Wrapping any section of content that should animate in on scroll (about sections,
contact sections, case study sections).

**Why:** Avoids duplicating `initial`/`animate`/`transition` props across every section component.

```typescript
// src/components/common/AnimatedSection.tsx
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedSection({
  children,
  delay = 0,
  className,
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
```

`viewport={{ once: true }}` ensures animation plays only once (no re-trigger on scroll up).
`margin: "-80px"` triggers the animation slightly before the element is fully in view,
preventing a pop-in effect at the bottom edge of the viewport.

---

### Pattern 2: Staggered project grid

**What:** Parent motion.div holds `staggerChildren` in transition; each card is a `motion.div`
with `variants` that inherit from parent.

**When:** `ProjectGrid` rendering the array of `ProjectCard` components.

```typescript
// Parent (ProjectGrid)
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// Child (ProjectCard)
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Usage
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {projects.map((p) => (
    <motion.div key={p.slug} variants={cardVariants}>
      <ProjectCard project={p} />
    </motion.div>
  ))}
</motion.div>
```

**Confidence:** HIGH — from Framer Motion official stagger documentation.

---

### Pattern 3: Markdown content pipeline

**What:** Loader function parses frontmatter with `gray-matter`; component renders body with
`react-markdown`. TypeScript interface validates frontmatter shape at parse time.

**When:** Any component that needs content from a `.md` file.

```typescript
// src/lib/markdown.ts
import matter from "gray-matter";

export interface ProjectMeta {
  title: string;
  slug: string;
  tags: string[];
  summary: string;
  color: string;
  year: string;
  role: string;
}

export interface ParsedProject {
  meta: ProjectMeta;
  body: string;
}

export function parseProject(raw: string): ParsedProject {
  const { data, content } = matter(raw);
  return {
    meta: data as ProjectMeta, // validated by TypeScript interface
    body: content,
  };
}
```

```typescript
// src/content/loader.ts
// Vite: import raw .md as string via custom plugin or ?raw query
import rawAqua from "./projects/aqua.md?raw";

import { parseProject, type ParsedProject } from "@/lib/markdown";

export const projects: ParsedProject[] = [
  parseProject(rawAqua),
  // add each project file here
];

export function getProject(slug: string): ParsedProject | undefined {
  return projects.find((p) => p.meta.slug === slug);
}
```

**Note on `?raw` suffix:** Vite supports `import file from './path?raw'` natively since Vite 2.
This imports the file contents as a plain string without any plugin needed. No external plugin
required for this approach.
**Confidence:** HIGH — from Vite official features documentation.

---

### Pattern 4: Prose-styled markdown rendering

**What:** `react-markdown` with `@tailwindcss/typography` `prose` class for case study body.

**When:** `CaseStudyContent` and `AboutPage` sections that render markdown body content.

```typescript
// src/components/case-study/CaseStudyContent.tsx
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CaseStudyContentProps {
  body: string;
}

export default function CaseStudyContent({ body }: CaseStudyContentProps) {
  return (
    <article className="prose prose-invert max-w-none prose-headings:font-medium prose-a:text-[--color-accent]">
      <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
    </article>
  );
}
```

**Tailwind v4 note:** Add `@plugin "@tailwindcss/typography";` in `src/index.css` alongside
the existing `@import "tailwindcss"`. This is the v4-compatible way to enable first-party plugins.
The prose-invert modifier is required for the dark/light theme color scheme.
**Confidence:** MEDIUM — Tailwind v4 + typography plugin integration confirmed as supported but
has documented quirks; verify preflight reset doesn't strip react-markdown output. See PITFALLS.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Animating every element independently

**What:** Each leaf component has its own `initial`/`animate` props with no shared variant system.

**Why bad:** Variants become inconsistent across the site. Timing changes require edits in dozens
of components. Stagger effects are impossible without parent-child variant coordination.

**Instead:** Define a small set of named variants in `src/lib/animations.ts` (`fadeUp`, `fadeIn`,
`stagger`). Import and reuse them in all components that need the same motion personality.

---

### Anti-Pattern 2: Importing all markdown files with `import.meta.glob` eagerly for large collections

**What:** Using `import.meta.glob('./content/**/*.md', { eager: true })` to auto-discover all
content files without an explicit list.

**Why bad:** At small scale (< 20 files) it works fine, but glob forces all files into the main
bundle at build time. As the project grows it slows dev server startup. It also loses explicit
ordering control — you can't guarantee sort order from glob alone without post-processing.

**Instead:** For a portfolio with a known, small number of projects, use explicit imports in
`loader.ts` and manually order them. This keeps bundle predictable and ordering intentional.
Switch to glob only if project count exceeds 15 and manual management becomes burdensome.

---

### Anti-Pattern 3: Putting markdown body in frontmatter

**What:** Storing all case study content in YAML fields (`description: |` multi-line string)
rather than in the markdown body below the `---` delimiter.

**Why bad:** YAML multi-line strings lose markdown formatting. Code blocks, headings, and links
inside YAML are not parsed as markdown. The content becomes unreadable in the `.md` file.

**Instead:** Keep frontmatter strictly for metadata (title, slug, tags, summary, color, year).
Write all body content below the closing `---` as standard markdown.

---

### Anti-Pattern 4: Blocking React renders with scroll events

**What:** Using `addEventListener('scroll', handler)` in a `useEffect` and calling `setState`
inside the handler to drive animation values.

**Why bad:** Every scroll event triggers a React re-render. At 60fps this means 60 renders/second
during scrolling — a significant performance hit on mobile.

**Instead:** Use Framer Motion's `useScroll` which returns motion values. Motion values update
CSS transforms directly via the browser compositor without triggering React re-renders. For
threshold detection (enter/exit viewport), use `useInView` or `whileInView` which internally
uses a pooled `IntersectionObserver`, not scroll events.

---

## Suggested Build Order

The dependencies between components determine what must be built before what.

```
Phase 1 — Foundation (no dependencies)
  ├── src/lib/markdown.ts          (gray-matter wrapper, typed interfaces)
  ├── src/lib/animations.ts        (shared Framer Motion variants)
  └── src/content/projects/*.md   (actual content files)

Phase 2 — Data pipeline (depends on Phase 1)
  └── src/content/loader.ts        (imports markdown, exports typed arrays)

Phase 3 — Animation primitives (depends on Phase 1 lib)
  ├── src/hooks/useScrollAnimation.ts
  ├── src/hooks/useParallax.ts
  ├── src/hooks/useScrollLock.ts   (replaces fragile direct manipulation)
  └── src/components/common/AnimatedSection.tsx

Phase 4 — Retrofit existing components (depends on Phase 3)
  ├── Hero.tsx + parallax
  ├── ProjectCard.tsx + whileInView
  └── ProjectGrid.tsx + stagger

Phase 5 — New content components (depends on Phase 2 + 3)
  ├── src/components/case-study/CaseStudyContent.tsx
  ├── src/components/case-study/CaseStudyHeader.tsx
  └── src/pages/CaseStudyPage.tsx  (new route /case-studies/:slug)

Phase 6 — Route + navigation updates (depends on Phase 5)
  ├── src/router.tsx               (add /case-studies/:slug route)
  └── src/components/layout/Navbar.tsx (link ProjectCard to case study route)
```

**Rationale for this order:**
- Animation variants and markdown parser are pure utilities — no React dependency — build first.
- Loader depends on the typed interfaces defined in `lib/markdown.ts`.
- `AnimatedSection` depends on variant constants from `lib/animations.ts`.
- Existing components can be retrofitted independently once animation primitives exist.
- Case study page depends on both the loader (data) and content components (rendering).
- Router update is last because it depends on `CaseStudyPage` existing.

---

## Scalability Considerations

| Concern | Current (< 10 projects) | At 20+ projects | At 50+ projects |
|---------|------------------------|-----------------|-----------------|
| Content loading | Explicit imports in loader.ts | Switch to `import.meta.glob` | Same + consider pagination |
| Bundle size | All MD in main bundle — acceptable | Still fine (text is small) | Consider lazy-loading case study bodies |
| Animation performance | All cards in DOM + animated | Add `viewport.amount` threshold | Add react-window for virtualization |
| Case study routes | Static slug list in router | Auto-generated from glob | Same |

---

## File Structure Delta (v1 → v2)

```
src/
├── content/                     # NEW — markdown source files
│   ├── projects/
│   │   ├── aqua.md              # one file per case study
│   │   └── other-project.md
│   ├── about.md
│   └── loader.ts                # loads + parses all content
├── components/
│   ├── home/                    # EXISTING — modify in place
│   │   ├── Hero.tsx             # add parallax
│   │   ├── ProjectCard.tsx      # add whileInView
│   │   ├── ProjectGrid.tsx      # add stagger
│   │   └── ProjectModal.tsx     # add optional body rendering
│   ├── case-study/              # NEW
│   │   ├── CaseStudyContent.tsx # react-markdown + prose
│   │   └── CaseStudyHeader.tsx  # hero for case study page
│   ├── common/                  # NEW
│   │   └── AnimatedSection.tsx  # scroll-trigger wrapper
│   └── layout/                  # EXISTING — minor updates
│       ├── RootLayout.tsx
│       ├── Navbar.tsx
│       └── Footer.tsx
├── hooks/                       # NEW
│   ├── useScrollAnimation.ts
│   ├── useParallax.ts
│   └── useScrollLock.ts
├── lib/
│   ├── cn.ts                    # EXISTING — unchanged
│   ├── markdown.ts              # NEW — gray-matter wrapper
│   └── animations.ts            # NEW — shared Framer Motion variants
├── pages/
│   ├── HomePage.tsx             # EXISTING — data source changes
│   ├── AboutPage.tsx            # EXISTING — add markdown rendering
│   ├── ContactPage.tsx          # EXISTING — mostly unchanged
│   └── CaseStudyPage.tsx        # NEW — full case study route
└── ...
```

---

## Sources

- Vite official docs on glob import and `?raw` asset suffix: [https://vite.dev/guide/features](https://vite.dev/guide/features) — HIGH confidence
- gray-matter library documentation: [https://github.com/jonschlinkert/gray-matter](https://github.com/jonschlinkert/gray-matter) — HIGH confidence (widely used, battle-tested)
- react-markdown official README: [https://github.com/remarkjs/react-markdown](https://github.com/remarkjs/react-markdown) — HIGH confidence
- Framer Motion scroll animations: [https://motion.dev/docs/react-scroll-animations](https://motion.dev/docs/react-scroll-animations) — HIGH confidence
- Framer Motion useInView: [https://motion.dev/docs/react-use-in-view](https://motion.dev/docs/react-use-in-view) — HIGH confidence
- @tailwindcss/typography v4 integration: [https://github.com/tailwindlabs/tailwindcss/discussions/17645](https://github.com/tailwindlabs/tailwindcss/discussions/17645) — MEDIUM confidence (known quirk, verify)
- React Router v7 + markdown static site: [https://geb1024.com/articles/rrv7-markdown-static-website/](https://geb1024.com/articles/rrv7-markdown-static-website/) — MEDIUM confidence
- Rendering markdown in Vite + React + TypeScript + Tailwind: [https://kristianhannula.com/posts/rendering-markdown-files-with-react-typescript-vite-and-tailwind/](https://www.kristianhannula.com/posts/rendering-markdown-files-with-react-typescript-vite-and-tailwind/) — MEDIUM confidence
- AnimatePresence + React Router pattern: [https://medium.com/@antonio.falcescu/animating-react-pages-with-react-router-dom-outlet-and-framer-motion-animatepresence-bd5438b3433b](https://medium.com/@antonio.falcescu/animating-react-pages-with-react-router-dom-outlet-and-framer-motion-animatepresence-bd5438b3433b) — MEDIUM confidence (existing implementation in v1 confirms)

---

*Architecture research: 2026-03-02*
