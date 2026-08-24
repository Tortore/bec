import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalLayout } from "@/components/legal/legal-layout";
import { getLegalPageBySlug } from "@/lib/cms/legal";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import type { LegalSlug } from "@/data/legal";

export async function legalPageMetadata(slug: LegalSlug): Promise<Metadata> {
  const page = await getLegalPageBySlug(slug);
  if (!page) return createMetadata({ title: "Page légale", description: "", path: "/" });
  return createMetadata({
    title: page.document.title,
    description: page.document.intro,
    path: page.path,
  });
}

export async function LegalPublicPage({ slug }: { slug: LegalSlug }) {
  const page = await getLegalPageBySlug(slug);
  if (!page) notFound();
  return (
    <LegalLayout
      title={page.document.title}
      intro={page.document.intro}
      updatedLabel={formatDate(page.document.updatedAt)}
    >
      <div dangerouslySetInnerHTML={{ __html: page.document.body }} />
    </LegalLayout>
  );
}
