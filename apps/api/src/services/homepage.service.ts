import type { HomepageConfig, HomepageSection } from "@ecommerce/contracts";
import { homepageSectionSchema } from "@ecommerce/contracts";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { mapProduct } from "../mappers/product.js";
import { mapCategory, mapCollection } from "../mappers/taxonomy.js";

type StoredSection = {
  id: string;
  type: string;
  position: number;
  isEnabled: boolean;
  title: string | null;
  subtitle: string | null;
  config: unknown;
};

const prismaTypeMap = {
  hero: "hero",
  "product-grid": "product_grid",
  "product-carousel": "product_carousel",
  "category-grid": "category_grid",
  collection: "collection",
  banner: "banner",
  "rich-content": "rich_content",
  newsletter: "newsletter",
} as const;

function buildSection(
  section: StoredSection,
  resolvedConfig: Record<string, unknown>,
): HomepageSection {
  const candidate = {
    id: section.id,
    type: section.type,
    position: section.position,
    isEnabled: section.isEnabled,
    ...(section.title ? { title: section.title } : {}),
    ...(section.subtitle ? { subtitle: section.subtitle } : {}),
    ...resolvedConfig,
  };

  return homepageSectionSchema.parse(candidate);
}

export async function getHomepage(): Promise<HomepageConfig> {
  const sections = await prisma.homepageSection.findMany({
    where: {
      isEnabled: true,
    },
    orderBy: {
      position: "asc",
    },
  });

  const resolvedSections = await Promise.all(
    sections.map(async (section) => {
      const config =
        section.config &&
        typeof section.config === "object" &&
        !Array.isArray(section.config)
          ? (section.config as Record<string, unknown>)
          : {};

      const publicType =
        section.type === "product_grid"
          ? "product-grid"
          : section.type === "product_carousel"
            ? "product-carousel"
            : section.type === "category_grid"
              ? "category-grid"
              : section.type === "rich_content"
                ? "rich-content"
                : section.type;

      const publicSection: StoredSection = {
        ...section,
        type: publicType,
      };

      switch (publicType) {
        case "hero":
          return buildSection(publicSection, {
            banners: Array.isArray(config.banners)
              ? config.banners
              : [],
          });

        case "product-grid":
        case "product-carousel": {
          const productIds = Array.isArray(config.productIds)
            ? config.productIds.filter(
                (value): value is string =>
                  typeof value === "string",
              )
            : [];

          const products = await prisma.product.findMany({
            where: {
              id: {
                in: productIds,
              },
            },
            include: {
              images: {
                orderBy: {
                  position: "asc",
                },
              },
              options: true,
              variants: true,
              collections: true,
            },
          });

          const productMap = new Map(
            products.map((product) => [
              product.id,
              mapProduct(product),
            ]),
          );

          const orderedProducts = productIds
            .map((id) => productMap.get(id))
            .filter(
              (
                product,
              ): product is NonNullable<typeof product> =>
                Boolean(product),
            );

          return buildSection(publicSection, {
            ...config,
            productIds,
            products: orderedProducts,
          });
        }

        case "category-grid": {
          const categoryIds = Array.isArray(config.categoryIds)
            ? config.categoryIds.filter(
                (value): value is string =>
                  typeof value === "string",
              )
            : [];

          const categories = await prisma.category.findMany({
            where: {
              id: {
                in: categoryIds,
              },
              isVisible: true,
            },
          });

          const categoryMap = new Map(
            categories.map((category) => [
              category.id,
              mapCategory(category),
            ]),
          );

          const orderedCategories = categoryIds
            .map((id) => categoryMap.get(id))
            .filter(
              (
                category,
              ): category is NonNullable<typeof category> =>
                Boolean(category),
            );

          return buildSection(publicSection, {
            ...config,
            categoryIds,
            categories: orderedCategories,
          });
        }

        case "collection": {
          const collectionId =
            typeof config.collectionId === "string"
              ? config.collectionId
              : undefined;

          if (!collectionId) {
            return buildSection(publicSection, {
              ...config,
              products: [],
            });
          }

          const collection =
            await prisma.collection.findFirst({
              where: {
                id: collectionId,
                isVisible: true,
              },
              include: {
                products: {
                  include: {
                    product: {
                      include: {
                        images: {
                          orderBy: {
                            position: "asc",
                          },
                        },
                        options: true,
                        variants: true,
                        collections: true,
                      },
                    },
                  },
                },
              },
            });

          if (!collection) {
            return buildSection(publicSection, {
              ...config,
              collectionId,
              products: [],
            });
          }

          return buildSection(publicSection, {
            ...config,
            collectionId,
            collection: mapCollection(collection),
            products: collection.products.map((item) =>
              mapProduct(item.product),
            ),
          });
        }

        case "banner":
        case "rich-content":
        case "newsletter":
          return buildSection(publicSection, {
            ...config,
          });

        default:
          return buildSection(publicSection, {});
      }
    }),
  );

  return {
    sections: resolvedSections,
  };
}

export async function updateHomepage(
  input: HomepageConfig,
): Promise<HomepageConfig> {
  await prisma.$transaction(async (tx) => {
    await tx.homepageSection.deleteMany();

    for (const section of input.sections) {
      const {
        id,
        type,
        position,
        isEnabled,
        title,
        subtitle,
        ...sectionConfig
      } = section;

      let config: Record<string, unknown> = {
        ...sectionConfig,
      };

      switch (type) {
        case "product-grid":
        case "product-carousel": {
          delete config.products;

          config.productIds = section.productIds;
          break;
        }

        case "category-grid": {
          delete config.categories;

          config.categoryIds = section.categoryIds;
          break;
        }

        case "collection": {
          delete config.collection;
          delete config.products;

          config.collectionId = section.collectionId;
          break;
        }

        default:
          break;
      }

      await tx.homepageSection.create({
        data: {
          id,
          type: prismaTypeMap[type],
          position,
          isEnabled,
          title,
          subtitle,
          config: config as Prisma.InputJsonObject,
        },
      });
    }
  });

  return getHomepage();
}