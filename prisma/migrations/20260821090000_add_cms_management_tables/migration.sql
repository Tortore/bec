-- Tables ajoutées après la migration initiale. Elles ne modifient ni ne
-- suppriment les données déjà présentes dans les tables du site.

CREATE TABLE "HomePage" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "experience" TEXT NOT NULL DEFAULT '',
    "education" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "cvFileName" TEXT NOT NULL,
    "cvStoredName" TEXT NOT NULL,
    "cvMimeType" TEXT NOT NULL,
    "cvSize" INTEGER NOT NULL,
    "idFileName" TEXT,
    "idStoredName" TEXT,
    "idMimeType" TEXT,
    "idSize" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'nouveau',
    "notes" TEXT NOT NULL DEFAULT '',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
CREATE INDEX "Application_status_createdAt_idx" ON "Application"("status", "createdAt");
CREATE INDEX "Application_read_createdAt_idx" ON "Application"("read", "createdAt");
