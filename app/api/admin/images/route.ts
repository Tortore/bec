import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/cms/auth";
import { saveUpload } from "@/lib/cms/media";
import { logServerError, requestId } from "@/lib/server-log";

export const runtime = "nodejs";

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
      return NextResponse.json(
        { ok: false, error: "Choisissez une image." },
        { status: 400, headers: { "X-Request-Id": id } },
      );
    }
    const src = await saveUpload(file);
    revalidatePath("/admin/medias");
    return NextResponse.json({ ok: true, src }, { headers: { "X-Request-Id": id } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "FORMAT") {
      return NextResponse.json(
        { ok: false, error: "Formats acceptés : JPG, PNG, WEBP, AVIF ou GIF." },
        { status: 415, headers: { "X-Request-Id": id } },
      );
    }
    if (code === "SIZE") {
      return NextResponse.json(
        { ok: false, error: "L’image ne doit pas dépasser 8 Mo." },
        { status: 413, headers: { "X-Request-Id": id } },
      );
    }
    logServerError("api.admin.images", error, { requestId: id });
    return NextResponse.json(
      { ok: false, error: "Une erreur technique empêche l’enregistrement de l’image." },
      { status: 500, headers: { "X-Request-Id": id } },
    );
  }
}
