import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { getLegalPages } from "@/lib/cms/legal";
import { legalPagesMeta } from "@/data/legal";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Pages légales" };

export default async function AdminLegalPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const pages = await getLegalPages();
  const saved = (await searchParams).ok === "1";
  return (
    <div>
      <AdminHeader
        title="Pages légales"
        description="Mentions légales, confidentialité, cookies et conditions d’utilisation affichées en pied de site."
      />
      {saved ? (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Page légale enregistrée.
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {legalPagesMeta.map((item) => {
          const document = pages[item.key];
          return (
            <Link
              key={item.slug}
              href={`/admin/legal/${item.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-lg font-semibold text-[#065b48]">{item.label}</p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{document.intro}</p>
              <p className="mt-4 text-xs text-slate-400">Mise à jour le {formatDate(document.updatedAt)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
