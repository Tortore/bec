import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminProjectList } from "@/components/admin/project-list";
import { getAllProjects, getCategories, getCategoryLabels } from "@/lib/cms/queries";

export const metadata: Metadata = { title: "Projets" };

export default async function AdminProjectsPage() {
  const [projects, categories, labels] = await Promise.all([
    getAllProjects(),
    getCategories(),
    getCategoryLabels(),
  ]);

  return (
    <div>
      <AdminHeader
        title="Projets"
        description="Ajoutez, publiez ou masquez les réalisations du portfolio."
        action={{ href: "/admin/projets/nouveau", label: "Nouveau projet" }}
      />
      <AdminProjectList projects={projects} categories={categories} labels={labels} />
    </div>
  );
}
