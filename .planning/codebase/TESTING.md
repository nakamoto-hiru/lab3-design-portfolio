# Testing Patterns

**Analysis Date:** 2025-02-16

## Test Framework

**Runner:**
- Not configured (no vitest, jest, or testing-library in package.json)
- No test files detected in codebase

**Assertion Library:**
- Not applicable (no testing infrastructure)

**Run Commands:**
```bash
# Currently available commands:
pnpm dev              # Dev server
pnpm build            # Build for production
pnpm lint             # ESLint only
pnpm preview          # Preview build
```

## Test File Organization

**Status:**
- No test files currently exist
- Test framework needs to be configured before testing can begin

**Recommended Setup:**
- Framework: Vitest (preferred for Vite projects) or Jest
- Assertion library: Vitest built-in or chai
- Testing library: @testing-library/react for component testing
- Config file: `vitest.config.ts`

**Suggested Patterns for Future Implementation:**

**Location:**
- Co-locate tests with source files: `ComponentName.tsx` + `ComponentName.test.tsx`
- Or separate: `src/components/` + `src/__tests__/components/`

**Naming:**
- Pattern: `[ComponentName].test.tsx` or `[ComponentName].spec.tsx`
- Example: `ProjectCard.test.tsx`, `HomePage.test.tsx`

**Structure:**
```
src/
├── components/
│   ├── home/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectCard.test.tsx
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectGrid.test.tsx
│   │   └── ...
│   └── layout/
├── pages/
│   ├── HomePage.tsx
│   ├── HomePage.test.tsx
│   └── ...
├── lib/
│   ├── cn.ts
│   └── cn.test.ts
└── __tests__/
    └── setup.ts
```

## Test Structure

**Recommended Suite Organization:**

Based on codebase patterns, tests should follow this structure:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ProjectCard from './ProjectCard';

