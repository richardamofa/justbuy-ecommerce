import type { ProductCreateInput, ProductListQuery, ProductUpdateInput } from "@ecommerce/contracts";
import {
    productCreateInputSchema,
    productListQuerySchema,
    productUpdateInputSchema,
} from "@ecommerce/contracts";
import type { FastifyInstance } from "fastify";
import { idParamsSchema, parseBody, parseParams, parseQuery, slugParamsSchema } from "../lib/validation.js";
import * as productService from "../services/product.service.js";

export async function registerProductRoutes(app: FastifyInstance) {
  app.get("/products", async (request) => {
    const query = parseQuery<ProductListQuery>(request, productListQuerySchema);
    return productService.listProducts(query);
  });

  app.get("/products/:slug", async (request) => {
    const { slug } = parseParams<{ slug: string }>(request, slugParamsSchema);
    return productService.getProductBySlug(slug);
  });

  app.post("/products", async (request, reply) => {
    const input = parseBody<ProductCreateInput>(request, productCreateInputSchema);
    const product = await productService.createProduct(input);
    return reply.status(201).send(product);
  });

  app.patch("/products/:id", async (request) => {
    const { id } = parseParams<{ id: string }>(request, idParamsSchema);
    const input = parseBody<ProductUpdateInput>(request, productUpdateInputSchema);
    return productService.updateProduct(id, input);
  });

  app.delete("/products/:id", async (request, reply) => {
    const { id } = parseParams<{ id: string }>(request, idParamsSchema);
    const result = await productService.deleteProduct(id);
    return reply.send(result);
  });
}