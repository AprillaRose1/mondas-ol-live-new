# Mondas

Premium olive oil boutique — **Next.js 15**, React 19, Tailwind v4, shadcn/ui, Framer Motion, Redux Toolkit.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

- **Store routes** (`src/app/(store)/`) — shop UI with header/footer
- **Admin** (`src/app/(admin)/admin/`) — dashboard behind cookie session + `RoleGuard`
- **Auth** (`src/app/(auth)/auth/`) — login/register
- **Account** (`src/app/(account)/profile/`) — protected profile
- **API** (`src/app/api/`) — products, orders, gallery, testimonials, auth session

Auth uses an httpOnly cookie (`mondas_session`) synced to Redux on the client. Middleware protects `/admin` and `/profile`.

## Demo accounts

- `admin@dougga.com` — admin (any password ≥ 6 chars)
- `mod@dougga.com` — moderator
- any other email — customer
