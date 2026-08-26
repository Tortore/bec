import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/cms/queries";
import { siteConfig } from "@/lib/site";

// Le sitemap reprend le contenu administrable et doit être généré à la demande.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "") || "https://bec-rdc.com";

  const pages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/projets`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/services`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/a-propos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/carrieres`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/mentions-legales`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/confidentialite`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookies`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/conditions-utilisation`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const projects = await getPublishedProjects();

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projets/${project.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...pages, ...projectRoutes];
}
