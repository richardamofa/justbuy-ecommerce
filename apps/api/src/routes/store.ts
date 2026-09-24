import type { StoreSettingsUpdateInput } from "@ecommerce/contracts";
import { storeSettingsUpdateInputSchema } from "@ecommerce/contracts";
import type { FastifyInstance } from "fastify";

import { parseBody } from "../lib/validation.js";
import * as storeService from "../services/store.service.js";

export async function registerStoreRoutes(app: FastifyInstance) {
  app.get("/store", async () => {
    return storeService.getStoreSettings();
  });

  app.patch("/admin/store", async (request) => {
    const input = parseBody<StoreSettingsUpdateInput>(
      request,
      storeSettingsUpdateInputSchema
    );

    return storeService.updateStoreSettings(input);
  });
}
