import { createReadStream } from "node:fs";
import { open, stat } from "node:fs/promises";
import { Readable } from "node:stream";
import nodePath from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const mimeTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".m4v": "video/mp4",
  ".mov": "video/quicktime",
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
    return { filePath, info, contentType, isVideo: contentType.startsWith("video/") };
  } catch {
    return null;
  }
}

function mediaHeaders(contentType: string, size: number, extra?: Record<string, string>) {
  const isVideo = contentType.startsWith("video/");
  return {
    "Accept-Ranges": "bytes",
    "Cache-Control": isVideo ? "public, max-age=86400, no-transform" : "public, max-age=31536000, immutable",
    "Content-Length": String(size),
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
    ...extra,
  };
}

function notFound() {
  return new NextResponse(null, { status: 404, headers: { "Cache-Control": "no-store" } });
}

function fileStream(filePath: string, start: number, end: number) {
  const nodeStream = createReadStream(filePath, { start, end });
  return Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
}

export async function HEAD(_request: Request, context: RouteContext) {
  const media = await resolveMedia(context);
  if (!media) return notFound();
  return new NextResponse(null, {
    status: 200,
    headers: mediaHeaders(media.contentType, media.info.size),
  });
}

export async function GET(request: Request, context: RouteContext) {
  const media = await resolveMedia(context);
  if (!media) return notFound();

  const size = media.info.size;
  const range = request.headers.get("range");
  const match = range?.match(/^bytes=(\d+)-(\d*)$/);
  if (range && !match) {
    return new NextResponse(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}`, "Cache-Control": "no-store" },
    });
  }

  if (match) {
    const start = Number(match[1]);
    const requestedEnd = match[2] ? Number(match[2]) : size - 1;
    const end = Math.min(requestedEnd, size - 1);
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}`, "Cache-Control": "no-store" },
      });
    }

    const length = end - start + 1;
    return new NextResponse(fileStream(media.filePath, start, end), {
      status: 206,
      headers: mediaHeaders(media.contentType, length, {
        "Content-Range": `bytes ${start}-${end}/${size}`,
      }),
    });
  }

  if (media.isVideo) {
    return new NextResponse(fileStream(media.filePath, 0, size - 1), {
      status: 200,
      headers: mediaHeaders(media.contentType, size),
    });
  }

  const file = await open(media.filePath, "r");
  try {
    const buffer = Buffer.alloc(size);
    await file.read(buffer, 0, size, 0);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: mediaHeaders(media.contentType, size),
    });
  } finally {
    await file.close();
  }
}
