import type { Category, Collection, HomepageConfig, StoreSettings } from "@ecommerce/contracts";
import { mockCategories, findCategoryBySlug } from "../mocks/categories";
import { mockCollections, findCollectionBySlug } from "../mocks/collections";
import { mockHomepageConfig } from "../mocks/homepage";
import { mockStoreSettings } from "../mocks/store";
import { delay } from "./delay";

export async function listCategories(): Promise<Category[]> {
  return delay(mockCategories);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return delay(findCategoryBySlug(slug) ?? null);
}

export async function listCollections(): Promise<Collection[]> {
  return delay(mockCollections);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  return delay(findCollectionBySlug(slug) ?? null);
}

export async function getHomepageConfig(): Promise<HomepageConfig> {
  return delay(mockHomepageConfig);
}

export async function getStoreSettings(): Promise<StoreSettings> {
  return delay(mockStoreSettings, 150);
}
