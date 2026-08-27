import { NextResponse } from "next/server";
import { z } from "zod";
import { contactSchema } from "@/lib/contact-schema";
import { sendContactMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logServerError, logServerWarning, requestId } from "@/lib/server-log";
import { MemoryRateLimiter, requestClientKey } from "@/lib/rate-limit";

const limiter = new MemoryRateLimiter(5, 15 * 60 * 1000);

export async function POST(request: Request) {
  const id = requestId(request);
  try {
    if (limiter.isLimited(requestClientKey(request))) {
      return NextResponse.json(
        { ok: false, error: "Trop de messages. Réessayez dans quelques minutes." },
        { status: 429, headers: { "Retry-After": "900", "X-Request-Id": id } },
      );
    }

    const data = await request.json();
    if (!data?.email || !data?.message) {
      return NextResponse.json({ ok: false, error: "Renseignez votre e-mail et votre message." }, { status: 400, headers: { "X-Request-Id": id } });
    }

    const parsed = contactSchema.parse(data);
    const fields = {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      subject: parsed.subject,
      message: parsed.message,
    };

    await prisma.contactMessage.create({
      data: {
        ...fields,
        phone: fields.phone || null,
        read: false,
      },
    });

    try {
      await sendContactMail(fields);
    } catch (error) {
      // Le message reste enregistré même si l’e-mail SMTP échoue.
      await logServerWarning("api.contact.email", error, { requestId: id });
    }

    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return NextResponse.json({ ok: true, success: true }, { headers: { "X-Request-Id": id } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: error.issues[0]?.message ?? "Vérifiez les informations du formulaire.", issues: error.issues },
        { status: 400, headers: { "X-Request-Id": id } },
      );
    }
    await logServerError("api.contact", error, { requestId: id });
    return NextResponse.json(
      { ok: false, error: "Le message n’a pas pu être enregistré. Réessayez dans un instant." },
      { status: 500, headers: { "X-Request-Id": id } },
    );
  }
}
