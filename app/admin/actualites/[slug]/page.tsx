import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { ArticleForm } from "@/components/admin/article-form";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia } from "@/lib/cms/media";
import { getAdminArticle } from "@/lib/cms/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getAdminArticle((await params).slug);
  return { title: article ? article.title : "Article" };
}

export default async function EditArticlePage({ params }: Props) {
  await requireAdmin();
  const article = await getAdminArticle((await params).slug);
  if (!article) notFound();
  const media = await listMedia();
  return (
    <div>
      <AdminHeader title={article.title} />
      <ArticleForm article={article} media={media} />
    </div>
  );
}
