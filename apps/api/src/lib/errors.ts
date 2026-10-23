import type { ApiErrorCode } from "@ecommerce/contracts";
import {
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { ZodError } from "zod";

export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: ApiErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(statusCode: number, code: ApiErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static validation(message = "Request validation failed", details?: Record<string, unknown>) {
    return new HttpError(400, "validation_error", message, details);
  }

  static notFound(message = "Resource not found") {
    return new HttpError(404, "not_found", message);
  }

  static conflict(message = "Resource conflict") {
    return new HttpError(409, "conflict", message);
  }

  static notImplemented(message = "This operation is not implemented") {
    return new HttpError(501, "not_implemented", message);
  }

static unauthorized(message = "Unauthorized.") {
  return new HttpError(
    401,
    "unauthorized",
    message,
  );
}
}

export function errorFromUnknown(error: unknown): HttpError {
  if (error instanceof HttpError) return error;

  if (error instanceof ZodError) {
    return HttpError.validation(
      "Request validation failed",
      Object.fromEntries(error.issues.map((issue) => [issue.path.join(".") || "request", issue.message]))
    );
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") return HttpError.conflict("A resource with this value already exists");
    if (error.code === "P2025") return HttpError.notFound("The requested resource was not found");
    return new HttpError(500, "database_error", "The database operation failed");
  }

  if (error instanceof PrismaClientValidationError) {
    return new HttpError(500, "database_error", "The database operation failed");
  }

  if (error instanceof PrismaClientInitializationError || error instanceof PrismaClientUnknownRequestError) {
    return new HttpError(500, "database_error", "The database operation failed");
  }

  return new HttpError(500, "internal_error", "An unexpected server error occurred");
}
