import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryLabels, getProject, getRelatedProjects, getPublishedProjects } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublishedProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Projet introuvable" };
  return createMetadata({
    title: `${project.title} — ${project.city}`,
    description: project.excerpt,
    path: `/projets/${project.slug}`,
    image: project.cover,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const [related, labels] = await Promise.all([getRelatedProjects(project.slug), getCategoryLabels()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.images,
    dateCreated: String(project.year),
    locationCreated: {
      "@type": "Place",
      name: `${project.city}, ${project.country}`,
    },
  };

  return (
    <article className="pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-site pt-8">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Projets", href: "/projets" },
            { label: project.title },
          ]}
        />
      </div>
      <ProjectGallery
        title={project.title}
        images={[project.cover, ...project.images.filter((src) => src !== project.cover)]}
      />
      <div className="container-site mt-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow">
              {labels[project.category] ?? project.category} · {project.city} · {project.year}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#065b48] md:text-4xl">
              {project.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{project.subtitle}</p>
            <p className="mt-6 max-w-2xl leading-relaxed text-foreground/85">
              {project.description}
            </p>
          </div>
          <aside className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <dl className="space-y-5 text-sm">
              <div>
                <dt className="text-muted-foreground">Localisation</dt>
                <dd className="mt-1 font-medium">
                  {project.city}, {project.country}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Année</dt>
                <dd className="mt-1 font-medium">{project.year}</dd>
              </div>
              {project.area ? (
                <div>
                  <dt className="text-muted-foreground">Superficie</dt>
                  <dd className="mt-1 font-medium">{project.area}</dd>
                </div>
              ) : null}
              {project.client ? (
                <div>
                  <dt className="text-muted-foreground">Maître d&apos;ouvrage</dt>
                  <dd className="mt-1 font-medium">{project.client}</dd>
                </div>
              ) : null}
              {project.duration ? (
                <div>
                  <dt className="text-muted-foreground">Durée des travaux</dt>
                  <dd className="mt-1 font-medium">{project.duration}</dd>
                </div>
              ) : null}
              {project.price ? (
                <div>
                  <dt className="text-muted-foreground">Prix</dt>
                  <dd className="mt-1 text-2xl font-medium">{project.price}</dd>
                </div>
              ) : null}
            </dl>
            <Button asChild className="mt-8 w-full">
              <Link href="/contact#devis">Demander un devis</Link>
            </Button>
          </aside>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <section>
            <h2 className="text-xl font-semibold text-[#065b48]">Caractéristiques principales</h2>
            <Separator className="my-5" />
            <ul className="space-y-3 text-muted-foreground">
              {project.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#065b48]">Matériaux utilisés</h2>
            <Separator className="my-5" />
            <ul className="space-y-3 text-muted-foreground">
              {project.materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-[#065b48]">Projets similaires</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ProjectCard key={item.slug} project={item} labels={labels} />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
