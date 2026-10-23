import type {
    CategoryCreateInput,
    CategoryUpdateInput,
    CollectionCreateInput,
    CollectionUpdateInput,
} from "@ecommerce/contracts";

import {
    categoryCreateInputSchema,
    categoryUpdateInputSchema,
    collectionCreateInputSchema,
    collectionUpdateInputSchema,
} from "@ecommerce/contracts";

import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../lib/require-admin.js";

import {
    idParamsSchema,
    parseBody,
    parseParams,
    slugParamsSchema,
} from "../lib/validation.js";

import * as taxonomyService from "../services/taxonomy.service.js";

export async function registerTaxonomyRoutes(app: FastifyInstance) {
  app.get("/admin/categories", { preHandler: requireAdmin }, async () =>
    taxonomyService.listAdminCategories(),
  );

  app.get("/admin/collections", { preHandler: requireAdmin }, async () =>
    taxonomyService.listAdminCollections(),
  );

  app.get("/categories", async () => {
    return taxonomyService.listCategories();
  });

  app.get("/categories/:slug", async (request) => {
    const { slug } = parseParams<{ slug: string }>(
      request,
      slugParamsSchema,
    );

    return taxonomyService.getCategoryBySlug(slug);
  });

  app.post("/categories", { preHandler: requireAdmin }, async (request, reply) => {
    const input = parseBody<CategoryCreateInput>(
      request,
      categoryCreateInputSchema,
    );

    const category =
      await taxonomyService.createCategory(input);

    return reply.status(201).send(category);
  });

  app.patch("/categories/:id", { preHandler: requireAdmin }, async (request) => {
    const { id } = parseParams<{ id: string }>(
      request,
      idParamsSchema,
    );

    const input = parseBody<CategoryUpdateInput>(
      request,
      categoryUpdateInputSchema,
    );

    return taxonomyService.updateCategory(id, input);
  });

  app.delete("/categories/:id", { preHandler: requireAdmin }, async (request) => {
    const { id } = parseParams<{ id: string }>(
      request,
      idParamsSchema,
    );

    return taxonomyService.deleteCategory(id);
  });

  app.get("/collections", async () => {
    return taxonomyService.listCollections();
  });

  app.get("/collections/:slug", async (request) => {
    const { slug } = parseParams<{ slug: string }>(
      request,
      slugParamsSchema,
    );

    return taxonomyService.getCollectionBySlug(slug);
  });

  app.post("/collections", { preHandler: requireAdmin }, async (request, reply) => {
    const input = parseBody<CollectionCreateInput>(
      request,
      collectionCreateInputSchema,
    );

    const collection =
      await taxonomyService.createCollection(input);

    return reply.status(201).send(collection);
  });

  app.patch("/collections/:id", { preHandler: requireAdmin }, async (request) => {
    const { id } = parseParams<{ id: string }>(
      request,
      idParamsSchema,
    );

    const input = parseBody<CollectionUpdateInput>(
      request,
      collectionUpdateInputSchema,
    );

    return taxonomyService.updateCollection(id, input);
  });

  app.delete("/collections/:id", { preHandler: requireAdmin }, async (request) => {
    const { id } = parseParams<{ id: string }>(
      request,
      idParamsSchema,
    );

    return taxonomyService.deleteCollection(id);
  });
}