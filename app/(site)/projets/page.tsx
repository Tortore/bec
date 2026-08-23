import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getCategories, getPublishedProjects } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Projets",
  description:
    "Portfolio de Bureau d'Études et Construction : résidentiel, commercial, hospitalité, public, académique, santé et logement social.",
  path: "/projets",
});

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([getPublishedProjects(), getCategories()]);
  return (
    <div className="pt-10 pb-16">
      <div className="container-site">
        <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Projets" }]} />
        <p className="eyebrow mt-8">Portfolio</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold text-[#065b48] md:text-4xl">
          Nos réalisations
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Résidences, logements sociaux, équipements publics, hospitalité, commerces,
          académique et santé — une même exigence de conception et d&apos;exécution.
        </p>
        <p className="sr-only">
          Catégories : {categories.map((item) => item.label).join(", ")}
        </p>
        <div className="mt-10">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-secondary" />}>
            <ProjectExplorer projects={projects} categories={categories} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
