import type {
  Category,
  Collection,
  Customer,
  HomepageSection,
  Order,
  Product,
  StoreSettings,
} from "@ecommerce/contracts";

import { apiRequest } from "../lib/api-client";

/* ------------------------------ Products --------------------------------- */

export async function listProducts(): Promise<Product[]> {
  const response = await apiRequest<{
    items: Product[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }>("/api/v1/products");

  return response.items;
}

export async function saveProduct(input: Product): Promise<Product> {
  if (input.id) {
    const { id, ...update } = input;

    return apiRequest<Product>(`/api/v1/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    });
  }

  const { id, ...create } = input;

  return apiRequest<Product>("/api/v1/products", {
    method: "POST",
    body: JSON.stringify(create),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await apiRequest(`/api/v1/products/${id}`, {
    method: "DELETE",
  });
}

/* ----------------------------- Categories --------------------------------- */

export async function listCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/api/v1/categories");
}

export async function saveCategory(input: Category): Promise<Category> {
  if (input.id) {
    const { id, ...update } = input;

    return apiRequest<Category>(`/api/v1/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    });
  }

  const { id, ...create } = input;

  return apiRequest<Category>("/api/v1/categories", {
    method: "POST",
    body: JSON.stringify(create),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await apiRequest(`/api/v1/categories/${id}`, {
    method: "DELETE",
  });
}

/* ---------------------------- Collections --------------------------------- */

export async function listCollections(): Promise<Collection[]> {
  return apiRequest<Collection[]>("/api/v1/collections");
}

export async function saveCollection(input: Collection): Promise<Collection> {
  if (input.id) {
    const { id, ...update } = input;

    return apiRequest<Collection>(`/api/v1/collections/${id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    });
  }

  const { id, ...create } = input;

  return apiRequest<Collection>("/api/v1/collections", {
    method: "POST",
    body: JSON.stringify(create),
  });
}

export async function deleteCollection(id: string): Promise<void> {
  await apiRequest(`/api/v1/collections/${id}`, {
    method: "DELETE",
  });
}

/* -------------------------------- Orders ----------------------------------- */

export async function listOrders(): Promise<Order[]> {
  const response = await apiRequest<{
    items: Order[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }>("/api/v1/admin/orders");

  return response.items;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
): Promise<Order> {
  return apiRequest<Order>(`/api/v1/admin/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/* ------------------------------- Customers ---------------------------------- */

/**
 * Customer admin API has not been implemented yet.
 *
 * Keep the function so the existing admin hooks remain type-safe,
 * but fail explicitly instead of silently returning mock data.
 */
export async function listCustomers(): Promise<Customer[]> {
  throw new Error("Customer admin API is not implemented yet.");
}

/* --------------------------- Homepage sections ------------------------------ */

export async function listSections(): Promise<HomepageSection[]> {
  const response = await apiRequest<{
    sections: HomepageSection[];
  }>("/api/v1/homepage");

  return [...response.sections].sort(
    (a, b) => a.position - b.position,
  );
}

export async function saveSections(
  input: HomepageSection[],
): Promise<HomepageSection[]> {
  const response = await apiRequest<{
    sections: HomepageSection[];
  }>("/api/v1/admin/homepage-sections", {
    method: "PUT",
    body: JSON.stringify({
      sections: input,
    }),
  });

  return [...response.sections].sort(
    (a, b) => a.position - b.position,
  );
}

/* ------------------------------- Settings ------------------------------------ */

export async function getSettings(): Promise<StoreSettings> {
  return apiRequest<StoreSettings>("/api/v1/store");
}

export async function saveSettings(
  input: StoreSettings,
): Promise<StoreSettings> {
  return apiRequest<StoreSettings>("/api/v1/admin/store", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}