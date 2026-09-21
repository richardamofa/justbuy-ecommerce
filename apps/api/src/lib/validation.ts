import type { FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpError } from "./errors.js";

function parse<T>(schema: z.ZodTypeAny, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw HttpError.validation(
      "Request validation failed",
      Object.fromEntries(result.error.issues.map((issue) => [issue.path.join(".") || "request", issue.message]))
    );
  }
  return result.data as T;
}

export function parseBody<T>(request: FastifyRequest, schema: z.ZodTypeAny): T {
  return parse(schema, request.body);
}

export function parseParams<T>(request: FastifyRequest, schema: z.ZodTypeAny): T {
  return parse(schema, request.params);
}

export function parseQuery<T>(request: FastifyRequest, schema: z.ZodTypeAny): T {
  return parse(schema, request.query);
}

export const idParamsSchema = z.object({ id: z.string().min(1) });
export const slugParamsSchema = z.object({ slug: z.string().min(1) });
