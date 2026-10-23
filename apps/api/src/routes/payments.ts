import {
  paymentInitializeInputSchema,
  paymentVerifyInputSchema,
  type PaymentInitializeInput,
  type PaymentVerifyInput,
} from "@ecommerce/contracts";
import type { FastifyInstance } from "fastify";
import { parseBody } from "../lib/validation.js";
import * as paymentService from "../services/payment.service.js";

export async function registerPaymentRoutes(app: FastifyInstance) {
  app.post("/payments/initialize", async (request) => {
    const input = parseBody<PaymentInitializeInput>(request, paymentInitializeInputSchema);
    return paymentService.initializePayment(input);
  });

  app.post("/payments/verify", async (request) => {
    const input = parseBody<PaymentVerifyInput>(request, paymentVerifyInputSchema);
    return paymentService.verifyPayment(input);
  });
}