import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { CareersPageForm, PagesNav, SavedBanner } from "@/components/admin/site-pages-forms";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia } from "@/lib/cms/media";
import { getSitePages } from "@/lib/cms/site-pages";

export const metadata: Metadata = { title: "Page Recrutement" };

export default async function AdminCareersPageCopy({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const [pages, media] = await Promise.all([getSitePages(), listMedia()]);
  const saved = (await searchParams).ok === "1";
  return (
    <div>
      <AdminHeader
        title="Page Recrutement"
        description="Tous les textes de /carrieres, y compris les postes proposés dans le formulaire. Les dossiers reçus restent dans Recrutement."
        action={{ href: "/admin/recrutement", label: "Voir les candidatures" }}
      />
      <PagesNav />
      {saved ? <SavedBanner>La page Recrutement a été mise à jour.</SavedBanner> : null}
      <CareersPageForm page={pages.careers} media={media} />
    </div>
  );
}
