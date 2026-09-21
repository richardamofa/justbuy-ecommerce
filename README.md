# Ecommerce Platform (Frontend Foundation)

A configurable single-store ecommerce platform. This milestone covers the
frontend foundation only: storefront, admin panel, and a shared component
library — all running on mock data. No backend, auth, payments, or
persistence yet.

## Stack

React · TypeScript · Vite · Tailwind CSS · React Router · Framer Motion ·
Lucide React · pnpm workspaces

## Structure

```
ecommerce/
├── apps/
│   ├── web/          # Customer storefront (port 5173)
│   ├── admin/         # Admin panel (port 5174)
│   └── api/           # Reserved for backend later (empty)
│
├── packages/
│   ├── ui/            # Shared UI components (Button, ProductCard, Modal, …)
│   ├── contracts/      # Shared TypeScript domain types
│   └── config/         # Shared Tailwind design tokens/preset
```

## Getting started

```bash
pnpm install

# storefront
pnpm dev:web       # http://localhost:5173

# admin panel
pnpm dev:admin      # http://localhost:5174
```

## Notable design decisions

- **Configurable homepage.** `apps/web/src/data/homepageSections.ts` defines
  an ordered list of typed sections (hero, new-arrivals, shop-by-category,
  trending, featured-collection, best-sellers, sale, newsletter). The
  `SectionRenderer` component maps each entry to a **reusable** section
  component — there's one `ProductRail` component behind New Arrivals,
  Trending, Best Sellers, and Sale, not four near-duplicate components. The
  admin's "Homepage Sections" screen edits a config shaped exactly like this
  (reordering/hiding is wired up in the UI; it isn't persisted yet).
- **Shared UI package.** `packages/ui` holds the primitives both apps use
  (`Button`, `Badge`, `Card`, `ProductCard`, `Modal`, `Input`, …) so the
  storefront and admin stay visually related without being copy-pasted.
- **Shared types.** `packages/contracts` defines `Product`, `Category`,
  `Collection`, `Order`, `Customer`, and `HomepageSection` — the shapes a
  real API would eventually return.
- **Mock data, not fake plumbing.** Cart state is a real (small) React
  context so Add to Bag → Cart drawer → Checkout UI works end-to-end in the
  browser; everything else (products, orders, customers) is static mock data
  per app, since there's no backend yet.

## What's intentionally not here

Backend, database, authentication, real payments, and any persistence.
Admin forms and the checkout flow are visual/interactive but don't write
anywhere — see `apps/api/README.md` for what's next.


