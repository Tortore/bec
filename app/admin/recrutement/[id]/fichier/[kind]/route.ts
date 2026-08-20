import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/auth";
import { readStoredFile } from "@/lib/cms/cv-storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string; kind: string }> };

function contentDisposition(filename: string) {
  const ascii = filename.replace(/[^\x20-\x7E]+/g, "_") || "document";
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function GET(_request: Request, { params }: Props) {
  await requireAdmin();
  const { id, kind } = await params;
  if (kind !== "cv" && kind !== "identite") notFound();

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) notFound();

  const storedName = kind === "cv" ? application.cvStoredName : application.idStoredName;
  const fileName = kind === "cv" ? application.cvFileName : application.idFileName;
  const mimeType = kind === "cv" ? application.cvMimeType : application.idMimeType;
  if (!storedName || !fileName || !mimeType) notFound();

  const buffer = await readStoredFile(storedName);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": contentDisposition(fileName),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
