import { open, readFile, stat } from "node:fs/promises";
import nodePath from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const mimeTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

type RouteContext = { params: Promise<{ path: string[] }> };

async function resolveMedia(context: RouteContext) {
  const segments = (await context.params).path;
  if (!segments.length || segments.some((segment) => !segment || segment === "." || segment === "..")) {
    return null;
  }

  const uploadsRoot = nodePath.resolve(process.cwd(), "public", "uploads");
  const filePath = nodePath.resolve(uploadsRoot, ...segments);
  if (!filePath.startsWith(`${uploadsRoot}${nodePath.sep}`)) return null;

  const extension = nodePath.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension];
  if (!contentType) return null;

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return null;
    return { filePath, info, contentType };
  } catch {
    return null;
  }
}

function mediaHeaders(contentType: string, size: number) {
  return {
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Length": String(size),
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
  };
}

export async function HEAD(_request: Request, context: RouteContext) {
  const media = await resolveMedia(context);
  if (!media) return new NextResponse(null, { status: 404 });
  return new NextResponse(null, {
    status: 200,
    headers: mediaHeaders(media.contentType, media.info.size),
  });
}

export async function GET(request: Request, context: RouteContext) {
  const media = await resolveMedia(context);
  if (!media) return new NextResponse(null, { status: 404 });

  const range = request.headers.get("range");
  const match = range?.match(/^bytes=(\d+)-(\d*)$/);
  if (range && !match) {
    return new NextResponse(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${media.info.size}` },
    });
  }

  if (match) {
    const start = Number(match[1]);
    const requestedEnd = match[2] ? Number(match[2]) : media.info.size - 1;
    const end = Math.min(requestedEnd, media.info.size - 1);
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${media.info.size}` },
      });
    }

    const length = end - start + 1;
    const buffer = Buffer.alloc(length);
    const file = await open(media.filePath, "r");
    try {
      await file.read(buffer, 0, length, start);
    } finally {
      await file.close();
    }
    return new NextResponse(new Uint8Array(buffer), {
      status: 206,
      headers: {
        ...mediaHeaders(media.contentType, length),
        "Content-Range": `bytes ${start}-${end}/${media.info.size}`,
      },
    });
  }

  const buffer = await readFile(media.filePath);
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: mediaHeaders(media.contentType, media.info.size),
  });
}
