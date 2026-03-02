# Domain Pitfalls

**Domain:** React portfolio rebuild — markdown content system + scroll/page animations
**Researched:** 2026-03-02
**Project:** Slug Portfolio v2

---

## Critical Pitfalls

Mistakes that cause rewrites, broken layouts, or hours of debugging.

---

### Pitfall 1: AnimatePresence Exit Animations Silently Break With React Router Outlet

**What goes wrong:** When you wrap `<Outlet>` directly inside `<AnimatePresence>`, exit animations do not fire. The old page disappears instantly. No error is thrown. The entry animation of the new page may still work, making it look like partial success.

**Why it happens:** AnimatePresence tracks direct children by their `key` prop. React Router's `<Outlet>` renders children asynchronously and does not expose a stable key that AnimatePresence can track, so the router removes components from the DOM before AnimatePresence can run the exit sequence.

**Consequences:** Page transitions look broken on exit. Developers often add extra `initial`/`animate` props trying to fix the wrong problem, wasting time.

**Prevention:**
- Use `useOutlet()` instead of `<Outlet>`, clone the element with `key={location.pathname}`, and render it as a direct child of `<AnimatePresence>`.
- Add `mode="wait"` to `AnimatePresence` so the old page fully exits before the new page enters — prevents overlapping pages mid-transition.
- Pattern that works with React Router v7:

```tsx
// RootLayout.tsx
const location = useLocation();
const element = useOutlet();

return (
  <AnimatePresence mode="wait">
    {element && React.cloneElement(element, { key: location.pathname })}
  </AnimatePresence>
);
```

**Detection:** Exit animation doesn't fire, or new page fades in over the top of the old page simultaneously. Check: does your AnimatePresence have direct motion children with stable keys?

**Phase:** Route setup / RootLayout implementation. Address this before adding any per-page animations.

**Confidence:** HIGH — documented in multiple official and community sources, confirmed as the standard React Router v7 integration pattern.

---

### Pitfall 2: Unlayered CSS Always Wins Over Tailwind v4 Utilities

**What goes wrong:** You write a CSS rule outside any `@layer` block in your stylesheet. It appears to work, but it silently overrides any Tailwind utility class targeting the same property — regardless of specificity or class order.

**Why it happens:** Tailwind v4 places all its generated utilities inside native CSS cascade layers (`@layer utilities`). Any CSS written outside a named `@layer` block is "unlayered" and lives in the browser's implicit highest-priority layer — above all named layers. So unlayered rules always beat `@layer utilities` rules, even when the Tailwind class is more specific.

Cascade order in Tailwind v4:
```
@layer theme → @layer base → @layer components → @layer utilities → [unlayered CSS wins over all of these]
```

**Consequences:** Tailwind utility classes mysteriously stop working. Adding `!important` or increasing specificity doesn't help because the problem is layer order, not specificity. Time-consuming to debug without knowing this rule.

**Prevention:**
- All custom global CSS that sets base defaults must live inside `@layer base { }`.
- All global resets must use `@layer base { }`.
- Link color overrides (`a { color: inherit }`), font defaults, scroll behavior — all go in `@layer base`.
- Never write raw CSS rules in `index.css` outside a layer block, except for `@theme`, `@import`, and `@font-face` declarations (which are exempt from this rule).

**Detection:** A Tailwind class is applied in HTML but has no visible effect. Open DevTools, inspect the element — if a rule in your CSS file is overriding the Tailwind utility without being more specific, this is the cause.

**Phase:** CSS setup and any phase where global styles are modified. Document in `CONVENTIONS.md` immediately.

**Confidence:** HIGH — confirmed in official Tailwind v4 changelog and multiple migration guides.

---

### Pitfall 3: Framer Motion Opacity Animations Create Stacking Contexts, Breaking Z-Index

**What goes wrong:** A `<motion.div>` with an `animate={{ opacity: ... }}` transition creates a new CSS stacking context during the animation. Any children with high `z-index` values will have their stacking context confined to the animated parent — making them appear below elements outside the parent, even if their z-index is numerically higher.

**Why it happens:** CSS stacking contexts are created by many properties, including `opacity < 1` and `will-change: opacity`. Since Framer Motion adds `will-change` to animated elements and transitions through opacity values, it triggers stacking context creation mid-animation.

**Consequences:** Modal overlay appears behind navbar during page transition. Fixed-position elements appear below animated wrappers. Z-index fights that seem random and inconsistent (they disappear at rest but appear during the animation).

