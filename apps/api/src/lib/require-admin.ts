import type { FastifyRequest } from "fastify";

import * as adminAuthService from "../services/admin-auth.service.js";
import { getSessionToken } from "./admin-auth.js";
import { HttpError } from "./errors.js";

export async function requireAdmin(
  request: FastifyRequest,
) {
  const token = getSessionToken(request);

  if (!token) {
    throw HttpError.unauthorized(
      "Admin authentication required.",
    );
  }

  const session =
    await adminAuthService.getAdminBySessionToken(token);

  if (!session) {
    throw HttpError.unauthorized(
      "Admin session is invalid or expired.",
    );
  }
}