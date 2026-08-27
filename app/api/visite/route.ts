import { NextResponse } from "next/server";
import { MemoryRateLimiter, requestClientKey } from "@/lib/rate-limit";
import {
  isBotUserAgent,
  normalizeReferrer,
  normalizeVisitPath,
  recordVisit,
  visitorHash,
} from "@/lib/cms/visits";
import { siteUrl } from "@/lib/env";
import { logServerError } from "@/lib/server-log";

const limiter = new MemoryRateLimiter(40, 60 * 1000);

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (isBotUserAgent(userAgent)) {
      return new NextResponse(null, { status: 204 });
    }

    const body = await readBody(request);
    if (typeof body.path !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const path = normalizeVisitPath(body.path);
    if (!path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ip = requestClientKey(request);
    if (limiter.isLimited(`${ip}:${path}`)) {
      return new NextResponse(null, { status: 204 });
    }

    const origin = request.headers.get("origin") || siteUrl;
    await recordVisit({
      path,
      referrer: normalizeReferrer(typeof body.referrer === "string" ? body.referrer : "", origin),
      visitorHash: visitorHash(ip, userAgent),
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    await logServerError("api.visite", error);
    return new NextResponse(null, { status: 204 });
  }
}

async function readBody(request: Request) {
  try {
    return (await request.json()) as { path?: string; referrer?: string };
  } catch {
    return {};
  }
}
