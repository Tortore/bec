import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getPublicContentVersion() {
  const rows = await prisma.$queryRaw<Array<{ version: string }>>(Prisma.sql`
    SELECT MD5(CONCAT_WS('|',
      (SELECT COUNT(*)::text || ':' || COALESCE(MAX("updatedAt")::text, '') FROM "HomePage"),
      (SELECT COUNT(*)::text || ':' || COALESCE(MAX("updatedAt")::text, '') FROM "SiteSettings"),
      (SELECT COUNT(*)::text || ':' || COALESCE(MAX("updatedAt")::text, '') FROM "CompanyProfile"),
      (SELECT COUNT(*)::text || ':' || COALESCE(MAX("updatedAt")::text, '') FROM "LegalPages"),
      (SELECT COUNT(*)::text || ':' || COALESCE(MAX("updatedAt")::text, '') FROM "SitePages"),
      (SELECT COUNT(*)::text || ':' || COALESCE(MAX("updatedAt")::text, '') FROM "Project"),
      (SELECT COUNT(*)::text || ':' || COALESCE(MAX("updatedAt")::text, '') FROM "Service"),
      (SELECT COUNT(*)::text || ':' || COALESCE(MAX("updatedAt")::text, '') FROM "TeamMember"),
      (SELECT COUNT(*)::text || ':' || COALESCE(MAX("updatedAt")::text, '') FROM "Category"),
      (SELECT COUNT(*)::text || ':' || COALESCE(MAX("updatedAt")::text, '') FROM "Review" WHERE approved = true)
    )) AS version
  `);

  return rows[0]?.version ?? "0";
}
