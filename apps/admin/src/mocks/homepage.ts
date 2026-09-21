import type { HomepageSection } from "@ecommerce/contracts";
import { mockCategories } from "./categories";
import { mockProducts } from "./products";

const newArrivals = mockProducts.filter((p) => p.isNewArrival);
const bestSellers = mockProducts.filter((p) => p.isBestSeller);
const topLevel = mockCategories.filter((c) => c.parentId === null);

export const mockHomepageSections: HomepageSection[] = [
  {
    id: "sec_hero",
    type: "hero",
    position: 0,
    isEnabled: true,
    banners: [
      {
        id: "banner_1",
        heading: "Considered goods for daily wear",
        subheading: "Clothing, footwear and objects built to outlast a season.",
        image: { id: "banner_1_img", url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&h=1000&q=85", alt: "New season", position: 0 },
        ctaLabel: "Shop the new season",
        ctaHref: "/shop",
        position: 0,
        isActive: true,
      },
        {
          id: "banner_2",
          heading: "Objects with a place in your home",
          subheading: "Quiet forms, useful materials, and details worth living with.",
          image: { id: "banner_2_img", url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&h=1000&q=85", alt: "Objects in a considered home", position: 1 },
          ctaLabel: "Explore home",
          ctaHref: "/category/home",
          position: 1,
          isActive: true,
        },
        {
          id: "banner_3",
          heading: "The everyday, made better",
          subheading: "Reliable essentials in honest materials, designed for repeat wear.",
          image: { id: "banner_3_img", url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&h=1000&q=85", alt: "Everyday clothing", position: 2 },
          ctaLabel: "Shop essentials",
          ctaHref: "/shop",
          position: 2,
          isActive: true,
        },
    ],
  },
  {
    id: "sec_categories",
    type: "category-grid",
    position: 1,
    isEnabled: true,
    title: "Shop by category",
    categories: topLevel,
    categoryIds: topLevel.map((c) => c.id),
  },
  {
    id: "sec_new_arrivals",
    type: "product-carousel",
    position: 2,
    isEnabled: true,
    title: "New Arrivals",
    products: newArrivals,
    productIds: newArrivals.map((p) => p.id),
    viewAllHref: "/collections/new-arrivals",
  },
  {
    id: "sec_best_sellers",
    type: "product-grid",
    position: 3,
    isEnabled: true,
    title: "Best Sellers",
    products: bestSellers,
    productIds: bestSellers.map((p) => p.id),
    viewAllHref: "/collections/best-sellers",
  },
  {
    id: "sec_newsletter",
    type: "newsletter",
    position: 4,
    isEnabled: false,
    heading: "Stay in the loop",
    body: "Occasional notes on new arrivals and restocks.",
  },
];

export const sectionTypeLabels: Record<HomepageSection["type"], string> = {
  hero: "Hero banner",
  "product-grid": "Product grid",
  "product-carousel": "Product carousel",
  "category-grid": "Category grid",
  collection: "Collection block",
  banner: "Banner",
  "rich-content": "Rich content",
  newsletter: "Newsletter",
};
