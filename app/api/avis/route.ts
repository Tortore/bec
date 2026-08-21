import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/review-schema";

const windowMs = 15 * 60 * 1000;
const maxAttempts = 3;
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
        { ok: false, error: "Trop d’avis envoyés. Réessayez dans quelques minutes." },
        { status: 429 },
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
    revalidatePath("/admin/avis");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: error.issues[0]?.message ?? "Vérifiez les informations." },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: false, error: "Impossible d’enregistrer l’avis." }, { status: 500 });
  }
}
