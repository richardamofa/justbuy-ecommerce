import type {
    OrderCreateInput,
    OrderListQuery,
    OrderStatusUpdateInput,
} from "@ecommerce/contracts";
import { Prisma } from "@prisma/client";

import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { mapOrder } from "../mappers/order.js";

function generateOrderNumber(): string {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const random = Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase();

  return `ORD-${timestamp}-${random}`;
}

function resolvePrice(
  product: {
    price: Prisma.Decimal;
    salePrice: Prisma.Decimal | null;
  },
  variant?: {
    price: Prisma.Decimal | null;
    salePrice: Prisma.Decimal | null;
  } | null,
): Prisma.Decimal {
  if (
    variant?.salePrice !== null &&
    variant?.salePrice !== undefined
  ) {
    return variant.salePrice;
  }

  if (
    variant?.price !== null &&
    variant?.price !== undefined
  ) {
    return variant.price;
  }

  if (product.salePrice !== null) {
    return product.salePrice;
  }

  return product.price;
}

function decimalMultiply(
  value: Prisma.Decimal,
  quantity: number,
): Prisma.Decimal {
  return value.mul(quantity);
}

export async function createOrder(
  input: OrderCreateInput,
) {
  const productIds = [
    ...new Set(
      input.items.map((item) => item.productId),
    ),
  ];

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      visibility: "visible",
    },

    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },

      variants: true,
    },
  });

  const productMap = new Map(
    products.map((product) => [
      product.id,
      product,
    ]),
  );

  const resolvedItems: Array<{
    productId: string;
    variantId?: string;
    name: string;
    imageUrl?: string;
    options: Record<string, string>;
    unitPrice: Prisma.Decimal;
    quantity: number;
    total: Prisma.Decimal;
  }> = [];

  for (const inputItem of input.items) {
    const product = productMap.get(
      inputItem.productId,
    );

    if (!product) {
      throw HttpError.notFound(
        `Product ${inputItem.productId} was not found or is unavailable.`,
      );
    }

    let variant:
      | (typeof product.variants)[number]
      | undefined;

    if (inputItem.variantId) {
      variant = product.variants.find(
        (item) =>
          item.id === inputItem.variantId,
      );

      if (!variant) {
        throw HttpError.notFound(
          `Variant ${inputItem.variantId} was not found.`,
        );
      }
    }

    const quantity = inputItem.quantity;

    const availableStock =
      variant?.stock ?? product.stock;

    if (
      product.trackInventory &&
      availableStock < quantity
    ) {
      throw HttpError.conflict(
        `Insufficient stock for ${product.name}.`,
      );
    }

    const unitPrice = resolvePrice(
      product,
      variant,
    );

    const total = decimalMultiply(
      unitPrice,
      quantity,
    );

    let options: Record<string, string> = {};

    if (
      variant?.options &&
      typeof variant.options === "object" &&
      !Array.isArray(variant.options)
    ) {
      const rawOptions =
        variant.options as Record<
          string,
          unknown
        >;

      for (const [key, value] of Object.entries(
        rawOptions,
      )) {
        if (typeof value === "string") {
          options[key] = value;
        }
      }
    }

    resolvedItems.push({
      productId: product.id,

      ...(variant
        ? {
            variantId: variant.id,
          }
        : {}),

      name: product.name,

      ...(variant?.imageUrl
        ? {
            imageUrl: variant.imageUrl,
          }
        : product.images[0]?.url
          ? {
              imageUrl:
                product.images[0].url,
            }
          : {}),

      options,
      unitPrice,
      quantity,
      total,
    });
  }

  const subtotal = resolvedItems.reduce(
    (sum, item) =>
      sum.add(item.total),
    new Prisma.Decimal(0),
  );

  const settings =
    await prisma.storeSettings.findUnique({
      where: {
        id: "store_settings",
      },
    });

  const shipping = settings?.shippingFlatRate
    ? new Prisma.Decimal(
        settings.shippingFlatRate,
      )
    : new Prisma.Decimal(0);

  const taxRate = settings?.taxRatePercent
    ? new Prisma.Decimal(
        settings.taxRatePercent,
      )
    : new Prisma.Decimal(0);

  const tax = subtotal
    .add(shipping)
    .mul(taxRate)
    .div(100);

  const discount =
    new Prisma.Decimal(0);

  const total = subtotal
    .add(shipping)
    .add(tax)
    .sub(discount);

  const currency =
    settings?.currency ??
    products[0]?.currency ??
    "GHS";

  const order =
    await prisma.$transaction(
      async (tx) => {
        const created =
          await tx.order.create({
            data: {
              orderNumber:
                generateOrderNumber(),

              ...(input.customerId
                ? {
                    customer: {
                      connect: {
                        id: input.customerId,
                      },
                    },
                  }
                : {}),

              customerEmail:
                input.customerEmail,

              status: "pending",

              subtotal,
              shipping,
              tax,
              discount,
              total,
              currency,

              shippingAddress:
                input.shippingAddress
                  ? (input.shippingAddress as Prisma.InputJsonValue)
                  : undefined,

              billingAddress:
                input.billingAddress
                  ? (input.billingAddress as Prisma.InputJsonValue)
                  : undefined,

              items: {
                create:
                  resolvedItems.map(
                    (item) => ({
                      productId:
                        item.productId,

                      ...(item.variantId
                        ? {
                            variantId:
                              item.variantId,
                          }
                        : {}),

                      name: item.name,
                      imageUrl:
                        item.imageUrl,

                      options:
                        item.options as Prisma.InputJsonValue,

                      unitPrice:
                        item.unitPrice,

                      quantity:
                        item.quantity,

                      total:
                        item.total,
                    }),
                  ),
              },
            },

            include: {
              items: true,
            },
          });

        for (const item of input.items) {
          const product =
            productMap.get(
              item.productId,
            );

          if (
            !product ||
            !product.trackInventory
          ) {
            continue;
          }

          if (item.variantId) {
            await tx.productVariant.update(
              {
                where: {
                  id: item.variantId,
                },

                data: {
                  stock: {
                    decrement:
                      item.quantity,
                  },
                },
              },
            );
          } else {
            await tx.product.update({
              where: {
                id: item.productId,
              },

              data: {
                stock: {
                  decrement:
                    item.quantity,
                },
              },
            });
          }
        }

        return created;
      },
    );

  return mapOrder(order);
}

