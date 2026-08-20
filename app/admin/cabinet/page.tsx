import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { CompanyForm } from "@/components/admin/company-form";
import { getCompany } from "@/lib/cms/queries";

export const metadata: Metadata = { title: "Cabinet" };

export default async function AdminCompanyPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const company = await getCompany();
  const saved = (await searchParams).ok === "1";
  return (
    <div>
      <AdminHeader
        title="Cabinet"
        description="Textes de la page À propos : histoire, vision, mission, valeurs et engagements."
      />
      {saved ? (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Textes du cabinet enregistrés.
        </p>
      ) : null}
      <CompanyForm company={company} />
    </div>
  );
}
