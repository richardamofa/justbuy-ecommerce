import type { Category } from "@ecommerce/contracts";

export const mockCategories: Category[] = [
  {
    id: "cat_apparel",
    name: "Apparel",
    slug: "apparel",
    description: "Everyday clothing, cut for movement.",
    parentId: null,
    position: 0,
    isVisible: true,
    image: { id: "img_cat_apparel", url: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=640&h=800&q=85", alt: "Apparel", position: 0 },
  },
  {
    id: "cat_apparel_outerwear",
    name: "Outerwear",
    slug: "apparel/outerwear",
    parentId: "cat_apparel",
    position: 0,
    isVisible: true,
  },
  {
    id: "cat_apparel_knitwear",
    name: "Knitwear",
    slug: "apparel/knitwear",
    parentId: "cat_apparel",
    position: 1,
    isVisible: true,
  },
  {
    id: "cat_footwear",
    name: "Footwear",
    slug: "footwear",
    description: "Built to last a season and then some.",
    parentId: null,
    position: 1,
    isVisible: true,
    image: { id: "img_cat_footwear", url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=640&h=800&q=85", alt: "Footwear", position: 0 },
  },
  {
    id: "cat_bags",
    name: "Bags",
    slug: "bags",
    parentId: null,
    position: 2,
    isVisible: true,
    image: { id: "img_cat_bags", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=640&h=800&q=85", alt: "Bags", position: 0 },
  },
  {
    id: "cat_accessories",
    name: "Accessories",
    slug: "accessories",
    parentId: null,
    position: 3,
    isVisible: true,
    image: { id: "img_cat_accessories", url: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=640&h=800&q=85", alt: "Accessories", position: 0 },
  },
  {
    id: "cat_home",
    name: "Home",
    slug: "home",
    description: "Objects for a considered interior.",
    parentId: null,
    position: 4,
    isVisible: true,
    image: { id: "img_cat_home", url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=640&h=800&q=85", alt: "Home", position: 0 },
  },
];

export function findCategoryBySlug(slug: string) {
  return mockCategories.find((c) => c.slug === slug);
}
