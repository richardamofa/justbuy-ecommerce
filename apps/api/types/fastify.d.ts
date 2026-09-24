import type { AdminUser } from "@ecommerce/contracts";

declare module "fastify" {
  interface FastifyRequest {
    admin?: AdminUser;
  }
}