import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { deleteApplicationAction } from "@/lib/cms/actions";
import { getApplications } from "@/lib/cms/queries";
import {
  applicationStatusClasses,
  applicationStatusLabels,
  applicationStatuses,
  isApplicationStatus,
} from "@/lib/recruitment";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Recrutement" };

type Props = { searchParams: Promise<{ statut?: string }> };

export default async function AdminRecruitmentPage({ searchParams }: Props) {
  const { statut } = await searchParams;
  const selected = statut && isApplicationStatus(statut) ? statut : "tous";
  const applications = await getApplications();
  const visible =
    selected === "tous" ? applications : applications.filter((item) => item.status === selected);
  const unread = applications.filter((item) => !item.read).length;

  return (
    <div>
      <AdminHeader
        title="Recrutement"
        description="Candidatures reçues depuis la page Carrières : identité, CV et pièces jointes."
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href="/admin/recrutement"
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium",
            selected === "tous" ? "bg-[#065b48] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200",
          )}
        >
          Toutes ({applications.length})
        </Link>
        {applicationStatuses.map((status) => {
          const count = applications.filter((item) => item.status === status).length;
          return (
            <Link
              key={status}
              href={`/admin/recrutement?statut=${status}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium",
                selected === status ? "bg-[#065b48] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200",
              )}
            >
              {applicationStatusLabels[status]} ({count})
            </Link>
          );
        })}
        {unread > 0 ? (
          <span className="ml-auto rounded-full bg-[#00af84]/15 px-3 py-1.5 text-xs font-semibold text-[#065b48]">
            {unread} non lu{unread > 1 ? "s" : ""}
          </span>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Aucune candidature pour le moment.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Candidat</th>
                <th className="hidden px-4 py-3 md:table-cell">Poste</th>
                <th className="hidden px-4 py-3 lg:table-cell">Ville</th>
                <th className="hidden px-4 py-3 lg:table-cell">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((application) => {
                const status = isApplicationStatus(application.status) ? application.status : "nouveau";
                return (
                  <tr key={application.id} className={application.read ? "" : "bg-[#00af84]/5"}>
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {application.firstName} {application.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{application.email}</p>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">{application.position}</td>
                    <td className="hidden px-4 py-3 lg:table-cell">{application.city}</td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {formatDate(application.createdAt.toISOString())}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-[11px] font-semibold",
                          applicationStatusClasses[status],
                        )}
                      >
                        {applicationStatusLabels[status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/recrutement/${application.id}`}
                        className="mr-2 font-medium text-[#065b48]"
                      >
                        Ouvrir
                      </Link>
                      <ConfirmDelete
                        message="Supprimer cette candidature et les fichiers associés ?"
                        action={deleteApplicationAction.bind(null, application.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
