import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Download, FileText, IdCard, Mail, Phone } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import {
  deleteApplicationAction,
  markApplicationReadAction,
  updateApplicationAction,
} from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/auth";
import { getApplication } from "@/lib/cms/queries";
import {
  applicationStatusClasses,
  applicationStatusLabels,
  applicationStatuses,
  formatFileSize,
  isApplicationStatus,
} from "@/lib/recruitment";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Candidature" };

export default async function AdminApplicationPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const application = await getApplication(id);
  if (!application) notFound();
  if (!application.read) await markApplicationReadAction(id);

  const status = isApplicationStatus(application.status) ? application.status : "nouveau";
  const fullName = `${application.firstName} ${application.lastName}`;

  return (
    <div>
      <AdminHeader
        title={fullName}
        description={`${application.position} · ${formatDate(application.createdAt.toISOString())}`}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                applicationStatusClasses[status],
              )}
            >
              {applicationStatusLabels[status]}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              {application.position}
            </span>
          </div>

          <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="text-slate-500">Nom</dt>
              <dd className="font-medium">{fullName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">E-mail</dt>
              <dd>
                <a className="inline-flex items-center gap-1 text-[#065b48] hover:underline" href={`mailto:${application.email}`}>
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  {application.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Téléphone</dt>
              <dd>
                <a className="inline-flex items-center gap-1 text-[#065b48] hover:underline" href={`tel:${application.phone.replace(/\s/g, "")}`}>
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {application.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Ville</dt>
              <dd className="font-medium">{application.city}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Expérience</dt>
              <dd className="font-medium">{application.experience}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Formation</dt>
              <dd className="font-medium">{application.education}</dd>
            </div>
          </dl>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Lettre de motivation
          </h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-700">{application.message}</p>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Pièces jointes
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <a
              href={`/admin/recrutement/${application.id}/fichier/cv`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-[#00af84]"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-medium text-[#065b48]">
                  <FileText className="h-4 w-4" aria-hidden />
                  Curriculum vitae
                </span>
                <span className="mt-1 block truncate text-xs text-slate-500">
                  {application.cvFileName} · {formatFileSize(application.cvSize)}
                </span>
              </span>
              <Download className="h-4 w-4 shrink-0 text-[#00af84]" aria-hidden />
            </a>
            {application.idStoredName && application.idFileName ? (
              <a
                href={`/admin/recrutement/${application.id}/fichier/identite`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-[#00af84]"
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-sm font-medium text-[#065b48]">
                    <IdCard className="h-4 w-4" aria-hidden />
                    Pièce d’identité
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {application.idFileName}
                    {application.idSize ? ` · ${formatFileSize(application.idSize)}` : ""}
                  </span>
                </span>
                <Download className="h-4 w-4 shrink-0 text-[#00af84]" aria-hidden />
              </a>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
                Aucune pièce d’identité jointe.
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`mailto:${application.email}?subject=${encodeURIComponent(`Candidature BEC — ${application.position}`)}`}
              className="rounded-xl bg-[#00af84] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#065b48]"
            >
              Répondre par e-mail
            </Link>
            <ConfirmDelete
              message="Supprimer cette candidature et les fichiers associés ?"
              action={deleteApplicationAction.bind(null, id)}
            />
          </div>
        </article>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-[#065b48]">Suivi du dossier</h2>
          <p className="mt-1 text-sm text-slate-500">
            Mettez à jour le statut et ajoutez une note interne.
          </p>
          <form action={updateApplicationAction.bind(null, id)} className="mt-5 space-y-4">
            <div>
              <label htmlFor="status" className="text-sm font-medium text-slate-700">
                Statut
              </label>
              <select
                id="status"
                name="status"
                defaultValue={status}
                className="mt-1.5 flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                {applicationStatuses.map((item) => (
                  <option key={item} value={item}>
                    {applicationStatusLabels[item]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="text-sm font-medium text-slate-700">
                Notes internes
              </label>
              <textarea
                id="notes"
                name="notes"
                defaultValue={application.notes}
                rows={8}
                className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Entretien prévu, impressions, suite à donner…"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#065b48] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#044a3a]"
            >
              Enregistrer le suivi
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
