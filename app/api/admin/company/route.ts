import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/cms/auth";
import { CompanyFormError, saveCompanyForm } from "@/lib/cms/company-save";
import { logServerError, requestId } from "@/lib/server-log";
import { revalidatePath } from "next/cache";

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
    await saveCompanyForm(await request.formData());
    revalidatePath("/", "layout");
    revalidatePath("/a-propos");
    revalidatePath("/admin/cabinet");
    return NextResponse.json({ ok: true }, { headers: { "X-Request-Id": id } });
  } catch (error) {
    if (error instanceof CompanyFormError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "X-Request-Id": id } });
    }
    await logServerError("api.admin.company", error, { requestId: id });
    return NextResponse.json(
      { ok: false, error: "Une erreur technique empêche l’enregistrement. Réessayez dans un instant." },
      { status: 500, headers: { "X-Request-Id": id } },
    );
  }
}
