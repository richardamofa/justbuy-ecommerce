import type {
    PaymentInitializeInput,
    PaymentVerifyInput,
} from "@ecommerce/contracts";
import { randomBytes } from "node:crypto";
import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { mapOrder } from "../mappers/order.js";
import { recordAdminEvent } from "./admin-event.service.js";
import { sendPaidOrderEmails } from "./email.service.js";
import { getPaymentProvider } from "./payment-provider.js";

const orderWithItems = { items: { include: { product: true } } } as const;

export async function initializePayment(input: PaymentInitializeInput) {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    include: orderWithItems,
  });

  if (!order || order.customerEmail.toLowerCase() !== input.customerEmail.toLowerCase()) {
    throw HttpError.notFound("Order not found.");
  }
  if (order.paymentStatus === "paid") {
    throw HttpError.conflict("This order has already been paid.");
  }

  const providerName = process.env.PAYMENT_PROVIDER ?? "paystack";
  const secretKey = process.env.PAYMENT_PROVIDER_SECRET_KEY ?? process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return { available: false as const };
  const callbackUrl = process.env.PAYMENT_CALLBACK_URL ?? process.env.PAYSTACK_CALLBACK_URL;
  if (!callbackUrl) {
    throw HttpError.notImplemented("Configure PAYMENT_CALLBACK_URL before accepting payments.");
  }

  const reference = `JB-${randomBytes(16).toString("hex").toUpperCase()}`;
  const attempt = await prisma.paymentAttempt.create({
    data: {
      orderId: order.id,
      reference,
      provider: providerName,
      amount: order.total,
      currency: order.currency,
    },
  });

  try {
    const provider = getPaymentProvider(providerName, secretKey);
    const initialized = await provider.initialize({
      email: order.customerEmail,
      amount: Number(order.total),
      currency: order.currency,
      reference,
      callbackUrl,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
    });

    await prisma.paymentAttempt.update({
      where: { id: attempt.id },
      data: { authorizationUrl: initialized.authorizationUrl },
    });
    return {
      available: true as const,
      authorizationUrl: initialized.authorizationUrl,
      reference,
    };
  } catch (error) {
    await prisma.paymentAttempt.update({
      where: { id: attempt.id },
      data: { status: "failed" },
    });
    await recordAdminEvent({
      severity: "error",
      source: "payment",
      title: "Payment initialization failed",
      message: `Could not start ${providerName} payment for order ${order.orderNumber}.`,
      entityType: "order",
      entityId: order.id,
    }).catch((eventError: unknown) => console.error("Could not record payment initialization failure.", eventError));
    throw new HttpError(
      502,
      "internal_error",
      error instanceof Error ? error.message : "Payment initialization failed.",
    );
  }
}

export async function verifyPayment(input: PaymentVerifyInput) {
  const secretKey = process.env.PAYMENT_PROVIDER_SECRET_KEY ?? process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw HttpError.notImplemented("Online payments are not configured.");

  const attempt = await prisma.paymentAttempt.findUnique({
    where: { reference: input.reference },
    include: { order: { include: orderWithItems } },
  });
  if (!attempt) throw HttpError.notFound("Payment reference not found.");
  if (attempt.order.paymentStatus === "paid") {
    return { status: "paid" as const, order: mapOrder(attempt.order), customerEmailSent: false };
  }

  let payment;
  try {
    payment = await getPaymentProvider(attempt.provider, secretKey).verify(input.reference);
  } catch {
    throw new HttpError(502, "internal_error", "Payment verification is temporarily unavailable.");
  }

  if (
    payment.reference !== attempt.reference ||
    Math.abs(payment.amount - Number(attempt.amount)) > 0.01 ||
    payment.currency !== attempt.currency
  ) {
    throw HttpError.conflict("The verified payment does not match this order.");
  }

  if (payment.status === "pending") {
    return { status: "pending" as const, order: mapOrder(attempt.order) };
  }

  if (payment.status === "failed") {
    const failedOrder = await prisma.$transaction(async (tx) => {
      await tx.paymentAttempt.update({
        where: { id: attempt.id },
        data: { status: "failed" },
      });
      await tx.order.updateMany({
        where: { id: attempt.orderId, paymentStatus: { not: "paid" } },
        data: { paymentStatus: "failed", paymentReference: attempt.reference },
      });
      return tx.order.findUniqueOrThrow({
        where: { id: attempt.orderId },
        include: orderWithItems,
      });
    });
    await recordAdminEvent({
      severity: "warning",
      source: "payment",
      title: "Payment was not completed",
      message: `Payment ${attempt.reference} for order ${attempt.order.orderNumber} was not successful.`,
      entityType: "order",
      entityId: attempt.orderId,
    }).catch((eventError: unknown) => console.error("Could not record failed payment event.", eventError));
    return { status: "failed" as const, order: mapOrder(failedOrder) };
  }

  const paymentResult = await prisma.$transaction(async (tx) => {
    const claimedOrder = await tx.order.updateMany({
      where: { id: attempt.orderId, paymentStatus: { not: "paid" } },
      data: {
        status: "paid",
        paymentStatus: "paid",
        paymentReference: attempt.reference,
        paidAt: new Date(),
      },
    });
    await tx.paymentAttempt.update({
      where: { id: attempt.id },
      data: { status: "successful" },
    });

    if (claimedOrder.count === 0) {
      const existingOrder = await tx.order.findUniqueOrThrow({
        where: { id: attempt.orderId },
        include: orderWithItems,
      });
      return { order: existingOrder, alreadyPaid: true };
    }

    let inventoryIssue = false;
    for (const item of attempt.order.items) {
      if (!item.product.trackInventory) continue;
      const result = item.variantId
        ? await tx.productVariant.updateMany({
            where: { id: item.variantId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          })
        : await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
      if (result.count === 0) inventoryIssue = true;
    }

    const updatedOrder = await tx.order.update({
      where: { id: attempt.orderId },
      data: { inventoryIssue },
      include: orderWithItems,
    });
    return { order: updatedOrder, alreadyPaid: false };
  });

  const order = mapOrder(paymentResult.order);
  if (order.inventoryIssue) {
    await recordAdminEvent({
      severity: "error",
      source: "inventory",
      title: "Paid order has an inventory shortfall",
      message: `Payment for ${order.orderNumber} succeeded, but available stock could not cover all items.`,
      entityType: "order",
      entityId: order.id,
    }).catch((eventError: unknown) => console.error("Could not record inventory event.", eventError));
  }
  const emailResult = paymentResult.alreadyPaid
    ? { customerSent: false }
    : await sendPaidOrderEmails(order);
  return { status: "paid" as const, order, customerEmailSent: emailResult.customerSent };
}