import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { listMedia, listVideos } from "@/lib/cms/media";
import { requireAdmin } from "@/lib/cms/auth";
import { getCategories } from "@/lib/cms/queries";

export const metadata: Metadata = { title: "Nouveau projet" };

export default async function NewProjectPage() {
  await requireAdmin();
  const [media, videos, categories] = await Promise.all([listMedia(), listVideos(), getCategories()]);
  return (
    <div>
      <AdminHeader title="Nouveau projet" description="Le projet apparaîtra dans le portfolio une fois publié." />
      <ProjectForm media={media} videos={videos} categories={categories} />
    </div>
  );
}
