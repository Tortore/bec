import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logServerError } from "@/lib/server-log";
import {
  type VisitPeriod,
  type VisitSeriesPoint,
  type VisitStats,
  visitPathLabel,
} from "@/lib/cms/visit-types";

export type { VisitPeriod, VisitSeriesPoint, VisitStats } from "@/lib/cms/visit-types";
export {
  VISIT_PERIODS,
  formatVisitNumber,
  parseVisitPeriod,
  visitPathLabel,
  visitPeriodLabels,
} from "@/lib/cms/visit-types";

const ZONE = "Africa/Lubumbashi";
const OFFSET = "+02:00";
const MAX_PATH = 180;
const RETENTION_DAYS = 400;

const BOT_UA =
  /bot|crawler|spider|crawling|preview|facebookexternalhit|facebot|whatsapp|telegram|slackbot|discordbot|linkedinbot|pinterest|applebot|bingbot|googlebot|yandex|baiduspider|duckduckbot|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|anthropic|perplexity|headless|phantom|puppeteer|playwright/i;

type CountRow = { views: number | bigint; uniques: number | bigint };
type PathRow = { path: string; views: number | bigint; uniques: number | bigint };
type ReferrerRow = { referrer: string; views: number | bigint };
type SeriesRow = { bucket: string; views: number | bigint; uniques: number | bigint };

function toInt(value: number | bigint | null | undefined) {
  if (typeof value === "bigint") return Number(value);
  return Number(value ?? 0);
}

function visitSecret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "bec-visit-hash-dev";
}

function zonedYmd(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function zonedYm(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
  }).format(date);
}

function addMonthsYm(ym: string, months: number) {
  const [year, month] = ym.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + months, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function startOfZonedDay(ymd: string) {
  return new Date(`${ymd}T00:00:00${OFFSET}`);
}

function startOfZonedMonth(ym: string) {
  return new Date(`${ym}-01T00:00:00${OFFSET}`);
}

function addDaysYmd(ymd: string, days: number) {
  return zonedYmd(new Date(startOfZonedDay(ymd).getTime() + days * 86_400_000));
}

function formatDayLabel(ymd: string) {
  const date = startOfZonedDay(ymd);
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatMonthLabel(ym: string) {
  const date = new Date(`${ym}-01T00:00:00${OFFSET}`);
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: ZONE,
    month: "short",
    year: "numeric",
  }).format(date);
}

export function isTrackablePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  if (path.length > MAX_PATH) return false;
  if (path.startsWith("/admin") || path.startsWith("/api") || path.startsWith("/_next")) return false;
  if (/\.[a-z0-9]{2,5}$/i.test(path)) return false;
  return true;
}

export function normalizeVisitPath(raw: string) {
  const path = raw.split("?")[0]?.split("#")[0]?.trim() || "/";
  if (!isTrackablePath(path)) return null;
  const cleaned = path.replace(/\/{2,}/g, "/");
  if (cleaned.length > 1 && cleaned.endsWith("/")) return cleaned.slice(0, -1);
  return cleaned;
}

export function normalizeReferrer(raw: string, origin?: string) {
  if (!raw.trim()) return "";
  try {
    const url = new URL(raw);
    if (origin && url.origin === origin) return "";
    return url.hostname.replace(/^www\./, "").slice(0, 80);
  } catch {
    return "";
  }
}

export function truncateIp(ip: string) {
  const value = ip.trim();
  if (!value || value === "unknown") return "unknown";
  if (value.includes(":")) {
    const parts = value.split(":").filter(Boolean);
    return parts.slice(0, 4).join(":");
  }
  const parts = value.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  return value.slice(0, 45);
}

export function visitorHash(ip: string, userAgent: string) {
  return createHash("sha256")
    .update(`${visitSecret()}|${truncateIp(ip)}|${userAgent.slice(0, 180)}`)
    .digest("hex")
    .slice(0, 32);
}

export function isBotUserAgent(userAgent: string) {
  return !userAgent || BOT_UA.test(userAgent);
}

