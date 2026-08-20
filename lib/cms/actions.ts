"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { contactSchema } from "@/lib/contact-schema";
import { clearSessionCookie, requireAdmin, setSessionCookie, verifyLogin } from "@/lib/cms/auth";
import { saveUpload, deleteUpload, isUploadedMedia } from "@/lib/cms/media";
import { uniqueSlug } from "@/lib/cms/slug";
import { defaultHome } from "@/lib/cms/defaults";
import { hashPassword } from "@/lib/cms/password";
import { prisma } from "@/lib/prisma";
import { getDatabase, updateDatabase, updateMessages } from "@/lib/cms/store";
import { getCategories, getHome, getUsers } from "@/lib/cms/queries";
import { teamDepartments, type Project, type ServiceItem, type TeamMember } from "@/types";
import { deleteStoredFile } from "@/lib/cms/cv-storage";
import { isApplicationStatus } from "@/lib/recruitment";

const attempts = new Map<string, { count: number; until: number }>();

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

function parseLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function bool(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const key = username || "unknown";
  const now = Date.now();
  const current = attempts.get(key);
  if (current && current.until > now && current.count >= 8) {
    return { ok: false as const, error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }
  const account = await verifyLogin(username, password);
  if (!account) {
    const next = current && current.until > now ? current : { count: 0, until: now + 15 * 60 * 1000 };
    next.count += 1;
    attempts.set(key, next);
    return { ok: false as const, error: "Identifiant ou mot de passe incorrect." };
  }
  attempts.delete(key);
  await setSessionCookie(account.username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/connexion");
}

export async function saveMessageAction(input: unknown) {
  const parsed = contactSchema.parse(input);
  const fields = {
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    subject: parsed.subject,
    message: parsed.message,
  };
  await updateMessages((messages) => [
    {
      id: crypto.randomUUID(),
      ...fields,
      createdAt: new Date().toISOString(),
      read: false,
    },
    ...messages,
  ]);
  revalidatePath("/admin/messages");
  return { ok: true as const };
}

export async function markMessageReadAction(id: string, read = true) {
  await requireAdmin();
  await updateMessages((messages) =>
    messages.map((item) => (item.id === id ? { ...item, read } : item)),
  );
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  await updateMessages((messages) => messages.filter((item) => item.id !== id));
  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Choisissez une image." };
  }
  try {
    const src = await saveUpload(file);
    revalidatePath("/admin/medias");
    return { ok: true as const, src };
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "FORMAT") return { ok: false as const, error: "Formats acceptés : JPG, PNG, WEBP, AVIF ou GIF." };
    if (code === "SIZE") return { ok: false as const, error: "L’image ne doit pas dépasser 8 Mo." };
    return { ok: false as const, error: "Impossible d’enregistrer l’image." };
  }
}

export async function deleteMediaAction(src: string) {
  await requireAdmin();
  if (!isUploadedMedia(src)) {
    return { ok: false as const, error: "Seules les images téléversées peuvent être supprimées." };
  }
  try {
    await deleteUpload(src);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "FORBIDDEN") {
      return { ok: false as const, error: "Seules les images téléversées peuvent être supprimées." };
    }
    return { ok: false as const, error: "Impossible de supprimer cette image." };
  }
  revalidateSite();
  return { ok: true as const };
}

const projectSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(2),
  subtitle: z.string().min(2),
  category: z.string().min(1),
  city: z.string().min(2),
  country: z.string().min(2),
  year: z.coerce.number().int().min(1990).max(2100),
  cover: z.string().min(1),
  images: z.array(z.string()),
  excerpt: z.string().min(10),
  description: z.string().min(20),
  features: z.array(z.string()),
  materials: z.array(z.string()),
  area: z.string().optional(),
  client: z.string().optional(),
  duration: z.string().optional(),
  price: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();
  const db = await getDatabase();
  const currentSlug = String(formData.get("currentSlug") ?? "");
  const title = String(formData.get("title") ?? "");
  const parsed = projectSchema.parse({
    title,
    subtitle: formData.get("subtitle"),
    category: formData.get("category"),
    city: formData.get("city"),
    country: formData.get("country") || "RDC",
    year: formData.get("year"),
    cover: formData.get("cover"),
    images: parseLines(formData.get("images")),
    excerpt: String(formData.get("excerpt") ?? "").trim() || String(formData.get("description") ?? "").trim().slice(0, 220),
    description: formData.get("description"),
    features: parseLines(formData.get("features")),
    materials: parseLines(formData.get("materials")),
    area: String(formData.get("area") ?? "") || undefined,
    client: String(formData.get("client") ?? "") || undefined,
    duration: String(formData.get("duration") ?? "") || undefined,
    price: String(formData.get("price") ?? "") || undefined,
    featured: bool(formData.get("featured")),
    published: bool(formData.get("published")),
  });
  const slug = uniqueSlug(
    String(formData.get("slug") || parsed.title),
    db.projects.map((item) => item.slug).filter((item) => item !== currentSlug),
    currentSlug || undefined,
  );
  const gallery = parseLines(formData.get("images")).filter((src) => src !== parsed.cover);
  const project: Project = {
    ...parsed,
    slug,
    images: [parsed.cover, ...gallery],
  };
  await updateDatabase((current) => ({
    ...current,
    projects: currentSlug
      ? current.projects.map((item) => (item.slug === currentSlug ? project : item))
      : [project, ...current.projects],
  }));
  revalidateSite();
  redirect("/admin/projets");
}

