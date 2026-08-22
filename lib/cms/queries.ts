import { unstable_noStore as noStore } from "next/cache";
import { getDatabase, getMessages, ensureSeeded } from "@/lib/cms/store";
import { defaultHome, labelsFrom } from "@/lib/cms/defaults";
import { listMedia } from "@/lib/cms/media";
import { prisma } from "@/lib/prisma";
import type { AdminAccount, Category, HomeContent, Project } from "@/types";

export async function getAllProjects() {
  return (await getDatabase()).projects;
}

export async function getPublishedProjects() {
  return (await getAllProjects()).filter((project) => project.published !== false);
}

export async function getProject(slug: string) {
  return (await getPublishedProjects()).find((project) => project.slug === slug);
}

export async function getAdminProject(slug: string) {
  return (await getAllProjects()).find((project) => project.slug === slug);
}

export async function getFeaturedProjects() {
  return (await getPublishedProjects()).filter((project) => project.featured);
}

export async function getRelatedProjects(slug: string, limit = 3) {
  const current = await getProject(slug);
  const catalog = await getPublishedProjects();
  if (!current) return catalog.slice(0, limit);
  return catalog
    .filter((project) => project.slug !== slug)
    .sort((a, b) => {
      const score = (project: Project) =>
        (project.category === current.category ? 2 : 0) + (project.city === current.city ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, limit);
}

export async function getAllArticles() {
  return (await getDatabase()).articles;
}

export async function getPublishedArticles() {
  return (await getAllArticles())
    .filter((article) => article.published !== false)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticle(slug: string) {
  return (await getPublishedArticles()).find((article) => article.slug === slug);
}

export async function getAdminArticle(slug: string) {
  return (await getAllArticles()).find((article) => article.slug === slug);
}

export async function getRelatedArticles(slug: string, limit = 2) {
  const current = await getArticle(slug);
  return (await getPublishedArticles())
    .filter((article) => article.slug !== slug)
    .sort((a, b) => {
      if (!current) return 0;
      if (a.category === current.category) return -1;
      if (b.category === current.category) return 1;
      return 0;
    })
    .slice(0, limit);
}

export async function getServices() {
  return (await getDatabase()).services;
}

export async function getService(id: string) {
  return (await getServices()).find((service) => service.id === id);
}

export async function getTeam() {
  return (await getDatabase()).team;
}

export async function getTeamMember(id: string) {
  return (await getTeam()).find((member) => member.id === id);
}

export async function getSettings() {
  return (await getDatabase()).settings;
}

export async function getCompany() {
  return (await getDatabase()).company;
}

export async function getApplications() {
  return prisma.application.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getApplication(id: string) {
  return prisma.application.findUnique({ where: { id } });
}

export async function markContactMessageRead(id: string) {
  await prisma.contactMessage.updateMany({ where: { id, read: false }, data: { read: true } });
}

export async function markApplicationRead(id: string) {
  await prisma.application.updateMany({ where: { id, read: false }, data: { read: true } });
}

export async function getUnreadApplicationsCount() {
  return prisma.application.count({ where: { read: false } });
}

export async function getApprovedReviews() {
  return prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { id: true, name: true, rating: true, message: true },
  });
}

export async function getAdminReviews() {
  return prisma.review.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getReview(id: string) {
  return prisma.review.findUnique({ where: { id } });
}

export async function getPendingReviewsCount() {
  return prisma.review.count({ where: { approved: false } });
}

export async function getDashboardStats() {
  const [db, messages, applications, unreadApplications, applicationCount, pendingReviews, reviews] = await Promise.all([
    getDatabase(),
    getMessages(),
    prisma.application.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.application.count({ where: { read: false } }),
    prisma.application.count(),
    getPendingReviewsCount(),
    prisma.review.count(),
  ]);
  return {
    projects: db.projects.length,
    publishedProjects: db.projects.filter((item) => item.published !== false).length,
    articles: db.articles.length,
    services: db.services.length,
    team: db.team.length,
    messages: messages.length,
    reviews,
    unreadMessages: messages.filter((item) => !item.read).length,
    pendingReviews,
    recentMessages: messages.slice(0, 5),
    applications: applicationCount,
    unreadApplications,
    recentApplications: applications,
    recentProjects: [...db.projects]
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, "fr"))
      .slice(0, 4),
  };
}

export async function getCategories(): Promise<Category[]> {
  await ensureSeeded();
  const rows = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((row) => ({ id: row.id, label: row.label, sortOrder: row.sortOrder }));
}

export async function getCategoryLabels() {
  return labelsFrom(await getCategories());
}

export async function getHome(): Promise<HomeContent> {
  noStore();
  await ensureSeeded();
  const row = await prisma.homePage.findUnique({ where: { id: "default" } });
  const data = (row?.data as Partial<HomeContent> | undefined) ?? {};
  return {
    ...defaultHome,
    ...data,
    stats: Array.isArray(data.stats) && data.stats.length ? data.stats : defaultHome.stats,
    ctaBenefits:
      Array.isArray(data.ctaBenefits) && data.ctaBenefits.length
        ? data.ctaBenefits
        : defaultHome.ctaBenefits,
  };
}

export async function getUsers(): Promise<AdminAccount[]> {
  await ensureSeeded();
  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  return users.map((user) => ({
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email ?? undefined,
    role: user.role === "editor" ? "editor" : "admin",
    active: user.active,
    createdAt: user.createdAt.toISOString(),
  }));
}

export async function getUser(id: string) {
  return (await getUsers()).find((user) => user.id === id);
}

export async function getMediaLibrary() {
  const [files, db, home] = await Promise.all([listMedia(), getDatabase(), getHome()]);
  const usage = new Map<string, string[]>();
  function add(src: string, label: string) {
    if (!src) return;
    const current = usage.get(src) ?? [];
    if (!current.includes(label)) current.push(label);
    usage.set(src, current);
  }
  for (const project of db.projects) {
    const label = `Projet « ${project.title} »`;
    add(project.cover, label);
    for (const image of project.images) add(image, label);
  }
  for (const article of db.articles) add(article.cover, `Article « ${article.title} »`);
  for (const service of db.services) add(service.image, `Service « ${service.title} »`);
  for (const member of db.team) add(member.image, `Équipe — ${member.name}`);
  add(home.heroImage, "Page d’accueil");
  return files.map((src) => ({
    src,
    uploaded: src.startsWith("/uploads/"),
    usedBy: usage.get(src) ?? [],
  }));
}
