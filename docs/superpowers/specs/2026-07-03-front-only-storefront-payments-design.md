# Design — Front-only storefront + real checkout (Stripe / PayPal / Nodemailer)

Date: 2026-07-03
Repo: `mondas-front-stale`
Status: approved for planning

## Goal

Turn `mondas-front-stale` into a self-contained Next.js storefront with **no remote backend**:

1. Remove every remaining real API call; app runs on local static data.
2. Remove the admin panel and auth entirely — pure public storefront.
3. Add real checkout payments: **Stripe** (Elements) + **PayPal** (Buttons), test/sandbox mode.
4. Replace the "orders backend" with **Nodemailer** — each paid order is emailed to a fixed inbox.
5. Fix cropped images (product card, product detail, hero).
6. Zoom-on-hover for all home + story images.
7. SEO: convert product detail + shop to Server Components with metadata.

Next.js Route Handlers (`src/app/api/*`) run server-side inside the same app — this is the "full-stack front-only" model. No separate backend service or repo.

## Non-goals

- No database, no order persistence beyond the email. Email IS the order record.
- No real payment credentials committed. Test/sandbox keys via env only.
- No user accounts, no order history, no admin.
- No redesign beyond the specified image + zoom fixes.

## Current state (verified)

- `src/lib/api/*` is already **client-only mock** over `src/data/*` (via `_mock.ts` `mockDelay`). `auth.ts`, `orders.ts`, `checkout.ts`, `products.ts` etc. return local data — no network.
- Remaining **real `fetch`** goes through `src/lib/api/http.ts` (→ `API_BASE + /api/...`, which 404s with no backend). Consumers still using it: admin pages (all deleted below), `contact-form`, `ProductReviews`, `auth-form` (deleted), `profile` (deleted), `auth-hydrator` (deleted).
- Checkout already scaffolds Stripe Elements (`stripe-payment.tsx`, `lib/stripe.ts`) but `createPaymentIntent` returns `clientSecret: null`, so it never activates. PayPal is a greyed "coming soon" box in `payment-step.tsx`.
- `AppImage` defaults `object-cover` (crops). `hoverZoom` prop exists but is gated to `objectFit === 'cover'` only.

## Architecture

### Data layer — minimal surgery (chosen)

Keep the existing `src/lib/api/*` mock modules that back the storefront (products, gallery, testimonials, reviews-read, checkout, contact). Delete only the admin/auth-specific modules and the dead HTTP transport. Rejected alternative: ripping out the whole `api/` abstraction and reading `src/data` directly everywhere — much larger diff, no user-visible gain, higher regression risk.

### Route Handlers (new, server-side)

```
src/app/api/checkout/stripe/route.ts        POST → { clientSecret }         (Stripe PaymentIntent)
src/app/api/checkout/paypal/create/route.ts POST → { id }                   (PayPal create order)
src/app/api/checkout/paypal/capture/route.ts POST → { status, id }          (PayPal capture)
src/app/api/orders/email/route.ts           POST → { ok }                    (Nodemailer order mail)
src/app/api/contact/route.ts                POST → { ok }                    (Nodemailer contact mail)
```

Amounts are recomputed server-side from cart line items + shipping (never trust a client total). Currency: EUR (matches product pricing).

## Work items

### 1. Remove admin + auth + dead API

Delete:
- `src/app/(admin)/**`, `src/app/(auth)/**`, `src/app/(account)/**`
- `src/lib/auth/**`, `src/lib/guards/**`
- `src/components/providers/auth-hydrator.tsx`
- Admin-only hooks: `useUsers`, `useDiscounts`, `useAnalytics`, `useOrders`, `useTestimonials` (if unused after admin removal), `useGallery` admin bits — audit each; keep any the storefront still imports.
- Admin-only api modules: `users`, `discounts`, `analytics`, `media`, `orders`, `audit-logs`, and `auth` (once no storefront ref remains).
- `src/lib/api/http.ts`, `src/lib/api/routes.ts` (after last consumer converted).
- Redux `authSlice` + `store` wiring + any `state.auth` selectors. Cart + wishlist slices stay.
- Middleware auth logic (`src/middleware.ts`) — reduce to i18n/no-op or delete if only auth.
- Header/Footer/nav links to admin/auth/profile/login.

Guardrail: after deletions, `npm run build` must pass — TypeScript surfaces every dangling import.

### 2. Contact form → email

- `contact-form.tsx`: replace `submitContactMessage` + `ApiError` with a `fetch('/api/contact', POST)`.
- `/api/contact/route.ts`: validate with existing `contactFormSchema` (server-side), send via Nodemailer to `ORDER_EMAIL_TO` (reuse mail transport). Best-effort; on failure return 500, client shows existing error toast.

### 3. Reviews → read-only

- `ProductReviews.tsx`: drop write / like / delete / "sign in to review" (all needed auth). Render approved reviews + summary from local `src/data/reviews-fallback.json` via existing (mock) `fetchReviews`, or read the JSON directly. Remove `state.auth` usage and `ApiError`/http import.

### 4. Payments

**Stripe:**
- Add `stripe` server SDK dep.
- `/api/checkout/stripe/route.ts`: recompute amount, `stripe.paymentIntents.create({ amount, currency: 'eur', automatic_payment_methods })`, return `clientSecret`.
- Wire `checkout/page.tsx` `initStripePayment` to call it (replace mock `createPaymentIntent`). Existing `StripePayment` (Elements) already confirms via `stripe.confirmPayment`. On success → post order email → step 3.

