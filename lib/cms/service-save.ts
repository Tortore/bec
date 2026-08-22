import { Prisma } from "@prisma/client";
import { z } from "zod";
import { uniqueSlug } from "@/lib/cms/slug";
import { prisma } from "@/lib/prisma";

const mediaPath = z
  .string()
  .trim()
  .min(1, "Ajoutez une image pour le service.")
  .refine(
    (value) => value.startsWith("/") && !value.startsWith("//") && !value.includes(".."),
    "L’image sélectionnée n’est pas valide. Téléversez un fichier ou choisissez une photo déjà en ligne.",
  );

const serviceSchema = z.object({
  title: z.string().trim().min(2, "Le titre doit contenir au moins 2 caractères."),
  shortDescription: z.string().trim().min(10, "Le résumé doit contenir au moins 10 caractères."),
  description: z.string().trim().min(20, "La description doit contenir au moins 20 caractères."),
  image: mediaPath,
});

export class ServiceFormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServiceFormError";
  }
}

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseProcess(value: FormDataEntryValue | null) {
  return lines(value)
    .map((line) => {
      const [step, ...rest] = line.split("|");
      const name = step.trim();
      return { step: name, description: rest.join("|").trim() || name };
    })
    .filter((item) => item.step);
}

export async function saveServiceForm(formData: FormData) {
  const currentId = String(formData.get("currentId") ?? "").trim();
  const result = serviceSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
  });

  if (!result.success) {
    throw new ServiceFormError(result.error.issues[0]?.message ?? "Vérifiez les informations du service.");
  }

  const existing = await prisma.service.findMany({ select: { id: true, sortOrder: true } });
  if (currentId && !existing.some((item) => item.id === currentId)) {
    throw new ServiceFormError("Ce service n’existe plus. Rechargez la liste des services.");
  }

  const id = uniqueSlug(
    String(formData.get("id") || result.data.title),
    existing.map((item) => item.id).filter((item) => item !== currentId),
    currentId || undefined,
  );
  const current = currentId ? existing.find((item) => item.id === currentId) : undefined;
  const sortOrder =
    current?.sortOrder ?? (existing.length ? Math.max(...existing.map((item) => item.sortOrder)) + 1 : 0);

  const data = {
    title: result.data.title,
    shortDescription: result.data.shortDescription,
    description: result.data.description,
    features: lines(formData.get("features")),
    process: parseProcess(formData.get("process")) as Prisma.InputJsonValue,
    image: result.data.image,
    sortOrder,
  };

  await prisma.$transaction(async (tx) => {
    if (currentId && currentId !== id) {
      await tx.service.delete({ where: { id: currentId } });
    }
    await tx.service.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  });

  return { id, created: !currentId };
}
