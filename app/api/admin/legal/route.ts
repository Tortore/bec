import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/cms/auth";
import { LegalFormError, saveLegalPage } from "@/lib/cms/legal";
import { legalPagesMeta } from "@/data/legal";
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
    await saveLegalPage(await request.formData());
    revalidatePath("/", "layout");
    revalidatePath("/admin/legal");
    for (const page of legalPagesMeta) {
      revalidatePath(page.path);
      revalidatePath(`/admin/legal/${page.slug}`);
    }
    return NextResponse.json({ ok: true }, { headers: { "X-Request-Id": id } });
  } catch (error) {
    if (error instanceof LegalFormError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "X-Request-Id": id } });
    }
    await logServerError("api.admin.legal", error, { requestId: id });
    return NextResponse.json(
      { ok: false, error: "Une erreur technique empêche l’enregistrement. Réessayez dans un instant." },
      { status: 500, headers: { "X-Request-Id": id } },
    );
  }
}
