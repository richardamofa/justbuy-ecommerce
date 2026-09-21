import type { Collection } from "@ecommerce/contracts";
import { mockProducts } from "./products";

function idsWhere(pred: (p: (typeof mockProducts)[number]) => boolean) {
  return mockProducts.filter(pred).map((p) => p.id);
}

export const mockCollections: Collection[] = [
  {
    id: "col_new_arrivals",
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Just landed.",
    isVisible: true,
    productIds: idsWhere((p) => p.isNewArrival),
  },
  {
    id: "col_best_sellers",
    name: "Best Sellers",
    slug: "best-sellers",
    description: "What everyone keeps buying.",
    isVisible: true,
    productIds: idsWhere((p) => p.isBestSeller),
  },
  {
    id: "col_winter_essentials",
    name: "Winter Essentials",
    slug: "winter-essentials",
    description: "Layer up.",
    image: { id: "img_col_winter", url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&h=800&q=85", alt: "Winter Essentials", position: 0 },
    isVisible: true,
    productIds: idsWhere((p) => p.tags.includes("winter")),
  },
  {
    id: "col_sale",
    name: "Sale",
    slug: "sale",
    description: "Reduced, while stock lasts.",
    isVisible: true,
    productIds: idsWhere((p) => p.salePrice != null),
  },
];

export function findCollectionBySlug(slug: string) {
  return mockCollections.find((c) => c.slug === slug);
}
