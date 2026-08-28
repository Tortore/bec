import type { Metadata } from "next";
import Link from "next/link";
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
        description="Ajoutez, publiez ou masquez les réalisations du portfolio. L’introduction de la page se modifie dans Pages."
        action={{ href: "/admin/projets/nouveau", label: "Nouveau projet" }}
      />
      <Link
        href="/admin/pages/projets"
        className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#00af84]/25 bg-white px-5 py-4 text-sm shadow-sm transition hover:border-[#00af84]"
      >
        <span>
          <span className="font-semibold text-[#065b48]">Textes de la page Projets</span>
          <span className="mt-0.5 block text-slate-500">Accroche, titre et introduction du portfolio.</span>
        </span>
        <span className="shrink-0 font-medium text-[#00af84]">Modifier</span>
      </Link>
      <AdminProjectList projects={projects} categories={categories} labels={labels} />
    </div>
  );
}
