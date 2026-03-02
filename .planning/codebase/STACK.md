# Technology Stack

**Analysis Date:** 2026-03-02

## Languages

**Primary:**
- TypeScript ~5.9.3 - All application code in `src/`
- TSX/JSX - React component files with type safety

**Secondary:**
- CSS3 - Styling via Tailwind CSS v4 with custom theme variables
- HTML5 - Static markup in `index.html`

## Runtime

**Environment:**
- Node.js (version managed via pnpm, no .nvmrc specified)

**Package Manager:**
- pnpm - Package manager with lockfile `pnpm-lock.yaml` present

## Frameworks

**Core:**
- React 19.2.0 - UI component library and rendering
- React Router 7.13.1 - Client-side routing, used in `src/router.tsx`
- Vite 7.3.1 - Build tool and dev server, runs on port 5173

**Styling:**
- Tailwind CSS 4.2.1 - Utility-first CSS framework with `@layer` system
- @tailwindcss/vite 4.2.1 - Vite plugin for Tailwind CSS processing
- Custom @theme variables defined in `src/index.css` for color palette and typography

**Animation:**
- Framer Motion 12.34.3 - Animation library used in `src/components/layout/RootLayout.tsx` and `src/components/home/ProjectModal.tsx` via `motion` and `AnimatePresence` components

**Utilities:**
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.5.0 - Merge and override Tailwind classes without conflicts
- Combined in custom `cn()` helper at `src/lib/cn.ts`

**Font Loading:**
- Geist 1.7.0 - Font package (UI font system)
- Custom Aeonik Pro font loaded via @font-face in `src/index.css` with woff2 format

## Build & Development Tools

**Build:**
- TypeScript compiler 5.9.3 - Type checking via `tsc -b` before vite build
- Vite 7.3.1 - Production bundling and optimization

**Bundler Plugins:**
- @vitejs/plugin-react 5.1.1 - React JSX transformation and fast refresh
- @tailwindcss/vite 4.2.1 - Tailwind CSS v4 integration

**Code Quality:**
- ESLint 9.39.1 - Linting with flat config in `eslint.config.js`
- typescript-eslint 8.48.0 - TypeScript-aware ESLint rules
- eslint-plugin-react-hooks 7.0.1 - React hooks best practices
- eslint-plugin-react-refresh 0.4.24 - Fast Refresh safety checks

## Key Dependencies

**Critical:**
- react, react-dom 19.2.0 - Core rendering and DOM
- react-router-dom 7.13.1 - Multi-page routing with `createBrowserRouter` and `RouterProvider`
- framer-motion 12.34.3 - Page transitions and component animations

**Utilities:**
- clsx, tailwind-merge - CSS class composition

## Configuration

**Environment:**
- No `.env` files detected - Configuration hardcoded in source or vite config
- Development server: `pnpm dev` → Vite on port 5173
- Build: `pnpm build` → TypeScript type-check then vite build to `dist/`
- Production: `pnpm preview` → Preview built assets
- Linting: `pnpm lint` → ESLint check with flat config

**Build Configuration:**
- `vite.config.ts` - Sets up React plugin, Tailwind CSS, and path alias `@` → `./src`
- `tsconfig.json` - Project references to `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` - App compilation with ES2022 target, strict mode, JSX as react-jsx
- `tsconfig.node.json` - Build tools compilation
- `eslint.config.js` - Flat ESLint config with TypeScript and React plugins
- `index.html` - Entry point with SPA root div #root and module script import

**Path Aliases:**
- `@/*` → `./src/*` for clean imports throughout codebase

**CSS Configuration:**
- Tailwind v4 uses `@layer` directives in `src/index.css`
- Custom `@theme` variables for colors and fonts
- `@layer base` contains global resets and link styling overrides

## Platform Requirements

**Development:**
- Node.js with pnpm
- Modern browser with ES2022 support
- Port 5173 available for dev server

**Production:**
- Any static file hosting (SPA with client-side routing)
- Modern browsers (ES2022, CSS Grid, CSS variables)
- No backend API required - static portfolio site

---

*Stack analysis: 2026-03-02*
