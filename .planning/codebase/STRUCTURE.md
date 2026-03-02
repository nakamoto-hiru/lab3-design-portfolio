# Codebase Structure

**Analysis Date:** 2026-03-02

## Directory Layout

```
slug-portfolio/
├── src/
│   ├── components/
│   │   ├── home/           # Homepage-specific components
│   │   │   ├── Hero.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectGrid.tsx
│   │   │   └── ProjectModal.tsx
│   │   └── layout/         # Shared layout chrome components
│   │       ├── RootLayout.tsx
│   │       ├── Navbar.tsx
│   │       └── Footer.tsx
│   ├── pages/              # Page components (routed)
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   └── ContactPage.tsx
│   ├── data/               # Static data modules
│   │   ├── projects.ts     # Project listings and interface
│   │   └── about.ts        # About page content
│   ├── lib/                # Utilities and helpers
│   │   └── cn.ts           # Class name merge utility
│   ├── App.tsx             # Root app component (RouterProvider)
│   ├── main.tsx            # React DOM entry point
│   ├── router.tsx          # Router configuration
│   └── index.css           # Global styles and theme
├── public/                 # Static assets
│   └── fonts/              # Font files
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript base config
├── tsconfig.app.json       # TypeScript app-specific config
├── tsconfig.node.json      # TypeScript Node config
├── package.json            # Project dependencies
└── pnpm-lock.yaml          # Lockfile
```

## Directory Purposes

**`src/components/home/`:**
- Purpose: Components specific to the homepage layout
- Contains: Project grid, cards, modal, hero section
- Key files: `ProjectGrid.tsx` (implements staggered 2-column layout), `ProjectModal.tsx` (modal with query param routing)
- Patterns: Props-based component composition, callback props for state management

**`src/components/layout/`:**
- Purpose: Shared layout components used across all pages
- Contains: Navigation header, footer, root layout wrapper
- Key files: `RootLayout.tsx` (page transition animations), `Navbar.tsx` (4-column grid layout), `Footer.tsx` (large SM text)
- Patterns: Layout wrapper with Outlet, AnimatePresence for transitions

**`src/pages/`:**
- Purpose: Page components rendered by React Router
- Contains: Full-page implementations for /, /about, /contact routes
- Key files: `HomePage.tsx` (state for modal and scroll lock), `AboutPage.tsx` (fixed left + scrolling right), `ContactPage.tsx` (form with local state)
- Patterns: Page wrapping components, local state management, route-level component composition

**`src/data/`:**
- Purpose: Centralize all static content and type definitions
- Contains: Project data array, about page content, TypeScript interfaces
- Key files: `projects.ts` (Project interface + array), `about.ts` (aboutData object)
- Patterns: Data as TypeScript constants, interfaces for type safety

**`src/lib/`:**
- Purpose: Shared utility functions and helpers
- Contains: Reusable functions for any component
- Key files: `cn.ts` (Tailwind class merging)
- Patterns: Pure functions, no side effects, exported as named functions

**`public/`:**
- Purpose: Static assets served as-is by Vite
- Contains: Font files (.woff2) referenced in index.css
- Generated: No
- Committed: Yes

## Key File Locations

**Entry Points:**
- `index.html`: HTML document loaded by browser, links to `src/main.tsx`
- `src/main.tsx`: Creates React root and renders App component
- `src/App.tsx`: Wraps RouterProvider around router config

**Configuration:**
- `vite.config.ts`: Vite dev server + build config, defines @ path alias
- `tsconfig.app.json`: TypeScript compiler settings, target ES2022, strict mode enabled
- `index.css`: Global theme variables, fonts, base layer styles

**Core Logic:**
- `src/router.tsx`: Route definitions and layout hierarchy
- `src/components/layout/RootLayout.tsx`: Page transition animations and layout wrapper
- `src/pages/HomePage.tsx`: Modal state via query params, scroll lock logic
- `src/components/home/ProjectGrid.tsx`: Staggered 2-column grid implementation

