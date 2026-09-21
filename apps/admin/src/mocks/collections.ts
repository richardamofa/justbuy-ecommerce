import type { Collection } from "@ecommerce/contracts";
import { mockProducts } from "./products";

export const mockCollections: Collection[] = [
  {
    id: "col_new_arrivals",
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Just landed.",
    isVisible: true,
    productIds: mockProducts.filter((p) => p.isNewArrival).map((p) => p.id),
  },
  {
    id: "col_best_sellers",
    name: "Best Sellers",
    slug: "best-sellers",
    description: "What everyone keeps buying.",
    isVisible: true,
    productIds: mockProducts.filter((p) => p.isBestSeller).map((p) => p.id),
  },
  {
    id: "col_winter_essentials",
    name: "Winter Essentials",
    slug: "winter-essentials",
    description: "Layer up.",
    isVisible: true,
    productIds: mockProducts.filter((p) => p.tags.includes("winter")).map((p) => p.id),
  },
];
