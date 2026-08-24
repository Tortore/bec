-- Ajoute la configuration administrable du pied de page sans modifier les
-- coordonnées déjà enregistrées.
ALTER TABLE "SiteSettings"
ADD COLUMN "footer" JSONB NOT NULL DEFAULT '{}';

-- Stocke le contenu administrable des pages légales.
CREATE TABLE "LegalPages" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalPages_pkey" PRIMARY KEY ("id")
);