export async function getOrderById(
  id: string,
) {
  const order =
    await prisma.order.findUnique({
      where: {
        id,
      },

      include: {
        items: true,
      },
    });

  if (!order) {
    throw HttpError.notFound(
      "Order not found.",
    );
  }

  return mapOrder(order);
}

export async function listOrders(
  query: OrderListQuery,
) {
  const where: Prisma.OrderWhereInput =
    {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      {
        orderNumber: {
          contains: query.search,
          mode: "insensitive",
        },
      },

      {
        customerEmail: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  const skip =
    (query.page - 1) *
    query.pageSize;

  const [orders, total] =
    await Promise.all([
      prisma.order.findMany({
        where,

        include: {
          items: true,
        },

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: query.pageSize,
      }),

      prisma.order.count({
        where,
      }),
    ]);

  return {
    items: orders.map(mapOrder),

    page: query.page,

    pageSize: query.pageSize,

    total,

    totalPages: Math.ceil(
      total / query.pageSize,
    ),
  };
}

export async function updateOrderStatus(
  id: string,
  input: OrderStatusUpdateInput,
) {
  const existing =
    await prisma.order.findUnique({
      where: {
        id,
      },
    });

  if (!existing) {
    throw HttpError.notFound(
      "Order not found.",
    );
  }

  const order =
    await prisma.order.update({
      where: {
        id,
      },

      data: {
        status: input.status,
      },

      include: {
        items: true,
      },
    });

  return mapOrder(order);
}