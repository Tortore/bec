import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/cms/auth";
import { saveVideoUpload } from "@/lib/cms/media";
import { logServerError, requestId } from "@/lib/server-log";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const id = requestId(request);
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Votre session a expiré. Reconnectez-vous à l’administration." },
      { status: 401, headers: { "X-Request-Id": id } },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ ok: false, error: "Choisissez une vidéo." }, { status: 400, headers: { "X-Request-Id": id } });
    }

    const src = await saveVideoUpload(file);
    return NextResponse.json({ ok: true, src }, { headers: { "X-Request-Id": id } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "FORMAT") {
      return NextResponse.json(
        { ok: false, error: "Formats acceptés : MP4, WebM ou MOV." },
        { status: 415, headers: { "X-Request-Id": id } },
      );
    }
    if (code === "SIZE") {
      return NextResponse.json(
        { ok: false, error: "La vidéo ne doit pas dépasser 50 Mo." },
        { status: 413, headers: { "X-Request-Id": id } },
      );
    }
    logServerError("api.admin.videos", error, { requestId: id });
    return NextResponse.json(
      {
        ok: false,
        error: "Une erreur technique empêche l’enregistrement de la vidéo. Réessayez dans un instant.",
      },
      { status: 500, headers: { "X-Request-Id": id } },
    );
  }
}
