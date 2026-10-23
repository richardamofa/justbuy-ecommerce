import { customerListQuerySchema, type CustomerListQuery } from "@ecommerce/contracts";
import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../lib/require-admin.js";
import { idParamsSchema, parseParams, parseQuery } from "../lib/validation.js";
import * as customerService from "../services/customer.service.js";

export async function registerCustomerRoutes(app: FastifyInstance) {
  app.get("/admin/customers", { preHandler: requireAdmin }, async (request) => {
    const query = parseQuery<CustomerListQuery>(request, customerListQuerySchema);
    return customerService.listCustomers(query);
  });

  app.get("/admin/customers/:id", { preHandler: requireAdmin }, async (request) => {
    const { id } = parseParams<{ id: string }>(request, idParamsSchema);
    return customerService.getCustomerDetails(id);
  });
}