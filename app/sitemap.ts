import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/cms/queries";
import { siteConfig } from "@/lib/site";

// Le sitemap reprend le contenu administrable et doit être généré à la demande.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "") || "https://www.bec-rdc.com";
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/projets`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/a-propos`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/carrieres`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/mentions-legales`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/confidentialite`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/conditions-utilisation`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const projects = await getPublishedProjects();

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projets/${project.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...pages, ...projectRoutes];
}
