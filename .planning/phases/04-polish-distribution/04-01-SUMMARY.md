---
phase: 04-polish-distribution
plan: 01
subsystem: seo
tags: [seo, og-tags, favicon, react-19, meta-tags, vite-plugin]

# Dependency graph
requires:
  - phase: 03-animation-layer
    provides: "Complete page components ready for SEO layer"
  - phase: 01-foundation
    provides: "Content pipeline with ParsedProject type and loader"
provides:
  - "src/seo/ module with siteMetadata, pageMetaMap, PageTemplate"
  - "SVG favicon in public/"
  - "React 19 native <title> tags on all 4 page components"
  - "Updated index.html with favicon link and meta description"
affects: [04-02-PLAN]

# Tech tracking
tech-stack:
  added: []
  patterns: ["React 19 native <title> for runtime browser tab titles", "Centralized SEO constants in src/seo/siteMetadata.ts", "Route-to-metadata mapping for build-time HTML generation"]

key-files:
  created:
    - src/seo/siteMetadata.ts
    - src/seo/pageMetaMap.ts
    - src/seo/PageTemplate.tsx
    - public/favicon.svg
  modified:
    - index.html
    - src/pages/HomePage.tsx
    - src/pages/AboutPage.tsx
    - src/pages/ContactPage.tsx
    - src/pages/CaseStudyPage.tsx

key-decisions:
  - "React 19 native <title> JSX element for runtime titles -- no react-helmet or custom hook needed"
  - "pageMetaMap uses hardcoded project data (not dynamic loader import) for build-time safety"
  - "SVG favicon with accent color #4c48ff and SM initials"

patterns-established:
  - "React 19 <title> pattern: render exactly one <title> per page component, wrap in Fragment if needed"
  - "SEO constants centralized in src/seo/siteMetadata.ts -- all page titles use SITE_NAME"
  - "PageMetaData interface: url, bundleEntryPoint, title, description, ogImage, ogType, ogUrl"

requirements-completed: [META-01, META-02, META-03]

# Metrics
duration: 3min
completed: 2026-03-02
---

# Phase 4 Plan 01: SEO Data Layer Summary

**SEO infrastructure with centralized metadata, 7-route pageMetaMap for build-time OG, SVG favicon, and React 19 native title tags on all pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-02T09:14:24Z
- **Completed:** 2026-03-02T09:17:18Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Created complete `src/seo/` module with site metadata constants, page meta map (7 routes), and HTML template component
- Added SVG favicon with accent-color branding and updated index.html with favicon link and meta description
- All 4 page components now render distinct React 19 native `<title>` tags for runtime browser tab titles
- CaseStudyPage renders dynamic titles from project frontmatter (e.g., "Whales Market | Slug Macro")

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SEO data layer and favicon** - `8ea05dd` (feat)
2. **Task 2: Add React 19 native title tags to all page components** - `ae2a4ef` (feat)

## Files Created/Modified
- `src/seo/siteMetadata.ts` - Centralized SEO constants: SITE_NAME, SITE_DESCRIPTION, SITE_URL, DEFAULT_OG_IMAGE, pageTitle(), ogImageUrl()
- `src/seo/pageMetaMap.ts` - Route-to-metadata mapping with PageMetaData interface, 7 entries (3 static + 4 case studies)
- `src/seo/PageTemplate.tsx` - Full HTML template component with OG and Twitter Card meta tags for vite-plugin-react-meta-map
- `public/favicon.svg` - SVG favicon with #4c48ff background and white SM initials
- `index.html` - Added favicon link and meta description tags
- `src/pages/HomePage.tsx` - Added `<title>Slug Macro | Product Designer</title>`
- `src/pages/AboutPage.tsx` - Wrapped in Fragment, added `<title>About | Slug Macro</title>`
- `src/pages/ContactPage.tsx` - Wrapped in Fragment, added `<title>Contact | Slug Macro</title>`
- `src/pages/CaseStudyPage.tsx` - Added dynamic `<title>{project.meta.title} | Slug Macro</title>`

## Decisions Made
- Used React 19 native `<title>` JSX element directly in page components -- no react-helmet, no custom hook. React 19 natively hoists `<title>` to `<head>`.
- pageMetaMap uses hardcoded project metadata (not dynamic import from content loader) because the file is consumed at build time by vite-plugin-react-meta-map and needs to be statically analyzable.
- SVG favicon uses the project accent color `#4c48ff` with "SM" initials -- minimal, on-brand, scales to all sizes.
- AboutPage and ContactPage wrapped in Fragments (`<>...</>`) to accommodate the `<title>` element alongside the existing single root div.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required. Note: `SITE_URL` in `src/seo/siteMetadata.ts` defaults to `https://slugmacro.com` and should be updated with the actual production domain before deployment. `og-default.png` (1200x630) should be added to `public/` before deployment.

## Next Phase Readiness
- `src/seo/` module is complete and ready for Plan 04-02 to wire `vite-plugin-react-meta-map` in vite.config.ts
- pageMetaMap and PageTemplate follow the exact interface the plugin expects
- All page components have runtime title tags for client-side navigation

## Self-Check: PASSED

All files verified present. All commit hashes verified in git log.

---
*Phase: 04-polish-distribution*
*Completed: 2026-03-02*
