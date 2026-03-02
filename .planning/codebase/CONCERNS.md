# Codebase Concerns

**Analysis Date:** 2025-03-02

## Tech Debt

**Array Index as Keys in Lists:**
- Issue: Using array index `i` as React keys in ProjectModal, AboutPage — violates React best practices and can cause incorrect re-renders or state mismatches when list items are reordered or filtered
- Files:
  - `src/components/home/ProjectModal.tsx` (lines 153, 170 — scope and impact lists)
  - `src/pages/AboutPage.tsx` (lines 32, 51 — strengths and philosophy points)
- Impact: If scope, impact, or about content is ever modified, sorted, or filtered, component state may associate with wrong items; animations and form inputs could bind to wrong data
- Fix approach: Add unique identifiers to data arrays (string IDs or slugs) and use those for keys instead of index

**Form in ContactPage Without Backend Integration:**
- Issue: Contact form has `onSubmit={(e) => e.preventDefault()}` with no actual submission logic, email handling, or validation
- Files: `src/pages/ContactPage.tsx` (line 27)
- Impact: Users expect form submission; currently pressing "Send Message" does nothing and may create expectation/confusion
- Fix approach: Either add validation + submission handler, or change button text/behavior to set expectations; consider email integration (nodemailer, SendGrid, etc.)

**Direct document.body.style Manipulation:**
- Issue: Multiple components directly set `document.body.style.overflow = "hidden"` to prevent scroll during modal/initial load
- Files:
  - `src/components/home/ProjectModal.tsx` (lines 15, 18, 21)
  - `src/pages/HomePage.tsx` (lines 17, 20, 24)
- Impact: If multiple overflow-hiding effects overlap, cleanup may be incomplete; race conditions possible if modals stack; no centralized scroll lock manager
- Fix approach: Create custom hook `useScrollLock()` or use library like `scroll-lock` to centralize overflow state management

## Known Bugs

**Modal Scroll Lock Race Condition:**
- Symptoms: When rapidly opening/closing ProjectModal, document.body.style.overflow may remain "hidden" if cleanup doesn't fire properly
- Files: `src/components/home/ProjectModal.tsx`, `src/pages/HomePage.tsx`
- Trigger: Open modal → Close modal → Open modal quickly (within 900ms on HomePage due to scroll lock timer)
- Workaround: Wait for initial 900ms lock to expire before opening another modal

**Overflow Hidden Not Removed on All Paths:**
- Symptoms: After closing modal via Escape key or background click, scrolling may remain locked
- Files: `src/components/home/ProjectModal.tsx` (useEffect cleanup at line 30 removes listener, but relies on onClose callback firing)
- Trigger: Close modal via Escape → scroll locked if onClose not called
- Current mitigation: useEffect cleanup includes fallback `return () => { document.body.style.overflow = ""; }` but only fires on unmount

## Security Considerations

**No Input Validation on Contact Form:**
- Risk: Email input accepts any string; no server-side validation; potential for spam/abuse
- Files: `src/pages/ContactPage.tsx` (email input at line 46)
- Current mitigation: None (client-side only, no backend)
- Recommendations: Add email format validation (regex or library); implement CAPTCHA if form connects to backend; rate-limit submissions server-side

**Missing CSRF Protection:**
- Risk: If form eventually connects to backend, no CSRF token present
- Files: `src/pages/ContactPage.tsx`
- Current mitigation: Form doesn't submit anywhere yet
- Recommendations: When adding backend, include CSRF token in form; use SameSite cookie policy

**Color Values in Project Data Not Validated:**
- Risk: Colors are hex strings from `projects.ts`; used inline in `style` attributes without sanitization
- Files: `src/data/projects.ts`, `src/components/home/ProjectCard.tsx`, `src/components/home/ProjectModal.tsx`
- Impact: If color data is ever user-generated or API-driven, malformed hex could cause CSS injection
- Recommendations: Validate hex format server-side; use CSS variables or predefined palette instead of inline style props

## Performance Bottlenecks

**No Image Optimization (Placeholder Gradients):**
- Problem: ProjectCard and ProjectModal use CSS gradients instead of actual images — acceptable for MVP, but final version needs real images
- Files: `src/components/home/ProjectCard.tsx` (lines 15-32), `src/components/home/ProjectModal.tsx` (lines 110-195)
- Cause: Images not provided; using generated placeholders
- Improvement path: Replace gradient divs with `<img>` tags, lazy-load with `loading="lazy"`, optimize formats (WebP); consider next-gen image service

**Scroll Lock Timer Magic Number (900ms):**
- Problem: HomePage hardcodes 900ms timeout for initial scroll lock—arbitrary value, no explanation
- Files: `src/pages/HomePage.tsx` (line 18)
- Cause: Likely tuned to Framer Motion page transition duration (0.3s), but 900ms seems disconnected
- Improvement path: Extract to constant, document why, tie to actual animation duration if possible

**No Viewport Optimization for Large Project Lists:**
- Problem: All projects render in ProjectGrid even if off-screen; no virtualization
- Files: `src/components/home/ProjectGrid.tsx` (lines 19-52)
- Cause: Currently only 4 projects—not a problem yet; will degrade at 20+ projects
- Improvement path: Add virtual scrolling library (react-window, react-virtual) if project count grows

## Fragile Areas

**ProjectModal Complex Layout with Fixed/Sticky Elements:**
- Files: `src/components/home/ProjectModal.tsx`
- Why fragile: Fixed overlay with max-width, sticky header inside scrollable panel, z-index stack (z-[9999], z-[20], z-10)—layout breaks easily with viewport changes or nesting
- Safe modification: Test all responsive breakpoints when changing layout; verify z-index hierarchy doesn't create stacking context issues; check that sticky header stays visible during scroll
- Test coverage: No unit/E2E tests for modal scroll behavior or responsive layout

