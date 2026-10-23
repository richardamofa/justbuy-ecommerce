import type { Order, OrderCreateInput, OrderLookupInput } from "@ecommerce/contracts";
import type {
  PaymentInitializeInput,
  PaymentVerifyInput,
} from "@ecommerce/contracts";
import { apiRequest } from "../lib/api-client";

export function createOrder(input: OrderCreateInput) {
  return apiRequest<Order>("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function lookupOrder(input: OrderLookupInput) {
  return apiRequest<Order>("/api/v1/orders/lookup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function initializePayment(input: PaymentInitializeInput) {
  return apiRequest<
    | { available: true; authorizationUrl: string; reference: string }
    | { available: false }
  >("/api/v1/payments/initialize", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function verifyPayment(input: PaymentVerifyInput) {
  return apiRequest<{ status: "paid" | "failed" | "pending"; order: Order; customerEmailSent?: boolean }>(
    "/api/v1/payments/verify",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}