function trendPct(current: number, previous: number): number | null {
  if (previous <= 0) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function periodBounds(period: VisitPeriod, now = new Date()) {
  const today = zonedYmd(now);
  const to = now;
  if (period === "aujourdhui") {
    return { from: startOfZonedDay(today), to, previousFrom: startOfZonedDay(addDaysYmd(today, -1)), previousTo: new Date(now.getTime() - 86_400_000) };
  }
  if (period === "7j") {
    const from = startOfZonedDay(addDaysYmd(today, -6));
    const span = to.getTime() - from.getTime();
    return { from, to, previousFrom: new Date(from.getTime() - span), previousTo: from };
  }
  if (period === "30j") {
    const from = startOfZonedDay(addDaysYmd(today, -29));
    const span = to.getTime() - from.getTime();
    return { from, to, previousFrom: new Date(from.getTime() - span), previousTo: from };
  }
  if (period === "12m") {
    const currentMonth = zonedYm(now);
    const from = startOfZonedMonth(addMonthsYm(currentMonth, -11));
    return {
      from,
      to,
      previousFrom: startOfZonedMonth(addMonthsYm(currentMonth, -23)),
      previousTo: from,
    };
  }
  return { from: new Date("2020-01-01T00:00:00.000Z"), to, previousFrom: null, previousTo: null };
}

function seriesMode(period: VisitPeriod): VisitStats["seriesMode"] {
  if (period === "aujourdhui") return "hour";
  if (period === "tout" || period === "12m") return "month";
  return "day";
}

function fillSeries(period: VisitPeriod, from: Date, to: Date, rows: SeriesRow[]): VisitSeriesPoint[] {
  const byKey = new Map(rows.map((row) => [row.bucket, { views: toInt(row.views), uniques: toInt(row.uniques) }]));
  const mode = seriesMode(period);
  const points: VisitSeriesPoint[] = [];

  if (mode === "hour") {
    for (let hour = 0; hour < 24; hour += 1) {
      const key = String(hour).padStart(2, "0");
      const current = byKey.get(key) ?? { views: 0, uniques: 0 };
      points.push({ key, label: `${key}h`, views: current.views, uniques: current.uniques });
    }
    return points;
  }

  if (mode === "month") {
    const end = zonedYm(to);
    let key = zonedYm(from);
    let guard = 0;
    while (key <= end && guard < 120) {
      const current = byKey.get(key) ?? { views: 0, uniques: 0 };
      points.push({ key, label: formatMonthLabel(key), views: current.views, uniques: current.uniques });
      key = addMonthsYm(key, 1);
      guard += 1;
    }
    if (points.length === 0) {
      const fallback = zonedYm(to);
      points.push({ key: fallback, label: formatMonthLabel(fallback), views: 0, uniques: 0 });
    }
    return points;
  }

  const start = zonedYmd(from);
  const end = zonedYmd(to);
  let ymd = start;
  while (ymd <= end) {
    const current = byKey.get(ymd) ?? { views: 0, uniques: 0 };
    points.push({ key: ymd, label: formatDayLabel(ymd), views: current.views, uniques: current.uniques });
    const next = addDaysYmd(ymd, 1);
    if (next === ymd) break;
    ymd = next;
  }
  return points;
}

function emptyStats(period: VisitPeriod, from: Date, to: Date): VisitStats {
  return {
    available: false,
    period,
    from: from.toISOString(),
    to: to.toISOString(),
    generatedAt: new Date().toISOString(),
    views: 0,
    uniques: 0,
    pagesPerVisitor: 0,
    previousViews: 0,
    previousUniques: 0,
    viewsTrend: 0,
    uniquesTrend: 0,
    peak: null,
    series: fillSeries(period, from, to, []),
    seriesMode: seriesMode(period),
    topPages: [],
    referrers: [],
  };
}

async function countRange(from: Date, to: Date): Promise<{ views: number; uniques: number }> {
  const rows = await prisma.$queryRaw<CountRow[]>(Prisma.sql`
    SELECT COUNT(*)::int AS views, COUNT(DISTINCT "visitorHash")::int AS uniques
    FROM "SiteVisit"
    WHERE "createdAt" >= (${from} AT TIME ZONE 'UTC')
      AND "createdAt" < (${to} AT TIME ZONE 'UTC')
  `);
  return { views: toInt(rows[0]?.views), uniques: toInt(rows[0]?.uniques) };
}

async function seriesRange(period: VisitPeriod, from: Date, to: Date) {
  const mode = seriesMode(period);
  if (mode === "hour") {
    return prisma.$queryRaw<SeriesRow[]>(Prisma.sql`
      SELECT to_char("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${ZONE}, 'HH24') AS bucket,
             COUNT(*)::int AS views,
             COUNT(DISTINCT "visitorHash")::int AS uniques
      FROM "SiteVisit"
      WHERE "createdAt" >= (${from} AT TIME ZONE 'UTC')
        AND "createdAt" < (${to} AT TIME ZONE 'UTC')
      GROUP BY 1
      ORDER BY 1
    `);
  }
  if (mode === "month") {
    return prisma.$queryRaw<SeriesRow[]>(Prisma.sql`
      SELECT to_char("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${ZONE}, 'YYYY-MM') AS bucket,
             COUNT(*)::int AS views,
             COUNT(DISTINCT "visitorHash")::int AS uniques
      FROM "SiteVisit"
      WHERE "createdAt" >= (${from} AT TIME ZONE 'UTC')
        AND "createdAt" < (${to} AT TIME ZONE 'UTC')
      GROUP BY 1
      ORDER BY 1
    `);
  }
  return prisma.$queryRaw<SeriesRow[]>(Prisma.sql`
    SELECT to_char("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${ZONE}, 'YYYY-MM-DD') AS bucket,
           COUNT(*)::int AS views,
           COUNT(DISTINCT "visitorHash")::int AS uniques
    FROM "SiteVisit"
    WHERE "createdAt" >= (${from} AT TIME ZONE 'UTC')
      AND "createdAt" < (${to} AT TIME ZONE 'UTC')
    GROUP BY 1
    ORDER BY 1
  `);
}

export async function recordVisit(input: { path: string; referrer: string; visitorHash: string }) {
  await prisma.siteVisit.create({
    data: {
      path: input.path,
      referrer: input.referrer,
      visitorHash: input.visitorHash,
    },
  });

  if (Math.random() < 0.02) {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000);
    await prisma.siteVisit.deleteMany({ where: { createdAt: { lt: cutoff } } });
  }
}

