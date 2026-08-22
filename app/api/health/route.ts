import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logServerError, requestId } from "@/lib/server-log";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const id = requestId(request);
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { ok: true, database: "available" },
      { headers: { "Cache-Control": "no-store", "X-Request-Id": id } },
    );
  } catch (error) {
    logServerError("api.health", error, { requestId: id });
    return NextResponse.json(
      { ok: false, database: "unavailable", error: "Service temporairement indisponible." },
      { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "30", "X-Request-Id": id } },
    );
  }
}
