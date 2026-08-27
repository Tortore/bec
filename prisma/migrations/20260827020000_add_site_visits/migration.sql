-- Statistiques de fréquentation du site public (agrégats internes, sans cookie).
CREATE TABLE "SiteVisit" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT NOT NULL DEFAULT '',
    "visitorHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteVisit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SiteVisit_createdAt_idx" ON "SiteVisit"("createdAt");
CREATE INDEX "SiteVisit_path_createdAt_idx" ON "SiteVisit"("path", "createdAt");
CREATE INDEX "SiteVisit_visitorHash_createdAt_idx" ON "SiteVisit"("visitorHash", "createdAt");
CREATE INDEX "SiteVisit_referrer_createdAt_idx" ON "SiteVisit"("referrer", "createdAt");
