import type {
    AdminLoginInput,
} from "@ecommerce/contracts";
import {
    adminLoginInputSchema,
} from "@ecommerce/contracts";
import type { FastifyInstance } from "fastify";

import {
    getClearSessionCookie,
    getSessionCookie,
    getSessionToken
} from "../lib/admin-auth.js";

import {
    parseBody,
} from "../lib/validation.js";

import * as adminAuthService from "../services/admin-auth.service.js";

export async function registerAdminAuthRoutes(
  app: FastifyInstance,
) {
  app.post("/admin/auth/login", async (request, reply) => {
    const input = parseBody<AdminLoginInput>(
      request,
      adminLoginInputSchema,
    );

    const result = await adminAuthService.login(input);

    reply.header(
      "Set-Cookie",
      getSessionCookie(result.sessionToken),
    );

    return {
      admin: result.admin,
    };
  });

  app.get("/admin/auth/me", async (request) => {
    const token = getSessionToken(request);

    if (!token) {
      return {
        admin: null,
      };
    }

    const session =
      await adminAuthService.getAdminBySessionToken(token);

    return {
      admin: session?.admin ?? null,
    };
  });

  app.post("/admin/auth/logout", async (request, reply) => {
    const token = getSessionToken(request);

    if (token) {
      await adminAuthService.logout(token);
    }

    reply.header(
      "Set-Cookie",
      getClearSessionCookie(),
    );

    return {
      success: true,
    };
  });
}