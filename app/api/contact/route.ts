import { NextResponse } from "next/server";
import { z } from "zod";
import { contactSchema } from "@/lib/contact-schema";
import { updateMessages } from "@/lib/cms/store";
import { sendContactMail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

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

export async function POST(request: Request) {
  try {
    if (isRateLimited(clientKey(request))) {
      return NextResponse.json(
        { ok: false, error: "Trop de messages. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const data = await request.json();
    if (!data?.email || !data?.message) {
      return NextResponse.json({ ok: false, error: "Champs requis manquants" }, { status: 400 });
    }

    const parsed = contactSchema.parse(data);
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

    try {
      await sendContactMail(fields);
    } catch {
      // Le message reste enregistré même si l’e-mail SMTP échoue.
    }

    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return NextResponse.json({ ok: true, success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Champs requis manquants", issues: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