**Navbar Grid Layout with Conditional Rendering:**
- Files: `src/components/layout/Navbar.tsx` (lines 14-54)
- Why fragile: 4-column grid with conditional label rendering (`md:hidden` vs `hidden md:inline`) — easy to desync mobile/desktop labels; active state indicator uses hardcoded "↓"
- Safe modification: Keep mobile and desktop labels in sync when updating copy; test navbar at all breakpoints after changes
- Test coverage: No responsive tests for navbar label visibility

**Page Transition Animations with Query Params:**
- Files: `src/pages/HomePage.tsx`, `src/components/layout/RootLayout.tsx`
- Why fragile: Query param (`?project=slug`) opens modal but page animations still fire; AnimatePresence in RootLayout doesn't account for query param changes
- Safe modification: When adding new features that use query params, ensure they don't conflict with existing route structure; test animation timing with modal open
- Test coverage: No tests for interaction between page transitions and modal state

**Hardcoded Theme Colors in Component Logic:**
- Files: `src/data/projects.ts`, `src/components/home/ProjectCard.tsx`, `src/components/home/ProjectModal.tsx`
- Why fragile: Colors baked into project objects; used in inline `style` attributes; no color system abstraction
- Safe modification: Don't change color values in projects.ts without re-testing all card and modal gradients; if adding light/dark mode, will need refactoring
- Test coverage: No visual regression tests for color changes

## Scaling Limits

**Hard-Coded Project Data:**
- Current capacity: 4 projects in static array
- Limit: No pagination, filtering, or API; all projects load at once; if 100+ projects added, grid layout will become unwieldy
- Scaling path: Migrate `src/data/projects.ts` to API endpoint; add pagination/virtualization in ProjectGrid; implement filtering/search

**Manual Scroll Lock Management:**
- Current capacity: Single modal or page transition can manage scroll
- Limit: Multiple overlays (tooltip + modal + slideout) would conflict; scroll state not atomic
- Scaling path: Implement context-based scroll lock manager; track lock count/stack

**No Backend Integration:**
- Current capacity: Read-only portfolio site
- Limit: Contact form doesn't send; no analytics; no dynamic content
- Scaling path: Add backend (Node.js, Python, etc.); implement email service; add CMS for projects if content changes frequently

## Dependencies at Risk

**React Router v7 (Recently Released):**
- Risk: Major version bump; may have edge cases with query param handling in AnimatePresence
- Impact: Page transitions + query params could have undetected race conditions as library matures
- Migration plan: Monitor release notes; pin to tested minor version; have rollback plan to v6 if issues arise

**Tailwind CSS v4 with @layer System:**
- Risk: V4 is recent; `@layer` directive can be non-intuitive—unlayered CSS always beats utilities, breaking expectations
- Impact: Custom CSS in `index.css` must use `@layer base` or it won't apply expected styles
- Current mitigation: Memory note documents this issue; `index.css` correctly uses `@layer base`
- Recommendations: Document this in CONVENTIONS.md; add ESLint rule to catch unlayered CSS if possible

**Framer Motion 12.x:**
- Risk: Frequently updated; behavior changes in animations between patches
- Impact: Page transitions, modal enter/exit could break unexpectedly after npm update
- Current mitigation: package.json pins to `^12.34.3`; dev environment should test after updates
- Recommendations: Test animations manually after dependency updates; consider locking to exact version if animations are critical

## Missing Critical Features

**No Accessibility (a11y) Features:**
- Problem: No `aria-labels`, `role` attributes, focus management, or keyboard navigation beyond Escape key
- Blocks: WCAG compliance; screen reader support; keyboard-only navigation
- Priority: High for portfolio site claiming to be production-quality

**No Error Boundaries:**
- Problem: No error boundary component; if child component crashes, entire app white-screens
- Blocks: Graceful error handling; user experience in production
- Priority: Medium

**No Loading States:**
- Problem: All content synchronous; no placeholders or spinners (would be needed when API integration added)
- Blocks: Future backend integration without visual feedback
- Priority: Medium

**No Image Gallery Functionality:**
- Problem: ProjectModal has placeholder image divs but no actual image uploading, lightbox, or carousel
- Blocks: Users can't view actual project images
- Priority: High for production portfolio

## Test Coverage Gaps

**No Unit Tests for Components:**
- What's not tested: Component rendering, event handlers, conditional logic
- Files: All `.tsx` files
- Risk: Refactors could break components silently; props changes undetected
- Priority: High

**No E2E Tests for Navigation:**
- What's not tested: Page transitions, modal open/close, query param handling, URL state
- Files: `src/router.tsx`, `src/pages/HomePage.tsx`, `src/components/home/ProjectModal.tsx`
- Risk: Navigation edge cases (rapid clicking, back button, modal + route change) undetected
- Priority: High

**No Responsive Design Tests:**
- What's not tested: Layout at different breakpoints, mobile vs desktop behavior, overflow handling
- Files: All layout components
- Risk: Responsive breakpoints could be wrong; mobile layout could be broken and undetected
- Priority: High

**No Visual Regression Tests:**
- What's not tested: Color rendering, typography, spacing after CSS changes
- Files: `src/index.css` and all styled components
- Risk: Small CSS changes could have unintended visual impact across site
- Priority: Medium

---

*Concerns audit: 2025-03-02*