export async function deleteProjectAction(slug: string) {
  await requireAdmin();
  await updateDatabase((current) => ({
    ...current,
    projects: current.projects.filter((item) => item.slug !== slug),
  }));
  revalidateSite();
}

export async function saveArticleAction(formData: FormData) {
  await requireAdmin();
  const db = await getDatabase();
  const currentSlug = String(formData.get("currentSlug") ?? "");
  const title = String(formData.get("title") ?? "");
  const content = parseLines(formData.get("content"));
  const slug = uniqueSlug(
    String(formData.get("slug") || title),
    db.articles.map((item) => item.slug).filter((item) => item !== currentSlug),
    currentSlug || undefined,
  );
  const article = {
    slug,
    title,
    excerpt: String(formData.get("excerpt") ?? ""),
    content: content.length ? content : [String(formData.get("excerpt") ?? "")],
    cover: String(formData.get("cover") ?? ""),
    category: String(formData.get("category") ?? "Architecture"),
    date: String(formData.get("date") ?? new Date().toISOString().slice(0, 10)),
    readingMinutes: Number(formData.get("readingMinutes") || 4),
    published: bool(formData.get("published")),
  };
  if (article.title.length < 2 || article.excerpt.length < 10 || !article.cover) {
    throw new Error("INVALID_ARTICLE");
  }
  await updateDatabase((current) => ({
    ...current,
    articles: currentSlug
      ? current.articles.map((item) => (item.slug === currentSlug ? article : item))
      : [article, ...current.articles],
  }));
  revalidateSite();
  redirect("/admin/actualites");
}

export async function deleteArticleAction(slug: string) {
  await requireAdmin();
  await updateDatabase((current) => ({
    ...current,
    articles: current.articles.filter((item) => item.slug !== slug),
  }));
  revalidateSite();
}

export async function saveServiceAction(formData: FormData) {
  await requireAdmin();
  const db = await getDatabase();
  const currentId = String(formData.get("currentId") ?? "");
  const title = String(formData.get("title") ?? "");
  const id = uniqueSlug(
    String(formData.get("id") || title),
    db.services.map((item) => item.id).filter((item) => item !== currentId),
    currentId || undefined,
  );
  const processSteps = parseLines(formData.get("process"));
  const service: ServiceItem = {
    id,
    title,
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    features: parseLines(formData.get("features")),
    process: processSteps.map((line) => {
      const [step, ...rest] = line.split("|");
      return { step: step.trim(), description: rest.join("|").trim() || step.trim() };
    }),
    image: String(formData.get("image") ?? ""),
  };
  await updateDatabase((current) => ({
    ...current,
    services: currentId
      ? current.services.map((item) => (item.id === currentId ? service : item))
      : [...current.services, service],
  }));
  revalidateSite();
  redirect("/admin/services");
}

export async function deleteServiceAction(id: string) {
  await requireAdmin();
  await updateDatabase((current) => ({
    ...current,
    services: current.services.filter((item) => item.id !== id),
  }));
  revalidateSite();
}

export async function saveTeamMemberAction(formData: FormData) {
  await requireAdmin();
  const db = await getDatabase();
  const currentId = String(formData.get("currentId") ?? "");
  const name = String(formData.get("name") ?? "");
  const department = teamDepartments.includes(
    String(formData.get("department")) as TeamMember["department"],
  )
    ? (String(formData.get("department")) as TeamMember["department"])
    : "architecture";
  const id = uniqueSlug(
    String(formData.get("id") || name),
    db.team.map((item) => item.id).filter((item) => item !== currentId),
    currentId || undefined,
  );
  const member: TeamMember = {
    id,
    name,
    role: String(formData.get("role") ?? ""),
    specialty: String(formData.get("specialty") ?? ""),
    image: String(formData.get("image") ?? ""),
    department,
  };
  await updateDatabase((current) => ({
    ...current,
    team: currentId
      ? current.team.map((item) => (item.id === currentId ? member : item))
      : [...current.team, member],
  }));
  revalidateSite();
  redirect("/admin/equipe");
}

