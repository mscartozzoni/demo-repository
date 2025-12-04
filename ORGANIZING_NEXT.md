Organizing Next.js Guidance Steps...
Setting up a todo list to track delivering the Next.js build guidance.

Created 1 todo

Organizing guidance for project setup
Marking the guidance task complete.

Completed: Write Next.js build best-practices guide (1/1)

Overview

Goal: High-quality, scalable Next.js (App Router) project on macOS/zsh.
Focus: Strong foundations (TypeScript, linting, testing, performance, security, DX, deployment).
Approach: Initialize cleanly, enforce consistency early, automate quality, optimize iteratively.
Project Initialization

Command: Use create-next-app with TypeScript, ESLint, Tailwind (or CSS Modules), src dir.
Base setup: npx create-next-app@latest my-app --typescript --eslint --src-dir --tailwind --app --import-alias "@/*"
Node version: Pin via .nvmrc (e.g., node -v then record). Add engines in package.json.
Package manager: Prefer pnpm for disk efficiency (corepack enable && pnpm install).
Code Quality

TypeScript: Enable strict mode ("strict": true, "noUncheckedIndexedAccess": true).
ESLint: Add plugins @typescript-eslint, eslint-plugin-import, jsx-a11y, security.
Formatting: Prettier + ESLint integration; configure prettier.config.cjs.
Git hooks: Use lefthook or husky + lint-staged to run type check & lint on affected files.
Consistency: Enforce path aliases (@/components, etc.) and index-barrel restraint (avoid over-aggregation).
Architecture

Folders: src/app, src/components, src/features, src/lib, src/services, src/styles, src/tests, src/types.
Domain modules: Group related UI + logic under src/features/<domain>/.
Server vs Client: Default to Server Components; opt into use client only when necessary (stateful, browser APIs).
Data fetching: Use Route Handlers (app/api/...) or external typed SDK in src/services.
Error boundaries: Provide error.tsx + loading.tsx at route segment granularity.
Styling & UI

Tailwind: Keep design tokens via config (colors, spacing). Avoid excessive arbitrary values.
Component strategy: Build small, composable primitives; avoid sprawling “god” components.
Accessibility: Include eslint-plugin-jsx-a11y; test with Storybook + Axe.
Data Layer & State

Remote data: Use React Query (TanStack Query) or native fetch + caching via Server Components.
Global state: Only if needed—Zustand or Jotai for lightweight; avoid Redux unless complex workflows.
Validation: Use Zod schemas for API payloads and forms (src/lib/validation).
Performance

Images: Use Next Image component; define proper sizes for responsive loads.
Fonts: Use next/font for self-hosted performance (no FOIT).
Caching: Set fetch options ({ cache: 'force-cache' } or { next: { revalidate: 60 } }) strategically.
Bundle analysis: Add @next/bundle-analyzer for periodic audits.
Dynamic imports: Lazy-load heavy components with import() + suspense.
Compression: Ensure server/CDN handles gzip or brotli; metadata caching headers correct.
Security & Reliability

Environment variables: Use .env.local for secrets; never commit. Validate presence at runtime.
Headers: Configure next.config.js with secure headers (CSP, X-Frame-Options, etc.).
Sanitization: Escape untrusted HTML; prefer Markdown libraries with sanitization when needed.
Auth: Use next-auth or custom JWT; rotate secrets; implement refresh logic securely.
Rate limiting: Implement basic middleware for write-heavy endpoints (e.g., upstash rate limit).
Dependency scanning: Use npm audit or pnpm audit, integrate into CI.
Testing

Unit: Jest + React Testing Library for components.
Integration: Playwright for critical flows.
Contract: Zod schemas as executable specifications.
Performance verification: Lighthouse CI or Next.js built-in analytics.
Test layout:
src/tests/unit/**/*
src/tests/integration/**/*
src/tests/e2e/**/*
Snapshot testing sparingly; prefer assertion-driven tests for stability.
Developer Experience

Absolute imports: Already set via alias; ensure tsconfig.json paths mirror.
Scripts: Add dev, build, lint, format, typecheck, test:unit, test:e2e.
CI: GitHub Actions—matrix for Node versions, separate jobs (lint/type/test/build).
Storybook: For isolated component development (npx storybook@latest init).
DX tools: Add VS Code settings for auto-format on save, recommended extensions.
Deployment & Ops

Platform: Vercel (native) or containerize (Docker) for other targets.
Observability: Add logging abstraction (pino) + error tracking (Sentry).
Metrics: Web Vitals analytics route or external (e.g., PostHog).
Progressive enhancement: Graceful fallback when JavaScript disabled (Server Components help).
Scale: Use edge runtime where appropriate (export const runtime = 'edge' in route handlers needing low latency).
Environment Setup Commands

Key Config Files (Summaries)

tsconfig.json: Strict type safety, path aliases.
next.config.js: ESLint ignore build, bundle analyzer toggle, security headers.
.env.example: Document required env vars.
.prettierrc / prettier.config.cjs: Shared formatting.
lefthook.yml or .husky/: Pre-commit lint + format + typecheck on staged.
Common Early Pitfalls

Overusing Client Components (hurts bundle size).
Mixing validation logic across many layers (centralize with Zod).
Missing hydration mismatch warnings (log them during dev).
Ignoring image sizes causing layout shifts.
First Implementation Milestones

Scaffold project + configs.
Add a sample feature (/app/dashboard) with loading + error boundaries.
Integrate Zod for one API route and form.
Add initial unit + Playwright smoke test.
Configure CI workflow.
Deploy preview branch; run Lighthouse.
Next Steps (Optional Help)

I can scaffold this project directly.
I can write baseline config files.
I can set up a GitHub Actions workflow.