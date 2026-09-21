import { z } from "zod";
import { imageSchema, moneySchema } from "./shared.js";

/* ------------------------------- Cart ---------------------------------- */

export const cartItemSchema = z.object({
  id: z.string(), // cart line id
  productId: z.string(),
  variantId: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  image: imageSchema.optional(),
  options: z.record(z.string(), z.string()).default({}),
  unitPrice: moneySchema,
  quantity: z.number().int().positive(),
  stock: z.number().int().nonnegative().optional(),
});
export type CartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  couponCode: z.string().optional(),
});
export type Cart = z.infer<typeof cartSchema>;

/* ------------------------------ Customer -------------------------------- */

export const addressSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1),
  phone: z.string().optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  region: z.string().optional(),
  country: z.string().min(1),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false),
});
export type Address = z.infer<typeof addressSchema>;

export const customerSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  addresses: z.array(addressSchema).default([]),
  ordersCount: z.number().int().nonnegative().default(0),
  totalSpent: moneySchema.default(0),
  createdAt: z.string().datetime().optional(),
});
export type Customer = z.infer<typeof customerSchema>;

/* ------------------------------- Order ---------------------------------- */

export const orderStatusSchema = z.enum([
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  variantId: z.string().optional(),
  name: z.string(),
  image: imageSchema.optional(),
  options: z.record(z.string(), z.string()).default({}),
  unitPrice: moneySchema,
  quantity: z.number().int().positive(),
  total: moneySchema,
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customerId: z.string().optional(),
  customerEmail: z.string().email(),
  items: z.array(orderItemSchema),
  status: orderStatusSchema,
  subtotal: moneySchema,
  shipping: moneySchema.default(0),
  tax: moneySchema.default(0),
  discount: moneySchema.default(0),
  total: moneySchema,
  currency: z.string().default("GHS"),
  shippingAddress: addressSchema.optional(),
  billingAddress: addressSchema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});
export type Order = z.infer<typeof orderSchema>;

/* ----------------------------- Promotion --------------------------------- */

export const promotionTypeSchema = z.enum(["percentage", "fixed", "free-shipping"]);
export type PromotionType = z.infer<typeof promotionTypeSchema>;

export const promotionSchema = z.object({
  id: z.string(),
  code: z.string().min(1),
  type: promotionTypeSchema,
  value: z.number().nonnegative(),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  usageLimit: z.number().int().positive().optional(),
  usageCount: z.number().int().nonnegative().default(0),
  minSubtotal: moneySchema.optional(),
});
export type Promotion = z.infer<typeof promotionSchema>;

/* --------------------------- Store Settings ------------------------------ */

export const storeSettingsSchema = z.object({
  storeName: z.string(),
  storeDescription: z.string().optional(),
  logo: imageSchema.optional(),
  favicon: imageSchema.optional(),
  currency: z.string().default("GHS"),
  contactEmail: z.string().email().optional(),
  supportPhone: z.string().optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      tiktok: z.string().optional(),
    })
    .default({}),
  themeColor: z.string().default("#111111"),
  shippingFlatRate: moneySchema.default(0),
  taxRatePercent: z.number().min(0).max(100).default(0),
});
export type StoreSettings = z.infer<typeof storeSettingsSchema>;
