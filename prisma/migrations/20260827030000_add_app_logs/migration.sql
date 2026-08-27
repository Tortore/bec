-- Journal interne des erreurs et avertissements (site + administration).
CREATE TABLE "AppLog" (
    "id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT NOT NULL DEFAULT '',
    "path" TEXT NOT NULL DEFAULT '',
    "requestId" TEXT NOT NULL DEFAULT '',
    "digest" TEXT NOT NULL DEFAULT '',
    "meta" JSONB NOT NULL DEFAULT '{}',
    "occurrences" INTEGER NOT NULL DEFAULT 1,
    "resolvedAt" TIMESTAMP(3),
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AppLog_fingerprint_key" ON "AppLog"("fingerprint");
CREATE INDEX "AppLog_resolvedAt_lastSeenAt_idx" ON "AppLog"("resolvedAt", "lastSeenAt");
CREATE INDEX "AppLog_level_lastSeenAt_idx" ON "AppLog"("level", "lastSeenAt");
CREATE INDEX "AppLog_source_lastSeenAt_idx" ON "AppLog"("source", "lastSeenAt");
