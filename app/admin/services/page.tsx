import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { deleteServiceAction } from "@/lib/cms/actions";
import { getServices } from "@/lib/cms/queries";

export const metadata: Metadata = { title: "Services" };

type Props = { searchParams: Promise<{ ok?: string }> };

export default async function AdminServicesPage({ searchParams }: Props) {
  const services = await getServices();
  const saved = (await searchParams).ok === "1";
  return (
    <div>
      <AdminHeader
        title="Services"
        description="Les prestations affichées sur la page Services et l’accueil. Les titres du bandeau et de la méthode se modifient dans Pages."
        action={{ href: "/admin/services/nouveau", label: "Nouveau service" }}
      />
      <Link
        href="/admin/pages/services"
        className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#00af84]/25 bg-white px-5 py-4 text-sm shadow-sm transition hover:border-[#00af84]"
      >
        <span>
          <span className="font-semibold text-[#065b48]">Textes de la page Services</span>
          <span className="mt-0.5 block text-slate-500">Bandeau « Nos services », catalogue et méthode de travail.</span>
        </span>
        <span className="shrink-0 font-medium text-[#00af84]">Modifier</span>
      </Link>
      {saved ? (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Le service a bien été enregistré.
        </p>
      ) : null}
      <div className="grid gap-4">
        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Aucun service pour le moment.
          </div>
        ) : null}
        {services.map((service) => (
          <article key={service.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-[#065b48]">{service.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{service.shortDescription}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/services/${service.id}`} className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#065b48] hover:bg-slate-50">
                Modifier
              </Link>
              <ConfirmDelete
                message={`Supprimer « ${service.title} » ?`}
                action={deleteServiceAction.bind(null, service.id)}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
