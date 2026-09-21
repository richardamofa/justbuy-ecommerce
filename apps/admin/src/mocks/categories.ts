import type { Category } from "@ecommerce/contracts";

export const mockCategories: Category[] = [
  { id: "cat_apparel", name: "Apparel", slug: "apparel", parentId: null, position: 0, isVisible: true, description: "Everyday clothing." },
  { id: "cat_apparel_outerwear", name: "Outerwear", slug: "apparel/outerwear", parentId: "cat_apparel", position: 0, isVisible: true },
  { id: "cat_apparel_knitwear", name: "Knitwear", slug: "apparel/knitwear", parentId: "cat_apparel", position: 1, isVisible: true },
  { id: "cat_footwear", name: "Footwear", slug: "footwear", parentId: null, position: 1, isVisible: true, description: "Shoes and boots." },
  { id: "cat_bags", name: "Bags", slug: "bags", parentId: null, position: 2, isVisible: true },
  { id: "cat_accessories", name: "Accessories", slug: "accessories", parentId: null, position: 3, isVisible: true },
  { id: "cat_home", name: "Home", slug: "home", parentId: null, position: 4, isVisible: false, description: "Objects for the home." },
];
