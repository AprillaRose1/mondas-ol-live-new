# Front-only Storefront + Payments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `mondas-front-stale` into a self-contained Next.js storefront — no remote backend, admin/auth removed — with real Stripe + PayPal checkout, Nodemailer order emails, uncropped images, hover-zoom on home/story, and SEO-friendly Server Components.

**Architecture:** Keep the existing client-only mock data layer (`src/lib/api/*` over `src/data/*`). Delete admin + auth. Add Next.js Route Handlers (`src/app/api/*`) for the only server-side work: Stripe PaymentIntent, PayPal create/capture, order email, contact email. Server recomputes order totals from local product data (never trusts client totals). Product/shop pages become Server Components with metadata.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind v4, Redux Toolkit (cart/wishlist only), Framer Motion, `stripe` (server), `@stripe/*` (client, already present), `@paypal/react-paypal-js`, `nodemailer`.

**Verification model:** This repo has **no test runner** (CLAUDE.md: vitest "once installed"). Each task is verified with `npm run lint`, `npm run build`, and/or the browser preview instead of unit tests. Commit after each task.

---

## File Structure

**New files:**
- `src/lib/mail.ts` — Nodemailer transport singleton + `isMailConfigured()`.
- `src/lib/server/stripe.ts` — server Stripe client singleton.
- `src/lib/server/paypal.ts` — PayPal REST helpers (auth, create, capture).
- `src/lib/server/order.ts` — recompute order lines/total from `MOCK_PRODUCTS`.
- `src/app/api/checkout/stripe/route.ts` — POST → `{ clientSecret }`.
- `src/app/api/checkout/paypal/create/route.ts` — POST → `{ id }`.
- `src/app/api/checkout/paypal/capture/route.ts` — POST → `{ status, id }`.
- `src/app/api/orders/email/route.ts` — POST → `{ ok }` (order email).
- `src/app/api/contact/route.ts` — POST → `{ ok }` (contact email).
- `src/app/(store)/product/[id]/product-detail-client.tsx` — client UI (moved from page).
- `src/app/(store)/shop/shop-client.tsx` — client UI (moved from page).

**Modified files:**
- `src/components/ui/app-image.tsx` — allow `hoverZoom` for `contain` too.
- `src/components/ui/hero-carousel.tsx` — blurred-backdrop letterbox fill.
- `src/components/product/ProductCard.tsx` — `objectFit="contain"`.
- `src/components/home/home-split-section.tsx` — add `hoverZoom`.
- `src/app/(store)/story/page.tsx` — add `hoverZoom` to story images.
- `src/app/(store)/product/[id]/page.tsx` — becomes Server Component.
- `src/app/(store)/shop/page.tsx` — becomes Server Component.
- `src/app/(store)/checkout/page.tsx` — wire real payments + order email; drop auth.
- `src/components/checkout/payment-step.tsx` — method selector + PayPal buttons.
- `src/components/contact/contact-form.tsx` — POST to `/api/contact`.
- `src/components/product/ProductReviews.tsx` — read-only, no auth.
- `src/components/common/Header.tsx` — remove auth UI.
- `src/store/index.ts`, `src/app/providers.tsx`, `src/middleware.ts` — drop auth wiring.
- `.env.example` — add Stripe/PayPal/SMTP placeholders.

**Deleted:** `src/app/(admin)/**`, `src/app/(auth)/**`, `src/app/(account)/**`, `src/lib/auth/**`, `src/lib/guards/**`, `src/components/providers/auth-hydrator.tsx`, `src/store/slices/authSlice.ts`, admin-only api modules + hooks (see Task 4), `src/lib/api/http.ts`, `src/lib/api/routes.ts`.

---

## Phase A — Setup

### Task 1: Install dependencies

**Files:** `package.json`

- [ ] **Step 1: Install runtime + types**

Run:
```bash
npm install stripe nodemailer @paypal/react-paypal-js
npm install -D @types/nodemailer
```
Expected: packages added, no peer-dep errors that break install.

- [ ] **Step 2: Verify install**

Run: `npm run build`
Expected: build still passes (nothing wired yet).

- [ ] **Step 3: Commit**
```bash
git add package.json package-lock.json
git commit -m "chore: add stripe, nodemailer, paypal deps"
```

### Task 2: Env placeholders

**Files:** Modify `.env.example`

- [ ] **Step 1: Append placeholders**

Add to `.env.example`:
```
# ── Payments (Stripe test) ─────────────────────────────
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# ── Payments (PayPal sandbox) ──────────────────────────
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx

# ── Order email (Gmail app password now; provider-agnostic) ──
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
ORDER_EMAIL_TO=orders@example.com
ORDER_EMAIL_FROM="Mondas <orders@example.com>"
```

- [ ] **Step 2: Commit**
```bash
git add .env.example
git commit -m "chore: env placeholders for payments + order email"
```

---

## Phase B — Server libraries

### Task 3: Server helper libs (mail, stripe, paypal, order)

**Files:**
- Create `src/lib/mail.ts`
- Create `src/lib/server/stripe.ts`
- Create `src/lib/server/paypal.ts`
- Create `src/lib/server/order.ts`

- [ ] **Step 1: `src/lib/mail.ts`**
```ts
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP env missing (SMTP_HOST, SMTP_USER, SMTP_PASS)');
  }
  const port = Number(SMTP_PORT ?? 465);
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}
```

