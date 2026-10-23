CREATE TYPE "AdminEventSeverity" AS ENUM ('info', 'warning', 'error');

CREATE TABLE "AdminEvent" (
    "id" TEXT NOT NULL,
    "severity" "AdminEventSeverity" NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "requestId" TEXT,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "AdminEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminEvent_isResolved_severity_createdAt_idx" ON "AdminEvent"("isResolved", "severity", "createdAt");
CREATE INDEX "AdminEvent_entityType_entityId_idx" ON "AdminEvent"("entityType", "entityId");