export async function deleteTeamMemberAction(id: string) {
  await requireAdmin();
  await updateDatabase((current) => ({
    ...current,
    team: current.team.filter((item) => item.id !== id),
  }));
  revalidateSite();
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const phones = parseLines(formData.get("phones"));
  await updateDatabase((current) => ({
    ...current,
    settings: {
      ...current.settings,
      email: String(formData.get("email") ?? current.settings.email),
      phones: phones.length ? phones : current.settings.phones,
      whatsapp: String(formData.get("whatsapp") ?? current.settings.whatsapp).replace(/\D/g, ""),
      tagline: String(formData.get("tagline") ?? current.settings.tagline),
      mapsUrl: String(formData.get("mapsUrl") ?? current.settings.mapsUrl),
      mapsEmbed: String(formData.get("mapsEmbed") ?? current.settings.mapsEmbed),
      address: {
        street: String(formData.get("street") ?? current.settings.address.street),
        neighborhood: String(formData.get("neighborhood") ?? current.settings.address.neighborhood),
        commune: String(formData.get("commune") ?? current.settings.address.commune),
        city: String(formData.get("city") ?? current.settings.address.city),
        country: String(formData.get("country") ?? current.settings.address.country),
        full: String(formData.get("full") ?? current.settings.address.full),
      },
      hours: [
        { days: "Lundi — Vendredi", time: String(formData.get("hoursWeek") ?? "") },
        { days: "Samedi", time: String(formData.get("hoursSaturday") ?? "") },
        { days: "Dimanche", time: String(formData.get("hoursSunday") ?? "") },
      ],
      social: {
        facebook: String(formData.get("facebook") ?? ""),
        twitter: String(formData.get("twitter") ?? ""),
        linkedin: String(formData.get("linkedin") ?? ""),
        instagram: String(formData.get("instagram") ?? ""),
      },
    },
  }));
  revalidateSite();
  redirect("/admin/parametres?ok=1");
}

export async function saveCompanyAction(formData: FormData) {
  await requireAdmin();
  await updateDatabase((current) => ({
    ...current,
    company: {
      ...current.company,
      history: {
        title: String(formData.get("historyTitle") ?? current.company.history.title),
        lead: String(formData.get("historyLead") ?? current.company.history.lead),
        body: String(formData.get("historyBody") ?? current.company.history.body),
      },
      vision: String(formData.get("vision") ?? current.company.vision),
      mission: {
        lead: String(formData.get("missionLead") ?? current.company.mission.lead),
        items: parseLines(formData.get("missionItems")),
      },
      values: parseLines(formData.get("values")).map((line) => {
        const [name, ...rest] = line.split("|");
        return { name: name.trim(), description: rest.join("|").trim() };
      }),
      commitments: parseLines(formData.get("commitments")),
    },
  }));
  revalidateSite();
  redirect("/admin/cabinet?ok=1");
}

export async function saveUserAction(formData: FormData) {
  await requireAdmin();
  const currentId = String(formData.get("currentId") ?? "");
  const username = String(formData.get("username") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "admin") === "editor" ? "editor" : "admin";
  const active = bool(formData.get("active")) || !currentId;
  if (username.length < 3 || name.length < 2) {
    throw new Error("INVALID_USER");
  }
  const existing = await prisma.adminUser.findFirst({
    where: { username: { equals: username, mode: "insensitive" }, NOT: currentId ? { id: currentId } : undefined },
  });
  if (existing) {
    throw new Error("USERNAME_TAKEN");
  }
  if (currentId) {
    const data: { username: string; name: string; email: string | null; role: string; active: boolean; passwordHash?: string } = {
      username,
      name,
      email: email || null,
      role,
      active,
    };
    if (password.length >= 8) data.passwordHash = hashPassword(password);
    await prisma.adminUser.update({ where: { id: currentId }, data });
  } else {
    if (password.length < 8) throw new Error("WEAK_PASSWORD");
    await prisma.adminUser.create({
      data: {
        username,
        name,
        email: email || null,
        role,
        active: true,
        passwordHash: hashPassword(password),
      },
    });
  }
  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs");
}

