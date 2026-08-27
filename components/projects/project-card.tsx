import Link from "next/link";
import { Play } from "lucide-react";
import { categoryLabels } from "@/lib/site";
import type { Project } from "@/types";
import { SiteImage } from "@/components/site-image";

export function ProjectCard({
  project,
  labels = categoryLabels,
}: {
  project: Project;
  index?: number;
  featured?: boolean;
  labels?: Record<string, string>;
}) {
  return (
    <Link href={`/projets/${project.slug}`} className="group block">
      <article className="overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <SiteImage
            src={project.cover}
            alt={`${project.title}, ${project.city}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {project.video ? (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              <Play className="h-3 w-3 fill-current" />
              Vidéo
            </span>
          ) : null}
        </div>
        <div className="p-4">
          <p className="text-xs text-[#00af84]">
            {labels[project.category] ?? project.category} · {project.city} · {project.year}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[#065b48] group-hover:text-[#00af84]">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
        </div>
      </article>
    </Link>
  );
}
