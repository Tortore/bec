import { NextResponse } from "next/server";
import { z } from "zod";
import { persistAppLog } from "@/lib/cms/logs";
import { getAdminSession } from "@/lib/cms/auth";
import { MemoryRateLimiter, requestClientKey } from "@/lib/rate-limit";

const limiter = new MemoryRateLimiter(10, 5 * 60 * 1000);

const payloadSchema = z.object({
  name: z.string().max(120).optional(),
  message: z.string().min(1).max(2000),
  stack: z.string().max(8000).optional(),
  digest: z.string().max(80).optional(),
  path: z.string().max(180).optional(),
  source: z.enum(["client", "admin"]).optional(),
});

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return new NextResponse(null, { status: 204 });
    }

    const ip = requestClientKey(request);
    if (limiter.isLimited(ip)) {
      return new NextResponse(null, { status: 204 });
    }

    const parsed = payloadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const source = parsed.data.source === "admin" ? "admin" : "client";
    if (source === "admin" && !(await getAdminSession())) {
      return new NextResponse(null, { status: 204 });
    }
    await persistAppLog({
      level: "error",
      source,
      scope: source === "admin" ? "client.admin" : "client.page",
      name: parsed.data.name,
      message: parsed.data.message,
      stack: parsed.data.stack,
      digest: parsed.data.digest,
      path: parsed.data.path,
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "")
      .split(",")[0]
      .trim();
    const protocol = (request.headers.get("x-forwarded-proto") || new URL(request.url).protocol)
      .split(",")[0]
      .trim()
      .replace(/:$/, "");
    return Boolean(host) && new URL(origin).origin === `${protocol}://${host}`;
  } catch {
    return false;
  }
}
