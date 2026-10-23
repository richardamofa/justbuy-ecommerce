import {
    addressSchema,
    type Order as ContractOrder,
} from "@ecommerce/contracts";
import type { Prisma } from "@prisma/client";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: true;
  };
}>;

function mapAddress(value: Prisma.JsonValue | null) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return undefined;
  }

  const parsed = addressSchema.safeParse(value);

  return parsed.success ? parsed.data : undefined;
}

function mapOptions(
  value: Prisma.JsonValue,
): Record<string, string> {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  const result: Record<string, string> = {};

  for (const [key, option] of Object.entries(value)) {
    if (typeof option === "string") {
      result[key] = option;
    }
  }

  return result;
}

export function mapOrder(
  order: OrderWithItems,
): ContractOrder {
  const shippingAddress = mapAddress(
    order.shippingAddress,
  );

  const billingAddress = mapAddress(
    order.billingAddress,
  );

  return {
    id: order.id,
    orderNumber: order.orderNumber,

    ...(order.customerId
      ? {
          customerId: order.customerId,
        }
      : {}),

    customerEmail: order.customerEmail,

    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,

      ...(item.variantId
        ? {
            variantId: item.variantId,
          }
        : {}),

      name: item.name,

      ...(item.imageUrl
        ? {
            image: {
              id: `${item.id}_image`,
              url: item.imageUrl,
              alt: item.name,
              position: 0,
            },
          }
        : {}),

      options: mapOptions(item.options),
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
      total: Number(item.total),
    })),

    status: order.status,
    fulfillmentMethod: order.fulfillmentMethod,
    fulfillmentLocation: order.fulfillmentLocation,
    paymentStatus: order.paymentStatus,
    ...(order.paymentReference ? { paymentReference: order.paymentReference } : {}),
    ...(order.paidAt ? { paidAt: order.paidAt.toISOString() } : {}),
    inventoryIssue: order.inventoryIssue,
    deliveryFee: Number(order.shipping),

    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    tax: Number(order.tax),
    discount: Number(order.discount),
    total: Number(order.total),

    currency: order.currency,

    ...(shippingAddress
      ? {
          shippingAddress,
        }
      : {}),

    ...(billingAddress
      ? {
          billingAddress,
        }
      : {}),

    createdAt: order.createdAt.toISOString(),

    ...(order.updatedAt
      ? {
          updatedAt: order.updatedAt.toISOString(),
        }
      : {}),
  };
}