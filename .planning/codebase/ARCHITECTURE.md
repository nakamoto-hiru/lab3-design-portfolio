# Architecture

**Analysis Date:** 2026-03-02

## Pattern Overview

**Overall:** React SPA with Router-based layout system + Modal-via-query-params pattern

**Key Characteristics:**
- Single-page application with React Router v7 managing page navigation
- Fixed hero + scrolling content pattern using z-index layering
- Modal state derived from URL query parameters (not separate routes)
- Responsive design with mobile-first approach and desktop-specific layouts using Tailwind breakpoints
- Max-width container (1800px) applied globally with left-aligned positioning

## Layers

**Application Layer:**
- Purpose: Bootstrap and render the application
- Location: `src/main.tsx`, `src/App.tsx`
- Contains: React root creation, app wrapper component
- Depends on: React Router configuration
- Used by: Browser/Vite dev server

**Router Layer:**
- Purpose: Define all page routes and layout structure
- Location: `src/router.tsx`
- Contains: Route definitions, RootLayout wrapper, page component references
- Depends on: React Router DOM, page and layout components
- Used by: App.tsx

**Layout Layer:**
- Purpose: Provide consistent chrome (navbar, footer) and page transitions across all pages
- Location: `src/components/layout/RootLayout.tsx`
- Contains: Outlet for page content, Navbar, Footer, AnimatePresence wrapper
- Depends on: React Router (useLocation, Outlet), Framer Motion
- Used by: Router configuration

**Page Layer:**
- Purpose: Implement full-page content for each route
- Location: `src/pages/HomePage.tsx`, `src/pages/AboutPage.tsx`, `src/pages/ContactPage.tsx`
- Contains: Page-specific layout, state management, component composition
- Depends on: Feature components, data modules
- Used by: Router

**Feature Components:**
- Purpose: Implement domain-specific UI patterns (home page grid + modal, about/contact layouts)
- Location: `src/components/home/` (Hero, ProjectGrid, ProjectCard, ProjectModal), `src/components/layout/` (Navbar, Footer)
- Contains: Reusable component logic, styling, interactions
- Depends on: Data modules, utilities (cn), React hooks
- Used by: Pages, other components

**Data Layer:**
- Purpose: Centralize project and about page content
- Location: `src/data/projects.ts`, `src/data/about.ts`
- Contains: TypeScript interfaces (Project), data objects, constants
- Depends on: Nothing (pure data)
- Used by: Feature components, pages

**Utility Layer:**
- Purpose: Provide reusable helper functions
- Location: `src/lib/cn.ts`
- Contains: Tailwind class merging utility (clsx + twMerge)
- Depends on: External packages (clsx, tailwind-merge)
- Used by: Components throughout codebase

**Styling Layer:**
- Purpose: Define design tokens and global CSS rules
- Location: `src/index.css`
- Contains: Tailwind v4 @theme variables, @layer base rules, @font-face declarations
- Depends on: Tailwind CSS, font files
- Used by: All components via Tailwind classes

## Data Flow

**Homepage - Project Selection Flow:**

1. User clicks ProjectCard in ProjectGrid
2. ProjectGrid calls `onProjectClick(slug)` callback
3. HomePage.handleProjectClick calls `setSearchParams({ project: slug })`
4. URL changes to `?project={slug}`
5. HomePage.activeProject selects matching project from data
6. ProjectModal receives project prop and renders
7. User closes modal → handleClose calls `setSearchParams({})` → URL resets

**Page Navigation Flow:**

1. User clicks navbar link (Link from React Router)
2. Router updates location pathname
3. RootLayout.useLocation detects pathname change
4. AnimatePresence key updates, triggering exit/enter animations
5. Outlet renders new page component
6. Page unmounts with opacity animation, new page mounts with opacity animation

**About/Contact Page Layout Flow:**

