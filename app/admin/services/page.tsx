import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { deleteServiceAction } from "@/lib/cms/actions";
import { getServices } from "@/lib/cms/queries";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await getServices();
  return (
    <div>
      <AdminHeader
        title="Services"
        description="Les prestations affichées sur la page Services et l’accueil."
        action={{ href: "/admin/services/nouveau", label: "Nouveau service" }}
      />
      <div className="grid gap-4">
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
