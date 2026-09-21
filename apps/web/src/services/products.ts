import type { Product, ProductListQuery, ProductListResponse } from "@ecommerce/contracts";
import { mockProducts, findProductBySlug } from "../mocks/products";
import { findCategoryBySlug } from "../mocks/categories";
import { findCollectionBySlug } from "../mocks/collections";
import { delay } from "./delay";

/**
 * This module is the API boundary for products. Every function returns the
 * same shape the eventual `GET /products` / `GET /products/:slug` endpoints
 * will return, so query hooks never need to change when the mock is
 * replaced with real `fetch` calls.
 */
export async function listProducts(query: Partial<ProductListQuery> = {}): Promise<ProductListResponse> {
  const { page = 1, pageSize = 24, categorySlug, collectionSlug, search, sort = "newest", minPrice, maxPrice, tags } = query;

  let items = [...mockProducts].filter((p) => p.visibility === "visible");

  if (categorySlug) {
    const category = findCategoryBySlug(categorySlug);
    if (category) items = items.filter((p) => p.categoryId === category.id);
  }
  if (collectionSlug) {
    const collection = findCollectionBySlug(collectionSlug);
    if (collection) items = items.filter((p) => collection.productIds.includes(p.id));
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)));
  }
  if (tags?.length) {
    items = items.filter((p) => tags.every((t) => p.tags.includes(t)));
  }
  if (minPrice != null) items = items.filter((p) => p.price >= minPrice);
  if (maxPrice != null) items = items.filter((p) => p.price <= maxPrice);

  switch (sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "best-selling":
      items.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
      break;
    case "featured":
      items.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
      break;
    default:
      items.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return delay({ items: pageItems, page, pageSize, total, totalPages });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return delay(findProductBySlug(slug) ?? null);
}

export async function listRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const related = mockProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit);
  return delay(related);
}
