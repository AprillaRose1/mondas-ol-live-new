# Mondas API

REST-style route handlers under `/api/*`. Client code uses `src/lib/api/*` and `API_ROUTES` in `src/lib/api/routes.ts`.

Point `NEXT_PUBLIC_API_URL` at an external backend when ready (e.g. `https://api.example.com`); paths stay the same.

## Auth

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/api/auth/login` | — | `{ email, password, name? }` |
| POST | `/api/auth/logout` | cookie | — |
| GET | `/api/auth/session` | — | — |

Session: httpOnly cookie `mondas_session`.

## Catalog

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/products` | — |
| GET | `/api/products/:id` | — |
| GET | `/api/gallery` | — |

## Orders

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/orders` | required (middleware + handler) |

## Testimonials

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/testimonials` | — |
| POST | `/api/testimonials` | — |
| DELETE | `/api/testimonials/:id` | — |

## Errors

```json
{ "error": "Message", "code": "UNAUTHORIZED", "details": {} }
```

Codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `BAD_REQUEST`, `INTERNAL_ERROR`.

## Server helpers

- `src/server/api/response.ts` — `apiSuccess`, `apiError`, …
- `src/server/api/request.ts` — `parseJsonBody` (Zod)
- `src/server/api/auth-guard.ts` — `requireSession`, `requireAdmin`

## Middleware

`src/middleware.ts` protects pages (`/admin`, `/profile`, `/auth`) and API prefixes listed in `PROTECTED_API_PREFIXES` (extend for new secured routes).
