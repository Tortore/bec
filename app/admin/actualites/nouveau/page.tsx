import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { ArticleForm } from "@/components/admin/article-form";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia } from "@/lib/cms/media";

export const metadata: Metadata = { title: "Nouvel article" };

export default async function NewArticlePage() {
  await requireAdmin();
  const media = await listMedia();
  return (
    <div>
      <AdminHeader title="Nouvel article" />
      <ArticleForm media={media} />
    </div>
  );
}
