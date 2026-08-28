-- Textes administrables des pages Services, Recrutement, Projets et Contact.
CREATE TABLE "SitePages" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SitePages_pkey" PRIMARY KEY ("id")
);