- [ ] **Step 2: `src/lib/server/stripe.ts`**
```ts
import Stripe from 'stripe';

let client: Stripe | null = null;

export const isStripeServerConfigured = (): boolean => Boolean(process.env.STRIPE_SECRET_KEY);

export function getStripeServer(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY missing');
  client ??= new Stripe(key);
  return client;
}
```

- [ ] **Step 3: `src/lib/server/paypal.ts`**
```ts
const BASE =
  process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

export const isPaypalConfigured = (): boolean =>
  Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);

async function accessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error('PayPal credentials missing');
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error('PayPal auth failed');
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function paypalCreateOrder(amount: number, currency = 'EUR') {
  const token = await accessToken();
  const res = await fetch(`${BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: currency, value: amount.toFixed(2) } }],
    }),
  });
  if (!res.ok) throw new Error('PayPal create order failed');
  return (await res.json()) as { id: string };
}

export async function paypalCaptureOrder(orderId: string) {
  const token = await accessToken();
  const res = await fetch(`${BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('PayPal capture failed');
  return (await res.json()) as { id: string; status: string };
}
```

- [ ] **Step 4: `src/lib/server/order.ts`**

Note: shipping is flat 0 (checkout `FREE_SHIPPING_THRESHOLD = 0` → shipping always 0). Prices come from local product data, not the client.
```ts
import { MOCK_PRODUCTS } from '@/data/products';

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface OrderLine {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

const SHIPPING_FLAT = 0;

export function buildOrder(items: OrderItemInput[]) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Empty order');
  }
  const lines: OrderLine[] = items.map((it) => {
    const p = MOCK_PRODUCTS.find((x) => x.id === it.productId);
    if (!p) throw new Error(`Unknown product ${it.productId}`);
    const quantity = Math.max(1, Math.floor(Number(it.quantity) || 1));
    return { productId: p.id, name: p.name.en, quantity, price: p.price, lineTotal: p.price * quantity };
  });
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const shipping = SHIPPING_FLAT;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}
```

- [ ] **Step 5: Verify types compile**

Run: `npm run build`
Expected: PASS (unused modules compile clean).

- [ ] **Step 6: Commit**
```bash
git add src/lib/mail.ts src/lib/server
git commit -m "feat: server helpers for mail, stripe, paypal, order pricing"
```

---

## Phase C — Route Handlers

### Task 4: Stripe + PayPal + order-email + contact routes

**Files:**
- Create `src/app/api/checkout/stripe/route.ts`
- Create `src/app/api/checkout/paypal/create/route.ts`
- Create `src/app/api/checkout/paypal/capture/route.ts`
- Create `src/app/api/orders/email/route.ts`
- Create `src/app/api/contact/route.ts`

- [ ] **Step 1: `src/app/api/checkout/stripe/route.ts`**
```ts
import { NextResponse } from 'next/server';
import { getStripeServer, isStripeServerConfigured } from '@/lib/server/stripe';
import { buildOrder } from '@/lib/server/order';

export async function POST(req: Request) {
  if (!isStripeServerConfigured()) {
    return NextResponse.json({ error: 'Payments unavailable' }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { items?: { productId: string; quantity: number }[] };
    const { total } = buildOrder(body.items ?? []);
    if (total <= 0) return NextResponse.json({ error: 'Empty order' }, { status: 400 });
    const stripe = getStripeServer();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (e) {
    console.error('[stripe] intent failed', e);
    return NextResponse.json({ error: 'Failed to init payment' }, { status: 400 });
  }
}
```

- [ ] **Step 2: `src/app/api/checkout/paypal/create/route.ts`**
```ts
import { NextResponse } from 'next/server';
import { isPaypalConfigured, paypalCreateOrder } from '@/lib/server/paypal';
import { buildOrder } from '@/lib/server/order';

export async function POST(req: Request) {
  if (!isPaypalConfigured()) {
    return NextResponse.json({ error: 'PayPal unavailable' }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { items?: { productId: string; quantity: number }[] };
    const { total } = buildOrder(body.items ?? []);
    if (total <= 0) return NextResponse.json({ error: 'Empty order' }, { status: 400 });
    const order = await paypalCreateOrder(total, 'EUR');
    return NextResponse.json({ id: order.id });
  } catch (e) {
    console.error('[paypal] create failed', e);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 400 });
  }
}
```

- [ ] **Step 3: `src/app/api/checkout/paypal/capture/route.ts`**
```ts
import { NextResponse } from 'next/server';
import { isPaypalConfigured, paypalCaptureOrder } from '@/lib/server/paypal';

export async function POST(req: Request) {
  if (!isPaypalConfigured()) {
    return NextResponse.json({ error: 'PayPal unavailable' }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { orderId?: string };
    if (!body.orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    const result = await paypalCaptureOrder(body.orderId);
    return NextResponse.json({ id: result.id, status: result.status });
  } catch (e) {
    console.error('[paypal] capture failed', e);
    return NextResponse.json({ error: 'Capture failed' }, { status: 400 });
  }
}
```

- [ ] **Step 4: `src/app/api/orders/email/route.ts`** (best-effort — never fails the buyer)
```ts
import { NextResponse } from 'next/server';
import { getTransporter, isMailConfigured } from '@/lib/mail';
import { buildOrder } from '@/lib/server/order';

interface Shipping {
  firstName?: string; lastName?: string; email?: string; phone?: string;
  address?: string; city?: string; zip?: string; country?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      items?: { productId: string; quantity: number }[];
      shipping?: Shipping;
      paymentProvider?: string;
      paymentRef?: string;
    };
    const { lines, subtotal, shipping, total } = buildOrder(body.items ?? []);
    const to = process.env.ORDER_EMAIL_TO;
    const from = process.env.ORDER_EMAIL_FROM ?? process.env.SMTP_USER;

    if (!isMailConfigured() || !to) {
      console.error('[orders/email] mail not configured — order NOT emailed', { total });
      return NextResponse.json({ ok: true, mailed: false });
    }

    const s = body.shipping ?? {};
    const rows = lines.map((l) => `${l.quantity}× ${l.name} — €${l.lineTotal.toFixed(2)}`).join('\n');
    const text =
      `NEW ORDER (${body.paymentProvider ?? 'unknown'})\n\n` +
      `${rows}\n\n` +
      `Subtotal: €${subtotal.toFixed(2)}\nShipping: €${shipping.toFixed(2)}\nTotal: €${total.toFixed(2)}\n\n` +
      `Ship to:\n${s.firstName ?? ''} ${s.lastName ?? ''}\n${s.address ?? ''}\n${s.city ?? ''} ${s.zip ?? ''}\n${s.country ?? ''}\n` +
      `${s.email ?? ''} / ${s.phone ?? ''}\n\n` +
      `Payment ref: ${body.paymentRef ?? '—'}`;
    const html =
      `<h2>New order (${body.paymentProvider ?? 'unknown'})</h2>` +
      `<ul>${lines.map((l) => `<li>${l.quantity}× ${l.name} — €${l.lineTotal.toFixed(2)}</li>`).join('')}</ul>` +
      `<p><b>Subtotal:</b> €${subtotal.toFixed(2)}<br/><b>Shipping:</b> €${shipping.toFixed(2)}<br/><b>Total:</b> €${total.toFixed(2)}</p>` +
      `<h3>Ship to</h3><p>${s.firstName ?? ''} ${s.lastName ?? ''}<br/>${s.address ?? ''}<br/>${s.city ?? ''} ${s.zip ?? ''}<br/>${s.country ?? ''}<br/>${s.email ?? ''} / ${s.phone ?? ''}</p>` +
      `<p><b>Payment ref:</b> ${body.paymentRef ?? '—'}</p>`;

    await getTransporter().sendMail({
      from,
      to,
      replyTo: s.email || undefined,
      subject: `New order — €${total.toFixed(2)} (${body.paymentProvider ?? 'unknown'})`,
      text,
      html,
    });
    return NextResponse.json({ ok: true, mailed: true });
  } catch (e) {
    // Payment is already captured; a mail failure must not look like a failed order.
    console.error('[orders/email] send failed', e);
    return NextResponse.json({ ok: true, mailed: false });
  }
}
```

- [ ] **Step 5: `src/app/api/contact/route.ts`**
```ts
import { NextResponse } from 'next/server';
import { getTransporter, isMailConfigured } from '@/lib/mail';
import { contactFormSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  try {
    const parsed = contactFormSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const to = process.env.ORDER_EMAIL_TO;
    const from = process.env.ORDER_EMAIL_FROM ?? process.env.SMTP_USER;
    if (!isMailConfigured() || !to) {
      console.error('[contact] mail not configured');
      return NextResponse.json({ error: 'Mail unavailable' }, { status: 503 });
    }
    const { name, email, subject, message } = parsed.data;
    await getTransporter().sendMail({
      from,
      to,
      replyTo: email,
      subject: `Contact form — ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[contact] send failed', e);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: PASS. Confirm `contactFormSchema` is exported from `@/lib/schemas` (it is, per `contact.schema.ts`).

- [ ] **Step 7: Commit**
```bash
git add src/app/api
git commit -m "feat: route handlers for stripe, paypal, order email, contact"
```

---

## Phase D — Remove admin + auth + dead API

### Task 5: Delete admin/auth/account routes, guards, auth libs, dead http

**Files:** deletions + a build gate.

- [ ] **Step 1: Delete directories/files**
```bash
git rm -r "src/app/(admin)" "src/app/(auth)" "src/app/(account)"
git rm -r src/lib/auth src/lib/guards
git rm src/components/providers/auth-hydrator.tsx
git rm src/store/slices/authSlice.ts
git rm src/lib/api/http.ts src/lib/api/routes.ts
git rm src/lib/api/auth.ts src/lib/api/users.ts src/lib/api/discounts.ts src/lib/api/analytics.ts src/lib/api/media.ts src/lib/api/orders.ts
git rm src/lib/hooks/useUsers.ts src/lib/hooks/useDiscounts.ts src/lib/hooks/useAnalytics.ts src/lib/hooks/useOrders.ts
```
Note: leave `src/lib/api/products.ts`, `gallery.ts`, `reviews.ts`, `testimonials.ts`, `contact.ts`, `checkout.ts`, `_mock.ts` and hooks `useProducts`, `useGallery`, `useTestimonials` (storefront still uses them). The build in later steps catches anything mis-deleted.

- [ ] **Step 2: Fix store — drop auth reducer**

Edit `src/store/index.ts`: remove the `authReducer` import and its key.
```ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist'],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

- [ ] **Step 3: Providers — drop AuthHydrator**

Edit `src/app/providers.tsx`: remove the `import { AuthHydrator }` line and the `<AuthHydrator />` element.

- [ ] **Step 4: Middleware — drop auth, keep matcher empty/no-op**

Replace `src/middleware.ts` entirely:
```ts
import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

export const config = { matcher: [] };
```

- [ ] **Step 5: Build to surface every dangling import**

Run: `npm run build`
Expected: FAIL, listing remaining references (Header, checkout, ProductReviews). Fixed in Task 6–8. Do not commit yet.

### Task 6: Strip auth from Header

**Files:** Modify `src/components/common/Header.tsx`

- [ ] **Step 1: Remove auth imports**

Delete these lines:
```ts
import { logout as logoutApi } from '@/lib/api/auth';
import { logout } from '@/store/slices/authSlice';
```
And the `LogOut, User` icons stay only if still used (see below — `User` is used for the mobile account button; keep `User`, remove `LogOut`).

- [ ] **Step 2: Remove auth state + handler**

Delete:
```ts
const { isAuthenticated, user } = useAppSelector(state => state.auth);
```
and the whole `handleLogout` function, and:
```ts
if (isAuthenticated && user && (user.role === 'admin' || user.role === 'moderator')) {
  navLinks.push({ to: '/admin/dashboard', label: t('nav.dashboard', 'Dashboard') });
}
```

- [ ] **Step 3: Replace the desktop account/logout block**

Replace the `{isAuthenticated ? ( ... ) : ( ... )}` account block **and** the trailing `{isAuthenticated && ( <button onClick={handleLogout} ...> )}` with nothing (remove both). The wishlist + cart links stay. The mobile hamburger button stays.

- [ ] **Step 4: Fix mobile account block**

In the mobile menu, replace the account `<div className="flex gap-4">...</div>` block (the `href={isAuthenticated ? '/profile' : '/auth'}` link + logout button) with nothing — remove the whole block. Keep wishlist/cart grid, language, accent.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: Header errors gone (checkout + ProductReviews may still error).

- [ ] **Step 6: Commit**
```bash
git add -A
git commit -m "refactor: remove admin + auth (routes, guards, libs, header UI, store)"
```

### Task 7: Reviews → read-only, no auth

**Files:** Rewrite `src/components/product/ProductReviews.tsx`

- [ ] **Step 1: Replace file**

Replace the whole file with a read-only version (no `state.auth`, no `ApiError`/http, no write/like/delete). Reads via existing mock `fetchReviews`.
```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Star, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchReviews, type Review, type ReviewsResult } from '@/lib/api/reviews';
import { AppImage } from '@/components/ui/app-image';

interface Props { productId: string }

const EMPTY: ReviewsResult = { reviews: [], count: 0, averageRating: 0, myReview: null };

function Avatar({ name, src, size = 40 }: { name: string; src: string | null; size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 uppercase"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {src ? <AppImage src={src} alt={name} sizes={`${size}px`} className="object-cover" /> : name.charAt(0)}
    </div>
  );
}

function Stars({ value, size = 11 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={cn(s <= value ? 'text-primary fill-primary' : 'text-border-subtle')} />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: Props) {
  const [data, setData] = useState<ReviewsResult>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchReviews(productId)
      .then((r) => { if (active) setData(r); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [productId]);

  return (
    <div className="space-y-10">
      {data.count > 0 && (
        <div className="flex items-center gap-6 p-6 bg-bg-card border border-border-subtle">
          <div className="text-center">
            <p className="text-5xl font-bold text-primary">{data.averageRating.toFixed(1)}</p>
            <div className="mt-1 flex justify-center"><Stars value={Math.round(data.averageRating)} size={14} /></div>
            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">
              {data.count} review{data.count !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-text-muted text-sm">Loading reviews...</div>
      ) : data.reviews.length === 0 ? (
        <p className="text-text-muted text-sm italic py-4">No reviews yet.</p>
      ) : (
        <div className="space-y-6">
          {data.reviews.map((review: Review) => (
            <div key={review.id} className="border-b border-border-subtle pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <Avatar name={review.userName} src={review.userAvatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{review.userName}</p>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-500">
                        <BadgeCheck size={12} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5"><Stars value={review.rating} /></div>
                  <p className="text-sm text-text-main mt-2 leading-relaxed">{review.text}</p>
                  <span className="text-[10px] text-text-muted">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```
Note: confirm `fetchReviews` and types `Review`/`ReviewsResult` are exported from `src/lib/api/reviews.ts`. If `reviews.ts` still uses `http.ts` (deleted), rewrite it to read `src/data/reviews-fallback.json` via `mockDelay` — mirror the `products.ts` mock pattern.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: reviews errors gone.

- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "refactor: product reviews are read-only (auth removed)"
```

---

## Phase E — Checkout payments + emails

### Task 8: Payment step — method selector + PayPal buttons

**Files:** Modify `src/components/checkout/payment-step.tsx`

- [ ] **Step 1: Make method tiles selectable + mount PayPal**

Rewrite `payment-step.tsx` to accept a selected method + PayPal handlers. New props:
```tsx
'use client';

import { useTranslation } from 'react-i18next';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { FormLabel } from '@/components/ui/typography';
import type { CheckoutFormData } from '@/lib/schemas';

type Method = 'card' | 'paypal';

type PaymentStepProps = {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  method: Method;
  onMethodChange: (m: Method) => void;
  paypalClientId: string | null;
  onPaypalCreate: () => Promise<string>;
  onPaypalApprove: (orderId: string) => Promise<void>;
  cardSlot: React.ReactNode; // Stripe Elements UI (rendered by parent)
};

const inputClass =
  'w-full bg-bg-card border border-border-subtle px-4 py-3 text-sm text-text-main focus:ring-1 focus:ring-primary h-[50px] rounded-sm';

export function PaymentStep({
  register, errors, method, onMethodChange, paypalClientId, onPaypalCreate, onPaypalApprove, cardSlot,
}: PaymentStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h3 className="section-title flex items-center gap-3 text-xl">
          <CreditCard size={20} className="text-primary" strokeWidth={1.5} />
          {t('checkout.payment_title')}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => onMethodChange('card')}
            className={cn(
              'relative flex items-center gap-4 border-2 p-5 text-left transition-colors',
              method === 'card' ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-primary/50',
            )}
          >
            <CreditCard className="text-primary" size={22} strokeWidth={1.5} />
            <div className="flex-grow">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-text-main">
                {t('checkout.payment_options.card')}
              </p>
              <p className="body-lg mt-1 text-[10px]">Visa, Mastercard, AMEX</p>
            </div>
            {method === 'card' && <CheckCircle size={16} className="text-primary" />}
          </button>
          <button
            type="button"
            onClick={() => onMethodChange('paypal')}
            className={cn(
              'relative flex items-center gap-4 border-2 p-5 text-left transition-colors',
              method === 'paypal' ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-primary/50',
            )}
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-text-main">
              {t('checkout.payment_options.paypal')}
            </p>
            {method === 'paypal' && <CheckCircle size={16} className="ml-auto text-primary" />}
          </button>
        </div>
      </div>

      {method === 'card' && <div className="card-premium p-6 md:p-8">{cardSlot}</div>}

      {method === 'paypal' && (
        paypalClientId ? (
          <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'EUR', intent: 'capture' }}>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={() => onPaypalCreate()}
              onApprove={(data) => onPaypalApprove(data.orderID)}
            />
          </PayPalScriptProvider>
        ) : (
          <p className="text-sm text-text-muted border border-border-subtle p-6">
            {t('checkout.paypal_unavailable', 'PayPal is not configured.')}
          </p>
        )
      )}

      <div className="card-premium space-y-3 p-6">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck size={20} strokeWidth={1.5} />
          <span className="label-caps text-primary">{t('checkout.secure_connection')}</span>
        </div>
        <p className="body-lg text-xs">{t('checkout.gdpr_notice')}</p>
      </div>
    </div>
  );
}
```
Add the missing import at top: `import { cn } from '@/lib/utils';`. The manual card-number inputs are removed — Stripe Elements (`cardSlot`) collects card data (PCI-safe).

- [ ] **Step 2: Build** — `npm run build` (checkout page not yet updated; may error — proceed to Task 9 before final build).

### Task 9: Checkout page — wire Stripe + PayPal + order email, drop auth

**Files:** Modify `src/app/(store)/checkout/page.tsx`

- [ ] **Step 1: Remove auth + mock imports; add helpers**

Remove: `import { submitCheckout, createPaymentIntent, ... }` mock calls, `ApiError`, `state.auth` selector, the guest-notice `<motion.div>` block, `isAuthenticated`.

Add near top:
```ts
import { isStripeEnabled } from '@/lib/stripe';
import { StripePayment } from '@/components/checkout/stripe-payment';

type Method = 'card' | 'paypal';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? null;

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Request failed');
  return res.json() as Promise<T>;
}

const orderItems = (items: { id: string; quantity: number }[]) =>
  items.map((i) => ({ productId: i.id, quantity: i.quantity }));
```

- [ ] **Step 2: New state + handlers**

Replace the old `placeOrder` / `initStripePayment` / `finalizeStripePayment` logic with:
```ts
const [method, setMethod] = useState<Method>('card');
const [clientSecret, setClientSecret] = useState<string | null>(null);

const sendOrderEmail = async (provider: string, paymentRef: string) => {
  const values = getValues();
  try {
    await postJson('/api/orders/email', {
      items: orderItems(items),
      shipping: {
        firstName: values.firstName, lastName: values.lastName, email: values.email, phone: values.phone,
        address: values.address, city: values.city, zip: values.zip, country: values.country,
      },
      paymentProvider: provider,
      paymentRef,
    });
  } catch (e) {
    console.error('order email failed (non-blocking)', e);
  }
};

const completeOrder = async (provider: string, paymentRef: string) => {
  await sendOrderEmail(provider, paymentRef);
  setOrderId(paymentRef);
  toast.success(t('checkout.success'));
  dispatch(clearCart());
  setStep(3);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Stripe: create intent, then mount Elements
const initStripe = async () => {
  setIsSubmitting(true);
  try {
    const res = await postJson<{ clientSecret: string }>('/api/checkout/stripe', { items: orderItems(items) });
    setClientSecret(res.clientSecret);
  } catch (e) {
    toast.error(e instanceof Error ? e.message : t('checkout.error'));
  } finally {
    setIsSubmitting(false);
  }
};

const onStripeSuccess = (paymentIntentId: string) => { void completeOrder('stripe', paymentIntentId); };

// PayPal
const paypalCreate = async () => {
  const res = await postJson<{ id: string }>('/api/checkout/paypal/create', { items: orderItems(items) });
  return res.id;
};
const paypalApprove = async (paypalOrderId: string) => {
  const res = await postJson<{ id: string; status: string }>('/api/checkout/paypal/capture', { orderId: paypalOrderId });
  if (res.status === 'COMPLETED') await completeOrder('paypal', res.id);
  else toast.error(t('checkout.error'));
};
```
Note: `StripePayment.onSuccess` currently takes no args. Update `stripe-payment.tsx` `onSuccess` to `(paymentIntentId: string) => void` and pass `paymentIntent.id` in `handlePay` (it already has `paymentIntent`). Update the prop type + call.

- [ ] **Step 3: Render payment step**

Replace the step-2 JSX branch with the new `PaymentStep`, passing the Stripe Elements as `cardSlot`:
```tsx
{step === 2 && (
  <motion.div key="payment" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
    <PaymentStep
      register={register}
      errors={errors}
      method={method}
      onMethodChange={setMethod}
      paypalClientId={PAYPAL_CLIENT_ID}
      onPaypalCreate={paypalCreate}
      onPaypalApprove={paypalApprove}
      cardSlot={
        isStripeEnabled ? (
          clientSecret ? (
            <StripePayment clientSecret={clientSecret} onSuccess={onStripeSuccess} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-text-muted">{t('checkout.stripe_intro', 'Continue to enter your card securely via Stripe.')}</p>
            </div>
          )
        ) : (
          <p className="text-sm text-text-muted">{t('checkout.stripe_unavailable', 'Card payment is not configured.')}</p>
        )
      }
    />
  </motion.div>
)}
```

- [ ] **Step 4: Fix the footer button for step 2**

For step 2, the confirm button applies only to the **card** method before Elements mount (PayPal has its own buttons). Replace the step-2 button branch:
```tsx
) : method === 'card' && isStripeEnabled && !clientSecret ? (
  <MondasButton type="button" loading={isSubmitting} onClick={() => void initStripe()} className="gap-2 px-8 py-3 shadow-lg shadow-primary/10">
    {t('checkout.buttons.continue_payment', 'Continue to payment')} <ArrowRight size={18} />
  </MondasButton>
) : null}
```
Remove the old `onSubmit`/`placeOrder` submit path and `PAYMENT_FIELDS` card validation (card fields no longer exist on the form). Keep `SHIPPING_FIELDS` + `goToPayment`.

- [ ] **Step 5: Build + lint**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 6: Commit**
```bash
git add -A
git commit -m "feat: real Stripe + PayPal checkout with order email on success"
```

### Task 10: Contact form → /api/contact

**Files:** Modify `src/components/contact/contact-form.tsx`

- [ ] **Step 1: Swap mock call for fetch**

Remove `import { submitContactMessage } from '@/lib/api/contact';` and `import { ApiError } from '@/lib/api/http';`. Replace `onSubmit`:
```ts
const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('failed');
    toast.success(t('contact.form.success'));
    reset({ name: '', email: '', subject: 'general', message: '' });
  } catch {
    toast.error(t('contact.form.error'));
  } finally {
    setIsSubmitting(false);
  }
};
```

- [ ] **Step 2: Build + commit**
```bash
npm run build
git add -A
git commit -m "feat: contact form sends email via /api/contact"
```

---

## Phase F — Images

### Task 11: AppImage — allow hoverZoom with contain

**Files:** Modify `src/components/ui/app-image.tsx:60`

- [ ] **Step 1: Ungate the zoom class**

Replace line 60:
```tsx
        hoverZoom && objectFit === 'cover' && 'transition-transform duration-700 ease-out will-change-transform group-hover:scale-110',
```
with:
```tsx
        hoverZoom && 'transition-transform duration-700 ease-out will-change-transform group-hover:scale-110',
```

- [ ] **Step 2: Build + commit**
```bash
npm run build
git add -A
git commit -m "feat: AppImage hoverZoom works with contain too"
```

### Task 12: Product images uncropped (contain)

**Files:** Modify `src/components/product/ProductCard.tsx`, `src/app/(store)/product/[id]/page.tsx` (or its client after Task 15 — apply to whichever holds the gallery JSX)

- [ ] **Step 1: ProductCard gallery image → contain**

In `ProductCard.tsx`, the `<AppImage>` (~line 92) add `objectFit="contain"` and drop the crop scale class:
```tsx
<AppImage
  src={product.images[currentImageIndex]}
  alt={product.name[currentLang]}
  objectFit="contain"
  sizes="(max-width: 768px) 100vw, 25vw"
/>
```
Keep the outer motion scale (subtle hover) if desired, but the image itself no longer crops.

- [ ] **Step 2: Product detail gallery + thumbnails → contain**

In the product detail gallery (main image + the 4-up thumbnails), add `objectFit="contain"` to both `<AppImage>` uses. Main:
```tsx
<AppImage src={prod.images[currentImage]} alt={prod.name[currentLang]} objectFit="contain" sizes="(max-width: 1024px) 100vw, 50vw" priority={currentImage === 0} />
```
Thumbnail:
```tsx
<AppImage src={img} alt="" objectFit="contain" sizes="80px" />
```

- [ ] **Step 3: Verify in preview**

Start preview (Task 17 workflow), open a product page + shop. Confirm full bottle visible, no crop. Commit:
```bash
git add -A
git commit -m "fix: product card + detail images show full (contain, no crop)"
```

### Task 13: Hero — blurred-backdrop letterbox fill

**Files:** Modify `src/components/ui/hero-carousel.tsx` (the slide `<Image>` ~line 249–269)

- [ ] **Step 1: Add blurred backdrop behind a contained foreground**

Inside each slide `<div className="relative h-full shrink-0" ...>`, render two images: a blurred cover backdrop, then the full contained image on top.
```tsx
<div
  key={`${src}-${i}`}
  className="relative h-full shrink-0 overflow-hidden"
  style={slideWidth > 0 ? { width: slideWidth } : { width: `${100 / slides.length}%` }}
  aria-hidden={looped ? toRealIndex(i, count) !== realIndex : i !== realIndex}
>
  {/* Blurred fill so letterbox gaps are never empty */}
  <Image
    src={src}
    alt=""
    fill
    quality={30}
    unoptimized
    sizes="100vw"
    aria-hidden
    className="pointer-events-none select-none scale-110 object-cover object-center blur-2xl"
    draggable={false}
  />
  <div className="pointer-events-none absolute inset-0 bg-black/20" />
  {/* Full image, uncropped */}
  <Image
    src={src}
    alt={/* keep the existing alt expression unchanged */ looped ? (toRealIndex(i, count) === realIndex ? (images.length > 1 ? `${alt} (${realIndex + 1}/${images.length})` : alt) : '') : i === 0 ? alt : ''}
    fill
    priority={priority && (looped ? i === 1 : i === 0)}
    quality={100}
    unoptimized
    sizes="100vw"
    className="pointer-events-none relative select-none object-contain object-center"
    draggable={false}
  />
</div>
```

- [ ] **Step 2: Verify in preview**

Open `/` and `/story`. Confirm hero shows the whole image, gaps filled by the blurred version, no hard letterbox bars. Tune `blur-2xl`/`scale-110`/`bg-black/20` if needed.

- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "fix: hero shows full image with blurred-backdrop letterbox fill"
```

### Task 14: Zoom-on-hover for home + story images

**Files:** Modify `src/components/home/home-split-section.tsx`, `src/app/(store)/story/page.tsx`

- [ ] **Step 1: home-split-section → hoverZoom**

The wrapper `<motion.div>` already has `overflow-hidden`; add `group` to it and `hoverZoom` to the `AppImage`:
```tsx
className="group relative h-full min-h-[50vh] w-full overflow-hidden lg:min-h-[70vh]"
```
```tsx
<AppImage
  src={imageSrc}
  alt={imageAlt}
  objectFit="cover"
  hoverZoom
  sizes="(min-width: 1024px) 50vw, 100vw"
  containerClassName="absolute inset-0 size-full bg-bg-page"
/>
```
This covers home-ancient-tree, home-mission, home-tradition-split (all render through it). home-experiences already has `hoverZoom`.

- [ ] **Step 2: story split sections → hoverZoom**

In `story/page.tsx` `StorySplitSection`, the outer `<motion.div>` already has `group` + `overflow-hidden`. Add `hoverZoom` to its `AppImage` (keep `objectFit="contain"` — now zoom-capable):
```tsx
<AppImage
  src={imageSrc}
  alt={imageAlt}
  objectFit="contain"
  hoverZoom
  sizes={STORY_IMAGE_SIZES}
  containerClassName="absolute inset-0 bg-bg-page"
/>
```
And the terroir image (`/story/story6.jpg`) — its wrapper has `group overflow-hidden`; add `hoverZoom`:
```tsx
<AppImage
  src="/story/story6.jpg"
  alt={t('story.terroir.image_alt')}
  objectFit="cover"
  hoverZoom
  sizes="(max-width: 1152px) 100vw, 1152px"
  containerClassName="absolute inset-0 h-full w-full"
/>
```

- [ ] **Step 3: Verify + commit**

Preview `/` and `/story`, hover images → zoom. Then:
```bash
git add -A
git commit -m "feat: hover-zoom on home + story images"
```

---

## Phase G — SEO Server Components

### Task 15: Product detail → Server Component with metadata

**Files:**
- Create `src/app/(store)/product/[id]/product-detail-client.tsx`
- Rewrite `src/app/(store)/product/[id]/page.tsx`

- [ ] **Step 1: Move current client UI into `product-detail-client.tsx`**

Create the client component from the CURRENT `page.tsx` body, but **remove the data-fetching**. Signature + preamble:
```tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { addItem } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import type { Language, Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';
import { MondasButton } from '@/components/ui/mondas-button';
import { fadeInUp, staggerContainer, fadeIn, scrollViewport } from '@/lib/animations';
import { AppImage } from '@/components/ui/app-image';
import { ProductReviews } from '@/components/product/ProductReviews';

export function ProductDetailClient({ product: prod, related }: { product: Product; related: Product[] }) {
  const dispatch = useAppDispatch();
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.slice(0, 2) as Language;
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [isAdding, setIsAdding] = useState(false);
  const isInWishlist = useAppSelector((s) => s.wishlist.itemIds.includes(prod.id));
  const id = prod.id;
  const relatedProducts = related;

  const handleAddToCart = async () => {
    if (prod.stock < quantity) { toast.error('Not enough stock'); return; }
    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 600));
    for (let i = 0; i < quantity; i++) dispatch(addItem(prod));
    toast.success(t('common.addedToCart'));
    setIsAdding(false);
  };

  return (
    /* ↓ paste the ENTIRE JSX return block from the original page.tsx starting at
       <div className="min-h-screen pt-6 pb-24 ..."> through its closing </div>,
       UNCHANGED. It already references prod, currentImage, relatedProducts, etc.
       Apply the objectFit="contain" gallery edits from Task 12 here. */
  );
}
```
Delete the original `useEffect`/`fetchProductById`/`isLoading`/loading-skeleton/not-found branches — the server guarantees a valid product.

- [ ] **Step 2: Server `page.tsx`**

Replace `src/app/(store)/product/[id]/page.tsx` with:
```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/data/products';
import { ProductDetailClient } from './product-detail-client';

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = MOCK_PRODUCTS.find((x) => x.id === params.id);
  if (!p) return { title: 'Product not found' };
  const description = p.description.en.slice(0, 160);
  return {
    title: `${p.name.en} — Mondas`,
    description,
    openGraph: {
      title: p.name.en,
      description,
      images: p.images?.[0] ? [{ url: p.images[0] }] : undefined,
      type: 'website',
    },
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCTS.find((p) => p.id === params.id);
  if (!product) notFound();
  const related = MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  return <ProductDetailClient product={product} related={related} />;
}
```
Note: if the installed Next version types `params` as a Promise (Next 15.x async params), make `generateMetadata`/`ProductPage` `async` and `await params`. Verify against the build error and adjust.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS; build log shows product routes prerendered (`generateStaticParams`).

- [ ] **Step 4: Verify SSR content**

Preview a product page. `curl` the route (or preview_network) and confirm the HTML contains the product name + description without JS. Commit:
```bash
git add -A
git commit -m "feat: product detail is a Server Component with metadata + static params"
```

### Task 16: Shop → Server Component with metadata + SSR content

**Files:**
- Create `src/app/(store)/shop/shop-client.tsx`
- Rewrite `src/app/(store)/shop/page.tsx`

- [ ] **Step 1: Move current shop UI into `shop-client.tsx`**

Copy the ENTIRE current `shop/page.tsx` into `shop-client.tsx`, rename the export `export function ShopClient({ initialProducts }: { initialProducts: Product[] })`, and seed the accumulation state so SSR/first paint shows products:
```tsx
// change:
const [items, setItems] = useState<Product[]>([]);
// to:
const [items, setItems] = useState<Product[]>(initialProducts);
```
Keep everything else (`useProducts`, filters, load-more). Keep `'use client';` at top. Add `import type { Product } from '@/lib/types';` (already imported).

- [ ] **Step 2: Server `page.tsx`**
```tsx
import type { Metadata } from 'next';
import { MOCK_PRODUCTS } from '@/data/products';
import { ShopClient } from './shop-client';

export const metadata: Metadata = {
  title: 'Shop — Mondas',
  description: 'Browse Mondas premium olive oils and infusions from Dougga, Tunisia.',
};

export default function ShopPage() {
  const initialProducts = MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 12);
  return <ShopClient initialProducts={initialProducts} />;
}
```
Note: initial list mirrors the client's default `featured: true` first page so hydration is consistent.

- [ ] **Step 3: Build + verify + commit**

Run: `npm run build`
Expected: PASS. Preview `/shop`; confirm products render in initial HTML. Commit:
```bash
git add -A
git commit -m "feat: shop is a Server Component with metadata + SSR product content"
```

---

## Phase H — Final verification

### Task 17: End-to-end verification

**Files:** none (verification only). Requires real test/sandbox keys in `.env` for payment steps.

- [ ] **Step 1: Lint + build**

Run: `npm run lint && npm run build`
Expected: both PASS, no warnings about missing modules.

- [ ] **Step 2: No dead API calls**

Run: `npm run dev`, open every storefront page (`/`, `/shop`, `/product/<id>`, `/story`, `/contact`, `/cart`, `/checkout`, `/gallery`, `/recipes`, `/faq`, `/wishlist`) and confirm the network panel shows **no 404** to `/api/*` except the intentional new routes. No references to `NEXT_PUBLIC_API_URL` remain.

- [ ] **Step 3: Images**

Confirm: product card + detail show full bottles (no crop); hero shows full image with blurred fill; home + story images zoom on hover; light + dark theme both OK.

- [ ] **Step 4: Payments (with test keys in .env)**

- Stripe: pick Card → Continue to payment → pay with `4242 4242 4242 4242`, any future expiry/CVC → success screen.
- PayPal: pick PayPal → sandbox buyer login → approve → capture COMPLETED → success screen.
- Confirm an order email arrives at `ORDER_EMAIL_TO` for each.

- [ ] **Step 5: Contact**

Submit the contact form → email arrives at `ORDER_EMAIL_TO`.

- [ ] **Step 6: SEO**

`curl -s localhost:3000/product/<id> | grep -i '<title>'` shows the product title; product HTML contains description without JS. `npm run build` log lists product routes as statically generated.

- [ ] **Step 7: Final commit (if any tweaks)**
```bash
git add -A
git commit -m "chore: final verification tweaks for storefront + payments"
```

---

## Self-Review (author checklist — completed)

- **Spec coverage:** Remove API calls → Tasks 5–10. Admin+auth removal → Tasks 5–6. Stripe+PayPal → Tasks 3,4,8,9. Nodemailer order email → Tasks 3,4,9. Contact email → Tasks 4,10. Reviews read-only → Task 7. Image crop (product) → Task 12. Hero fill → Task 13. Hover-zoom → Tasks 11,14. SEO server components → Tasks 15,16. Env → Task 2. Deps → Task 1. Verification → Task 17. All spec sections mapped.
- **Placeholder scan:** the only "paste unchanged" reference is the product-detail JSX (Task 15) — intentional, the executor holds the original file; all new code shown in full.
- **Type consistency:** `buildOrder` returns `{ lines, subtotal, shipping, total }` used consistently in Tasks 3,4. `OrderItemInput { productId, quantity }` matches `orderItems()` output in Task 9. `StripePayment.onSuccess` signature change flagged in Task 9. `PaymentStep` prop shape matches its call site.
- **Known follow-up:** Next 15 async `params` typing — flagged inline in Task 15 to adjust against the build error.