**Prevention:**
- Do not animate `opacity` on wrapper elements that contain `position: fixed` or high-z-index descendants.
- Animate page content at the page level (not the layout wrapper) to isolate stacking context creation.
- For modals: render them outside the animated page wrapper using a React Portal to `document.body`.
- Prefer animating individual content sections (cards, headings) rather than full-page wrappers when z-index conflicts exist.

**Detection:** Modal or navbar appears/disappears during page transition animation. Problem appears during animation, resolves when animation completes. Check: is your modal inside a `<motion.div>` that animates opacity?

**Phase:** Page transitions implementation and modal rebuild. Evaluate portal approach for ProjectModal.

**Confidence:** HIGH — confirmed in Framer Motion GitHub issues (#1885, #1117) and CSS stacking context documentation.

---

### Pitfall 4: gray-matter Has No Runtime Type Safety — Frontmatter Errors Fail Silently at Runtime

**What goes wrong:** `gray-matter` parses frontmatter YAML and returns `{ [key: string]: any }`. If a required field is missing (e.g., `title`, `slug`, `coverImage`), TypeScript cannot catch this at compile time — and the component renders with `undefined` values, causing blank sections or broken layouts rather than a clear error.

**Why it happens:** gray-matter provides no schema validation. Its TypeScript types use `any` for the data property. A typo in a markdown file (`tilte` instead of `title`) passes compilation and only manifests as a blank heading at runtime.

**Consequences:** Publishing a case study with missing frontmatter silently renders broken UI. The developer must manually inspect markdown files rather than getting a build error.

**Prevention:**
- Use `zod-matter` (a Zod wrapper around gray-matter) to define a schema and validate at parse time.
- Or: write a Zod schema and validate manually after `gray-matter` parses.
- Run validation at build time via a Vite plugin or a separate `scripts/validate-content.ts` script.

```typescript
// Example with zod-matter
import { matter } from 'zod-matter';
import { z } from 'zod';

const ProjectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  year: z.number(),
  tags: z.array(z.string()),
  coverImage: z.string().optional(),
});

const { data, content } = matter(rawFile, ProjectSchema);
// data is now typed as z.infer<typeof ProjectSchema>
// throws ZodError if frontmatter is invalid
```

**Detection:** Component renders with blank or undefined values. React DevTools shows `undefined` props for content fields.

**Phase:** Markdown content system setup. Define schema and validation before writing content files.

**Confidence:** HIGH — confirmed in gray-matter GitHub issues (#69) and npm documentation.

---

## Moderate Pitfalls

Mistakes that create technical debt or require non-trivial fixes.

---

### Pitfall 5: Animating Layout Properties Instead of Transform/Opacity Causes Jank

**What goes wrong:** Using Framer Motion to animate `width`, `height`, `padding`, `margin`, `top`, `left`, or `background-color` triggers browser layout recalculation and repaint on every frame. On mid-tier hardware or mobile, this produces visible stutter.

**Why it happens:** Layout properties force the browser to reflow the page every frame. GPU-composited properties (`transform`, `opacity`) do not require CPU-side layout calculation — they are handled entirely on the GPU compositor thread.

**Prevention:**
- Animate only `transform` (translate, scale, rotate) and `opacity` for all motion effects.
- For card hover effects: use `scale` via `whileHover={{ scale: 1.02 }}`, not changing `width` or `padding`.
- For slide-in effects: use `x`, `y` (which map to `translateX/Y`) rather than `left`/`top`.
- For fade-ins on scroll: use `opacity` + `y` together (`initial={{ opacity: 0, y: 24 }}`, `animate={{ opacity: 1, y: 0 }}`).
- Avoid animating `backgroundColor`, `borderColor`, `boxShadow` on scroll — reserve those for hover states that only animate on user interaction.

**Detection:** Chrome DevTools Performance panel shows "Layout" or "Paint" in the flame graph during animation. FPS drops below 60 during scroll.

**Phase:** Any animation implementation. Apply as a coding standard from the first animation written.

**Confidence:** HIGH — official Motion performance documentation, confirmed by browser rendering pipeline documentation.

---

### Pitfall 6: Scroll Animation Re-render Storms From useInView Triggering State Updates

**What goes wrong:** When `useInView` (from Framer Motion or react-intersection-observer) triggers a state update inside a component, React re-renders that component — and potentially its parent tree — on every scroll event that changes visibility. With 8+ project cards on the page, this causes batched re-renders that compete with the animation itself.

**Why it happens:** `useInView` hooks that set local `useState` values create React reconciliation cycles. The Intersection Observer fires its callback on the main thread, which queues a state update, which schedules a React render.

**Prevention:**
- Use Framer Motion's `whileInView` prop instead of `useInView` + state when possible. `whileInView` is managed internally and does not trigger React state updates.
- When using `useInView` from `react-intersection-observer`, pass `triggerOnce: true` so it only fires once per element (fires, sets state once, observer disconnects).
- Use `useAnimation()` hook pattern — connect to `useInView` but only call `controls.start()` rather than `setState`.

```tsx
// Preferred: no state update
<motion.div
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.5 }}
/>
```

**Detection:** Chrome DevTools Profiler shows many rapid "Render committed" events while scrolling. Remove event → stutter disappears.

**Phase:** Project grid and case study page scroll animations.

**Confidence:** MEDIUM — based on Framer Motion docs pattern guidance and react-intersection-observer GitHub issues.

---

### Pitfall 7: The Fixed Hero + Scrolling Grid Pattern Creates Paint Layer Conflicts With Framer Motion

**What goes wrong:** The layout uses `position: fixed` for the hero (z-1) with the project grid (z-10) scrolling over it. When Framer Motion adds `will-change: transform` to animated grid cards, it creates composite layers. These composite layers may not respect the fixed element's z-index correctly in some browser rendering paths, causing the hero to flash visible above cards briefly during animation.

**Why it happens:** `position: fixed` creates a stacking context relative to the viewport. `will-change: transform` on a child also creates a stacking context. The two stacking contexts do not always compose cleanly, especially when both are compositing simultaneously.

**Prevention:**
- Keep the hero element outside the React animation tree — do not wrap it in any `<motion.div>`.
- Ensure the grid container has a high enough z-index and `isolation: isolate` to create a clean stacking context boundary.
- Add `position: relative` and an explicit `z-index` to the scrolling grid container.
- Test on Safari specifically — Safari's compositing behavior differs from Chrome for fixed + will-change combinations.

**Detection:** Hero text or image briefly appears on top of project cards during scroll or animation. Only visible during animation, resolved at rest.

**Phase:** Fixed hero + grid layout implementation, before adding scroll animations.

**Confidence:** MEDIUM — based on CSS stacking context documentation and Framer Motion issues with fixed positioning.

---

### Pitfall 8: Markdown Imported at Runtime Creates Unnecessary Bundle Bloat

**What goes wrong:** Importing markdown files via a Vite plugin that processes them at runtime (rather than build-time) embeds the full parsed HTML or AST into the JavaScript bundle. For case study content that can be 2,000+ words, this adds meaningful kilobytes to the initial JS payload — content that is only needed when the user navigates to that specific case study.

**Why it happens:** When markdown is processed into a React component (via vite-plugin-md or similar), the entire rendered output becomes part of the JS module graph. Vite bundles it eagerly unless the import is explicitly lazy.

**Prevention:**
- Use `React.lazy()` + `import()` for case study page components so markdown content is only loaded when the route is visited.
- Or: process markdown at build time and generate static JSON data files — parse frontmatter and body separately, only include the body when the detail page loads.
- `content-collections` (the Vite-native content layer library) handles this correctly with code-splitting by default.

```typescript
// Lazy load case study pages so their markdown content splits out
const CaseStudyPage = React.lazy(() => import('./pages/CaseStudyPage'));
```

**Detection:** Run `pnpm build` and inspect `dist/assets/` — if you see a single large JS file containing recognizable text content from your markdown files, lazy loading is not working.

**Phase:** Markdown content system and case study page implementation.

**Confidence:** MEDIUM — based on Vite code-splitting documentation and static site best practices.

---

### Pitfall 9: Scroll Lock Race Condition on HomePage Initial Load

**What goes wrong:** The v1 codebase has a `setTimeout` of 900ms that locks `document.body.style.overflow`. If a user clicks a project card before 900ms elapses, the modal opens while scroll is locked from the initial load timer. When the modal closes, it releases scroll lock — but the initial-load timer may re-lock it, or the timer's cleanup runs after the modal sets `overflow: ""`, leaving scroll permanently locked.

**Why it happens:** Two independent effects managing the same global DOM property (`document.body.style.overflow`) without coordination. Both are using their own cleanup logic unaware of the other.

**Consequences:** User scrolls, finds the page locked. Requires a full page refresh. Severe UX regression.

**Prevention:**
- Implement a single scroll lock manager (custom hook `useScrollLock`) that counts active locks. Scroll only unlocks when the count reaches zero.
- Never use `document.body.style.overflow` directly in multiple places — always go through the centralized hook.

```typescript
// useScrollLock.ts — reference-counted scroll lock
const lockCount = { value: 0 };

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (active) {
      lockCount.value++;
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (active) {
        lockCount.value--;
        if (lockCount.value === 0) {
          document.body.style.overflow = '';
        }
      }
    };
  }, [active]);
}
```

**Detection:** Open site, immediately click a project card, close modal — check if page scrolls. Run this several times rapidly.

**Phase:** HomePage rebuild. Fix before adding Framer Motion page transitions (which add a third animation state).

**Confidence:** HIGH — documented as a known bug in `.planning/codebase/CONCERNS.md`.

---

### Pitfall 10: Tailwind v4 Border Color Default Changed From gray-200 to currentColor

**What goes wrong:** In Tailwind v3, `border` defaulted to `gray-200`. In Tailwind v4, `border` defaults to `currentColor` (inherits the text color). Any component that relied on the invisible-ish gray border in v3 will now render with a full-color border matching the text color, making borders suddenly visible and potentially breaking layouts.

**Why it happens:** Tailwind v4 aligned the default border color with the CSS default behavior for `border-color`. The v3 behavior was a Tailwind-specific override that v4 removed.

**Prevention:**
- Audit all components that use a `border` utility without an explicit color class (e.g., `border border-[rgba(255,255,255,0.1)]`).
- In `index.css`, add a global base rule: `*, *::before, *::after { border-color: var(--border-default); }` inside `@layer base` to restore a predictable default.
- Or: always write explicit border color classes (`border-[rgba(255,255,255,0.1)]`) — never rely on the default.

**Detection:** Borders that were invisible or subtle in development suddenly appear dark/colored after a style reset or fresh build.

**Phase:** Initial CSS setup and any component that uses `border` utilities.

**Confidence:** HIGH — confirmed in official Tailwind v4 changelog and multiple migration guides.

---

## Minor Pitfalls

---

### Pitfall 11: Array Index Keys on Animated Lists Cause Animation Mismatches

**What goes wrong:** Using array index as React key on project cards means that when the project list is filtered, sorted, or reordered, React maps the animation state of index `0` to whichever element is now first — causing wrong elements to animate in/out.

**Why it happens:** React uses keys to identify which element is which across renders. Index keys allow React to "reuse" a component instance for a different data item, confusing Framer Motion's `layoutId` tracking.

**Prevention:**
- Use a stable unique identifier (e.g., `project.slug`) as the key for all list-rendered components.
- This is already documented in CONCERNS.md as tech debt — resolve during the v2 rebuild.

**Detection:** Shuffle or filter the project list — wrong cards animate, or `layoutId` shared element transitions map to wrong elements.

**Phase:** ProjectGrid rebuild.

**Confidence:** HIGH — confirmed by React documentation on keys and existing CONCERNS.md analysis.

---

### Pitfall 12: The `motion` Package Import Path Changed in Framer Motion 12

**What goes wrong:** In Framer Motion v12, the package was restructured. Some import paths changed — specifically, the recommended import is now `from "motion/react"` rather than `from "framer-motion"`. The old path still works for now but may be deprecated in future releases.

**Why it happens:** The project renamed from "framer-motion" to "motion" as a standalone library, and the React integration moved to a sub-path export.

**Consequences:** Not an immediate break, but inconsistent imports across codebase create confusion and increase migration cost later.

**Prevention:**
- Standardize all motion imports to use `"motion/react"` in v2 rebuild.
- Add an ESLint rule or `tsconfig.paths` alias if needed to enforce consistency.

**Detection:** Codebase has a mix of `from "framer-motion"` and `from "motion/react"` imports.

**Phase:** Initial setup — set the correct import convention before writing any animation code.

**Confidence:** MEDIUM — based on Framer Motion v12 release notes and community reports.

---

### Pitfall 13: React StrictMode + Framer Motion Drag Gestures Produce Offset Bugs

**What goes wrong:** In React 19 with StrictMode enabled, drag gesture components may render with incorrect initial positions. The component appears offset from where it should be.

**Why it happens:** React 19 StrictMode double-invokes effects and ref callbacks to surface side effects. Framer Motion's drag gesture initialization uses refs and effects in a way that can misfire on the second invocation.

**Prevention:**
- This only affects drag gestures — most portfolio animations (fade, slide, scale, page transitions) are unaffected.
- If drag is not used in the portfolio, this is not a concern.
- If drag is ever added (e.g., for a draggable modal), test immediately in StrictMode and consider removing StrictMode from affected component subtrees as a workaround.

**Detection:** Draggable elements appear positioned incorrectly on load in development (StrictMode active) but correctly in production.

**Phase:** Relevant only if drag gestures are implemented.

**Confidence:** MEDIUM — based on Framer Motion GitHub issues and React 19 StrictMode behavior reports.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| RootLayout + page transitions | AnimatePresence exit doesn't fire with Outlet (Pitfall 1) | Use `useOutlet()` + `cloneElement` pattern from day one |
| CSS setup (`index.css`) | Unlayered CSS overrides all Tailwind utilities (Pitfall 2) | Write ALL global rules inside `@layer base {}` |
| Page transitions + modal | Opacity animation creates stacking context, breaks z-index (Pitfall 3) | Render modal via React Portal; animate page content, not layout wrappers |
| Markdown content system | gray-matter returns `any`, silent frontmatter errors (Pitfall 4) | Add Zod schema validation at parse time |
| Project grid scroll animations | Animating layout properties → jank (Pitfall 5) | Only animate `transform` + `opacity` |
| Project grid scroll animations | useInView re-render storms (Pitfall 6) | Prefer `whileInView` prop with `viewport={{ once: true }}` |
| Fixed hero rebuild | Stacking context conflict with will-change on animated cards (Pitfall 7) | Add `isolation: isolate` to grid container |
| Case study pages | Markdown bundle bloat in JS chunk (Pitfall 8) | Lazy-load case study pages |
| HomePage rebuild | Scroll lock race condition from v1 (Pitfall 9) | Implement centralized `useScrollLock` hook |
| Any border usage | Border defaults to currentColor in Tailwind v4 (Pitfall 10) | Always use explicit border color classes |
| ProjectGrid rebuild | Array index keys break animation identity (Pitfall 11) | Use `project.slug` as key |
| Initial setup | Inconsistent Framer Motion import paths (Pitfall 12) | Standardize on `"motion/react"` immediately |

---

## Sources

- [Motion (Framer Motion) Animation Performance Guide](https://motion.dev/docs/performance)
- [AnimatePresence with React Router — Outlet pattern](https://medium.com/@antonio.falcescu/animating-react-pages-with-react-router-dom-outlet-and-framer-motion-animatepresence-bd5438b3433b)
- [Why Framer Motion Exit Animations Fail](https://medium.com/javascript-decoded-in-plain-english/understanding-animatepresence-in-framer-motion-attributes-usage-and-a-common-bug-914538b9f1d3)
- [Tailwind CSS v4 Official Release Blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind v4 cascade layers incompatibility issue](https://github.com/livewire/flux/issues/783)
- [gray-matter TypeScript typing issue (#69)](https://github.com/jonschlinkert/gray-matter/issues/69)
- [zod-matter — typesafe frontmatter](https://github.com/HiDeoo/zod-matter)
- [Framer Motion opacity animations breaking stacking context (#1885)](https://github.com/framer/motion/issues/1885)
- [Framer Motion position fixed in AnimatePresence (#1117)](https://github.com/framer/motion/issues/1117)
- [React 19 + Framer Motion compatibility (#2668)](https://github.com/motiondivision/motion/issues/2668)
- [Framer Motion v12 React 19 alpha announcement](https://www.framer.community/c/developers/framer-motion-v12-alpha-for-react-19-rc)
- [react-intersection-observer performance issue (#217)](https://github.com/thebuilder/react-intersection-observer/issues/217)
- [Motion scroll animations guide](https://motion.dev/docs/react-scroll-animations)
- [CSS Stacking Contexts — Josh Comeau](https://www.joshwcomeau.com/css/stacking-contexts/)
- [Existing codebase CONCERNS.md](/.planning/codebase/CONCERNS.md)

---

*Researched: 2026-03-02*
