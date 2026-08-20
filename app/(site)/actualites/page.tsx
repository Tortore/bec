import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { NewsExplorer } from "@/components/news/news-explorer";
import { SiteImage } from "@/components/site-image";

export const metadata: Metadata = createMetadata({
  title: "Actualités",
  description:
    "Les dernières tendances en architecture et construction : technologies, bâtiments intelligents et méthodes durables.",
  path: "/actualites",
});

export default async function NewsPage() {
  const articles = await getPublishedArticles();
  const [featured, ...rest] = articles;

  return (
    <div className="pt-10 pb-16">
      <div className="container-site">
        <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Actualités" }]} />
        <p className="eyebrow mt-8">Actualités</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold text-[#065b48] md:text-4xl">
          Architecture et construction
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Innovations, méthodes de chantier et projets qui façonnent le bâtiment en RDC.
        </p>

        {featured ? (
          <Link
            href={`/actualites/${featured.slug}`}
            className="group mt-10 grid overflow-hidden rounded-lg bg-[#065b48] text-white lg:grid-cols-2 lg:items-stretch"
          >
            <div className="relative min-h-52 lg:min-h-[18rem] lg:h-full">
              <SiteImage
                src={featured.cover}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <p className="text-sm text-[#00af84]">
                {featured.category} · {formatDate(featured.date)}
              </p>
              <h2 className="mt-3 text-xl font-semibold sm:text-2xl">{featured.title}</h2>
              <p className="mt-3 line-clamp-3 text-white/75">{featured.excerpt}</p>
              <span className="mt-5 text-sm font-medium text-white">Lire l&apos;article →</span>
            </div>
          </Link>
        ) : null}

        <div className="mt-12">
          <NewsExplorer articles={rest.length ? rest : articles} />
        </div>
      </div>
    </div>
  );
}