**Testing:**
- No testing framework or test files present

## Naming Conventions

**Files:**
- PascalCase for components: `ProjectCard.tsx`, `RootLayout.tsx`
- camelCase for utilities: `projects.ts`, `cn.ts`
- Index files use feature name: `src/pages/HomePage.tsx` (not `Home.tsx`)
- Paired file structure: Related components in same directory (e.g., ProjectGrid + ProjectCard)

**Directories:**
- Lowercase plural for grouped features: `components/`, `pages/`, `data/`, `lib/`
- Subdirectories by feature: `components/home/`, `components/layout/`

**TypeScript:**
- PascalCase for interfaces: `Project`, `ProjectCardProps`, `ProjectGridProps`
- camelCase for variables/functions: `projects`, `handleClick`, `onClose`
- Constants UPPERCASE: Not used (prefer camelCase)

**CSS Classes:**
- Tailwind utility classes with custom CSS variables for theme: `var(--color-bg)`, `var(--color-text-primary)`
- Tailwind responsive prefixes: `md:` for medium+ screens
- State/interaction classes: `group`, `hover:`, `focus:`, `transition-colors`, `duration-300`

## Where to Add New Code

**New Page:**
- Route definition: `src/router.tsx` (add new entry to children array)
- Page component: `src/pages/NewPage.tsx` (follow AboutPage or ContactPage structure)
- Layout: Use RootLayout automatically; apply max-w-[1800px] in component if needed
- Navbar updates: Add nav item to `navItems` array in `src/components/layout/Navbar.tsx`

**New Feature Component (Homepage-specific):**
- Implementation: `src/components/home/NewComponent.tsx`
- Props: Define interface (e.g., `NewComponentProps`) in same file
- Data: Reference data from `src/data/projects.ts` or pass as props
- Styling: Use Tailwind with custom CSS variables for theme colors

**New Feature Component (Reusable):**
- Implementation: Create new directory in `src/components/` or add to `layout/`
- Example: `src/components/common/Card.tsx` for a card wrapper
- Props: Define comprehensive interface, use cn() for conditional classes

**New Data/Content:**
- Static data: `src/data/newdata.ts` (follow projects.ts or about.ts pattern)
- Interfaces: Export from data file, import in components that use it

**Utilities:**
- Helper functions: `src/lib/newutility.ts`
- Styling helpers: Add to `src/lib/cn.ts` or create new utility file
- Pattern: Pure functions, no side effects, export as named exports

**Styling:**
- Global theme variables: `src/index.css` in `@theme` block
- Base layer resets: `src/index.css` in `@layer base`
- Component styles: Inline Tailwind classes in component JSX (no separate CSS files)

## Special Directories

**`src/index.css`:**
- Purpose: Global styles entry point
- Generated: No
- Committed: Yes
- Contains: Tailwind import, font-face declarations, @theme variables, @layer base rules
- Key variables: `--color-bg`, `--color-text-primary`, `--color-accent`, `--color-border`, `--font-sans`
- Note: Uses Tailwind v4 @theme syntax with CSS custom properties

**`public/fonts/`:**
- Purpose: Host font files for Aeonik Pro font family
- Generated: No (manually added)
- Committed: Yes
- Contains: `.woff2` font files (Regular, Medium, Bold weights)
- Note: Loaded via @font-face in index.css with font-display: swap

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (via pnpm install)
- Committed: No (in .gitignore)

**`.planning/codebase/`:**
- Purpose: GSD mapping documents
- Generated: Yes (by GSD orchestrator)
- Committed: Yes

## File Organization Principles

1. **Co-location:** Components live near where they're used (home page components in `components/home/`)
2. **Logical grouping:** Layout components separated from feature components
3. **Type safety:** Interfaces defined in same file as data/components they describe
4. **No barrel files:** Each component file exports single component or data module
5. **Path aliases:** Use `@` prefix to reference `src/` (e.g., `import Hero from "@/components/home/Hero"`)

---

*Structure analysis: 2026-03-02*
