import type { HomepageConfig } from "@ecommerce/contracts";
import { homepageUpdateInputSchema } from "@ecommerce/contracts";
import type { FastifyInstance } from "fastify";

import { requireAdmin } from "../lib/require-admin.js";
import { parseBody } from "../lib/validation.js";
import * as homepageService from "../services/homepage.service.js";

export async function registerHomepageRoutes(app: FastifyInstance) {
  app.get("/homepage", async () => {
    return homepageService.getHomepage();
  });

  app.put(
    "/admin/homepage-sections",
    { preHandler: requireAdmin },
    async (request) => {
      const input = parseBody<HomepageConfig>(
        request,
        homepageUpdateInputSchema,
      );

      return homepageService.updateHomepage(input);
    },
  );
}