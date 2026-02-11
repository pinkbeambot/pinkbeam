# Repository Guidelines

## Project Structure
The codebase is a Next.js App Router site. Key paths:
- `app/` routes, layouts, and page-level components.
- `components/` shared UI; `components/ui/` hosts shadcn/ui primitives.
- `hooks/` custom React hooks.
- `lib/` utilities and shared logic; tests live in `lib/__tests__/`.
- `types/` shared TypeScript types.
- `content/` CMS content (Sanity).
- `public/` static assets (`images/`, `videos/`).
- `styles/` global styles and Tailwind setup.
- `prisma/` schema and seeding.
- `supabase/` edge functions and migrations.
- `scripts/` maintenance scripts (e.g., storage setup).

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the local dev server (http://localhost:3000).
- `npm run build` creates a production build.
- `npm run start` runs the production server after build.
- `npm run lint` runs ESLint.
- `npm run test` runs Vitest in `jsdom`.
- `npm run test:ui` launches the Vitest UI.
- DB helpers: `npm run db:migrate`, `npm run db:seed`, `npm run db:studio`.

## Coding Style & Naming Conventions
Use strict TypeScript; avoid `any` (prefer `unknown` + type guards). Define shared types in `types/`. Use functional components with hooks, and require a props interface for components. Page components should be default exports; shared components should use named exports. Styling is Tailwind-only; use `cn()` from `lib/utils` for conditional classes and follow mobile-first patterns. File names: components `PascalCase.tsx`, utilities `camelCase.ts`, types `PascalCase.ts` or `types.ts`, constants `SCREAMING_SNAKE_CASE`. Indentation is 2 spaces in TS/TSX; follow existing file style and let `npm run lint` be the source of truth.

## Testing Guidelines
Tests use Vitest + React Testing Library. Place tests under `lib/__tests__/` and name them `*.test.ts`. Add tests for utility functions and complex components. Run `npm run test` before committing; use `npm run test:ui` for focused debugging.

## Commit & Pull Request Guidelines
Commit history uses ticket-style prefixes like `WEB-012: ...`, `COMMON-010: ...`, `HOME-013: ...`; use the relevant ticket ID when available and keep messages descriptive and atomic. Small fixes may use `Fix: ...`. Work on feature branches and squash-merge after review. PRs should include a short summary, linked ticket/issue, test notes, and screenshots for UI changes.

## Environment & Configuration
Copy `.env.example` to `.env.local` and fill required values. Keep secrets out of the repo.
