export const VISIT_PERIODS = ["aujourdhui", "7j", "30j", "12m", "tout"] as const;
export type VisitPeriod = (typeof VISIT_PERIODS)[number];

export const visitPeriodLabels: Record<VisitPeriod, string> = {
  aujourdhui: "Aujourd’hui",
  "7j": "7 jours",
  "30j": "30 jours",
  "12m": "12 mois",
  tout: "Depuis le début",
};

export type VisitSeriesPoint = {
  key: string;
  label: string;
  views: number;
  uniques: number;
};

export type VisitStats = {
  available: boolean;
  period: VisitPeriod;
  from: string;
  to: string;
  generatedAt: string;
  views: number;
  uniques: number;
  pagesPerVisitor: number;
  previousViews: number;
  previousUniques: number;
  viewsTrend: number | null;
  uniquesTrend: number | null;
  peak: { label: string; views: number } | null;
  series: VisitSeriesPoint[];
  seriesMode: "hour" | "day" | "month";
  topPages: { path: string; label: string; views: number; uniques: number; share: number }[];
  referrers: { host: string; label: string; views: number; share: number }[];
};

const PAGE_LABELS: Record<string, string> = {
  "/": "Accueil",
  "/projets": "Projets",
  "/services": "Services",
  "/a-propos": "À propos",
  "/contact": "Contact",
  "/carrieres": "Recrutement",
  "/cookies": "Cookies",
  "/mentions-legales": "Mentions légales",
  "/confidentialite": "Confidentialité",
  "/conditions-utilisation": "Conditions d’utilisation",
};

export function parseVisitPeriod(value: string | undefined): VisitPeriod {
  return VISIT_PERIODS.includes(value as VisitPeriod) ? (value as VisitPeriod) : "30j";
}

export function visitPathLabel(path: string) {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  if (path.startsWith("/projets/")) return "Fiche projet";
  if (path.startsWith("/services/")) return "Fiche service";
  return path;
}

export function formatVisitNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}
