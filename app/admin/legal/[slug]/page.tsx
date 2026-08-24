import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { LegalForm } from "@/components/admin/legal-form";
import { getLegalPageBySlug } from "@/lib/cms/legal";
import { legalMetaBySlug } from "@/data/legal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const meta = legalMetaBySlug((await params).slug);
  return { title: meta ? meta.label : "Page légale" };
}

export default async function AdminLegalEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const page = await getLegalPageBySlug((await params).slug);
  if (!page) notFound();
  return (
    <div>
      <AdminHeader
        title={page.label}
        description={`Modifiez le texte public de ${page.path}.`}
        action={{ href: "/admin/legal", label: "Toutes les pages" }}
      />
      <LegalForm pageKey={page.key} document={page.document} publicPath={page.path} />
    </div>
  );
}
