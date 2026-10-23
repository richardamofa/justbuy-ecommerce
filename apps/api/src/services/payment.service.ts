import type {
  PaymentInitializeInput,
  PaymentVerifyInput,
} from "@ecommerce/contracts";
import { randomBytes } from "node:crypto";
import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { mapOrder } from "../mappers/order.js";
import { sendPaidOrderEmails } from "./email.service.js";

type PaystackResponse = {
  status: boolean;
  message?: string;
  data?: {
    authorization_url?: string;
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
  };
};

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

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return { available: false as const };
  if (!process.env.PAYSTACK_CALLBACK_URL) {
    throw HttpError.notImplemented("Configure PAYSTACK_CALLBACK_URL before accepting payments.");
  }

  const reference = `JB-${randomBytes(16).toString("hex").toUpperCase()}`;
  const attempt = await prisma.paymentAttempt.create({
    data: {
      orderId: order.id,
      reference,
      amount: order.total,
      currency: order.currency,
    },
  });

  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: order.customerEmail,
        amount: Math.round(Number(order.total) * 100),
        currency: order.currency,
        reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata: { order_id: order.id, order_number: order.orderNumber },
      }),
    });
    const result = await response.json() as PaystackResponse;
    if (!response.ok || !result.status || !result.data?.authorization_url) {
      throw new Error(result.message ?? "Paystack could not initialize this payment.");
    }

    await prisma.paymentAttempt.update({
      where: { id: attempt.id },
      data: { authorizationUrl: result.data.authorization_url },
    });
    return {
      available: true as const,
      authorizationUrl: result.data.authorization_url,
      reference,
    };
  } catch (error) {
    await prisma.paymentAttempt.update({
      where: { id: attempt.id },
      data: { status: "failed" },
    });
    throw new HttpError(
      502,
      "internal_error",
      error instanceof Error ? error.message : "Payment initialization failed.",
    );
  }
}

export async function verifyPayment(input: PaymentVerifyInput) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw HttpError.notImplemented("Online payments are not configured.");

  const attempt = await prisma.paymentAttempt.findUnique({
    where: { reference: input.reference },
    include: { order: { include: orderWithItems } },
  });
  if (!attempt) throw HttpError.notFound("Payment reference not found.");
  if (attempt.order.paymentStatus === "paid") {
    return { status: "paid" as const, order: mapOrder(attempt.order), customerEmailSent: false };
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(input.reference)}`,
    { headers: { Authorization: `Bearer ${secretKey}` } },
  );
  const result = await response.json() as PaystackResponse;
  const payment = result.data;
  if (!response.ok || !result.status || !payment) {
    throw new HttpError(502, "internal_error", "Payment verification is temporarily unavailable.");
  }

  if (
    payment.reference !== attempt.reference ||
    payment.amount !== Math.round(Number(attempt.amount) * 100) ||
    payment.currency !== attempt.currency
  ) {
    throw HttpError.conflict("The verified payment does not match this order.");
  }

  if (payment.status !== "success") {
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
  const emailResult = paymentResult.alreadyPaid
    ? { customerSent: false }
    : await sendPaidOrderEmails(order);
  return { status: "paid" as const, order, customerEmailSent: emailResult.customerSent };
}