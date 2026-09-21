import type { FastifyInstance } from "fastify";
import { HttpError } from "../lib/errors.js";

/**
 * Store-level routes mirror packages/contracts/src/api.ts (`API_ENDPOINTS`).
 * Product routes are registered separately in routes/products.ts; the
 * remaining store domains stay explicit boundaries until their phases begin.
 */
export async function registerStoreRoutes(app: FastifyInstance) {
  const notImplemented = (resource: string) => async () => {
    throw HttpError.notImplemented(`${resource} will be implemented in a later phase.`);
  };

  app.get("/homepage", notImplemented("GET /homepage (config-driven section list)"));
  app.get("/store", notImplemented("GET /store (store settings)"));

  // Admin surface — will require real auth before it does anything.
  app.register(
    async (admin) => {
      admin.get("/products", notImplemented("GET /admin/products"));
      admin.post("/products", notImplemented("POST /admin/products"));
      admin.patch("/products/:id", notImplemented("PATCH /admin/products/:id"));
      admin.delete("/products/:id", notImplemented("DELETE /admin/products/:id"));
      admin.get("/orders", notImplemented("GET /admin/orders"));
      admin.patch("/orders/:id", notImplemented("PATCH /admin/orders/:id"));
      admin.get("/homepage-sections", notImplemented("GET /admin/homepage-sections"));
      admin.put("/homepage-sections", notImplemented("PUT /admin/homepage-sections"));
    },
    { prefix: "/admin" }
  );
}
