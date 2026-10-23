import { z } from "zod";
import {
    addressSchema,
    adminEventSchema,
    customerSchema,
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
  "unauthorized",
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
  customerName: z.string().trim().min(2),
  customerPhone: z.string().trim().min(6),
  customerId: z.string().nullable().optional(),
  items: z.array(orderCreateItemSchema).min(1),
  fulfillmentMethod: z.enum(["delivery", "pickup"]).default("delivery"),
  fulfillmentLocation: z.string().trim().min(1),
  shippingAddress: addressSchema.optional(),
  billingAddress: addressSchema.optional(),
});

export type OrderCreateInput = z.infer<typeof orderCreateInputSchema>;

export const orderLookupInputSchema = z.object({
  orderNumber: z.string().trim().toUpperCase().min(1),
  customerEmail: z.string().trim().email(),
});
export type OrderLookupInput = z.infer<typeof orderLookupInputSchema>;

export const paymentInitializeInputSchema = z.object({
  orderId: z.string().min(1),
  customerEmail: z.string().trim().email(),
});
export type PaymentInitializeInput = z.infer<typeof paymentInitializeInputSchema>;

export const paymentInitializeResponseSchema = z.discriminatedUnion("available", [
  z.object({
    available: z.literal(true),
    authorizationUrl: z.string().url(),
    reference: z.string(),
  }),
  z.object({ available: z.literal(false) }),
]);

export const paymentVerifyInputSchema = z.object({
  reference: z.string().min(1),
});
export type PaymentVerifyInput = z.infer<typeof paymentVerifyInputSchema>;

export const paymentVerificationResponseSchema = z.object({
  status: z.enum(["paid", "failed", "pending"]),
  order: orderSchema,
  customerEmailSent: z.boolean().optional(),
});

export const customerDetailsSchema = customerSchema.extend({
  orders: z.array(orderSchema),
});
export type CustomerDetails = z.infer<typeof customerDetailsSchema>;

export const newsletterSubscribeInputSchema = z.object({
  email: z.string().trim().email(),
});
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeInputSchema>;

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

export const customerListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
});
export type CustomerListQuery = z.infer<typeof customerListQuerySchema>;

export const adminEventListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
  isResolved: z.coerce.boolean().optional(),
});
export type AdminEventListQuery = z.infer<typeof adminEventListQuerySchema>;

export const adminEventListResponseSchema = paginatedSchema(adminEventSchema);
export const adminEventResolveInputSchema = z.object({ isResolved: z.boolean() });

export const orderResponseSchema = orderSchema;
export const orderListResponseSchema = paginatedSchema(orderSchema);
export const customerListResponseSchema = paginatedSchema(customerSchema);

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
  adminCustomers: "/api/v1/admin/customers",
  adminCustomer: (id: string) => `/api/v1/admin/customers/${id}`,
  adminEvents: "/api/v1/admin/events",
  adminEvent: (id: string) => `/api/v1/admin/events/${id}`,
  orderLookup: "/api/v1/orders/lookup",
  paymentInitialize: "/api/v1/payments/initialize",
  paymentVerify: "/api/v1/payments/verify",
  newsletterSubscribe: "/api/v1/newsletter/subscribe",
} as const;

