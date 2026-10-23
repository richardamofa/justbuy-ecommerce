import type {
    ProductCreateInput,
    ProductListQuery,
    ProductUpdateInput,
} from "@ecommerce/contracts";
import { Prisma } from "@prisma/client";
import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { mapProduct } from "../mappers/product.js";

const productInclude = {
  images: {
    orderBy: {
      position: "asc" as const,
    },
  },
  options: true,
  variants: true,
  collections: true,
};

const productIncludeForQuery =
  productInclude satisfies Prisma.ProductInclude;

function productCreateData(
  input: ProductCreateInput,
): Prisma.ProductCreateInput {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description,
    shortDescription: input.shortDescription,
    price: input.price,
    salePrice: input.salePrice,
    currency: input.currency,
    sku: input.sku,
    tags: input.tags,
    stock: input.stock,
    lowStockThreshold: input.lowStockThreshold,
    trackInventory: input.trackInventory,
    isFeatured: input.isFeatured,
    isBestSeller: input.isBestSeller,
    isNewArrival: input.isNewArrival,
    visibility: input.visibility,
    seoTitle: input.seo?.title,
    seoDescription: input.seo?.description,

    category: input.categoryId
      ? {
          connect: {
            id: input.categoryId,
          },
        }
      : undefined,

    images: {
      create: input.images.map((image) => ({
        url: image.url,
        alt: image.alt,
        position: image.position,
      })),
    },

    options: {
      create: input.options.map((option) => ({
        name: option.name,
        values: option.values,
      })),
    },

    variants: {
      create: input.variants.map((variant) => ({
        sku: variant.sku,
        options: variant.options,
        price: variant.price,
        salePrice: variant.salePrice,
        stock: variant.stock,
        imageUrl: variant.image?.url,
        isDefault: variant.isDefault,
      })),
    },

    collections: {
      create: input.collectionIds.map((collectionId) => ({
        collection: {
          connect: {
            id: collectionId,
          },
        },
      })),
    },
  };
}

export async function listProducts(query: ProductListQuery, includeHidden = false) {
  const where: Prisma.ProductWhereInput = includeHidden
    ? {}
    : { visibility: "visible" };

  if (query.categorySlug) {
    where.category = {
      slug: query.categorySlug,
    };
  }

  if (query.collectionSlug) {
    where.collections = {
      some: {
        collection: {
          slug: query.collectionSlug,
        },
      },
    };
  }

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        sku: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        tags: {
          has: query.search.toLowerCase(),
        },
      },
    ];
  }

  if (query.tags?.length) {
    where.tags = {
      hasSome: query.tags,
    };
  }

  if (
    query.minPrice !== undefined ||
    query.maxPrice !== undefined
  ) {
    where.price = {
      ...(query.minPrice !== undefined
        ? { gte: query.minPrice }
        : {}),
      ...(query.maxPrice !== undefined
        ? { lte: query.maxPrice }
        : {}),
    };
  }

  const orderBy:
    | Prisma.ProductOrderByWithRelationInput
    | Prisma.ProductOrderByWithRelationInput[] =
    query.sort === "price-asc"
      ? { price: "asc" }
      : query.sort === "price-desc"
        ? { price: "desc" }
        : query.sort === "featured"
          ? [
              { isFeatured: "desc" },
              { createdAt: "desc" },
            ]
          : query.sort === "best-selling"
            ? [
                { isBestSeller: "desc" },
                { createdAt: "desc" },
              ]
            : { createdAt: "desc" };

  const skip = (query.page - 1) * query.pageSize;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productIncludeForQuery,
      orderBy,
      skip,
      take: query.pageSize,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    items: products.map((product) => mapProduct(product)),
    page: query.page,
    pageSize: query.pageSize,
    total,
    totalPages: Math.ceil(total / query.pageSize),
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: productIncludeForQuery,
  });

  if (!product || product.visibility !== "visible") {
    throw HttpError.notFound("Product not found");
  }

  return mapProduct(product);
}

export async function createProduct(input: ProductCreateInput) {
  const product = await prisma.product.create({
    data: productCreateData(input),
    include: productIncludeForQuery,
  });

  return mapProduct(product);
}

export async function updateProduct(
  id: string,
  input: ProductUpdateInput,
) {
  const existing = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw HttpError.notFound("Product not found");
  }

  const {
    images,
    collectionIds,
    options,
    variants,
    seo,
    categoryId,
    ...scalars
  } = input;

  const product = await prisma.$transaction(
    async (tx) => {
      if (images !== undefined) {
        await tx.productImage.deleteMany({
          where: {
            productId: id,
          },
        });

        if (images.length) {
          await tx.productImage.createMany({
            data: images.map((image) => ({
              productId: id,
              url: image.url,
              alt: image.alt,
              position: image.position,
            })),
          });
        }
      }

      if (options !== undefined) {
        await tx.productOption.deleteMany({
          where: {
            productId: id,
          },
        });

        if (options.length) {
          await tx.productOption.createMany({
            data: options.map((option) => ({
              productId: id,
              name: option.name,
              values: option.values,
            })),
          });
        }
      }

      if (variants !== undefined) {
        await tx.productVariant.deleteMany({
          where: {
            productId: id,
          },
        });

        if (variants.length) {
          await tx.productVariant.createMany({
            data: variants.map((variant) => ({
              productId: id,
              sku: variant.sku,
              options: variant.options,
              price: variant.price,
              salePrice: variant.salePrice,
              stock: variant.stock,
              imageUrl: variant.image?.url,
              isDefault: variant.isDefault,
            })),
          });
        }
      }

      if (collectionIds !== undefined) {
        await tx.productCollection.deleteMany({
          where: {
            productId: id,
          },
        });

        if (collectionIds.length) {
          await tx.productCollection.createMany({
            data: collectionIds.map((collectionId) => ({
              productId: id,
              collectionId,
            })),
          });
        }
      }

      const data: Prisma.ProductUpdateInput = {
        ...scalars,
      };

      if (categoryId !== undefined) {
        data.category =
          categoryId === null
            ? {
                disconnect: true,
              }
            : {
                connect: {
                  id: categoryId,
                },
              };
      }

      if (seo !== undefined) {
        data.seoTitle = seo.title;
        data.seoDescription = seo.description;
      }

      return tx.product.update({
        where: {
          id,
        },
        data,
        include: productIncludeForQuery,
      });
    },
    {
      maxWait: 10000,
      timeout: 15000,
    },
  );

  return mapProduct(product);
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw HttpError.notFound("Product not found");
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });

  return {
    id,
  };
}