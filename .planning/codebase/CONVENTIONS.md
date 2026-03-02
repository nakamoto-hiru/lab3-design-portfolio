# Coding Conventions

**Analysis Date:** 2025-02-16

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `ProjectCard.tsx`, `Navbar.tsx`, `RootLayout.tsx`)
- Data/utilities: camelCase (e.g., `projects.ts`, `about.ts`, `cn.ts`)
- Pages: PascalCase with "Page" suffix (e.g., `HomePage.tsx`, `AboutPage.tsx`, `ContactPage.tsx`)
- Directories: camelCase (e.g., `src/components/home`, `src/components/layout`, `src/pages`, `src/data`, `src/lib`)

**Functions:**
- React components: PascalCase, no "Component" suffix
- Regular functions: camelCase (e.g., `handleProjectClick`, `handleChange`, `handleClose`)
- Custom hooks: camelCase with "use" prefix if applicable
- Utility functions: camelCase (e.g., `cn()` for className utility in `src/lib/cn.ts`)

**Variables:**
- State (useState): camelCase (e.g., `form`, `scrollLocked`, `activeProject`)
- Constants in data files: camelCase (e.g., `projects`, `aboutData`, `navItems`)
- Props: camelCase within component definitions
- Private refs: camelCase (e.g., `panelRef`)

**Types:**
- Interfaces: PascalCase with "Props" suffix for component props (e.g., `ProjectCardProps`, `ProjectModalProps`, `ProjectGridProps`)
- Exported interfaces: PascalCase (e.g., `Project`)
- Type aliases: PascalCase

## Code Style

**Formatting:**
- No Prettier config detected — relying on ESLint for style enforcement
- Trailing commas: Used in arrays/objects (ES5+ style)
- Quotes: Double quotes for JSX attributes and strings
- Indentation: 2 spaces (inferred from codebase)
- Line length: No hard limit enforced

**Linting:**
- Framework: ESLint 9.39.1 with flat config (`eslint.config.js`)
- React plugins: `react-hooks` and `react-refresh`
- TypeScript: Using `typescript-eslint` 8.48.0 with recommended config
- Key rules enforced:
  - ESLint recommended rules
  - TypeScript strict mode
  - React hooks rules (dependency arrays, rules of hooks)
  - React refresh rules for fast refresh

**TypeScript Configuration:**
- Strict mode: Enabled (`"strict": true`)
- Target: ES2022
- Module: ESNext
- JSX: react-jsx (automatic JSX transform)
- Unused variables/parameters: Error (`noUnusedLocals`, `noUnusedParameters`)
- Path alias: `@` → `./src/` (configured in `tsconfig.app.json`)

## Import Organization

**Order:**
1. External libraries (React, react-router-dom, framer-motion, clsx, etc.)
2. Type imports (`import type { ... }`)
3. Internal absolute imports using `@/` alias
4. Relative imports (rarely used)

**Examples:**
```typescript
// From src/components/home/ProjectCard.tsx
import type { Project } from "@/data/projects";

// From src/pages/HomePage.tsx
import { useCallback, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "@/components/home/Hero";
import ProjectGrid from "@/components/home/ProjectGrid";
```

**Path Aliases:**
- `@/*` resolves to `./src/*` (defined in `vite.config.ts` and `tsconfig.app.json`)
- All internal imports use this alias to avoid relative path traversal

## Error Handling

**Current Approach:**
- Minimal error handling observed in current codebase
- Modal fallback uses nullish coalescing: `activeProject ?? null`
- No try-catch blocks in current components
- No error boundaries implemented

**Expected Patterns:**
- For fetch/async operations: Use try-catch or promise `.catch()` handling
- For component errors: Consider implementing Error Boundaries for page-level components
- For form validation: Check field values before setState/submit

## Logging

**Framework:** console object (no dedicated logging library)

**Patterns:**
- No systematic logging observed in current codebase
- When needed: Use `console.log()`, `console.warn()`, `console.error()`
- Avoid logging in production — guard with `if (process.env.NODE_ENV === 'development')`

## Comments

**When to Comment:**
- Complex layout/grid logic (e.g., `src/components/home/ProjectGrid.tsx` has inline comments for 2-column stagger layout)
- Non-obvious conditional logic
- Unusual CSS techniques (e.g., Tailwind v4 `@layer` system, dynamic gradients)
- Visual hierarchy/design intent

**JSDoc/TSDoc:**
- Not currently used in codebase
- Consider for:
  - Utility functions (`src/lib/cn.ts` could benefit from JSDoc)
  - Complex data structures
  - Public APIs

**Example from codebase:**
```typescript
// From src/components/home/ProjectGrid.tsx
// Split projects into left (odd-indexed) and right (even-indexed) columns
// to match the original staggered 2-column layout
const leftCol = projects.filter((_, i) => i % 2 === 0);
const rightCol = projects.filter((_, i) => i % 2 === 1);
```

## Function Design

**Size Guidelines:**
- Small, focused functions preferred
- Component functions: 50-150 lines typical (see `ProjectModal.tsx` at ~200 lines for complex component)
- Utility functions: Single responsibility (e.g., `cn()` is 5 lines)

**Parameters:**
- Props destructured in function signature
- Single `props` object for components with multiple props
- Use TypeScript for explicit prop typing

**Examples:**
```typescript
// Simple component with destructured props
export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (/* ... */);
}

// Page component with useState/useCallback
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
}
```

**Return Values:**
- Components: Return JSX directly
- Event handlers: Return void (side effects only)
- Utility functions: Return single value or object
- Hooks: Follow React hook conventions (useState returns [state, setState])

## Module Design

**Exports:**
- Components: Default export of the component function
- Data: Named exports (e.g., `export const projects: Project[]`)
- Utilities: Named exports for functions, types as named exports

**Examples:**
```typescript
// Component: default export
export default function ProjectCard({ project, onClick }: ProjectCardProps) { ... }

// Data file: named exports
export interface Project { ... }
export const projects: Project[] = [ ... ]

// Utility: named export
export function cn(...inputs: ClassValue[]) { ... }
```

**Barrel Files:**
- Not extensively used in current codebase
- Could be added for `src/components/` to simplify imports

**Component Organization:**
- Props interface defined above component function
- Component function name matches filename (PascalCase)
- Default export at end of file

---

*Convention analysis: 2025-02-16*
