import type {
    OrderCreateInput,
    OrderListQuery,
    OrderStatusUpdateInput,
} from "@ecommerce/contracts";

import {
    orderCreateInputSchema,
    orderListQuerySchema,
    orderStatusUpdateInputSchema,
} from "@ecommerce/contracts";

import type { FastifyInstance } from "fastify";

import {
    idParamsSchema,
    parseBody,
    parseParams,
    parseQuery,
} from "../lib/validation.js";

import { requireAdmin } from "../lib/require-admin.js";
import * as orderService from "../services/order.service.js";

export async function registerOrderRoutes(app: FastifyInstance) {
  // Public: create an order
  app.post("/orders", async (request, reply) => {
    const input = parseBody<OrderCreateInput>(
      request,
      orderCreateInputSchema,
    );

    const order = await orderService.createOrder(input);

    return reply.status(201).send(order);
  });

  // Public: get an order
  app.get("/orders/:id", async (request) => {
    const { id } = parseParams<{ id: string }>(
      request,
      idParamsSchema,
    );

    return orderService.getOrderById(id);
  });

  // Admin: list orders
  app.get(
    "/admin/orders",
    { preHandler: requireAdmin },
    async (request) => {
      const query = parseQuery<OrderListQuery>(
        request,
        orderListQuerySchema,
      );

      return orderService.listOrders(query);
    },
  );

  // Admin: get order
  app.get(
    "/admin/orders/:id",
    { preHandler: requireAdmin },
    async (request) => {
      const { id } = parseParams<{ id: string }>(
        request,
        idParamsSchema,
      );

      return orderService.getOrderById(id);
    },
  );

  // Admin: update order status
  app.patch(
    "/admin/orders/:id",
    { preHandler: requireAdmin },
    async (request) => {
      const { id } = parseParams<{ id: string }>(
        request,
        idParamsSchema,
      );

      const input = parseBody<OrderStatusUpdateInput>(
        request,
        orderStatusUpdateInputSchema,
      );

      return orderService.updateOrderStatus(id, input);
    },
  );
};
