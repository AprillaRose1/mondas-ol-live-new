# Mondas UI style guide

Use this checklist whenever you add a **new page** or **component** so the storefront stays consistent.

## Typography (required)

| Role | Class / component | When to use |
|------|-------------------|-------------|
| Page hero | `PageHeader` or `.page-title` + `.page-subtitle` | Top of shop, contact, cart, checkout, FAQ |
| Eyebrow | `.eyebrow` | Small label above a title |
| Section heading | `.section-title` or `AccentTitle` | Home sections, story blocks |
| Display (home hero) | `.display-title` + `AccentTitle` | Homepage hero only |
| Body | `.body-lg` or default `p` | Paragraphs, descriptions |
| Labels | `FormLabel` or `.form-label` | Form fields |
| Caps / meta | `.label-caps` | Prices meta, cart lines, footer-style labels |
| Nav / footer | `.nav-label`, `.footer-link`, `.footer-heading` | Navigation and footer only |

**Do not** use ad-hoc `text-5xl font-black`, `tracking-[0.4em]`, or `font-bold uppercase` unless documented here.

### Fonts

- **Body**: `font-sans` (DM Sans) — UI, forms, buttons, nav
- **Headings**: `font-serif` (Cormorant Garamond) — titles via `.page-title`, `.section-title`, `.display-title`
- Base size: `16px` root; body `text-[0.9375rem]` / `.body-lg`

## Color & surfaces

- Page: `bg-bg-page`
- Cards / panels: `card-premium` or `bg-bg-card border border-border-subtle`
- Matte sections: `bg-bg-matte`
- Text: `text-text-main`, `text-text-muted`, `text-text-secondary`
- Accent: `text-primary`, `bg-primary`, `btn-mondas`
- Borders: `border-border-subtle`

No raw hex in components — use CSS variables / Tailwind semantic tokens from `globals.css`.

## Layout

- Content width: `container-premium` (`max-w-6xl mx-auto px-5 lg:px-10`)
- Section spacing: `.section-y` or `.section-y-lg`
- Store pages below header: rely on layout `pt-[4.5rem] md:pt-20` (except full-bleed home hero)

## Motion

- Import from `@/lib/animations`: `fadeInUp`, `staggerContainer`, `scrollViewport`, split reveals
- Timing: `motionTransition` (~2.4s), premium ease `[0.22, 1, 0.36, 1]`
- Text + image splits: **text first**, image **+0.15s** (`SPLIT_IMAGE_DELAY`)
- Viewport: `scrollViewport` (re-animate on scroll) unless footer-like (`footerViewport`, `once: true`)

## Images

- Use `AppImage` from `@/components/ui/app-image`
- Local `/public` assets: served `unoptimized` at `quality={100}` by default
- Hover zoom on editorial images: `hoverZoom` prop
- `sizes` must match layout (e.g. `(min-width: 1024px) 50vw, 100vw` for half-width columns)

## Forms & buttons

- Primary CTA: `btn-mondas`
- Secondary: `btn-mondas-outline`
- Inputs: global base styles in `globals.css` (border, focus ring) — avoid one-off input classes
- Errors: `text-red-500 text-[10px] font-semibold uppercase`

## i18n

- All user-visible strings via `react-i18next` (`t('key')`)
- Add keys to `src/lib/i18n/en.ts` and mirror in `de`, `fr`, `ar` (or `brand-locales` for shared brand copy)

## File structure

```
src/app/(store)/<route>/page.tsx     # thin page, composes sections
src/components/<feature>/            # reusable UI for that feature
src/components/ui/                   # shared primitives (AppImage, typography)
src/lib/                             # schemas, helpers (no UI)
```

## New page checklist

- [ ] `PageHeader` or consistent title classes
- [ ] `container-premium` / full-bleed intentional
- [ ] Semantic colors only
- [ ] `AppImage` + correct `sizes`
- [ ] Motion variants from `@/lib/animations`
- [ ] i18n keys in all locales
- [ ] Mobile layout checked (no horizontal overflow)
- [ ] Cart / checkout links if commerce-related

## Reference pages

- **Gold standard**: Contact, Shop, Home sections (`src/components/home/`)
- **Split layout**: Story (`StorySplitSection`), `HomeSplitSection`
- **Commerce**: Cart, Checkout (`src/components/checkout/`)
