import {
    adminEventListQuerySchema,
    adminEventResolveInputSchema,
    type AdminEventListQuery,
} from "@ecommerce/contracts";
import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../lib/require-admin.js";
import { idParamsSchema, parseBody, parseParams, parseQuery } from "../lib/validation.js";
import * as adminEventService from "../services/admin-event.service.js";

export async function registerAdminEventRoutes(app: FastifyInstance) {
  app.get("/admin/events", { preHandler: requireAdmin }, async (request) => {
    const query = parseQuery<AdminEventListQuery>(request, adminEventListQuerySchema);
    return adminEventService.listAdminEvents(query);
  });

  app.patch("/admin/events/:id", { preHandler: requireAdmin }, async (request) => {
    const { id } = parseParams<{ id: string }>(request, idParamsSchema);
    const input = parseBody<{ isResolved: boolean }>(request, adminEventResolveInputSchema);
    return adminEventService.resolveAdminEvent(id, input.isResolved);
  });
}