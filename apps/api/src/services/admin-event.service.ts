import type { AdminEventSeverity } from "@ecommerce/contracts";
import { randomUUID } from "node:crypto";
import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";

type AdminEventRecord = {
  id: string;
  severity: AdminEventSeverity;
  source: string;
  title: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  requestId: string | null;
  isResolved: boolean;
  createdAt: Date;
  resolvedAt: Date | null;
};

export async function recordAdminEvent(input: {
  severity: AdminEventSeverity;
  source: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  requestId?: string;
}) {
  const id = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO "AdminEvent" ("id", "severity", "source", "title", "message", "entityType", "entityId", "requestId")
    VALUES (${id}, ${input.severity}::"AdminEventSeverity", ${input.source}, ${input.title}, ${input.message}, ${input.entityType ?? null}, ${input.entityId ?? null}, ${input.requestId ?? null})
  `;
  return { id, ...input, isResolved: false, createdAt: new Date() };
}

export async function listAdminEvents(query: {
  page: number;
  pageSize: number;
  isResolved?: boolean;
}) {
  const offset = (query.page - 1) * query.pageSize;
  const [items, count] = query.isResolved === undefined
    ? await Promise.all([
        prisma.$queryRaw<AdminEventRecord[]>`
          SELECT * FROM "AdminEvent"
          ORDER BY "isResolved" ASC, "createdAt" DESC
          LIMIT ${query.pageSize} OFFSET ${offset}
        `,
        prisma.$queryRaw<Array<{ total: bigint }>>`SELECT COUNT(*) AS total FROM "AdminEvent"`,
      ])
    : await Promise.all([
        prisma.$queryRaw<AdminEventRecord[]>`
          SELECT * FROM "AdminEvent" WHERE "isResolved" = ${query.isResolved}
          ORDER BY "isResolved" ASC, "createdAt" DESC
          LIMIT ${query.pageSize} OFFSET ${offset}
        `,
        prisma.$queryRaw<Array<{ total: bigint }>>`SELECT COUNT(*) AS total FROM "AdminEvent" WHERE "isResolved" = ${query.isResolved}`,
      ]);
  const total = Number(count[0]?.total ?? 0);

  return {
    items: items.map((event) => ({
      ...event,
      createdAt: event.createdAt.toISOString(),
      ...(event.resolvedAt ? { resolvedAt: event.resolvedAt.toISOString() } : {}),
    })),
    page: query.page,
    pageSize: query.pageSize,
    total,
    totalPages: Math.ceil(total / query.pageSize),
  };
}

export async function resolveAdminEvent(id: string, isResolved: boolean) {
  const events = await prisma.$queryRaw<AdminEventRecord[]>`
    UPDATE "AdminEvent"
    SET "isResolved" = ${isResolved}, "resolvedAt" = ${isResolved ? new Date() : null}
    WHERE "id" = ${id}
    RETURNING *
  `;
  const event = events[0];
  if (!event) throw HttpError.notFound("Admin event not found.");
  return {
    ...event,
    createdAt: event.createdAt.toISOString(),
    ...(event.resolvedAt ? { resolvedAt: event.resolvedAt.toISOString() } : {}),
  };
}