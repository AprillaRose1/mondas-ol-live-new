# Mondas — Claude Code Project Guide

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 App Router, React 19 |
| Language | TypeScript ~5.8 |
| Styling | Tailwind v4 (`@theme` in `globals.css`), shadcn new-york |
| State | Redux Toolkit + redux-persist (`src/store/slices/`) |
| Animation | Framer Motion 12 |
| Forms | React Hook Form + Zod |
| i18n | i18next (`src/lib/i18n/`) |
| Auth | Session-based (`src/lib/auth/`, Next.js API routes) |

## Key paths

```
src/app/          — Next.js App Router pages & API routes
src/components/   — UI components (ui/, layouts/, common/, features/)
src/lib/          — types, hooks, auth, utils, animations, i18n
src/store/        — Redux store + slices
src/data/         — Mock data (gallery.ts, …)
src/server/       — Server-side mock DB
public/           — Static assets
```

## Aliases

All `@/` → `src/`. Examples: `@/components`, `@/lib/types`, `@/store`.

## Commands

```bash
npm run dev       # dev server (port 3000)
npm run build     # production build
npm run lint      # ESLint
npm run test      # Vitest (once installed — see /project:testing)
```

## Core rules

- **Client boundary**: add `'use client'` only when file uses hooks, Redux, browser APIs, motion, or event handlers.
- **State**: cart, auth, wishlist live in Redux — do not add a second global-state lib.
- **Types**: shared shapes in `src/lib/types/`; use barrel `@/lib/types`.
- **Styling**: use semantic tokens (`bg-bg-card`, `text-text-main`, `bg-primary`) — never hardcode `#c5a059`.
- **Scope**: smallest correct diff; match existing naming; no drive-by refactors.
- **i18n**: copy in `src/lib/i18n/{en,de,fr,ar}.ts`; wire through existing config.

## Before marking done

- [ ] `npm run lint` passes
- [ ] `npm run build` passes for non-trivial changes
- [ ] Light + dark theme checked for UI work
- [ ] No new deps without reason

## Skills (slash commands)

| Command | Purpose |
|---------|---------|
| `/project:nextjs` | App Router patterns, RSC, routing, data fetching |
| `/project:ui` | shadcn/UI + design system tokens |
| `/project:motion` | Framer Motion shared variants |
| `/project:testing` | Vitest + RTL setup and patterns |
| `/project:nestjs` | NestJS backend conventions (future API) |
| `/project:superpowers` | Full power-workflow: scaffold, lint, build, test |
