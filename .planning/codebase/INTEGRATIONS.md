# External Integrations

**Analysis Date:** 2026-03-02

## APIs & External Services

**No external APIs integrated** - This is a static portfolio website without external service calls.

## Data Storage

**Databases:**
- Not applicable - No backend database

**File Storage:**
- Local filesystem only
  - Static assets in `public/` directory (fonts, images)
  - HTML built to `dist/` folder during production build

**Caching:**
- Browser caching via standard HTTP cache headers (Vite default)
- No explicit caching service configured

## Authentication & Identity

**Auth Provider:**
- Not applicable - No authentication required

**Implementation:**
- Static portfolio site, no user accounts or protected routes

## Monitoring & Observability

**Error Tracking:**
- Not configured - No error tracking service integrated

**Logs:**
- Console logs only via JavaScript `console.*` methods
- Development: Vite provides dev server logging
- Production: Standard browser console

## CI/CD & Deployment

**Hosting:**
- Not detected - Ready for deployment to any static host (Vercel, Netlify, GitHub Pages, etc.)

**Build Artifacts:**
- `dist/` folder contains compiled HTML, CSS, and JavaScript
- Ready for direct upload to static hosting

**CI Pipeline:**
- Not configured - No GitHub Actions, GitLab CI, or other CI service detected

## Environment Configuration

**Required env vars:**
- None - Application is fully static with no environment-dependent secrets

**Secrets location:**
- Not applicable - No secrets in use

## Webhooks & Callbacks

**Incoming:**
- None - Site does not receive webhooks

**Outgoing:**
- None configured

## Contact Form

**Current State:**
- Contact form in `src/pages/ContactPage.tsx` is UI-only (lines 27-79)
- Form collects `name`, `email`, `message` fields
- `onSubmit` currently prevents default with `e.preventDefault()` - no backend integration
- No form submission endpoint configured

**To Enable Email Delivery:**
- Would require backend API endpoint or third-party email service
- Suggested services: SendGrid, Mailgun, EmailJS, Formspree, or similar
- Would need POST endpoint integration in `src/pages/ContactPage.tsx` `handleSubmit` method

## Static Content

**Project Data:**
- Hardcoded in `src/data/projects.ts`
- Contains project metadata: slug, title, year, tags, role, description, scope, impact, color
- No CMS or content management system connected

**About Page Content:**
- Loaded from `src/data/about.ts` (not reviewed, likely similar structure)

---

*Integration audit: 2026-03-02*
