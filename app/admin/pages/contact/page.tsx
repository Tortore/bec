import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { ContactPageForm, PagesNav, SavedBanner } from "@/components/admin/site-pages-forms";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia } from "@/lib/cms/media";
import { getSitePages } from "@/lib/cms/site-pages";

export const metadata: Metadata = { title: "Page Contact" };

export default async function AdminContactPageCopy({
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
        title="Page Contact"
        description="Bandeau, titres, carte et questions fréquentes. Adresse, téléphones et e-mail se modifient dans Paramètres."
        action={{ href: "/admin/parametres", label: "Paramètres" }}
      />
      <PagesNav />
      {saved ? <SavedBanner>La page Contact a été mise à jour.</SavedBanner> : null}
      <ContactPageForm page={pages.contact} media={media} />
    </div>
  );
}
