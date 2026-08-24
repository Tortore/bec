import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { CompanyForm } from "@/components/admin/company-form";
import { AdminFormError } from "@/components/admin/form-error";
import { getCompany } from "@/lib/cms/queries";
import { listMedia } from "@/lib/cms/media";

export const metadata: Metadata = { title: "Cabinet" };

export default async function AdminCompanyPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const [company, media] = await Promise.all([getCompany(), listMedia()]);
  const query = await searchParams;
  const saved = query.ok === "1";
  return (
    <div>
      <AdminHeader
        title="Cabinet"
        description="Toute la page À propos : bannière, histoire, vision, valeurs, chronologie, équipe et engagements."
      />
      {saved ? (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Textes du cabinet enregistrés.
        </p>
      ) : null}
      <AdminFormError code={query.error} />
      <CompanyForm company={company} media={media} />
    </div>
  );
}
