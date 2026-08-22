import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { applicationFieldsSchema } from "@/lib/application-schema";
import { deleteStoredFile, readStoredFile, saveApplicationFile } from "@/lib/cms/cv-storage";
import { sendApplicationMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { logServerError, logServerWarning, requestId } from "@/lib/server-log";
import { MemoryRateLimiter, requestClientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const limiter = new MemoryRateLimiter(process.env.NODE_ENV === "development" ? 40 : 5, 15 * 60 * 1000);

function asFile(value: FormDataEntryValue | null) {
  return value instanceof File && value.size > 0 ? value : null;
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Utilisez POST pour envoyer une candidature." }, { status: 405 });
}

export async function POST(request: Request) {
  const id = requestId(request);
  let cvStored: string | undefined;
  let idStored: string | undefined;
  let applicationCreated = false;

  try {
    if (limiter.isLimited(requestClientKey(request))) {
      return NextResponse.json(
        { ok: false, error: "Trop de candidatures. Réessayez dans quelques minutes." },
        { status: 429, headers: { "Retry-After": "900", "X-Request-Id": id } },
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Le dossier est trop volumineux. Chaque fichier doit rester sous 8 Mo." },
        { status: 413, headers: { "X-Request-Id": id } },
      );
    }
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
      return NextResponse.json({ ok: false, error: "Joignez votre CV." }, { status: 400, headers: { "X-Request-Id": id } });
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
    applicationCreated = true;

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
    } catch (error) {
      // La candidature reste enregistrée même si l’e-mail SMTP échoue.
      logServerWarning("api.recruitment.email", error, { requestId: id });
    }

    revalidatePath("/admin/recrutement");
    revalidatePath("/admin");
    revalidatePath("/admin", "layout");
    return NextResponse.json({ ok: true, success: true }, { headers: { "X-Request-Id": id } });
  } catch (error) {
    // Une fois la ligne créée, ses fichiers lui appartiennent. On ne les efface
    // plus si une opération secondaire (notification ou revalidation) échoue.
    if (!applicationCreated) {
      const cleanup = await Promise.allSettled([deleteStoredFile(cvStored), deleteStoredFile(idStored)]);
      for (const result of cleanup) {
        if (result.status === "rejected") {
          logServerWarning("api.recruitment.cleanup", result.reason, { requestId: id });
        }
      }
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.issues[0]?.message ?? "Vérifiez les informations du formulaire.",
          issues: error.issues,
        },
        { status: 400, headers: { "X-Request-Id": id } },
      );
    }
    if (error instanceof Error && error.message === "FORMAT") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Format de fichier non accepté. CV : PDF, Word, ODT ou RTF. Pièce d’identité : PDF, JPG, PNG ou WEBP.",
        },
        { status: 415, headers: { "X-Request-Id": id } },
      );
    }
    if (error instanceof Error && error.message === "SIZE") {
      return NextResponse.json(
        { ok: false, error: "Chaque fichier ne doit pas dépasser 8 Mo." },
        { status: 413, headers: { "X-Request-Id": id } },
      );
    }
    logServerError("api.recruitment", error, { requestId: id });
    const prismaCode = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (prismaCode.startsWith("P")) {
      return NextResponse.json(
        { ok: false, error: "La base de données n’a pas pu enregistrer la candidature. Réessayez." },
        { status: 500, headers: { "X-Request-Id": id } },
      );
    }
    return NextResponse.json(
      { ok: false, error: "La candidature n’a pas pu être enregistrée. Réessayez dans un instant." },
      { status: 500, headers: { "X-Request-Id": id } },
    );
  }
}
