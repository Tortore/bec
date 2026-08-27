import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LogActions } from "@/components/admin/log-actions";
import { getAppLog } from "@/lib/cms/logs";
import {
  buildLogDiagnostic,
  formatLogDateTime,
  logLevelLabels,
  logSourceLabels,
} from "@/lib/cms/log-types";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const log = await getAppLog(id);
  return { title: log ? `Log · ${log.scopeLabel}` : "Log" };
}

export default async function AdminLogDetailPage({ params }: Props) {
  const { id } = await params;
  const log = await getAppLog(id);
  if (!log) notFound();
  const diagnostic = buildLogDiagnostic(log);
  const error = log.level === "error";

  return (
    <div>
      <Link
        href="/admin/logs"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-[#065b48]"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux logs
      </Link>

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className={cn("px-6 py-5 md:px-8", log.resolved ? "bg-slate-50" : error ? "bg-rose-50" : "bg-amber-50")}>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                error ? "bg-rose-600 text-white" : "bg-amber-500 text-white",
              )}
            >
              {logLevelLabels[log.level]}
            </span>
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
              {logSourceLabels[log.source]}
            </span>
            {log.resolved ? (
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Résolu
              </span>
            ) : (
              <span className="rounded-full bg-[#065b48] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                À traiter
              </span>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-[#065b48] md:text-3xl">{log.scopeLabel}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{log.message}</p>
        </div>

        <div className="grid gap-6 px-6 py-6 md:grid-cols-[1fr_220px] md:px-8">
          <dl className="grid gap-4 sm:grid-cols-2">
            <Item label="Nom" value={log.name} />
            <Item label="Portée technique" value={log.scope} />
            <Item label="Page" value={log.path || "—"} />
            <Item label="Occurrences" value={String(log.occurrences)} />
            <Item label="Première apparition" value={formatLogDateTime(log.firstSeenAt)} />
            <Item label="Dernière apparition" value={formatLogDateTime(log.lastSeenAt)} />
            <Item label="Requête" value={log.requestId || "—"} />
            <Item label="Digest" value={log.digest || "—"} />
          </dl>
          <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
            Récupérez le diagnostic pour le transmettre à un prestataire, puis marquez l’incident comme résolu une fois
            corrigé.
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-5 md:px-8">
          <LogActions log={log} />
        </div>
      </div>

      {Object.keys(log.meta).length > 0 ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-[#065b48]">Métadonnées</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(log.meta).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-slate-50 px-4 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{key}</dt>
                <dd className="mt-1 break-all text-sm text-slate-700">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-[#0f1c19] p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-semibold text-white">Diagnostic récupérable</h2>
          <p className="text-[11px] text-white/40">Texte brut, prêt à copier</p>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-black/30 p-4 text-[12px] leading-6 text-emerald-100/90">
          {diagnostic}
        </pre>
      </section>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 break-all text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}
