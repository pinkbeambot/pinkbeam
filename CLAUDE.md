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
npm run build        # Production build (runs prisma generate first)
npm run lint         # ESLint (flat config, ESLint 9)
npx tsc --noEmit     # Type check

# Testing (Vitest)
npm test                              # Run all unit tests (single run)
npx vitest run lib/__tests__/email    # Run single test file
npx vitest -t "template"             # Run tests matching name pattern
npm run test:coverage                 # Coverage report (v8)

# E2E Testing (Playwright)
npm run test:e2e     # Run E2E tests (auto-starts dev server)
npm run test:e2e:ui  # Playwright interactive UI

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

- `app/(main)/` — Public marketing pages (home, contact, dashboard, help, privacy, terms)
- `app/(web)/` — Web services section (admin portal, client portal, pricing, blog)
- `app/(solutions)/` — Solutions/consulting services
- `app/(agents)/` — AI agent products
- `app/(labs)/` — Development/labs services
- `app/(portal)/` — Authenticated client portal
- `app/api/` — REST API routes

Each route group has its own layout with service-specific metadata and a `ConditionalXyzNav` component that renders service-appropriate navigation.

### Authentication & Middleware

Supabase SSR auth with three layers:
- `lib/supabase/client.ts` — Browser-side Supabase client
- `lib/supabase/server.ts` — Server-side client (for Server Components/Route Handlers)
- `lib/supabase/middleware.ts` — Session refresh and cookie management

`middleware.ts` handles:
- **Route protection:** `/portal` routes redirect unauthenticated users to `/sign-in`
- **Auth redirect:** Authenticated users on `/sign-in` or `/sign-up` redirect to `/portal`
- **API auth header:** Sets `x-user-id` header on API routes when user is authenticated
- **Rate limiting:** In-memory, per-IP. Global: 120 req/min. Sensitive endpoints (`/api/user/delete`, `/api/agents/purchase`, `/api/quotes`, `/api/labs/quotes`): 10 req/min
- **E2E test support:** Cookie-based auth bypass with `pb-e2e-auth=1`

### API Pattern

All API routes follow a consistent pattern:
- Zod validation on request bodies (schemas in `lib/validation.ts`)
- Response shape: `{ success: boolean, data?: T, error?: string }`
- Standard REST methods (GET/POST on collection, GET/PUT/DELETE on `[id]`)
- **Important:** Route handler `params` is a `Promise` — must be awaited: `const { id } = await params`

Auth middleware decorators in `lib/auth/apiMiddleware.ts`:
- `withAuth()` — Requires authentication (401 if not)
- `withAdmin()` — Requires ADMIN or MANAGER role (403 if insufficient)
- `withOwnership()` — Verifies user owns the resource
- `applyUserFilter()` — Filters Prisma queries by user role (admins see all, clients see own)

### Database (Prisma)

Schema at `prisma/schema.prisma`. Uses `driverAdapters` preview feature with `@prisma/adapter-pg`. Prisma client is instantiated as a singleton in `lib/prisma.ts` (cached on `globalThis` in dev).

Core models: User (roles: ADMIN/MANAGER/CLIENT), Project, Quote, QuoteRequest, Invoice, SupportTicket, BlogPost, ActivityLog. Also includes subscription/billing models (Plan, Subscription, AgentAssignment, UsageRecord), task management (Task, Sprint, TimeEntry), and messaging (Conversation, Message).

**Important:** `lib/prisma.ts` uses `dotenv.config({ override: true })` to load `.env.local` values, because `supabase link` sets a stale `DATABASE_URL` in the shell environment. The `.env.local` value is the authoritative connection string.

### Key Systems

**AI Integration (`lib/ai/`):**
- `claude-client.ts` — Anthropic SDK wrapper with sync/streaming modes, auto model selection (haiku for simple, sonnet for complex), cost estimation
- `valis-prompt.ts` — VALIS personality system prompt (the AI persona across all touchpoints)

**Email (`lib/email.ts` + `lib/email-templates/`):**
- Resend API for delivery. Functions organized by category: quotes (8), tickets (4), auth (3), invoices (2), projects (4), demos/resources (2)
- Templates in `lib/email-templates/` return `{ subject, html, text }`. Reusable HTML components in `email-templates/components/`

**Webhooks (`lib/webhooks/`):**
- Modular event handling with signature verification for Stripe, GitHub, Clerk
- `createWebhookHandler()` wrapper handles idempotency, logging, and retries
- Handlers return `{ success, message, shouldRetry? }`

**Product Catalog (`lib/products/catalog.ts`):**
- Single source of truth for all products, pricing, features, limits, and Stripe price IDs across all 4 services

**Environment (`lib/env.ts`):**
- Zod-validated env vars. Required: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Optional with defaults: `RESEND_API_KEY`, `EMAIL_FROM`, `STRIPE_SECRET_KEY`, `CRON_SECRET`, etc.

### Component Library

- `components/ui/` — shadcn/ui primitives (Button, Card, Input, Badge, Dialog, Sheet, Accordion, etc.)
- `components/animations/` — Framer Motion wrappers (FadeIn, SlideUp, StaggerContainer, etc.)
- `components/layout/` — Container, Section, SplitSection (with size/padding/background variants)
- `components/web/`, `components/agents/`, `components/solutions/` — Service-specific section components

Use `cn()` from `lib/utils` for merging Tailwind classes (clsx + tailwind-merge).

### Styling

Tailwind CSS 4 with custom theme in `app/globals.css`. Three font families: Space Grotesk (display), Inter (body), JetBrains Mono (code). Dark mode via `next-themes`.

Service color theming:
- Agents: Pink (`#FF006E`)
- Web: Violet (`#8B5CF6`)
- Labs: Cyan (`#06B6D4`)
- Solutions: Amber (`#F59E0B`)

## Conventions

- **Imports:** Use `@/` path alias (maps to project root)
- **Components:** Named exports for shared components, default exports for pages
- **Client components:** Section components in `components/sections/` use `"use client"` directive
- **File naming:** PascalCase for components, camelCase for utilities, SCREAMING_SNAKE_CASE for constants
- **TypeScript:** Strict mode. Avoid `any` — use `unknown` with type guards. Types live in `/types`
- **Node version:** 22

## CI Pipeline

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`:

```
lint ──────┐
typecheck ─┼─→ e2e ─→ build
test ──────┘
```

All jobs must pass. Build uses placeholder Supabase env vars.

**Note:** `next.config.ts` temporarily ignores ESLint and TypeScript errors during builds (`ignoreDuringBuilds: true`, `ignoreBuildErrors: true`) due to pre-existing errors. `npx tsc --noEmit` is the authoritative type check.
