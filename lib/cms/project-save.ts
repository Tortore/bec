import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/cms/slug";

const mediaPath = z
  .string()
  .trim()
  .min(1, "Choisissez une image principale.")
  .refine(
    (value) => value.startsWith("/") && !value.startsWith("//") && !value.includes(".."),
    "L’image principale sélectionnée n’est pas valide.",
  );

const projectSchema = z.object({
  title: z.string().trim().min(2, "Le titre doit contenir au moins 2 caractères."),
  subtitle: z.string().trim().min(2, "Le sous-titre doit contenir au moins 2 caractères."),
  category: z.string().trim().min(1, "Choisissez une catégorie."),
  city: z.string().trim().min(2, "Indiquez la ville du projet."),
  country: z.string().trim().min(2, "Indiquez le pays du projet."),
  year: z.coerce
    .number()
    .int("L’année doit être un nombre entier.")
    .min(1990, "L’année doit être supérieure ou égale à 1990.")
    .max(2100, "L’année doit être inférieure ou égale à 2100."),
  cover: mediaPath,
  excerpt: z.string().trim().min(10, "Le texte de présentation doit contenir au moins 10 caractères."),
  description: z.string().trim().min(20, "La description doit contenir au moins 20 caractères."),
});

export class ProjectFormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectFormError";
  }
}

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function enabled(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

function optional(value: FormDataEntryValue | null) {
  return String(value ?? "").trim() || null;
}

export async function saveProjectForm(formData: FormData) {
  const currentSlug = String(formData.get("currentSlug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const submittedExcerpt = String(formData.get("excerpt") ?? "").trim();
  const result = projectSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    category: String(formData.get("category") ?? ""),
    city: String(formData.get("city") ?? ""),
    country: String(formData.get("country") || "RDC"),
    year: String(formData.get("year") ?? ""),
    cover: String(formData.get("cover") ?? ""),
    excerpt: submittedExcerpt || description.slice(0, 220),
    description,
  });

  if (!result.success) {
    throw new ProjectFormError(result.error.issues[0]?.message ?? "Vérifiez les informations du projet.");
  }

  const categoryExists = await prisma.category.count({ where: { id: result.data.category } });
  if (!categoryExists) throw new ProjectFormError("La catégorie sélectionnée n’existe plus.");

  const existing = await prisma.project.findMany({ select: { slug: true, sortOrder: true } });
  if (currentSlug && !existing.some((item) => item.slug === currentSlug)) {
    throw new ProjectFormError("Ce projet n’existe plus. Rechargez la liste des projets.");
  }

  const slug = uniqueSlug(
    String(formData.get("slug") || result.data.title),
    existing.map((item) => item.slug).filter((item) => item !== currentSlug),
    currentSlug || undefined,
  );
  const gallery = lines(formData.get("images")).filter(
    (src) => src.startsWith("/") && !src.startsWith("//") && !src.includes("..") && src !== result.data.cover,
  );
  const current = currentSlug ? existing.find((item) => item.slug === currentSlug) : undefined;
  const sortOrder = current?.sortOrder ?? (existing.length ? Math.max(...existing.map((item) => item.sortOrder)) + 1 : 0);
  const data = {
    title: result.data.title,
    subtitle: result.data.subtitle,
    category: result.data.category,
    city: result.data.city,
    country: result.data.country,
    year: result.data.year,
    cover: result.data.cover,
    images: [result.data.cover, ...gallery],
    excerpt: result.data.excerpt,
    description: result.data.description,
    features: lines(formData.get("features")),
    materials: lines(formData.get("materials")),
    area: optional(formData.get("area")),
    client: optional(formData.get("client")),
    duration: optional(formData.get("duration")),
    price: optional(formData.get("price")),
    featured: enabled(formData.get("featured")),
    published: enabled(formData.get("published")),
    sortOrder,
  };

  await prisma.$transaction(async (tx) => {
    if (currentSlug && currentSlug !== slug) {
      await tx.project.delete({ where: { slug: currentSlug } });
    }
    await tx.project.upsert({
      where: { slug },
      create: { slug, ...data },
      update: data,
    });
  });

  return { slug, created: !currentSlug };
}
