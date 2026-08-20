"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { filterProjectList } from "@/lib/cms/filter";
import { labelsFrom } from "@/lib/cms/defaults";
import type { Category, Project, ProjectCategory, ProjectSort } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 9;

export function ProjectExplorer({
  projects,
  categories,
}: {
  projects: Project[];
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ids = categories.map((item) => item.id);
  const labels = labelsFrom(categories);
  const paramCategory = searchParams.get("categorie");
  const category: ProjectCategory | "all" =
    paramCategory && ids.includes(paramCategory) ? paramCategory : "all";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ProjectSort>("recent");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(
    () => filterProjectList(projects, { query, category, sort }),
    [projects, query, category, sort],
  );
  const shown = results.slice(0, visible);

  function setCategory(item: ProjectCategory | "all") {
    const params = new URLSearchParams(searchParams.toString());
    if (item === "all") params.delete("categorie");
    else params.set("categorie", item);
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    setVisible(PAGE_SIZE);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Rechercher un projet, une ville..."
            className="pl-10"
            aria-label="Rechercher un projet"
          />
        </div>
        <Select value={sort} onValueChange={(value) => setSort(value as ProjectSort)}>
          <SelectTrigger className="lg:w-52" aria-label="Trier les projets">
            <SelectValue placeholder="Trier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="oldest">Plus anciens</SelectItem>
            <SelectItem value="az">Titre A → Z</SelectItem>
            <SelectItem value="za">Titre Z → A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3" role="tablist" aria-label="Filtrer par catégorie">
        {(["all", ...ids] as const).map((item) => {
          const active = category === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`border-b-2 pb-1 text-sm font-medium transition-colors ${
                active
                  ? "border-[#00af84] text-[#00af84]"
                  : "border-transparent text-muted-foreground hover:text-[#065b48]"
              }`}
            >
              {item === "all" ? "Tous" : labels[item]}
            </button>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        {results.length} projet{results.length > 1 ? "s" : ""}
      </p>

      {shown.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index % 3} labels={labels} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">
          Aucun projet ne correspond à cette recherche.
        </p>
      )}

      {visible < results.length ? (
        <div className="mt-12 flex justify-center">
          <Button variant="outline" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
            Charger plus de projets
          </Button>
        </div>
      ) : null}
    </div>
  );
}
