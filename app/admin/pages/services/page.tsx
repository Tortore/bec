import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { PagesNav, SavedBanner, ServicesPageForm } from "@/components/admin/site-pages-forms";
import { requireAdmin } from "@/lib/cms/auth";
import { getSitePages } from "@/lib/cms/site-pages";

export const metadata: Metadata = { title: "Page Services" };

export default async function AdminServicesPageCopy({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const pages = await getSitePages();
  const saved = (await searchParams).ok === "1";
  return (
    <div>
      <AdminHeader
        title="Page Services"
        description="Bandeau du haut, titres du catalogue et méthode. Les cartes de prestations se modifient dans Services."
        action={{ href: "/admin/services", label: "Gérer les services" }}
      />
      <PagesNav />
      {saved ? <SavedBanner>La page Services a été mise à jour.</SavedBanner> : null}
      <ServicesPageForm page={pages.services} />
    </div>
  );
}
