import type {
    OrderCreateInput,
    OrderListQuery,
    OrderLookupInput,
    OrderStatusUpdateInput,
} from "@ecommerce/contracts";
import { Prisma } from "@prisma/client";
import { randomBytes } from "node:crypto";

import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { mapOrder } from "../mappers/order.js";
import { sendOrderCreatedEmails, sendOrderStatusEmail } from "./email.service.js";

function generateOrderNumber(): string {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const random = randomBytes(6).toString("hex").toUpperCase();

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
  const customerEmail = input.customerEmail.trim().toLowerCase();
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

  if (input.fulfillmentMethod === "pickup") {
    if (!settings?.pickupLocations.includes(input.fulfillmentLocation)) {
      throw HttpError.validation("Choose a configured pickup location.");
    }
  } else if (!input.shippingAddress) {
    throw HttpError.validation("A delivery address is required for delivery orders.");
  }

  const shippingRate = settings?.shippingFlatRate
    ? new Prisma.Decimal(
        settings.shippingFlatRate,
      )
    : new Prisma.Decimal(0);
  const shipping = input.fulfillmentMethod === "pickup"
    ? new Prisma.Decimal(0)
    : shippingRate;

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
        const customerName = input.customerName.trim().split(/\s+/);
        const customer = await tx.customer.upsert({
          where: { email: customerEmail },
          create: {
            email: customerEmail,
            firstName: customerName[0] ?? "Customer",
            lastName: customerName.slice(1).join(" "),
            phone: input.customerPhone,
          },
          update: {
            ...(customerName.length
              ? {
                  firstName: customerName[0],
                  lastName: customerName.slice(1).join(" "),
                }
              : {}),
            phone: input.customerPhone,
          },
        });

        if (input.shippingAddress) {
          const addressInput = input.shippingAddress;
          const existingAddress = await tx.address.findFirst({
            where: {
              customerId: customer.id,
              line1: addressInput.line1,
              city: addressInput.city,
              country: addressInput.country,
              postalCode: addressInput.postalCode ?? null,
            },
          });

          if (!existingAddress) {
            const hasDefaultAddress = await tx.address.count({
              where: { customerId: customer.id, isDefault: true },
            });
            await tx.address.create({
              data: {
                customerId: customer.id,
                fullName: addressInput.fullName,
                phone: addressInput.phone,
                line1: addressInput.line1,
                line2: addressInput.line2,
                city: addressInput.city,
                region: addressInput.region,
                country: addressInput.country,
                postalCode: addressInput.postalCode,
                isDefault: hasDefaultAddress === 0,
              },
            });
          }
        }

        const created =
          await tx.order.create({
            data: {
              orderNumber:
                generateOrderNumber(),

              customer: { connect: { id: customer.id } },

              customerEmail,
              fulfillmentMethod: input.fulfillmentMethod,
              fulfillmentLocation: input.fulfillmentLocation,

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

        return created;
      },
    );

  const mappedOrder = mapOrder(order);
  await sendOrderCreatedEmails(mappedOrder);
  return mappedOrder;
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

  if (input.status === "paid" && existing.paymentStatus !== "paid") {
    throw HttpError.conflict("An order can only be marked paid after provider verification.");
  }
  if (["processing", "shipped", "delivered", "completed"].includes(input.status) && existing.paymentStatus !== "paid") {
    throw HttpError.conflict("Payment must be verified before fulfilment can advance.");
  }
  if (existing.paymentStatus === "paid" && input.status === "pending") {
    throw HttpError.conflict("A paid order cannot return to pending.");
  }
  if (existing.fulfillmentMethod === "pickup" && ["shipped", "delivered"].includes(input.status)) {
    throw HttpError.conflict("Pickup orders cannot use delivery statuses.");
  }
  if (input.status === "shipped" && existing.status !== "processing") {
    throw HttpError.conflict("An order must be processing before it can be shipped.");
  }
  if (input.status === "delivered" && existing.status !== "shipped") {
    throw HttpError.conflict("An order must be shipped before it can be marked delivered.");
  }
  if (input.status === "completed") {
    const canComplete = existing.fulfillmentMethod === "pickup"
      ? existing.status === "processing"
      : existing.status === "delivered";
    if (!canComplete) {
      throw HttpError.conflict("Delivery orders must be delivered, or pickup orders processing, before completion.");
    }
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

  const mappedOrder = mapOrder(order);
  if (existing.status !== input.status) await sendOrderStatusEmail(mappedOrder);
  return mappedOrder;
}

export async function getOrderByNumberAndEmail(
  input: OrderLookupInput,
) {
  const order = await prisma.order.findFirst({
    where: {
      orderNumber: input.orderNumber,
      customerEmail: {
        equals: input.customerEmail.trim(),
        mode: "insensitive",
      },
    },
    include: { items: true },
  });

  if (!order) {
    throw HttpError.notFound("No order matched that number and email.");
  }

  return mapOrder(order);
}