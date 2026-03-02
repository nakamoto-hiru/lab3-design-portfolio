# Technology Stack

**Project:** Slug Portfolio — Markdown Content + Animations Layer
**Researched:** 2026-03-02
**Scope:** Additive research. Existing stack (React 19 + Vite 7 + Tailwind CSS v4 + React Router v7) is fixed. This document covers only the new additions needed for markdown-based content and smooth animations.

---

## Existing Stack (Fixed — Do Not Re-evaluate)

| Technology | Version (installed) | Role |
|------------|---------------------|------|
| React | 19.2.0 | UI framework |
| Vite | 7.3.1 | Build tool + dev server |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4.2.1 | Styling |
| React Router DOM | 7.13.1 | Client-side routing |
| framer-motion | 12.34.3 | Animation (already installed) |
| clsx + tailwind-merge | latest | Class utilities |

---

## Recommended Additions

### 1. Markdown Content System

#### Primary: `@content-collections/core` + `@content-collections/vite`

**Confidence: HIGH** — Official Vite integration, active development, verified via official docs.

| Package | Version | Role |
|---------|---------|------|
| `@content-collections/core` | latest (`^0.x`) | Schema definition, collection runtime |
| `@content-collections/vite` | latest (`^0.x`) | Vite plugin integration |
| `zod` | `^3.x` | Schema validation for frontmatter (peer dep of content-collections) |

**Why content-collections over alternatives:**
- Type-safe frontmatter out of the box — schema defined with Zod, TypeScript types inferred automatically
- Build-time processing with HMR support in development
- Single config file (`content.config.ts`) handles all collections
- Official Vite plugin, zero friction with existing Vite 7 config
- Used by and integrated with Astro/VitePress patterns — battle-tested approach
- No runtime overhead — content processed at build time, imported as plain JS objects

**Why NOT vite-plugin-markdown:** Last meaningful update was 2022, no active maintenance, limited TypeScript support. LOW confidence in long-term viability.

**Why NOT manual `import.meta.glob` + gray-matter:** Works but defeats the purpose — you'd be hand-rolling what content-collections gives you out of the box (typed schema, validation, transforms). Appropriate for one-off use, not a content system.

**Why NOT MDX (`@mdx-js/rollup`):** MDX adds React component embedding to markdown. For case study content, this is unnecessary complexity. Plain markdown with react-markdown renderer is simpler, safer, and easier to maintain. Use MDX only if you need interactive React components inside markdown — this project doesn't.

**Installation:**
```bash
pnpm add @content-collections/core @content-collections/vite zod
```

**Setup summary:**
```typescript
// content.config.ts (project root)
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    slug: z.string(),
    year: z.number(),
    tags: z.array(z.string()),
    summary: z.string(),
    coverImage: z.string().optional(),
  }),
});

export default defineConfig({ collections: [projects] });
```

```typescript
// vite.config.ts — add plugin
import contentCollections from "@content-collections/vite";
plugins: [react(), tailwindcss(), contentCollections()]
```

**Add to `.gitignore`:** `.content-collections/`
**Add to `tsconfig.json` paths:** `"content-collections": ["./.content-collections/generated"]`

---

#### Secondary: `react-markdown` + plugins (for rendering)

**Confidence: MEDIUM** — v10.1.0 is current, but has a known React 19 peer dependency warning. Functional with `--legacy-peer-deps` or overrides.

| Package | Version | Role |
|---------|---------|------|
| `react-markdown` | `^10.1.0` | Renders markdown string to React elements |
| `remark-gfm` | `^4.0.0` | GitHub Flavored Markdown (tables, strikethrough, task lists) |
| `rehype-highlight` | `^7.x` | Syntax highlighting for code blocks |

**Why react-markdown:** The industry-standard, most downloaded React markdown renderer. Plugin ecosystem (remark/rehype) is unmatched. Safe by default — no `dangerouslySetInnerHTML`.

**React 19 compatibility note:** react-markdown v10 lists `react@>=18` as peer dep but works with React 19 functionally. Install with `--legacy-peer-deps` or add to `package.json` overrides:
```json
"pnpm": {
  "overrides": {
    "react-markdown": { "react": ">=18" }
  }
}
```
This is a peer dep declaration issue, not a functional incompatibility. The library renders correctly on React 19.

**Why NOT MDX for rendering:** See above. Unnecessary for static case study content.

**Installation:**
```bash
pnpm add react-markdown remark-gfm rehype-highlight --legacy-peer-deps
```

---

### 2. Animation System

#### Already Installed: `framer-motion` v12.34.3 — Migrate Import to `motion`

**Confidence: HIGH** — framer-motion v12 IS the `motion` package. Same codebase, same version number. The package `framer-motion` is being sunset in favor of `motion` but currently ships the same code.

**Recommended action:** Migrate imports from `framer-motion` to `motion/react` now.

