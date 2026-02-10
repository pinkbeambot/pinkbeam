# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pink Beam marketing website and client management platform — a "Living Intelligence Factory." Built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4, and PostgreSQL via Supabase.

### Related: Obsidian Vault

Project documentation, tasks, and planning are tracked in a separate Obsidian vault at `~/obsidian/pinkbeam/`. The vault contains:

- `services/` — Task files for each service (Agents, Web, Labs, Solutions) plus `common/` for shared cross-service tasks
- `shared/` — Cross-cutting docs like `TECH-STACK.md`
- `Org Chart/` — Team identities and roles
- Task files use YAML frontmatter with fields like `status`, `priority`, `dependencies`, `consolidated_into`

When completing a task from the vault, update its status and work log in the corresponding Obsidian task file.

## Commands

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint (flat config, ESLint 9)
npx tsc --noEmit     # Type check (used in CI)
npm run test         # Vitest tests
npm run test:ui      # Vitest with browser UI

# Database (Prisma + Supabase PostgreSQL)
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations (prisma migrate dev)
npm run db:push      # Push schema to DB without migration
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed with sample data (tsx prisma/seed.ts)
```

## Architecture

### App Router Structure (Route Groups)

Pages are organized into route groups (parenthesized directories that don't affect URL paths):

- `app/(main)/` — Public marketing pages (home, about, contact, dashboard)
- `app/(web)/` — Web services section (admin portal, client portal, pricing, blog, SEO, maintenance)
- `app/(solutions)/` — Solutions showcase
- `app/(agents)/` — AI agent products
- `app/(labs)/` — Experimental features
- `app/api/` — REST API routes (17+ endpoints)
- `app/design-system/` — Live component showcase

### Authentication Flow

Supabase SSR auth with three layers:
- `lib/supabase/client.ts` — Browser-side Supabase client
- `lib/supabase/server.ts` — Server-side client (for Server Components/Route Handlers)
- `lib/supabase/middleware.ts` — Session refresh middleware

`middleware.ts` protects dashboard routes (`/agents/dashboard`, `/web/dashboard`, `/labs/dashboard`, `/solutions/dashboard`, `/dashboard/platform`) — unauthenticated users redirect to `/sign-in`.

### API Pattern

All API routes follow a consistent pattern:
- Zod validation on request bodies
- Response shape: `{ success: boolean, data?: T, error?: string }`
- Standard REST methods (GET/POST on collection, GET/PUT/DELETE on `[id]`)
- Key endpoints: `/api/clients`, `/api/projects`, `/api/quotes`, `/api/invoices`, `/api/support-tickets`, `/api/blog`, `/api/users/me`, `/api/health`

### Database (Prisma)

Schema at `prisma/schema.prisma`. Uses `driverAdapters` preview feature with `@prisma/adapter-pg`. Prisma client is instantiated as a singleton in `lib/prisma.ts` (cached on `globalThis` in dev).

Core models: User (roles: ADMIN/MANAGER/CLIENT), Project, Quote, QuoteRequest, Invoice, SupportTicket, BlogPost, ActivityLog.

**Important:** `lib/prisma.ts` uses `dotenv.config({ override: true })` to load `.env.local` values, because `supabase link` sets a stale `DATABASE_URL` in the shell environment. The `.env.local` value is the authoritative connection string.

### Component Library

- `components/ui/` — shadcn/ui primitives (Button, Card, Input, Badge, Dialog, Sheet, etc.)
- `components/animations/` — Framer Motion wrappers (FadeIn, SlideUp, StaggerContainer, etc.)
- `components/layout/` — Container, Section, SplitSection
- `components/web/`, `components/agents/`, `components/solutions/` — Section-specific components

Use `cn()` from `lib/utils` for merging Tailwind classes (clsx + tailwind-merge).

### Styling

Tailwind CSS 4 with custom theme in `app/globals.css`. Primary color: Pink (#FF006E). Three font families: Space Grotesk (display), Inter (body), JetBrains Mono (code). Dark mode supported via `next-themes`.

## Conventions

- **Imports:** Use `@/` path alias (maps to project root)
- **Components:** Named exports for shared components, default exports for pages
- **File naming:** PascalCase for components, camelCase for utilities, SCREAMING_SNAKE_CASE for constants
- **TypeScript:** Strict mode. Avoid `any` — use `unknown` with type guards. Types live in `/types`
- **Node version:** 22 (per CI config)

## CI Pipeline

GitHub Actions runs lint, typecheck, and build on push/PR to `main`. All three must pass.
