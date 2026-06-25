# Mondas — Agent guide

Next.js 15 App Router e-commerce (olive oil boutique).

**Before adding pages or components**, read [docs/UI-STYLE-GUIDE.md](docs/UI-STYLE-GUIDE.md) for typography, colors, motion, and layout conventions.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |

## App structure (route groups)

```
src/app/
  layout.tsx              # Root: Providers only
  providers.tsx
  (store)/                # Public shop + SiteLayout
  (admin)/admin/          # AdminShell + RoleGuard + middleware
  (auth)/auth/            # AuthLayout (no store chrome)
  (account)/profile/      # AuthGuard + AccountShell
  api/                    # Route handlers
src/middleware.ts         # Cookie session guards
src/lib/api/              # Client HTTP layer → /api/*
src/lib/auth/             # Session cookie + credentials
src/components/layouts/   # store, admin, auth, account shells
src/components/motion/    # PageTransition, FadeIn, Stagger
src/data/                 # Mock seed data
src/server/mock-db.ts     # Mutable in-memory API store
```

## Demo logins

| Email | Role |
|-------|------|
| `admin@dougga.com` | Admin |
| `mod@dougga.com` | Moderator |
| any other valid email | Customer |

## Skills

See `.cursor/skills/` for Mondas-specific Next.js, shadcn, Framer Motion, design, testing, and debugging guidance.
