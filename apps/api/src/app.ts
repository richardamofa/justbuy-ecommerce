import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { loadConfig, type AppConfig } from "./config/env.js";
import { errorFromUnknown } from "./lib/errors.js";
import { registerProductRoutes } from "./routes/products.js";
import { registerStoreRoutes } from "./routes/store.js";

export async function buildApp(config: AppConfig = loadConfig()): Promise<FastifyInstance> {
  const app = Fastify({ logger: true, bodyLimit: 1_048_576 });

  await app.register(cors, { origin: config.CORS_ORIGIN });

  app.setErrorHandler((error, request, reply) => {
    const normalized = errorFromUnknown(error);
    if (normalized.statusCode >= 500) request.log.error({ err: error }, normalized.message);

    return reply.status(normalized.statusCode).send({
      error: normalized.code,
      message: normalized.message,
      ...(normalized.details ? { details: normalized.details } : {}),
      requestId: request.id,
    });
  });

  app.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      error: "not_found",
      message: "The requested endpoint was not found",
      requestId: request.id,
    });
  });

  app.get("/health", async () => ({ status: "ok" }));
  await app.register(registerProductRoutes, { prefix: "/api/v1" });
  await app.register(registerStoreRoutes, { prefix: "/api/v1" });

  return app;
}
