import type { Product as ContractProduct } from "@ecommerce/contracts";
import type {
    Product,
    ProductCollection,
    ProductImage,
    ProductOption,
    ProductVariant,
} from "@prisma/client";

type ProductWithRelations = Product & {
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  collections: ProductCollection[];
};

export function mapProduct(product: ProductWithRelations): ContractProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    ...(product.shortDescription
      ? { shortDescription: product.shortDescription }
      : {}),
    price: Number(product.price),
    ...(product.salePrice !== null
      ? { salePrice: Number(product.salePrice) }
      : {}),
    currency: product.currency,
    sku: product.sku,

    images: product.images
      .sort((a, b) => a.position - b.position)
      .map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt,
        position: image.position,
      })),

    categoryId: product.categoryId,

    collectionIds: product.collections.map(
      (collection) => collection.collectionId,
    ),

    tags: product.tags,

    options: product.options.map((option) => ({
      name: option.name,
      values: option.values,
    })),

    variants: product.variants.map((variant) => ({
      id: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      options:
        typeof variant.options === "object" &&
        variant.options !== null &&
        !Array.isArray(variant.options)
          ? (variant.options as Record<string, string>)
          : {},
      ...(variant.price !== null
        ? { price: Number(variant.price) }
        : {}),
      ...(variant.salePrice !== null
        ? { salePrice: Number(variant.salePrice) }
        : {}),
      stock: variant.stock,
      ...(variant.imageUrl
        ? {
            image: {
              id: `${variant.id}_image`,
              url: variant.imageUrl,
              alt: product.name,
              position: 0,
            },
          }
        : {}),
      isDefault: variant.isDefault,
    })),

    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    trackInventory: product.trackInventory,

    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    visibility: product.visibility,

    ...(product.seoTitle || product.seoDescription
      ? {
          seo: {
            ...(product.seoTitle ? { title: product.seoTitle } : {}),
            ...(product.seoDescription
              ? { description: product.seoDescription }
              : {}),
          },
        }
      : {}),

    // These are not currently stored in Prisma.
    reviewCount: 0,

    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}