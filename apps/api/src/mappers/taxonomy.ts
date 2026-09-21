import type {
    Category as ContractCategory,
    Collection as ContractCollection,
} from "@ecommerce/contracts";

import type {
    Category,
    Collection,
    ProductCollection,
} from "@prisma/client";

type CategoryWithRelations = Category & {
  // Kept here so the mapper remains compatible with included relations later.
  children?: Category[];
};

type CollectionWithProducts = Collection & {
  products?: ProductCollection[];
};

export function mapCategory(
  category: CategoryWithRelations,
): ContractCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    ...(category.description
      ? { description: category.description }
      : {}),
    ...(category.imageUrl
      ? {
          image: {
            id: `${category.id}_image`,
            url: category.imageUrl,
            alt: category.name,
            position: 0,
          },
        }
      : {}),
    parentId: category.parentId,
    position: category.position,
    isVisible: category.isVisible,

    ...(category.seoTitle || category.seoDescription
      ? {
          seo: {
            ...(category.seoTitle
              ? { title: category.seoTitle }
              : {}),
            ...(category.seoDescription
              ? { description: category.seoDescription }
              : {}),
          },
        }
      : {}),
  };
}

export function mapCollection(
  collection: CollectionWithProducts,
): ContractCollection {
  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,

    ...(collection.description
      ? { description: collection.description }
      : {}),

    ...(collection.imageUrl
      ? {
          image: {
            id: `${collection.id}_image`,
            url: collection.imageUrl,
            alt: collection.name,
            position: 0,
          },
        }
      : {}),

    productIds:
      collection.products?.map((item) => item.productId) ?? [],

    isVisible: collection.isVisible,
  };
}