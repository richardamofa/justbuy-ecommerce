import type { HomepageConfig } from "@ecommerce/contracts";
import { mockCategories } from "./categories";
import { mockCollections } from "./collections";
import { mockProducts } from "./products";

const newArrivals = mockProducts.filter((p) => p.isNewArrival);
const bestSellers = mockProducts.filter((p) => p.isBestSeller);
const featured = mockProducts.filter((p) => p.isFeatured);
const topLevelCategories = mockCategories.filter((c) => c.parentId === null);
const winterCollection = mockCollections.find((c) => c.slug === "winter-essentials")!;
const winterProducts = mockProducts.filter((p) => winterCollection.productIds.includes(p.id));

export const mockHomepageConfig: HomepageConfig = {
  sections: [
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
      categories: topLevelCategories,
      categoryIds: topLevelCategories.map((c) => c.id),
    },
    {
      id: "sec_new_arrivals",
      type: "product-carousel",
      position: 2,
      isEnabled: true,
      title: "New Arrivals",
      subtitle: "Fresh this week",
      products: newArrivals,
      productIds: newArrivals.map((p) => p.id),
      viewAllHref: "/collections/new-arrivals",
    },
    {
      id: "sec_winter",
      type: "collection",
      position: 3,
      isEnabled: true,
      title: winterCollection.name,
      subtitle: winterCollection.description,
      collection: winterCollection,
      collectionId: winterCollection.id,
      products: winterProducts,
    },
    {
      id: "sec_best_sellers",
      type: "product-grid",
      position: 4,
      isEnabled: true,
      title: "Best Sellers",
      products: bestSellers,
      productIds: bestSellers.map((p) => p.id),
      viewAllHref: "/collections/best-sellers",
    },
    {
      id: "sec_banner",
      type: "banner",
      position: 5,
      isEnabled: true,
      image: { id: "banner_2_img", url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&h=700&q=85", alt: "Made to last", position: 0 },
      title: "Made to last, not to trend",
      ctaLabel: "Our approach",
      ctaHref: "/shop",
    },
    {
      id: "sec_featured",
      type: "product-grid",
      position: 6,
      isEnabled: true,
      title: "Editor's Picks",
      products: featured,
      productIds: featured.map((p) => p.id),
    },
    {
      id: "sec_newsletter",
      type: "newsletter",
      position: 7,
      isEnabled: true,
      heading: "Stay in the loop",
      body: "Occasional notes on new arrivals and restocks. No spam.",
    },
  ],
};