1. Page renders two-column layout using md breakpoints
2. Mobile: Hero text is static in document flow with min-h-[50vh]
3. Desktop: Left (25%) sidebar is fixed at top, right (75%) content scrolls below
4. About/Contact pages split content: fixed left title + scrolling right detail

**State Management:**

- **HomePage scroll lock:** Local useState to temporarily disable scrolling during initial load (900ms)
- **ContactPage form:** Local useState for form fields (name, email, message)
- **ProjectModal:** Controlled by URL query params (no local state, data-driven)
- **Navbar active state:** Derived from useLocation pathname comparison

## Key Abstractions

**Project Interface:**
- Purpose: Type-safe definition for project data
- Examples: `src/data/projects.ts`
- Pattern: TypeScript interface with string/array fields, exported as data array

**Router Configuration:**
- Purpose: Define route tree with nested layout
- Examples: `src/router.tsx`
- Pattern: createBrowserRouter with single root element (RootLayout) and children routes

**Modal via Query Params:**
- Purpose: Decouple modal state from routing (modal doesn't navigate)
- Examples: `src/pages/HomePage.tsx`, `src/components/home/ProjectModal.tsx`
- Pattern: useState(useSearchParams), conditional render on project presence, URL query as source of truth

**Responsive Layout System:**
- Purpose: Provide consistent left-aligned, max-width container across all pages
- Examples: `src/components/layout/RootLayout.tsx`, `src/pages/AboutPage.tsx`, `src/pages/ContactPage.tsx`
- Pattern: RootLayout applies max-w-[1800px] at root, individual pages use md: breakpoint to switch between mobile and desktop layout

**Staggered 2-Column Grid:**
- Purpose: Implement desktop-specific visual layout with offset columns and divider
- Examples: `src/components/home/ProjectGrid.tsx`
- Pattern: CSS Grid with gridTemplateColumns: "1fr 1px 1fr", left column offset with mt-[337px]

## Entry Points

**Browser Entry:**
- Location: `index.html`
- Triggers: Page load
- Responsibilities: Load Vite script entry point, render React root element

**Application Entry:**
- Location: `src/main.tsx`
- Triggers: Vite module script execution
- Responsibilities: Create React DOM root, render App wrapped in StrictMode

**App Root:**
- Location: `src/App.tsx`
- Triggers: React initialization
- Responsibilities: Initialize RouterProvider with router configuration

**Router Definition:**
- Location: `src/router.tsx`
- Triggers: App.tsx setup
- Responsibilities: Define all routes, apply RootLayout wrapper, export router instance

**Layout Root:**
- Location: `src/components/layout/RootLayout.tsx`
- Triggers: Router initialization
- Responsibilities: Render Navbar, Outlet for page content, Footer; manage page transitions with AnimatePresence

**Page Components:**
- Locations: `src/pages/*.tsx`
- Triggers: Route match (via Router)
- Responsibilities: Implement page-specific content, state, and interactions

## Error Handling

**Strategy:** Minimal error handling in current implementation

**Patterns:**
- No explicit error boundaries in place
- Form submission in ContactPage uses preventDefault without validation
- Modal safely handles null project with conditional rendering (`{project && ...}`)
- No network error handling (no API calls)
- No loading states

## Cross-Cutting Concerns

**Logging:** Not implemented — no logging framework in use

**Validation:** Not implemented — ContactPage accepts any form input without validation

**Authentication:** Not applicable — no user authentication required

**Scroll Behavior:**
- HomePage locks scroll for 900ms on initial load using document.body.style.overflow
- ProjectModal locks scroll when open, releases on close
- RootLayout sets scroll-behavior: smooth on html element

**Accessibility:**
- Link components use semantic HTML
- Form inputs have labels in ContactPage
- Modal closes on Escape key
- Color contrast provided via dark theme design

**Performance:**
- React.StrictMode enabled for development
- Framer Motion used for page and modal animations
- No explicit code splitting (single-page app)
- No lazy loading or route-based code splitting implemented

---

*Architecture analysis: 2026-03-02*
