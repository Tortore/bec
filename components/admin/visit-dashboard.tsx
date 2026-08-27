import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Eye,
  Globe2,
  Minus,
  MousePointerClick,
  Sparkles,
  Users,
} from "lucide-react";
import { VisitChart } from "@/components/admin/visit-chart";
import {
  formatVisitNumber,
  visitPeriodLabels,
  VISIT_PERIODS,
  type VisitPeriod,
  type VisitStats,
} from "@/lib/cms/visit-types";
import { cn } from "@/lib/utils";

function Trend({ value }: { value: number | null }) {
  if (value == null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#00af84]/10 px-2 py-0.5 text-[11px] font-semibold text-[#065b48]">
        <Sparkles className="h-3 w-3" />
        Nouveau
      </span>
    );
  }
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
        <Minus className="h-3 w-3" />
        Stable
      </span>
    );
  }
  const up = value > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-semibold",
        up ? "text-emerald-600" : "text-rose-600",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {up ? "+" : ""}
      {value} %
    </span>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const w = 120;
  const h = 36;
  const d = values
    .map((value, index) => {
      const x = values.length === 1 ? w / 2 : (index / (values.length - 1)) * w;
      const y = h - (value / max) * (h - 4) - 2;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-[120px] text-[#00af84]" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function VisitDashboard({ stats }: { stats: VisitStats }) {
  const generated = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Lubumbashi",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(stats.generatedAt));
  const chartTitle =
    stats.seriesMode === "hour"
      ? "Répartition horaire"
      : stats.seriesMode === "month"
        ? "Évolution mensuelle"
        : "Évolution quotidienne";

  const kpis = [
    {
      label: "Visiteurs uniques",
      value: formatVisitNumber(stats.uniques),
      hint: "Personnes distinctes estimées",
      trend: stats.uniquesTrend,
      icon: Users,
    },
    {
      label: "Pages / visiteur",
      value: stats.pagesPerVisitor ? stats.pagesPerVisitor.toLocaleString("fr-FR") : "—",
      hint: "Profondeur de navigation",
      trend: null as number | null,
      icon: MousePointerClick,
      hideTrend: true,
    },
    {
      label: "Meilleur créneau",
      value: stats.peak ? formatVisitNumber(stats.peak.views) : "—",
      hint: stats.peak ? stats.peak.label : "Pas encore de pic",
      trend: null as number | null,
      icon: Clock3,
      hideTrend: true,
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#00af84]">Audience</p>
          <h1 className="mt-1 text-3xl font-semibold text-[#065b48]">Statistiques</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Fréquentation du site public, mesurée en interne sans cookie. Mis à jour à {generated} (Lubumbashi).
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          {VISIT_PERIODS.map((period) => (
            <PeriodLink key={period} period={period} current={stats.period} />
          ))}
        </div>
      </div>

      {!stats.available ? (
        <div role="alert" className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <p className="font-semibold">Les statistiques sont temporairement indisponibles.</p>
          <p className="mt-1 text-amber-800">
            Vérifiez la connexion à PostgreSQL et l’application de la migration, puis rechargez cette page.
          </p>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-3xl bg-[#044a3a] p-6 text-white shadow-xl shadow-[#044a3a]/15 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-white/60">Pages vues · {visitPeriodLabels[stats.period]}</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">{formatVisitNumber(stats.views)}</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-white/70">
              <TrendBadge value={stats.viewsTrend} />
              {stats.period !== "tout" ? <span>par rapport à la période précédente</span> : <span>depuis le lancement du suivi</span>}
            </div>
          </div>
          <div className="hidden sm:block">
            <Sparkline values={stats.series.map((point) => point.views)} />
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article key={kpi.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#065b48] text-white">
                  <Icon className="h-5 w-5" />
                </span>
                {kpi.hideTrend ? null : <Trend value={kpi.trend} />}
              </div>
              <p className="mt-4 text-3xl font-semibold text-[#065b48]">{kpi.value}</p>
              <p className="font-medium text-slate-800">{kpi.label}</p>
              <p className="text-xs text-slate-500">{kpi.hint}</p>
            </article>
          );
        })}
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#065b48]">{chartTitle}</h2>
            <p className="text-xs text-slate-500">Survolez le graphique pour le détail de chaque point.</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-full bg-[#00af84]" /> Pages vues
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0.5 w-4 border-t-2 border-dashed border-[#065b48]" /> Visiteurs
            </span>
          </div>
        </div>
        {stats.available && stats.views === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00af84]/10 text-[#065b48]">
              <Eye className="h-6 w-6" />
            </span>
            <p className="mt-4 font-medium text-[#065b48]">Aucune visite sur cette période</p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Les consultations du site public apparaîtront ici automatiquement, y compris la vôtre si vous ouvrez le site.
            </p>
          </div>
        ) : stats.available ? (
          <VisitChart points={stats.series} mode={stats.seriesMode} />
        ) : (
          <div className="py-16 text-center text-sm text-slate-500">
            Le graphique sera disponible dès que la connexion aux statistiques sera rétablie.
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-[#065b48]">Pages les plus consultées</h2>
          <p className="mt-1 text-xs text-slate-500">Classement des pages du site pour la période choisie.</p>
          {stats.topPages.length === 0 ? (
            <p className="mt-8 text-sm text-slate-500">Pas encore de pages à afficher.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {stats.topPages.map((page, index) => (
                <li key={page.path}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <p className="min-w-0 truncate font-medium text-slate-800">
                      <span className="mr-2 text-xs font-semibold text-slate-400">{index + 1}.</span>
                      {page.label}
                    </p>
                    <p className="shrink-0 tabular-nums text-slate-500">{formatVisitNumber(page.views)}</p>
                  </div>
                  <p className="mt-0.5 truncate pl-6 text-[11px] text-slate-400">{page.path}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#065b48] to-[#00af84]"
                      style={{ width: `${Math.max(page.share * 100, 3)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-[#065b48]">Provenance</h2>
          <p className="mt-1 text-xs text-slate-500">D’où arrivent les visiteurs (lien externe ou accès direct).</p>
          {stats.referrers.length === 0 ? (
            <p className="mt-8 text-sm text-slate-500">Aucune source enregistrée pour le moment.</p>
          ) : (
            <ul className="mt-5 divide-y divide-slate-100">
              {stats.referrers.map((item) => (
                <li key={item.host || "direct"} className="flex items-center gap-3 py-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-[#065b48]">
                    <Globe2 className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{item.label}</p>
                    <p className="text-[11px] text-slate-400">{Math.round(item.share * 100)} % du trafic</p>
                  </div>
                  <p className="tabular-nums text-sm font-semibold text-[#065b48]">{formatVisitNumber(item.views)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function PeriodLink({ period, current }: { period: VisitPeriod; current: VisitPeriod }) {
  const active = period === current;
  return (
    <Link
      href={period === "30j" ? "/admin/statistiques" : `/admin/statistiques?periode=${period}`}
      className={cn(
        "rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-[#065b48] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-[#065b48]",
      )}
    >
      {visitPeriodLabels[period]}
    </Link>
  );
}

function TrendBadge({ value }: { value: number | null }) {
  if (value == null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
        Première période
      </span>
    );
  }
  const up = value >= 0;
  const Icon = value === 0 ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        value === 0 ? "bg-white/10 text-white/80" : up ? "bg-emerald-400/20 text-emerald-100" : "bg-rose-400/20 text-rose-100",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {value > 0 ? "+" : ""}
      {value} %
    </span>
  );
}
