import { NextResponse } from "next/server";
import { getPublicContentVersion } from "@/lib/cms/public-content-version";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const version = await getPublicContentVersion();
    return NextResponse.json(
      { version },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    return NextResponse.json(
      { version: null },
      { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
