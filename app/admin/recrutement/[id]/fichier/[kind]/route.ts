import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/auth";
import { resolveStoredFile } from "@/lib/cms/cv-storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string; kind: string }> };

function contentDisposition(filename: string, inline: boolean) {
  const ascii = filename.replace(/[^\x20-\x7E]+/g, "_") || "document";
  const mode = inline ? "inline" : "attachment";
  return `${mode}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

function fileStream(filePath: string, signal: AbortSignal) {
  let nodeStream: ReturnType<typeof createReadStream> | undefined;
  let settled = false;

  return new ReadableStream<Uint8Array>({
    start(controller) {
      nodeStream = createReadStream(filePath);
      const abort = () => {
        if (settled) return;
        settled = true;
        nodeStream?.destroy();
      };
      signal.addEventListener("abort", abort, { once: true });
      nodeStream.on("data", (chunk) => {
        if (!settled) controller.enqueue(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      });
      nodeStream.on("end", () => {
        if (settled) return;
        settled = true;
        signal.removeEventListener("abort", abort);
        controller.close();
      });
      nodeStream.on("error", (error) => {
        if (settled) return;
        settled = true;
        signal.removeEventListener("abort", abort);
        controller.error(error);
      });
    },
    cancel() {
      if (settled) return;
      settled = true;
      nodeStream?.destroy();
    },
  });
}

export async function GET(request: Request, { params }: Props) {
  try {
    await requireAdmin();
  } catch {
    return new NextResponse("Connexion administrateur requise.", {
      status: 401,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "private, no-store" },
    });
  }

  const { id, kind } = await params;
  if (kind !== "cv" && kind !== "identite") notFound();

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) notFound();

  const storedName = kind === "cv" ? application.cvStoredName : application.idStoredName;
  const fileName = kind === "cv" ? application.cvFileName : application.idFileName;
  const mimeType = kind === "cv" ? application.cvMimeType : application.idMimeType;
  if (!storedName || !fileName || !mimeType) notFound();

  let filePath: string;
  try {
    filePath = resolveStoredFile(storedName);
  } catch {
    notFound();
  }

  let size = 0;
  try {
    const info = await stat(filePath);
    if (!info.isFile()) notFound();
    size = info.size;
  } catch {
    return new NextResponse("Fichier introuvable sur le serveur.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "private, no-store" },
    });
  }

  const inline = new URL(request.url).searchParams.get("inline") === "1";

  return new NextResponse(fileStream(filePath, request.signal), {
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(size),
      "Content-Disposition": contentDisposition(fileName, inline),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
