import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { PagesNav, ProjectsPageForm, SavedBanner } from "@/components/admin/site-pages-forms";
import { requireAdmin } from "@/lib/cms/auth";
import { getSitePages } from "@/lib/cms/site-pages";

export const metadata: Metadata = { title: "Page Projets" };

export default async function AdminProjectsPageCopy({
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
        title="Page Projets"
        description="Introduction du portfolio. Les réalisations se gèrent dans Projets."
        action={{ href: "/admin/projets", label: "Gérer les projets" }}
      />
      <PagesNav />
      {saved ? <SavedBanner>La page Projets a été mise à jour.</SavedBanner> : null}
      <ProjectsPageForm page={pages.projects} />
    </div>
  );
}
