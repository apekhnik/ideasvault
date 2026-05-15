# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANT**: This project uses Next.js 16, which has breaking changes from prior versions. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code. Heed deprecation notices.

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push schema changes to NeonDB (requires .env.local)
```

Required env vars in `.env.local`:
- `DATABASE_URL` or `POSTGRES_URL` — NeonDB connection string
- Clerk keys: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

## Architecture

**Stack**: Next.js 16 App Router · Clerk auth · NeonDB (serverless Postgres) · Drizzle ORM · Tailwind CSS v4 · Framer Motion

### Data flow pattern

Pages are React Server Components that fetch data and hand it off to `*Client` components:

```
page.tsx (RSC)
  → auth() from Clerk
  → query from lib/queries/  (read-only DB)
  → presenter from lib/presenters/  (DB record → UI props)
  → <*PageClient initialIdeas={...} />  (client component)
```

Mutations go through Next.js Server Actions in `src/lib/actions/ideas.ts`. Every action calls `auth()` and scopes queries to `userId`.

### Key directories

| Path | Purpose |
|---|---|
| `src/app/` | Routes: `/` (landing), `/vault` (main), `/archives`, `/categories` |
| `src/components/` | UI — `*PageClient` are page-level client shells; others are reusable |
| `src/lib/actions/ideas.ts` | All Server Actions (create/update/delete/archive idea, create category) |
| `src/lib/queries/ideas.ts` | Read-only DB queries returning `IdeaRecord[]` |
| `src/lib/presenters/ideas.ts` | `toIdeaCardProps()` converts DB rows to `IdeaCardData` |
| `src/lib/db/schema/ideas.ts` | Drizzle schema for `ideas` and `categories` tables |
| `src/lib/types/idea.ts` | Shared enums (`IdeaPriority`, `IdeaCategory`, `IdeaFormMode`) and interfaces |

### Database schema

Two tables, both scoped by `userId` (Clerk user ID):

- **`ideas`**: `id`, `userId`, `title`, `category`, `priority`, `rating`, `notes`, `tags`, `archivedAt`, `createdAt`, `updatedAt`
- **`categories`**: `id`, `userId`, `title`, `description`, `iconKey` — unique index on `(userId, title)`

Archiving is a soft-delete: `archivedAt IS NULL` = active, `archivedAt IS NOT NULL` = archived.

### Design system

Tailwind v4 with a Material Design 3-inspired token system. CSS custom properties define the palette in `globals.css`:

- **Default (dark)**: Obsidian & Gold — `--primary: #e6c364`
- **Light mode**: Alabaster & Gold — toggled by adding `.light` class to `<html>`

Theme switching is handled by `ThemeProvider` (context + localStorage). Custom utility classes: `gold-gradient`, `gold-glow`, `micro-border`, `premium-shadow`.

Color tokens follow the MD3 naming: `surface`, `on-surface`, `surface-container-*`, `primary`, `on-primary`, etc. Always use semantic tokens, not raw hex values.

### Auth

Clerk middleware in `src/middleware.ts` runs on all non-static routes. Public routes are only `/sign-in` and `/sign-up`. Auth state is available server-side via `auth()` from `@clerk/nextjs/server` and client-side via `useAuth()`.

### `IdeaFormModal` category loading

The form modal calls the `getIdeaCategories()` Server Action on open to merge categories from the `categories` table with distinct category values already on `ideas`. This deduplicates and merges both sources.
