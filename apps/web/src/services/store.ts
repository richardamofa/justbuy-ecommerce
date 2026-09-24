import type {
  Category,
  Collection,
  HomepageConfig,
  StoreSettings,
} from "@ecommerce/contracts";
import { apiRequest } from "../lib/api-client";

export async function listCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/api/v1/categories");
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    return await apiRequest<Category>(
      `/api/v1/categories/${encodeURIComponent(slug)}`,
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ApiRequestError") {
      const apiError = error as { status?: number };

      if (apiError.status === 404) {
        return null;
      }
    }

    throw error;
  }
}

export async function listCollections(): Promise<Collection[]> {
  return apiRequest<Collection[]>("/api/v1/collections");
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  try {
    return await apiRequest<Collection>(
      `/api/v1/collections/${encodeURIComponent(slug)}`,
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ApiRequestError") {
      const apiError = error as { status?: number };

      if (apiError.status === 404) {
        return null;
      }
    }

    throw error;
  }
}

export async function getHomepageConfig(): Promise<HomepageConfig> {
  return apiRequest<HomepageConfig>("/api/v1/homepage");
}

export async function getStoreSettings(): Promise<StoreSettings> {
  return apiRequest<StoreSettings>("/api/v1/store");
}