import type { Project, ProjectCategory, ProjectSort } from "@/types";

export function filterProjectList(
  projects: Project[],
  {
    query = "",
    category,
    sort = "recent",
  }: {
    query?: string;
    category?: ProjectCategory | "all";
    sort?: ProjectSort;
  },
) {
  const normalized = query.trim().toLowerCase();
  const published = projects.filter((project) => project.published !== false);
  let result = published.filter((project) => {
    const matchesCategory = !category || category === "all" || project.category === category;
    const haystack = [project.title, project.subtitle, project.city, project.excerpt, project.description]
      .join(" ")
      .toLowerCase();
    return matchesCategory && (!normalized || haystack.includes(normalized));
  });

  result = [...result].sort((a, b) => {
    if (sort === "oldest") return a.year - b.year || a.title.localeCompare(b.title, "fr");
    if (sort === "az") return a.title.localeCompare(b.title, "fr");
    if (sort === "za") return b.title.localeCompare(a.title, "fr");
    return b.year - a.year || a.title.localeCompare(b.title, "fr");
  });

  return result;
}
