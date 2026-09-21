import { z } from "zod";
import { productSchema } from "./product.js";
import { imageSchema } from "./shared.js";
import { categorySchema, collectionSchema } from "./taxonomy.js";

export const heroBannerSchema = z.object({
  id: z.string(),
  heading: z.string(),
  subheading: z.string().optional(),
  image: imageSchema,
  mobileImage: imageSchema.optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  position: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});
export type HeroBanner = z.infer<typeof heroBannerSchema>;

/**
 * Homepage is config-driven: a list of typed sections.
 * The API will eventually return this exact shape from GET /homepage.
 */
export const homepageSectionTypeSchema = z.enum([
  "hero",
  "product-grid",
  "product-carousel",
  "category-grid",
  "collection",
  "banner",
  "rich-content",
  "newsletter",
]);
export type HomepageSectionType = z.infer<typeof homepageSectionTypeSchema>;

const baseSection = z.object({
  id: z.string(),
  position: z.number().int().nonnegative().default(0),
  isEnabled: z.boolean().default(true),
  title: z.string().optional(),
  subtitle: z.string().optional(),
});

export const heroSectionSchema = baseSection.extend({
  type: z.literal("hero"),
  banners: z.array(heroBannerSchema).default([]),
});

export const productGridSectionSchema = baseSection.extend({
  type: z.literal("product-grid"),
  products: z.array(productSchema).default([]),
  /** Used by admin builder before products are resolved */
  productIds: z.array(z.string()).default([]),
  viewAllHref: z.string().optional(),
});

export const productCarouselSectionSchema = baseSection.extend({
  type: z.literal("product-carousel"),
  products: z.array(productSchema).default([]),
  productIds: z.array(z.string()).default([]),
  viewAllHref: z.string().optional(),
});

export const categoryGridSectionSchema = baseSection.extend({
  type: z.literal("category-grid"),
  categories: z.array(categorySchema).default([]),
  categoryIds: z.array(z.string()).default([]),
});

export const collectionSectionSchema = baseSection.extend({
  type: z.literal("collection"),
  collection: collectionSchema.optional(),
  collectionId: z.string().optional(),
  products: z.array(productSchema).default([]),
});

export const bannerSectionSchema = baseSection.extend({
  type: z.literal("banner"),
  image: imageSchema,
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export const richContentSectionSchema = baseSection.extend({
  type: z.literal("rich-content"),
  html: z.string().default(""),
});

export const newsletterSectionSchema = baseSection.extend({
  type: z.literal("newsletter"),
  heading: z.string().default("Join our newsletter"),
  body: z.string().optional(),
});

export const homepageSectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  productGridSectionSchema,
  productCarouselSectionSchema,
  categoryGridSectionSchema,
  collectionSectionSchema,
  bannerSectionSchema,
  richContentSectionSchema,
  newsletterSectionSchema,
]);
export type HomepageSection = z.infer<typeof homepageSectionSchema>;

export const homepageConfigSchema = z.object({
  sections: z.array(homepageSectionSchema),
});
export type HomepageConfig = z.infer<typeof homepageConfigSchema>;