**PayPal:**
- Add `@paypal/react-paypal-js` for Buttons.
- Replace the greyed PayPal box in `payment-step.tsx` with real `<PayPalButtons>` inside `<PayPalScriptProvider>` (client id from `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `intent=capture`, currency EUR).
- `createOrder` → `/api/checkout/paypal/create`; `onApprove` → `/api/checkout/paypal/capture` → on `COMPLETED` → post order email → step 3.
- PayPal REST via server `fetch` with OAuth (client id/secret), base `https://api-m.sandbox.paypal.com` when `PAYPAL_ENV=sandbox`.

**Payment method selector:** make the card/PayPal tiles in `payment-step.tsx` selectable (they drive which pay UI shows). `paymentMethod` already in `CheckoutFormData`.

### 5. Order email (the orders backend)

- Add `nodemailer` dep + `src/lib/mail.ts` (transport from SMTP_* env, singleton).
- `/api/orders/email/route.ts`: accept `{ shipping, items, subtotal, shippingCost, total, paymentProvider, paymentRef }`, build an HTML + text order summary, send to `ORDER_EMAIL_TO` from `ORDER_EMAIL_FROM`. Optional buyer copy to `shipping.email`.
- Best-effort: payment is already captured before this runs. On mail failure, log server-side and still return success to the client so the buyer sees confirmation. (A failed email must not look like a failed order.)

### 6. Image crop fix

- **Product card** (`ProductCard.tsx`, `aspect-[4/5]`) + **product detail gallery + thumbnails** (`product/[id]`, `aspect-square`): `AppImage objectFit="contain"`. Full bottle shows, centered on card bg. Drop the crop-scale classes.
- **Hero** (`hero-carousel.tsx`): blurred-backdrop letterbox fill. Foreground `object-contain` (full image). Behind it, a duplicate of the same slide `object-cover` + `blur` + slight `scale` fills the letterbox gaps so no dead space. Apply to home hero + story hero (same component). Verify in browser preview against real images; tune blur/scale.

### 7. Zoom on hover — home + story

- `AppImage`: allow `hoverZoom` with **both** `contain` and `cover` (remove the `objectFit === 'cover'` gate on the zoom class; `group-hover:scale-*` works for either).
- Add `hoverZoom` to every content image on **home** (`home-split-section`, and any other home component using `AppImage`/`next/image`; `home-experiences` already has it) and **story** (`StorySplitSection` images + terroir image).
- Product images stay un-zoomed (they get un-cropped, not zoomed).

### 8. SEO — server components

- Convert `src/app/(store)/product/[id]/page.tsx` to a **Server Component**:
  - `generateStaticParams` from local product data.
  - `generateMetadata` (title, description, OpenGraph image = product image) per product.
  - Move interactive UI (gallery state, add-to-cart, tabs, wishlist) into a `'use client'` child that receives the product as a prop. No client-side fetch.
- Convert `src/app/(store)/shop/page.tsx` similarly: server shell + metadata; client child for filters/interaction.
- Confirm root `layout.tsx` / store layout has sane default metadata; keep i18n working (FR canonical per project convention).

## Environment (`.env` — placeholders in `.env.example`, real values uncommitted)

```
# Stripe (test)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# PayPal (sandbox)
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...

# Mail (Gmail app password now; provider-agnostic for Proton later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=...
SMTP_PASS=...
ORDER_EMAIL_TO=orders@example.com
ORDER_EMAIL_FROM="Mondas <orders@example.com>"
```

New deps: `stripe`, `nodemailer`, `@paypal/react-paypal-js`. (`@stripe/*` already present.)

## Data flow — checkout

1. Shipping step (client, validated) → payment step.
2. User picks Card or PayPal.
   - **Card:** `POST /api/checkout/stripe` → `clientSecret` → Stripe Elements confirm → success.
   - **PayPal:** Buttons → `create` → user approves → `onApprove` → `capture` → `COMPLETED`.
3. On payment success: `POST /api/orders/email` with order details → clear cart → `CheckoutSuccess`.
4. Email failure never blocks step 3.

## Error handling

- Payment errors → toast from provider message; user stays on payment step, cart intact.
- Server amount mismatch / invalid cart → 400, generic toast.
- Missing env keys → route returns 503 + logs a clear message; UI shows a graceful "payment unavailable" state (so a fresh clone without keys degrades cleanly).
- Mail transport error → logged, order still confirmed to buyer.

## Testing / verification

- `npm run lint` + `npm run build` pass.
- Browser preview: home + story images zoom on hover; product images uncropped; hero shows full image with blurred fill, no dead space.
- Stripe test card `4242 4242 4242 4242` → success → email arrives at `ORDER_EMAIL_TO`.
- PayPal sandbox buyer → capture COMPLETED → email arrives.
- Contact form → email arrives.
- Product page HTML contains full content + `<title>`/meta without JS (SSR), `generateStaticParams` builds all products.
- Light + dark theme checked for the image/checkout UI changes.

## Acceptance criteria

- [ ] No remote/`http.ts` fetch remains; no request 404s in the network panel on any storefront page.
- [ ] Admin + auth fully removed; no dead links; build clean.
- [ ] Stripe + PayPal both complete a test/sandbox purchase end-to-end.
- [ ] Each completed order emails a readable summary to the fixed inbox.
- [ ] Product + hero images display in full (no unwanted crop); hero gaps filled.
- [ ] Home + story images zoom on hover.
- [ ] Product detail + shop are Server Components with per-page metadata.