export async function deleteUserAction(id: string) {
  const session = await requireAdmin();
  const users = await getUsers();
  const target = users.find((user) => user.id === id);
  if (!target) return;
  if (target.username === session.user) return;
  if (users.length <= 1) return;
  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/utilisateurs");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const currentId = String(formData.get("currentId") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return;
  const categories = await getCategories();
  if (currentId) {
    await prisma.category.update({ where: { id: currentId }, data: { label } });
  } else {
    const id = uniqueSlug(
      label,
      categories.map((item) => item.id),
    );
    await prisma.category.create({ data: { id, label, sortOrder: categories.length } });
  }
  revalidateSite();
  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  const used = await prisma.project.count({ where: { category: id } });
  if (used > 0) {
    return {
      ok: false as const,
      error: "Cette catégorie est utilisée par des projets. Réassignez-les d’abord.",
    };
  }
  await prisma.category.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

export async function saveHomeAction(formData: FormData) {
  await requireAdmin();
  const current = await getHome();
  const stats = [0, 1, 2, 3].map((index) => ({
    value: Number(formData.get(`statValue${index}`) || current.stats[index]?.value || 0),
    suffix: String(formData.get(`statSuffix${index}`) ?? current.stats[index]?.suffix ?? ""),
    label: String(formData.get(`statLabel${index}`) ?? current.stats[index]?.label ?? ""),
    description: String(formData.get(`statDescription${index}`) ?? current.stats[index]?.description ?? ""),
  }));
  const data = {
    ...defaultHome,
    ...current,
    heroBadge: String(formData.get("heroBadge") ?? current.heroBadge),
    heroTitle: String(formData.get("heroTitle") ?? current.heroTitle),
    heroAccent: String(formData.get("heroAccent") ?? current.heroAccent),
    heroSubtitle: String(formData.get("heroSubtitle") ?? current.heroSubtitle),
    heroLocation: String(formData.get("heroLocation") ?? current.heroLocation),
    heroImage: String(formData.get("heroImage") ?? current.heroImage),
    heroPrimaryLabel: String(formData.get("heroPrimaryLabel") ?? current.heroPrimaryLabel),
    heroSecondaryLabel: String(formData.get("heroSecondaryLabel") ?? current.heroSecondaryLabel),
    servicesEyebrow: String(formData.get("servicesEyebrow") ?? current.servicesEyebrow),
    servicesTitle: String(formData.get("servicesTitle") ?? current.servicesTitle),
    servicesIntro: String(formData.get("servicesIntro") ?? current.servicesIntro),
    projectsEyebrow: String(formData.get("projectsEyebrow") ?? current.projectsEyebrow),
    projectsTitle: String(formData.get("projectsTitle") ?? current.projectsTitle),
    projectsIntro: String(formData.get("projectsIntro") ?? current.projectsIntro),
    teamEyebrow: String(formData.get("teamEyebrow") ?? current.teamEyebrow),
    teamTitle: String(formData.get("teamTitle") ?? current.teamTitle),
    teamIntro: String(formData.get("teamIntro") ?? current.teamIntro),
    ctaEyebrow: String(formData.get("ctaEyebrow") ?? current.ctaEyebrow),
    ctaTitle: String(formData.get("ctaTitle") ?? current.ctaTitle),
    ctaText: String(formData.get("ctaText") ?? current.ctaText),
    ctaButton: String(formData.get("ctaButton") ?? current.ctaButton),
    ctaBenefits: parseLines(formData.get("ctaBenefits")),
    stats,
  };
  await prisma.homePage.upsert({
    where: { id: "default" },
    create: { id: "default", data: data as Prisma.InputJsonValue },
    update: { data: data as Prisma.InputJsonValue },
  });
  revalidateSite();
  redirect("/admin/accueil?ok=1");
}

export async function markApplicationReadAction(id: string) {
  await requireAdmin();
  await prisma.application.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/recrutement");
  revalidatePath("/admin");
}

export async function updateApplicationAction(id: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 8000);
  if (!isApplicationStatus(status)) {
    throw new Error("STATUT");
  }
  await prisma.application.update({
    where: { id },
    data: { status, notes },
  });
  revalidatePath("/admin/recrutement");
  revalidatePath(`/admin/recrutement/${id}`);
  revalidatePath("/admin");
}

export async function deleteApplicationAction(id: string) {
  await requireAdmin();
  const row = await prisma.application.findUnique({ where: { id } });
  if (row) {
    await deleteStoredFile(row.cvStoredName);
    await deleteStoredFile(row.idStoredName);
    await prisma.application.delete({ where: { id } });
  }
  revalidatePath("/admin/recrutement");
  revalidatePath("/admin");
  redirect("/admin/recrutement");
}
