"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { SiteImage } from "@/components/site-image";
import { Input } from "@/components/ui/input";
import { deleteProjectAction } from "@/lib/cms/actions";
import type { Category, Project } from "@/types";

export function AdminProjectList({
  projects,
  categories,
  labels,
}: {
  projects: Project[];
  categories: Category[];
  labels: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = category === "all" || project.category === category;
      const haystack = [project.title, project.subtitle, project.city, String(project.year)]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [projects, query, category]);

  return (
    <div>
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un projet, une ville…"
            className="pl-10"
            aria-label="Rechercher un projet"
          />
        </div>
        <div className="mt-4 -mx-1 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2 px-1" role="tablist" aria-label="Filtrer par catégorie">
            <CategoryChip
              active={category === "all"}
              onClick={() => setCategory("all")}
              label={`Tous (${projects.length})`}
            />
            {categories.map((item) => {
              const count = projects.filter((project) => project.category === item.id).length;
              return (
                <CategoryChip
                  key={item.id}
                  active={category === item.id}
                  onClick={() => setCategory(item.id)}
                  label={`${item.label} (${count})`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <p className="mb-3 text-sm text-slate-500">
        {results.length} projet{results.length > 1 ? "s" : ""}
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {results.length ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Projet</th>
                <th className="hidden px-4 py-3 md:table-cell">Catégorie</th>
                <th className="hidden px-4 py-3 lg:table-cell">Ville</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((project) => (
                <tr key={project.slug} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-16 overflow-hidden rounded-lg bg-slate-100">
                        <SiteImage src={project.cover} alt="" fill className="object-cover" sizes="64px" />
                      </span>
                      <div>
                        <p className="font-medium text-slate-800">{project.title}</p>
                        <p className="text-xs text-slate-500">{project.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {labels[project.category] ?? project.category}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">{project.city}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        project.published === false
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {project.published === false ? "Brouillon" : "Publié"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/projets/${project.slug}`} className="mr-2 text-sm font-medium text-[#065b48]">
                      Modifier
                    </Link>
                    <ConfirmDelete
                      message={`Supprimer « ${project.title} » ?`}
                      action={deleteProjectAction.bind(null, project.slug)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-slate-500">Aucun projet ne correspond à cette recherche.</p>
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-[#065b48] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
