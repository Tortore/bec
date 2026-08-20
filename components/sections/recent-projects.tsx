import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { getFeaturedProjects } from "@/lib/cms/queries";
import { SiteImage } from "@/components/site-image";
import type { HomeContent, Project } from "@/types";

export async function RecentProjects({
  projects,
  home,
  labels,
}: {
  projects?: Project[];
  home: Pick<HomeContent, "projectsEyebrow" | "projectsTitle" | "projectsIntro">;
  labels: Record<string, string>;
}) {
  const featured = (projects ?? (await getFeaturedProjects())).slice(0, 3);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-site">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              {home.projectsEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              {home.projectsTitle}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{home.projectsIntro}</p>
          </div>
          <Link
            href="/projets"
            className="group inline-flex items-center gap-2 font-semibold text-[#00af84] hover:text-[#065b48]"
          >
            Voir toutes les réalisations
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href={`/projets/${project.slug}`}
              className="group overflow-hidden rounded-2xl bg-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <SiteImage
                  src={project.cover}
                  alt={`${project.title}, ${project.city}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-[#00af84] px-3 py-1 text-xs font-semibold text-white">
                  {labels[project.category] ?? project.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#065b48] transition-colors group-hover:text-[#00af84]">
                  {project.title}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {project.city}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {project.year}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
