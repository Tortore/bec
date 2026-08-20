import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { applicationFieldsSchema } from "@/lib/application-schema";
import { deleteStoredFile, readStoredFile, saveApplicationFile } from "@/lib/cms/cv-storage";
import { sendApplicationMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 60;

const windowMs = 15 * 60 * 1000;
const maxAttempts = 5;
const attempts = new Map<string, { count: number; until: number }>();

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (current && current.until > now && current.count >= maxAttempts) return true;
  if (!current || current.until <= now) {
    attempts.set(key, { count: 1, until: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > maxAttempts;
}

function asFile(value: FormDataEntryValue | null) {
  return value instanceof File && value.size > 0 ? value : null;
}

export async function POST(request: Request) {
  let cvStored: string | undefined;
  let idStored: string | undefined;

  try {
    if (isRateLimited(clientKey(request))) {
      return NextResponse.json(
        { ok: false, error: "Trop de candidatures. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const parsed = applicationFieldsSchema.parse({
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      city: String(formData.get("city") ?? ""),
      position: String(formData.get("position") ?? ""),
      experience: String(formData.get("experience") ?? ""),
      education: String(formData.get("education") ?? ""),
      message: String(formData.get("message") ?? ""),
      privacy: formData.get("privacy") === "true" || formData.get("privacy") === "on",
    });

    const cvFile = asFile(formData.get("cv"));
    if (!cvFile) {
      return NextResponse.json({ ok: false, error: "Joignez votre CV." }, { status: 400 });
    }

    const cv = await saveApplicationFile(cvFile, "cv");
    cvStored = cv.storedName;

    const idFile = asFile(formData.get("identityDoc"));
    const identity = idFile ? await saveApplicationFile(idFile, "id") : null;
    idStored = identity?.storedName;

    await prisma.application.create({
      data: {
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
        city: parsed.city,
        position: parsed.position,
        experience: parsed.experience,
        education: parsed.education,
        message: parsed.message,
        cvFileName: cv.fileName,
        cvStoredName: cv.storedName,
        cvMimeType: cv.mimeType,
        cvSize: cv.size,
        idFileName: identity?.fileName,
        idStoredName: identity?.storedName,
        idMimeType: identity?.mimeType,
        idSize: identity?.size,
      },
    });

    try {
      const cvBuffer = await readStoredFile(cv.storedName);
      const idBuffer = identity ? await readStoredFile(identity.storedName) : undefined;
      await sendApplicationMail({
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
        city: parsed.city,
        position: parsed.position,
        experience: parsed.experience,
        education: parsed.education,
        message: parsed.message,
        cvFileName: cv.fileName,
        cvBuffer,
        cvMimeType: cv.mimeType,
        idFileName: identity?.fileName,
        idBuffer,
        idMimeType: identity?.mimeType,
      });
    } catch {
      // La candidature reste enregistrée même si l’e-mail SMTP échoue.
    }

    revalidatePath("/admin/recrutement");
    revalidatePath("/admin");
    revalidatePath("/admin", "layout");
    return NextResponse.json({ ok: true, success: true });
  } catch (error) {
    await deleteStoredFile(cvStored);
    await deleteStoredFile(idStored);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Vérifiez les informations du formulaire.", issues: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof Error && error.message === "FORMAT") {
      return NextResponse.json(
        { ok: false, error: "Format de fichier non accepté. CV : PDF, Word, ODT, RTF. Pièce d’identité : PDF, JPG ou PNG." },
        { status: 400 },
      );
    }
    if (error instanceof Error && error.message === "SIZE") {
      return NextResponse.json(
        { ok: false, error: "Chaque fichier ne doit pas dépasser 8 Mo." },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
