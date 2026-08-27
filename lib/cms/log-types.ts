export const LOG_LEVELS = ["error", "warning"] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export const LOG_SOURCES = ["server", "client", "admin"] as const;
export type LogSource = (typeof LOG_SOURCES)[number];

export const LOG_STATUSES = ["ouverts", "resolus", "tous"] as const;
export type LogStatusFilter = (typeof LOG_STATUSES)[number];

export const LOG_LEVEL_FILTERS = ["tous", "error", "warning"] as const;
export type LogLevelFilter = (typeof LOG_LEVEL_FILTERS)[number];

export type AppLogView = {
  id: string;
  level: LogLevel;
  source: LogSource;
  scope: string;
  scopeLabel: string;
  name: string;
  message: string;
  stack: string;
  path: string;
  requestId: string;
  digest: string;
  meta: Record<string, string | number | boolean | null>;
  occurrences: number;
  resolved: boolean;
  firstSeenAt: string;
  lastSeenAt: string;
};

export type AppLogStats = {
  available: boolean;
  openErrors: number;
  openWarnings: number;
  last24h: number;
  resolved: number;
  total: number;
};

const SCOPE_LABELS: Record<string, string> = {
  "api.contact": "Formulaire de contact",
  "api.contact.email": "E-mail de contact",
  "api.recruitment": "Candidature",
  "api.recruitment.email": "E-mail de candidature",
  "api.recruitment.cleanup": "Nettoyage candidature",
  "api.reviews": "Avis",
  "api.health": "Santé du service",
  "api.visite": "Suivi des visites",
  "api.admin.images": "Médias — images",
  "api.admin.videos": "Médias — vidéos",
  "api.admin.projects": "Projets",
  "api.admin.services": "Services",
  "api.admin.company": "Cabinet",
  "api.admin.legal": "Pages légales",
  "admin.company.save": "Enregistrement cabinet",
  "admin.recruitment.cleanup": "Nettoyage recrutement",
  "visits.today": "Compteur de visites",
  "visits.stats": "Statistiques de visites",
  "client.page": "Page publique",
  "client.admin": "Administration",
};

export const logStatusLabels: Record<LogStatusFilter, string> = {
  ouverts: "À traiter",
  resolus: "Résolus",
  tous: "Tous",
};

export const logLevelLabels: Record<LogLevel | "tous", string> = {
  tous: "Tous niveaux",
  error: "Erreurs",
  warning: "Avertissements",
};

export const logSourceLabels: Record<LogSource, string> = {
  server: "Serveur",
  client: "Site public",
  admin: "Administration",
};

export function parseLogStatus(value: string | undefined): LogStatusFilter {
  return LOG_STATUSES.includes(value as LogStatusFilter) ? (value as LogStatusFilter) : "ouverts";
}

export function parseLogLevelFilter(value: string | undefined): LogLevelFilter {
  return LOG_LEVEL_FILTERS.includes(value as LogLevelFilter) ? (value as LogLevelFilter) : "tous";
}

export function logScopeLabel(scope: string) {
  return SCOPE_LABELS[scope] ?? scope.replace(/\./g, " · ");
}

export function formatLogDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Lubumbashi",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatLogRelative(iso: string, nowIso?: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const now = nowIso ? new Date(nowIso).getTime() : Date.now();
  const diff = Math.max(0, now - date.getTime());
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "À l’instant";
  if (diff < hour) {
    const n = Math.floor(diff / minute);
    return `Il y a ${n} min`;
  }
  if (diff < day) {
    const n = Math.floor(diff / hour);
    return n === 1 ? "Il y a 1 h" : `Il y a ${n} h`;
  }
  if (diff < 7 * day) {
    const n = Math.floor(diff / day);
    return n === 1 ? "Hier" : `Il y a ${n} j`;
  }
  return formatLogDateTime(iso);
}

export function buildLogDiagnostic(log: AppLogView) {
  const meta =
    Object.keys(log.meta).length > 0 ? `\nMétadonnées : ${JSON.stringify(log.meta, null, 2)}` : "";
  return [
    `BEC — diagnostic ${log.level === "error" ? "erreur" : "avertissement"}`,
    `Identifiant : ${log.id}`,
    `Niveau : ${log.level}`,
    `Source : ${logSourceLabels[log.source]}`,
    `Portée : ${log.scopeLabel} (${log.scope})`,
    `Nom : ${log.name}`,
    `Message : ${log.message}`,
    log.path ? `Page : ${log.path}` : null,
    log.requestId ? `Requête : ${log.requestId}` : null,
    log.digest ? `Digest : ${log.digest}` : null,
    `Occurrences : ${log.occurrences}`,
    `Première fois : ${formatLogDateTime(log.firstSeenAt)}`,
    `Dernière fois : ${formatLogDateTime(log.lastSeenAt)}`,
    `Statut : ${log.resolved ? "Résolu" : "À traiter"}`,
    meta.trim() || null,
    log.stack ? `\nPile d’exécution\n${log.stack}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
