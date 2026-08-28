import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getCategories, getPublishedProjects } from "@/lib/cms/queries";
import { getSitePages } from "@/lib/cms/site-pages";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const pages = await getSitePages();
  return createMetadata({
    title: pages.projects.title || "Projets",
    description: pages.projects.intro,
    path: "/projets",
  });
}

export default async function ProjectsPage() {
  const [projects, categories, pages] = await Promise.all([
    getPublishedProjects(),
    getCategories(),
    getSitePages(),
  ]);
  const copy = pages.projects;
  return (
    <div className="pt-10 pb-16">
      <div className="container-site">
        <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Projets" }]} />
        <p className="eyebrow mt-8">{copy.eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold text-[#065b48] md:text-4xl">{copy.title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{copy.intro}</p>
        <p className="sr-only">Catégories : {categories.map((item) => item.label).join(", ")}</p>
        <div className="mt-10">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-secondary" />}>
            <ProjectExplorer projects={projects} categories={categories} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
