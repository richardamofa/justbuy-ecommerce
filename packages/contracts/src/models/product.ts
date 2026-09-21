import { z } from "zod";
import { imageSchema, moneySchema, seoSchema, slugSchema } from "./shared.js";

export const productVisibilitySchema = z.enum(["visible", "hidden", "draft"]);
export type ProductVisibility = z.infer<typeof productVisibilitySchema>;

/** A single purchasable variant of a product (size/color/etc combination). */
export const productVariantSchema = z.object({
  id: z.string(),
  productId: z.string(),
  sku: z.string(),
  /** Arbitrary option map, e.g. { size: "M", color: "Black" } */
  options: z.record(z.string(), z.string()).default({}),
  price: moneySchema.optional(),
  salePrice: moneySchema.optional(),
  stock: z.number().int().nonnegative().default(0),
  image: imageSchema.optional(),
  isDefault: z.boolean().default(false),
});
export type ProductVariant = z.infer<typeof productVariantSchema>;

export const productOptionSchema = z.object({
  name: z.string(), // e.g. "Size", "Color"
  values: z.array(z.string()),
});
export type ProductOption = z.infer<typeof productOptionSchema>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: slugSchema,
  description: z.string().default(""),
  shortDescription: z.string().optional(),

  price: moneySchema,
  salePrice: moneySchema.optional(),
  currency: z.string().default("GHS"),

  sku: z.string(),
  images: z.array(imageSchema).default([]),

  categoryId: z.string().nullable().default(null),
  collectionIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  options: z.array(productOptionSchema).default([]),
  variants: z.array(productVariantSchema).default([]),

  stock: z.number().int().nonnegative().default(0),
  lowStockThreshold: z.number().int().nonnegative().default(5),
  trackInventory: z.boolean().default(true),

  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  visibility: productVisibilitySchema.default("visible"),

  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().default(0),

  seo: seoSchema.optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type Product = z.infer<typeof productSchema>;

/** Shape used by admin create/edit forms (React Hook Form + zodResolver). */
export const productFormSchema = productSchema
  .omit({ id: true, createdAt: true, updatedAt: true, rating: true, reviewCount: true })
  .extend({
    salePrice: moneySchema.optional().or(z.literal("")),
  });
export type ProductFormValues = z.infer<typeof productFormSchema>;

export function getEffectivePrice(product: Pick<Product, "price" | "salePrice">): number {
  return product.salePrice != null && product.salePrice < product.price
    ? product.salePrice
    : product.price;
}

export function isOnSale(product: Pick<Product, "price" | "salePrice">): boolean {
  return product.salePrice != null && product.salePrice < product.price;
}

export function isLowStock(product: Pick<Product, "stock" | "lowStockThreshold">): boolean {
  return product.stock > 0 && product.stock <= product.lowStockThreshold;
}

export function isOutOfStock(product: Pick<Product, "stock" | "trackInventory">): boolean {
  return product.trackInventory && product.stock <= 0;
}
