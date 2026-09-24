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

import * as orderService from "../services/order.service.js";

export async function registerOrderRoutes(
  app: FastifyInstance,
) {
  app.post(
    "/orders",
    async (request, reply) => {
      const input =
        parseBody<OrderCreateInput>(
          request,
          orderCreateInputSchema,
        );

      const order =
        await orderService.createOrder(
          input,
        );

      return reply
        .status(201)
        .send(order);
    },
  );

  app.get(
    "/orders/:id",
    async (request) => {
      const { id } =
        parseParams<{ id: string }>(
          request,
          idParamsSchema,
        );

      return orderService.getOrderById(
        id,
      );
    },
  );

  app.get(
    "/admin/orders",
    async (request) => {
      const query =
        parseQuery<OrderListQuery>(
          request,
          orderListQuerySchema,
        );

      return orderService.listOrders(
        query,
      );
    },
  );

  app.get(
    "/admin/orders/:id",
    async (request) => {
      const { id } =
        parseParams<{ id: string }>(
          request,
          idParamsSchema,
        );

      return orderService.getOrderById(
        id,
      );
    },
  );

  app.patch(
    "/admin/orders/:id",
    async (request) => {
      const { id } =
        parseParams<{ id: string }>(
          request,
          idParamsSchema,
        );

      const input =
        parseBody<OrderStatusUpdateInput>(
          request,
          orderStatusUpdateInputSchema,
        );

      return orderService.updateOrderStatus(
        id,
        input,
      );
    },
  );
}