describe('ProjectCard', () => {
  const mockProject = {
    slug: 'test-project',
    title: 'Test Project',
    year: '2025',
    // ... other required fields
  };

  it('should render project title', () => {
    const mockOnClick = vi.fn();
    render(
      <ProjectCard project={mockProject} onClick={mockOnClick} />
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const mockOnClick = vi.fn();
    const { getByRole } = render(
      <ProjectCard project={mockProject} onClick={mockOnClick} />
    );

    await userEvent.click(getByRole('button'));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
```

**Patterns Observed in Codebase:**
- Props destructuring pattern makes testing easier
- Clear separation of concerns (components receive data via props)
- Event handlers passed as callbacks (easy to mock)

## Mocking

**Recommended Framework:**
- `vitest` has built-in mocking with `vi.fn()` and `vi.mock()`
- For components: Mock context providers, router, data
- For hooks: Use @testing-library/react hooks testing library

**Patterns for Common Mocks:**

**Mock React Router:**
```typescript
import { BrowserRouter } from 'react-router-dom';

render(
  <BrowserRouter>
    <Component />
  </BrowserRouter>
);

// Or use createMemoryRouter for testing routes
```

**Mock Callbacks/Handlers:**
```typescript
const mockOnClick = vi.fn();
render(<ProjectCard onClick={mockOnClick} {...props} />);
expect(mockOnClick).toHaveBeenCalledWith(expectedArg);
```

**Mock API Data:**
```typescript
const mockProjects = [
  {
    slug: 'test-1',
    title: 'Test Project 1',
    // ... required fields
  },
];

// Import and override if needed
vi.mock('@/data/projects', () => ({
  projects: mockProjects,
}));
```

**What to Mock:**
- External API calls (if added)
- Router navigation
- Event handlers/callbacks passed as props
- Third-party library methods (if needed)
- Global state/context (if added)

**What NOT to Mock:**
- Component rendering logic
- Utility functions like `cn()` (test as-is)
- DOM interactions
- React hooks themselves (test their effects)

## Fixtures and Factories

**Test Data:**

Create a test fixtures file to avoid duplication:

```typescript
// src/__tests__/fixtures/projects.ts
import { Project } from '@/data/projects';

export const mockProjectFixture: Project = {
  slug: 'whales-market',
  title: 'Whales Market',
  subtitle: 'Advanced Trading Platform',
  year: '2025',
  tags: ['Trading', 'Web App'],
  role: 'Product Design',
  description: 'Test description',
  scope: ['Test scope 1'],
  impact: ['Test impact 1'],
  color: '#4c48ff',
};

export const mockProjects: Project[] = [
  mockProjectFixture,
  {
    ...mockProjectFixture,
    slug: 'test-2',
    title: 'Another Project',
  },
];
```

**Location:**
- `src/__tests__/fixtures/` directory
- Separate file per domain (e.g., `projects.ts`, `about.ts`)

## Coverage

**Current Status:**
- No coverage configuration
- 0% test coverage

**Recommendations:**
- Configure coverage threshold after testing is set up
- Aim for: 80% statements, 70% branches, 80% lines, 80% functions
- Focus coverage on:
  - Components: Critical user interactions, state changes
  - Utils: All edge cases (e.g., `cn()` utility)
  - Pages: Main user flows

**View Coverage (Once Configured):**
```bash
vitest --coverage
# Generates coverage report in coverage/ directory
```

## Test Types

**Unit Tests:**
- Scope: Individual functions, utilities, hooks
- Approach: Test inputs/outputs, side effects
- Examples:
  - `cn()` utility: Test className merging
  - `useCallback` handlers: Test memoization and dependencies
  - Data validation: Test data structure integrity

**Integration Tests:**
- Scope: Component interactions, state management, data flow
- Approach: Test components with their dependencies
- Examples:
  - ProjectCard with onClick handler and project data
  - HomePage with ProjectGrid + ProjectModal interaction
  - Form submission in ContactPage
  - Router navigation in Navbar

**E2E Tests:**
- Framework: Not currently configured
- Recommended: Playwright or Cypress for full user flows
- Examples:
  - Complete project modal workflow (click card → view details → close)
  - Page navigation via navbar
  - Form submission flow
  - Responsive behavior across breakpoints

## Common Patterns

**Async Testing:**

For components with async operations (when added):

```typescript
it('should handle async operations', async () => {
  const { rerender } = render(<Component />);

  // Wait for async operations
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});

// Or for hooks
const { result } = renderHook(() => useAsync());
await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});
```

**Error Testing:**

Testing error states and boundaries:

```typescript
it('should handle missing data gracefully', () => {
  const { container } = render(
    <ProjectCard project={null} onClick={vi.fn()} />
  );

  // Test fallback UI or error message
  expect(container).toMatchSnapshot();
});

it('should catch error boundaries', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  expect(() => {
    render(<ThrowError />);
  }).toThrow('Test error');
});
```

**Event Testing:**

Testing user interactions:

```typescript
import { userEvent } from '@testing-library/user-event';

it('should handle form changes', async () => {
  const user = userEvent.setup();
  render(<ContactPage />);

  const nameInput = screen.getByPlaceholderText('Your name');
  await user.type(nameInput, 'John Doe');

  expect(nameInput.value).toBe('John Doe');
});
```

## Critical Testing Gaps

**Areas with No Tests:**
- All React components
- Route/navigation logic
- Modal open/close behavior
- Form handling
- Responsive layouts (consider visual regression tests)
- Animation timing (Framer Motion)

**Priority for Implementation:**
1. **High:** `HomePage.tsx`, `ProjectModal.tsx`, `Navbar.tsx` (core user flows)
2. **High:** `ProjectCard.tsx`, `ProjectGrid.tsx` (frequent interactions)
3. **Medium:** `ContactPage.tsx` (form testing)
4. **Medium:** `AboutPage.tsx` (content rendering)
5. **Low:** `cn()` utility (simple logic)

---

*Testing analysis: 2025-02-16*
