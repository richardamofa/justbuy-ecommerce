import cors from "@fastify/cors";
import Fastify, {
    type FastifyInstance,
} from "fastify";

import { loadConfig, type AppConfig } from "./config/env.js";
import { errorFromUnknown } from "./lib/errors.js";
import { registerAdminAuthRoutes } from "./routes/admin-auth.js";
import { registerCustomerRoutes } from "./routes/customers.js";
import { registerHomepageRoutes } from "./routes/homepage.js";
import { registerNewsletterRoutes } from "./routes/newsletter.js";
import { registerOrderRoutes } from "./routes/order.js";
import { registerPaymentRoutes } from "./routes/payments.js";
import { registerProductRoutes } from "./routes/products.js";
import { registerStoreRoutes } from "./routes/store.js";
import { registerTaxonomyRoutes } from "./routes/taxonomy.js";

export async function buildApp(
  config: AppConfig = loadConfig(),
): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
    bodyLimit: 1_048_576,
  });

  await app.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: true,
  });

  app.setErrorHandler(
    async (error, request, reply) => {
      request.log.error(error);

      const normalized =
        errorFromUnknown(error);

      return reply
        .status(normalized.statusCode)
        .send(normalized);
    },
  );

  app.setNotFoundHandler(
    async (_request, reply) => {
      return reply.status(404).send({
        error: "not_found",
        message: "Route not found.",
      });
    },
  );

  app.get("/health", async () => ({
    status: "ok",
  }));

  await app.register(
    registerProductRoutes,
    {
      prefix: "/api/v1",
    },
  );

  await app.register(
    registerTaxonomyRoutes,
    {
      prefix: "/api/v1",
    },
  );

  await app.register(
    registerHomepageRoutes,
    {
      prefix: "/api/v1",
    },
  );

  await app.register(
    registerStoreRoutes,
    {
      prefix: "/api/v1",
    },
  );

  await app.register(
    registerOrderRoutes,
    {
      prefix: "/api/v1",
    },
  );

  await app.register(registerCustomerRoutes, {
    prefix: "/api/v1",
  });

  await app.register(registerNewsletterRoutes, {
    prefix: "/api/v1",
  });

  await app.register(registerPaymentRoutes, {
    prefix: "/api/v1",
  });

  await app.register(registerAdminAuthRoutes, {
    prefix: "/api/v1",
  });

  return app;
}