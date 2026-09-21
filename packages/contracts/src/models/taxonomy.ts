import { z } from "zod";
import { imageSchema, seoSchema, slugSchema } from "./shared.js";

/**
 * Categories are the permanent store taxonomy (fixed structural tree).
 * Subcategories are modeled via `parentId` self-reference.
 */
export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: slugSchema,
  description: z.string().optional(),
  image: imageSchema.optional(),
  parentId: z.string().nullable().default(null),
  position: z.number().int().nonnegative().default(0),
  isVisible: z.boolean().default(true),
  seo: seoSchema.optional(),
});
export type Category = z.infer<typeof categorySchema>;

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

/**
 * Collections are curated, cross-cutting groups of products
 * (e.g. "Summer Collection", "Best Sellers") independent of the
 * permanent category tree.
 */
export const collectionSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: slugSchema,
  description: z.string().optional(),
  image: imageSchema.optional(),
  productIds: z.array(z.string()).default([]),
  isVisible: z.boolean().default(true),
  seo: seoSchema.optional(),
});
export type Collection = z.infer<typeof collectionSchema>;
