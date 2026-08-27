import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { LogBulkActions, LogCard } from "@/components/admin/log-actions";
import {
  formatLogDateTime,
  logLevelLabels,
  logStatusLabels,
  LOG_LEVEL_FILTERS,
  LOG_STATUSES,
  type AppLogStats,
  type AppLogView,
  type LogLevelFilter,
  type LogStatusFilter,
} from "@/lib/cms/log-types";
import { cn } from "@/lib/utils";

function hrefFor(status: LogStatusFilter, level: LogLevelFilter, query: string) {
  const params = new URLSearchParams();
  if (status !== "ouverts") params.set("statut", status);
  if (level !== "tous") params.set("niveau", level);
  if (query) params.set("q", query);
  const encoded = params.toString();
  return encoded ? `/admin/logs?${encoded}` : "/admin/logs";
}

export function LogsDashboard({
  logs,
  stats,
  status,
  level,
  query,
  generatedAt,
}: {
  logs: AppLogView[];
  stats: AppLogStats;
  status: LogStatusFilter;
  level: LogLevelFilter;
  query: string;
  generatedAt: string;
}) {
  const openTotal = stats.openErrors + stats.openWarnings;
  const kpis = [
    {
      label: "Erreurs ouvertes",
      value: stats.openErrors,
      hint: "À traiter en priorité",
      icon: ShieldAlert,
      tone: "rose" as const,
    },
    {
      label: "Avertissements",
      value: stats.openWarnings,
      hint: "Signaux non bloquants",
      icon: AlertTriangle,
      tone: "amber" as const,
    },
    {
      label: "Dernières 24 h",
      value: stats.last24h,
      hint: "Nouveaux ou réapparus",
      icon: Clock3,
      tone: "brand" as const,
    },
    {
      label: "Résolus",
      value: stats.resolved,
      hint: "Incidents clôturés",
      icon: CheckCircle2,
      tone: "emerald" as const,
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#00af84]">Supervision</p>
          <h1 className="mt-1 text-3xl font-semibold text-[#065b48]">Logs</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Journal des erreurs du site et de l’administration. Récupérez le diagnostic, marquez comme résolu, ou
            rouvrez un incident.
          </p>
        </div>
        <p className="text-xs text-slate-400">Mis à jour à {formatLogDateTime(generatedAt)}</p>
      </div>

      {!stats.available ? (
        <div role="alert" className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <p className="font-semibold">Le journal est temporairement indisponible.</p>
          <p className="mt-1 text-amber-800">
            Vérifiez PostgreSQL et la migration des logs, puis rechargez cette page.
          </p>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-3xl bg-[#1b2a27] p-6 text-white shadow-xl shadow-[#1b2a27]/15 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-white/55">Incidents ouverts</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">{openTotal}</p>
            <p className="mt-3 max-w-md text-sm text-white/65">
              {openTotal === 0
                ? "Aucun incident en cours. Le journal reste disponible pour l’historique."
                : `${stats.openErrors} erreur${stats.openErrors > 1 ? "s" : ""} et ${stats.openWarnings} avertissement${stats.openWarnings > 1 ? "s" : ""} à parcourir.`}
            </p>
          </div>
          <LogBulkActions openTotal={openTotal} resolvedTotal={stats.resolved} />
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const tones = {
            rose: "bg-rose-50 text-rose-700",
            amber: "bg-amber-50 text-amber-800",
            brand: "bg-[#065b48] text-white",
            emerald: "bg-emerald-50 text-emerald-700",
          };
          return (
            <article key={kpi.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", tones[kpi.tone])}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-3xl font-semibold text-[#065b48]">{kpi.value}</p>
              <p className="font-medium text-slate-800">{kpi.label}</p>
              <p className="text-xs text-slate-500">{kpi.hint}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          {LOG_STATUSES.map((item) => (
            <Link
              key={item}
              href={hrefFor(item, level, query)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
                status === item ? "bg-[#065b48] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50",
              )}
            >
              {logStatusLabels[item]}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {LOG_LEVEL_FILTERS.map((item) => (
            <Link
              key={item}
              href={hrefFor(status, item, query)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold",
                level === item ? "bg-[#00af84]/15 text-[#065b48]" : "bg-white text-slate-500 ring-1 ring-slate-200",
              )}
            >
              {logLevelLabels[item]}
            </Link>
          ))}
        </div>
      </div>

      <form action="/admin/logs" method="get" className="mt-4 flex gap-2">
        {status !== "ouverts" ? <input type="hidden" name="statut" value={status} /> : null}
        {level !== "tous" ? <input type="hidden" name="niveau" value={level} /> : null}
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Rechercher un message, une page ou une portée…"
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-[#00af84] focus:ring-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-2xl bg-[#065b48] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#044a3a]"
        >
          Filtrer
        </button>
      </form>

      <section className="mt-6 space-y-3">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00af84]/10 text-[#065b48]">
              <Sparkles className="h-6 w-6" />
            </span>
            <p className="mt-4 font-medium text-[#065b48]">
              {query ? "Aucun résultat pour cette recherche" : "Rien à signaler sur ce filtre"}
            </p>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Les erreurs du site, des formulaires et de l’administration apparaîtront ici. Vous pourrez ensuite
              récupérer le diagnostic complet.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <LogCard key={log.id} log={log} generatedAt={generatedAt} />
          ))
        )}
      </section>
    </div>
  );
}
