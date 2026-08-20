import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia } from "@/lib/cms/media";
import { getAdminProject, getCategories } from "@/lib/cms/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getAdminProject(slug);
  return { title: project ? `Modifier ${project.title}` : "Projet" };
}

export default async function EditProjectPage({ params }: Props) {
  await requireAdmin();
  const { slug } = await params;
  const [project, media, categories] = await Promise.all([
    getAdminProject(slug),
    listMedia(),
    getCategories(),
  ]);
  if (!project) notFound();
  return (
    <div>
      <AdminHeader title={project.title} description="Mise à jour du projet et de sa publication." />
      <ProjectForm project={project} media={media} categories={categories} />
    </div>
  );
}
