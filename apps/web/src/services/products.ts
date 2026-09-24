import type {
  Product,
  ProductListQuery,
  ProductListResponse,
} from "@ecommerce/contracts";
import { apiRequest } from "../lib/api-client";

function buildQueryString(query: Partial<ProductListQuery>): string {
  const params = new URLSearchParams();

  if (query.page != null) {
    params.set("page", String(query.page));
  }

  if (query.pageSize != null) {
    params.set("pageSize", String(query.pageSize));
  }

  if (query.categorySlug) {
    params.set("categorySlug", query.categorySlug);
  }

  if (query.collectionSlug) {
    params.set("collectionSlug", query.collectionSlug);
  }

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  if (query.minPrice != null) {
    params.set("minPrice", String(query.minPrice));
  }

  if (query.maxPrice != null) {
    params.set("maxPrice", String(query.maxPrice));
  }

  if (query.tags?.length) {
    for (const tag of query.tags) {
      params.append("tags", tag);
    }
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
}

export async function listProducts(
  query: Partial<ProductListQuery> = {},
): Promise<ProductListResponse> {
  return apiRequest<ProductListResponse>(
    `/api/v1/products${buildQueryString(query)}`,
  );
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    return await apiRequest<Product>(
      `/api/v1/products/${encodeURIComponent(slug)}`,
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

export async function listRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const response = await listProducts({
    categorySlug: undefined,
    page: 1,
    pageSize: limit + 1,
  });

  return response.items
    .filter((item) => item.id !== product.id)
    .filter((item) => item.categoryId === product.categoryId)
    .slice(0, limit);
}