import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { mapCategory, mapCollection } from "../mappers/taxonomy.js";

const categoryInclude = {
  children: true,
};

const collectionInclude = {
  products: true,
};

export async function listCategories() {
  const categories = await prisma.category.findMany({
    where: {
      isVisible: true,
    },
    orderBy: [
      {
        position: "asc",
      },
      {
        name: "asc",
      },
    ],
    include: categoryInclude,
  });

  return categories.map(mapCategory);
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: categoryInclude,
  });

  if (!category || !category.isVisible) {
    throw HttpError.notFound("Category not found");
  }

  return mapCategory(category);
}

export async function createCategory(input: {
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    alt?: string;
    position?: number;
  };
  parentId?: string | null;
  position?: number;
  isVisible?: boolean;
  seo?: {
    title?: string;
    description?: string;
  };
}) {
  if (input.parentId) {
    const parent = await prisma.category.findUnique({
      where: {
        id: input.parentId,
      },
    });

    if (!parent) {
      throw HttpError.notFound("Parent category not found");
    }
  }

  const category = await prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      imageUrl: input.image?.url,
      parentId: input.parentId ?? null,
      position: input.position ?? 0,
      isVisible: input.isVisible ?? true,
      seoTitle: input.seo?.title,
      seoDescription: input.seo?.description,
    },
    include: categoryInclude,
  });

  return mapCategory(category);
}

export async function updateCategory(
  id: string,
  input: {
    name?: string;
    slug?: string;
    description?: string;
    image?: {
      url: string;
      alt?: string;
      position?: number;
    };
    parentId?: string | null;
    position?: number;
    isVisible?: boolean;
    seo?: {
      title?: string;
      description?: string;
    };
  },
) {
  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing) {
    throw HttpError.notFound("Category not found");
  }

  if (input.parentId === id) {
    throw HttpError.conflict(
      "A category cannot be its own parent",
    );
  }

  if (input.parentId) {
    const parent = await prisma.category.findUnique({
      where: {
        id: input.parentId,
      },
    });

    if (!parent) {
      throw HttpError.notFound("Parent category not found");
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(input.name !== undefined
        ? { name: input.name }
        : {}),

      ...(input.slug !== undefined
        ? { slug: input.slug }
        : {}),

      ...(input.description !== undefined
        ? { description: input.description }
        : {}),

      ...(input.image !== undefined
        ? { imageUrl: input.image?.url }
        : {}),

      ...(input.parentId !== undefined
        ? { parentId: input.parentId }
        : {}),

      ...(input.position !== undefined
        ? { position: input.position }
        : {}),

      ...(input.isVisible !== undefined
        ? { isVisible: input.isVisible }
        : {}),

      ...(input.seo !== undefined
        ? {
            seoTitle: input.seo.title,
            seoDescription: input.seo.description,
          }
        : {}),
    },
    include: categoryInclude,
  });

  return mapCategory(category);
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing) {
    throw HttpError.notFound("Category not found");
  }

  await prisma.category.delete({
    where: { id },
  });

  return { id };
}

export async function listCollections() {
  const collections = await prisma.collection.findMany({
    where: {
      isVisible: true,
    },
    orderBy: {
      name: "asc",
    },
    include: collectionInclude,
  });

  return collections.map(mapCollection);
}

export async function getCollectionBySlug(slug: string) {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: collectionInclude,
  });

  if (!collection || !collection.isVisible) {
    throw HttpError.notFound("Collection not found");
  }

  return mapCollection(collection);
}

export async function createCollection(input: {
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    alt?: string;
    position?: number;
  };
  productIds?: string[];
  isVisible?: boolean;
  seo?: {
    title?: string;
    description?: string;
  };
}) {
  const productIds = input.productIds ?? [];

  if (productIds.length) {
    const count = await prisma.product.count({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (count !== productIds.length) {
      throw HttpError.notFound(
        "One or more products were not found",
      );
    }
  }

  const collection = await prisma.collection.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      imageUrl: input.image?.url,
      isVisible: input.isVisible ?? true,

      products: {
        create: productIds.map((productId) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
    include: collectionInclude,
  });

  return mapCollection(collection);
}

export async function updateCollection(
  id: string,
  input: {
    name?: string;
    slug?: string;
    description?: string;
    image?: {
      url: string;
      alt?: string;
      position?: number;
    };
    productIds?: string[];
    isVisible?: boolean;
    seo?: {
      title?: string;
      description?: string;
    };
  },
) {
  const existing = await prisma.collection.findUnique({
    where: { id },
  });

  if (!existing) {
    throw HttpError.notFound("Collection not found");
  }

  if (input.productIds !== undefined) {
    const productIds = input.productIds;

    if (productIds.length) {
      const count = await prisma.product.count({
        where: {
          id: {
            in: productIds,
          },
        },
      });

      if (count !== productIds.length) {
        throw HttpError.notFound(
          "One or more products were not found",
        );
      }
    }

    await prisma.productCollection.deleteMany({
      where: {
        collectionId: id,
      },
    });

    if (productIds.length) {
      await prisma.productCollection.createMany({
        data: productIds.map((productId) => ({
          collectionId: id,
          productId,
        })),
      });
    }
  }

  const collection = await prisma.collection.update({
    where: { id },
    data: {
      ...(input.name !== undefined
        ? { name: input.name }
        : {}),

      ...(input.slug !== undefined
        ? { slug: input.slug }
        : {}),

      ...(input.description !== undefined
        ? { description: input.description }
        : {}),

      ...(input.image !== undefined
        ? { imageUrl: input.image?.url }
        : {}),

      ...(input.isVisible !== undefined
        ? { isVisible: input.isVisible }
        : {}),
    },
    include: collectionInclude,
  });

  return mapCollection(collection);
}

export async function deleteCollection(id: string) {
  const existing = await prisma.collection.findUnique({
    where: { id },
  });

  if (!existing) {
    throw HttpError.notFound("Collection not found");
  }

  await prisma.collection.delete({
    where: { id },
  });

  return { id };
}

export async function listAdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: categoryInclude,
  });

  return categories.map(mapCategory);
}

export async function listAdminCollections() {
  const collections = await prisma.collection.findMany({
    orderBy: { name: "asc" },
    include: collectionInclude,
  });

  return collections.map(mapCollection);
}