```typescript
// Old (still works but deprecated path)
import { motion, AnimatePresence } from "framer-motion"

// New (preferred, future-proof)
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "motion/react"
```

**No new packages needed** — `framer-motion` v12 in package.json already provides `motion/react` as an entry point.

**Key APIs for this project:**

| API | Use Case | Confidence |
|-----|----------|------------|
| `motion.div` with `whileInView` | Scroll-triggered fade-ins on project cards | HIGH |
| `useScroll` + `useTransform` | Parallax effects on hero section | HIGH |
| `AnimatePresence` | Page transition mount/unmount animations | HIGH |
| `motion.div` with `variants` | Staggered card reveals in project grid | HIGH |
| `useInView` | Imperative scroll detection for complex triggers | HIGH |
| `useSpring` | Smooth spring-physics on parallax values | HIGH |

**Performance note:** Motion v12 uses the browser's native `ScrollTimeline` API where available (Chrome/Edge), falling back to JS. This means scroll-linked animations are hardware-accelerated at 120fps on modern browsers. No extra config needed.

**No additional animation libraries needed.** Do not add GSAP, AOS, or ScrollReveal — they duplicate Motion's capabilities and increase bundle size.

---

### 3. Supporting Utilities

#### `highlight.js` (peer dep for rehype-highlight)

| Package | Version | Role |
|---------|---------|------|
| `highlight.js` | `^11.x` | Syntax highlighting engine (peer dep) |

```bash
pnpm add highlight.js
```

Import only the languages you need to keep bundle small:
```typescript
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
hljs.registerLanguage('typescript', typescript)
```

---

## Alternatives Considered and Rejected

| Category | Recommended | Rejected | Reason for Rejection |
|----------|-------------|----------|---------------------|
| Content system | @content-collections | vite-plugin-markdown | Abandoned, no TypeScript, last updated 2022 |
| Content system | @content-collections | Manual import.meta.glob | Hand-rolling boilerplate, no type safety without extra work |
| Content system | @content-collections | Contentlayer | **Archived/unmaintained** as of 2024 — do not use |
| Markdown renderer | react-markdown | MDX (@mdx-js/rollup) | Overkill for static prose content, adds complexity |
| Markdown renderer | react-markdown | markdown-it direct | No React integration, no plugin ecosystem, requires wrapper |
| Animations | motion (framer-motion) | GSAP | License cost for commercial use, larger bundle, no React-native API |
| Animations | motion (framer-motion) | AOS/ScrollReveal | CSS-class-based, no programmatic control, conflicts with React model |
| Animations | motion (framer-motion) | CSS scroll-driven animations (native) | Limited browser support in 2025, no exit animations, no spring physics |

---

## Complete Installation Command

```bash
# Content system
pnpm add @content-collections/core @content-collections/vite zod

# Markdown rendering
pnpm add react-markdown remark-gfm rehype-highlight highlight.js --legacy-peer-deps
```

No migration needed for animations — `framer-motion` v12 is already installed and provides `motion/react`.

---

## Configuration Checklist

- [ ] Add `@content-collections/vite` plugin to `vite.config.ts`
- [ ] Create `content.config.ts` at project root
- [ ] Add `.content-collections/` to `.gitignore`
- [ ] Add `content-collections` path alias to `tsconfig.json`
- [ ] Create `content/projects/` directory for markdown files
- [ ] Migrate animation imports from `framer-motion` to `motion/react`
- [ ] Choose a highlight.js theme and import CSS (e.g., `highlight.js/styles/github-dark.css`)

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| framer-motion / motion | HIGH | Verified current version (12.34.3), confirmed React 19 support, official docs checked |
| @content-collections | HIGH | Official Vite integration documented, Zod-based, actively maintained |
| react-markdown | MEDIUM | v10.1.0 confirmed current. React 19 peer dep warning is known but non-blocking |
| remark-gfm / rehype-highlight | HIGH | Active maintenance, standard plugins, well-documented |
| highlight.js | HIGH | Mature library, stable API |

---

## Sources

- [Motion for React — Official Docs](https://motion.dev/docs/react)
- [Motion scroll animations](https://motion.dev/docs/react-scroll-animations)
- [Motion upgrade guide (framer-motion → motion)](https://motion.dev/docs/react-upgrade-guide)
- [Content Collections — Vite Quickstart](https://www.content-collections.dev/docs/quickstart/vite)
- [react-markdown GitHub](https://github.com/remarkjs/react-markdown)
- [remark-gfm GitHub](https://github.com/remarkjs/remark-gfm)
- [React 19 + react-markdown peer dep issue](https://github.com/remarkjs/react-markdown/issues/920)
- [Motion v12 React 19 compatibility](https://www.framer.community/c/developers/framer-motion-v12-alpha-for-react-19-rc)
- [Framer Motion + Tailwind 2025 patterns](https://dev.to/manukumar07/framer-motion-tailwind-the-2025-animation-stack-1801)
