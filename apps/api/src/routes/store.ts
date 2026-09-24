import type { StoreSettingsUpdateInput } from "@ecommerce/contracts";
import { storeSettingsUpdateInputSchema } from "@ecommerce/contracts";
import type { FastifyInstance } from "fastify";

import { requireAdmin } from "../lib/require-admin.js";
import { parseBody } from "../lib/validation.js";
import * as storeService from "../services/store.service.js";

export async function registerStoreRoutes(app: FastifyInstance) {
  app.get("/store", async () => {
    return storeService.getStoreSettings();
  });

  app.patch(
    "/admin/store",
    { preHandler: requireAdmin },
    async (request) => {
      const input = parseBody<StoreSettingsUpdateInput>(
        request,
        storeSettingsUpdateInputSchema,
      );

      return storeService.updateStoreSettings(input);
    },
  );
}