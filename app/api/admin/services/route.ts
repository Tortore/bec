import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/cms/auth";
import { saveServiceForm, ServiceFormError } from "@/lib/cms/service-save";
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
    const result = await saveServiceForm(await request.formData());
    revalidatePath("/", "layout");
    revalidatePath("/services");
    revalidatePath("/admin/services");
    return NextResponse.json({ ok: true, ...result }, { headers: { "X-Request-Id": id } });
  } catch (error) {
    if (error instanceof ServiceFormError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "X-Request-Id": id } });
    }
    await logServerError("api.admin.services", error, { requestId: id });
    return NextResponse.json(
      { ok: false, error: "Une erreur technique empêche l’enregistrement. Réessayez dans un instant." },
      { status: 500, headers: { "X-Request-Id": id } },
    );
  }
}
