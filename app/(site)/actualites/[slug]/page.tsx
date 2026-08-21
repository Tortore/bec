import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import { getArticle, getRelatedArticles } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteImage } from "@/components/site-image";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article introuvable" };
  return createMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/actualites/${article.slug}`,
    image: article.cover,
    type: "article",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const related = await getRelatedArticles(article.slug);
  const shareUrl = `${siteConfig.url}/actualites/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.date,
    image: article.cover,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <article className="pt-10 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-site max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Actualités", href: "/actualites" },
            { label: article.title },
          ]}
        />
        <p className="eyebrow mt-8">
          {article.category} · {formatDate(article.date)} · {article.readingMinutes} min de lecture
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[#065b48] sm:text-3xl md:text-4xl">{article.title}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{article.excerpt}</p>
      </div>
      <div className="container-site mt-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-secondary">
          <SiteImage
            src={article.cover}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="container-site mt-12 max-w-3xl space-y-6 text-lg leading-relaxed">
        {article.content.map((paragraph, index) => (
          <p key={`${article.slug}-${index}`}>{paragraph}</p>
        ))}
        <div className="flex flex-wrap items-center gap-3 pt-6">
          <span className="text-sm text-muted-foreground">Partager</span>
          <a
            className="rounded-full border border-border p-2 hover:bg-secondary"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur Facebook"
          >
            <Facebook className="size-4" />
          </a>
          <a
            className="rounded-full border border-border p-2 hover:bg-secondary"
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur Twitter"
          >
            <Twitter className="size-4" />
          </a>
          <a
            className="rounded-full border border-border p-2 hover:bg-secondary"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur LinkedIn"
          >
            <Linkedin className="size-4" />
          </a>
        </div>
      </div>
      {related.length ? (
        <section className="container-site mt-20">
          <h2 className="text-2xl font-semibold text-[#065b48]">Articles liés</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/actualites/${item.slug}`}
                className="group overflow-hidden rounded-lg border border-border bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  <SiteImage src={item.cover} alt={item.title} fill className="object-cover" sizes="50vw" />
                </div>
                <h3 className="p-4 text-lg font-semibold text-[#065b48] group-hover:text-[#00af84]">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
