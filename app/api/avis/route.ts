import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/review-schema";
import { logServerError, requestId } from "@/lib/server-log";
import { MemoryRateLimiter, requestClientKey } from "@/lib/rate-limit";

const limiter = new MemoryRateLimiter(3, 15 * 60 * 1000);

export async function POST(request: Request) {
  const id = requestId(request);
  try {
    if (limiter.isLimited(requestClientKey(request))) {
      return NextResponse.json(
        { ok: false, error: "Trop d’avis envoyés. Réessayez dans quelques minutes." },
        { status: 429, headers: { "Retry-After": "900", "X-Request-Id": id } },
      );
    }
    const parsed = reviewSchema.parse(await request.json());
    await prisma.review.create({
      data: {
        name: parsed.name,
        email: parsed.email.toLowerCase(),
        rating: parsed.rating,
        message: parsed.message,
      },
    });
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admin/messages");
    return NextResponse.json({ ok: true }, { headers: { "X-Request-Id": id } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: error.issues[0]?.message ?? "Vérifiez les informations." },
        { status: 400, headers: { "X-Request-Id": id } },
      );
    }
    await logServerError("api.reviews", error, { requestId: id });
    return NextResponse.json(
      { ok: false, error: "L’avis n’a pas pu être enregistré. Réessayez dans un instant." },
      { status: 500, headers: { "X-Request-Id": id } },
    );
  }
}