export async function getTodayVisitCount() {
  try {
    const today = startOfZonedDay(zonedYmd());
    return prisma.siteVisit.count({ where: { createdAt: { gte: today } } });
  } catch (error) {
    await logServerError("visits.today", error);
    return 0;
  }
}

export async function getVisitStats(period: VisitPeriod): Promise<VisitStats> {
  const bounds = periodBounds(period);
  try {
    if (period === "tout") {
      const first = await prisma.siteVisit.findFirst({
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });
      if (first) bounds.from = first.createdAt;
    }
    const [current, previous, seriesRows, pathRows, referrerRows] = await Promise.all([
      countRange(bounds.from, bounds.to),
      bounds.previousFrom && bounds.previousTo
        ? countRange(bounds.previousFrom, bounds.previousTo)
        : Promise.resolve({ views: 0, uniques: 0 }),
      seriesRange(period, bounds.from, bounds.to),
      prisma.$queryRaw<PathRow[]>(Prisma.sql`
        SELECT path, COUNT(*)::int AS views, COUNT(DISTINCT "visitorHash")::int AS uniques
        FROM "SiteVisit"
        WHERE "createdAt" >= (${bounds.from} AT TIME ZONE 'UTC')
          AND "createdAt" < (${bounds.to} AT TIME ZONE 'UTC')
        GROUP BY path
        ORDER BY views DESC
        LIMIT 8
      `),
      prisma.$queryRaw<ReferrerRow[]>(Prisma.sql`
        SELECT referrer, COUNT(*)::int AS views
        FROM "SiteVisit"
        WHERE "createdAt" >= (${bounds.from} AT TIME ZONE 'UTC')
          AND "createdAt" < (${bounds.to} AT TIME ZONE 'UTC')
        GROUP BY referrer
        ORDER BY views DESC
        LIMIT 8
      `),
    ]);

    const series = fillSeries(period, bounds.from, bounds.to, seriesRows);
    const peakPoint = series.reduce<VisitSeriesPoint | null>((best, point) => {
      if (!best || point.views > best.views) return point;
      return best;
    }, null);

    return {
      available: true,
      period,
      from: bounds.from.toISOString(),
      to: bounds.to.toISOString(),
      generatedAt: new Date().toISOString(),
      views: current.views,
      uniques: current.uniques,
      pagesPerVisitor: current.uniques > 0 ? Math.round((current.views / current.uniques) * 10) / 10 : 0,
      previousViews: previous.views,
      previousUniques: previous.uniques,
      viewsTrend: trendPct(current.views, previous.views),
      uniquesTrend: trendPct(current.uniques, previous.uniques),
      peak: peakPoint && peakPoint.views > 0 ? { label: peakPoint.label, views: peakPoint.views } : null,
      series,
      seriesMode: seriesMode(period),
      topPages: pathRows.map((row) => ({
        path: row.path,
        label: visitPathLabel(row.path),
        views: toInt(row.views),
        uniques: toInt(row.uniques),
        share: current.views > 0 ? toInt(row.views) / current.views : 0,
      })),
      referrers: referrerRows.map((row) => {
        const host = row.referrer?.trim() || "";
        return {
          host,
          label: host ? host : "Accès direct",
          views: toInt(row.views),
          share: current.views > 0 ? toInt(row.views) / current.views : 0,
        };
      }),
    };
  } catch (error) {
    await logServerError("visits.stats", error);
    return emptyStats(period, bounds.from, bounds.to);
  }
}
