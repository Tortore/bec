-- Ajoute TikTok aux réseaux sociaux configurables du site.
ALTER TABLE "SiteSettings"
ADD COLUMN "tiktok" TEXT NOT NULL DEFAULT '#';
