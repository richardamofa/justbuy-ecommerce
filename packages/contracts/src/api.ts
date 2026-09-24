import { z } from "zod";
import {
  orderSchema,
  orderStatusSchema,
  storeSettingsSchema,
} from "./models/commerce.js";
import { homepageConfigSchema } from "./models/homepage.js";
import { productSchema } from "./models/product.js";
import { paginatedSchema } from "./models/shared.js";
import { categorySchema, collectionSchema } from "./models/taxonomy.js";


export const apiErrorCodeSchema = z.enum([
  "validation_error",
  "not_found",
  "conflict",
  "database_error",
  "not_implemented",
  "internal_error",
]);
export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

export const apiErrorSchema = z.object({
  error: apiErrorCodeSchema,
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
  requestId: z.string().optional(),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

export const apiSuccessSchema = <T extends z.ZodTypeAny>(data: T) => z.object({ data })

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(24),
  categorySlug: z.string().optional(),
  collectionSlug: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "best-selling", "featured"]).default("newest"),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
});
export type ProductListQuery = z.infer<typeof productListQuerySchema>;

export const productCreateInputSchema = productSchema.omit({
  id: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
  updatedAt: true,
});
export type ProductCreateInput = z.infer<typeof productCreateInputSchema>;

export const productUpdateInputSchema = productCreateInputSchema.partial();
export type ProductUpdateInput = z.infer<typeof productUpdateInputSchema>;

export const categoryCreateInputSchema = categorySchema.omit({ id: true });
export type CategoryCreateInput = z.infer<typeof categoryCreateInputSchema>;

export const categoryUpdateInputSchema = categoryCreateInputSchema.partial();
export type CategoryUpdateInput = z.infer<typeof categoryUpdateInputSchema>;

export const collectionCreateInputSchema = collectionSchema.omit({ id: true });
export type CollectionCreateInput = z.infer<typeof collectionCreateInputSchema>;

export const collectionUpdateInputSchema = collectionCreateInputSchema.partial();
export type CollectionUpdateInput = z.infer<typeof collectionUpdateInputSchema>;

export const homepageUpdateInputSchema = homepageConfigSchema;
export type HomepageUpdateInput = z.infer<typeof homepageUpdateInputSchema>;

export const storeSettingsUpdateInputSchema = storeSettingsSchema.partial();
export type StoreSettingsUpdateInput = z.infer<typeof storeSettingsUpdateInputSchema>;

export const productListResponseSchema = paginatedSchema(productSchema);
export type ProductListResponse = z.infer<typeof productListResponseSchema>;

export const categoryListResponseSchema = z.array(categorySchema);
export const collectionListResponseSchema = z.array(collectionSchema);

export const homepageResponseSchema = homepageConfigSchema;

export const storeSettingsResponseSchema = storeSettingsSchema;

export const orderCreateItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).nullable().optional(),
  quantity: z.number().int().positive(),
});

export const orderCreateInputSchema = z.object({
  customerEmail: z.string().email(),
  customerId: z.string().nullable().optional(),
  items: z.array(orderCreateItemSchema).min(1),
  shippingAddress: z.record(z.string(), z.unknown()).optional(),
  billingAddress: z.record(z.string(), z.unknown()).optional(),
});

export type OrderCreateInput = z.infer<typeof orderCreateInputSchema>;

export const orderStatusUpdateInputSchema = z.object({
  status: orderStatusSchema,
});

export type OrderStatusUpdateInput = z.infer<
  typeof orderStatusUpdateInputSchema
>;

export const orderListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
  status: orderStatusSchema.optional(),
  search: z.string().optional(),
});

export type OrderListQuery = z.infer<typeof orderListQuerySchema>;

export const orderResponseSchema = orderSchema;
export const orderListResponseSchema = paginatedSchema(orderSchema);

export const API_ENDPOINTS = {
  products: "/api/v1/products",
  product: (slug: string) => `/api/v1/products/${slug}`,
  categories: "/api/v1/categories",
  category: (slug: string) => `/api/v1/categories/${slug}`,
  collections: "/api/v1/collections",
  collection: (slug: string) => `/api/v1/collections/${slug}`,
  homepage: "/api/v1/homepage",
  store: "/api/v1/store",
  orders: "/api/v1/orders",
  order: (id: string) => `/api/v1/orders/${id}`,
  adminOrders: "/api/v1/admin/orders",
  adminOrder: (id: string) => `/api/v1/admin/orders/${id}`,
} as const;

