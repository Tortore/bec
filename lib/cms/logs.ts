import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  type AppLogStats,
  type AppLogView,
  type LogLevel,
  type LogLevelFilter,
  type LogSource,
  type LogStatusFilter,
  logScopeLabel,
} from "@/lib/cms/log-types";

const RETENTION_DAYS = 120;
const MAX_MESSAGE = 2_000;
const MAX_STACK = 8_000;
const MAX_SCOPE = 80;
const MAX_PATH = 180;

export type PersistLogInput = {
  level: LogLevel;
  source: LogSource;
  scope: string;
  error?: unknown;
  name?: string;
  message?: string;
  stack?: string;
  path?: string;
  requestId?: string;
  digest?: string;
  meta?: Record<string, string | number | boolean | null | undefined>;
};

type SerializedError = { name: string; message: string; stack: string };

function clip(value: string, max: number) {
  return value
    .replace(/\b(postgresql?|mongodb(?:\+srv)?):\/\/[^@\s]+@/gi, "$1://***@")
    .replace(/((?:password|passwd|secret|token|authorization|cookie)\s*[:=]\s*)[^\s,;]+/gi, "$1***")
    .trim()
    .slice(0, max);
}

function serializeUnknown(error: unknown): SerializedError {
  if (error instanceof Error) {
    return {
      name: clip(error.name || "Error", 120) || "Error",
      message: clip(error.message || "Erreur inconnue", MAX_MESSAGE) || "Erreur inconnue",
      stack: clip(error.stack ?? "", MAX_STACK),
    };
  }
  if (error && typeof error === "object") {
    const record = error as { name?: unknown; message?: unknown; stack?: unknown };
    return {
      name: clip(String(record.name ?? "Error"), 120) || "Error",
      message: clip(String(record.message ?? "Erreur inconnue"), MAX_MESSAGE) || "Erreur inconnue",
      stack: clip(String(record.stack ?? ""), MAX_STACK),
    };
  }
  return { name: "Error", message: clip(String(error || "Erreur inconnue"), MAX_MESSAGE), stack: "" };
}

function compactMeta(meta: PersistLogInput["meta"] = {}) {
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (value === undefined) continue;
    const safeKey = clip(key, 40);
    if (!safeKey) continue;
    if (typeof value === "string") out[safeKey] = clip(value, 200);
    else out[safeKey] = value;
  }
  return out;
}

export function logFingerprint(input: { level: string; source: string; scope: string; name: string; message: string }) {
  return createHash("sha256")
    .update(`${input.level}|${input.source}|${input.scope}|${input.name}|${input.message}`)
    .digest("hex")
    .slice(0, 32);
}

function toView(row: {
  id: string;
  level: string;
  source: string;
  scope: string;
  name: string;
  message: string;
  stack: string;
  path: string;
  requestId: string;
  digest: string;
  meta: Prisma.JsonValue;
  occurrences: number;
  resolvedAt: Date | null;
  firstSeenAt: Date;
  lastSeenAt: Date;
}): AppLogView {
  const meta =
    row.meta && typeof row.meta === "object" && !Array.isArray(row.meta)
      ? (row.meta as Record<string, string | number | boolean | null>)
      : {};
  return {
    id: row.id,
    level: row.level === "warning" ? "warning" : "error",
    source: row.source === "admin" ? "admin" : row.source === "client" ? "client" : "server",
    scope: row.scope,
    scopeLabel: logScopeLabel(row.scope),
    name: row.name,
    message: row.message,
    stack: row.stack,
    path: row.path,
    requestId: row.requestId,
    digest: row.digest,
    meta,
    occurrences: row.occurrences,
    resolved: Boolean(row.resolvedAt),
    firstSeenAt: row.firstSeenAt.toISOString(),
    lastSeenAt: row.lastSeenAt.toISOString(),
  };
}

export async function persistAppLog(input: PersistLogInput) {
  try {
    const serialized = serializeUnknown(input.error ?? input.message ?? "Erreur inconnue");
    const name = clip(input.name || serialized.name, 120) || "Error";
    const message = clip(input.message || serialized.message, MAX_MESSAGE) || "Erreur inconnue";
    const stack = clip(input.stack || serialized.stack, MAX_STACK);
    const scope = clip(input.scope, MAX_SCOPE) || "app";
    const path = clip(input.path ?? "", MAX_PATH);
    const requestId = clip(input.requestId ?? "", 100);
    const digest = clip(input.digest ?? "", 80);
    const meta = compactMeta(input.meta);
    const fingerprint = logFingerprint({
      level: input.level,
      source: input.source,
      scope,
      name,
      message,
    });
    const now = new Date();

    await prisma.appLog.upsert({
      where: { fingerprint },
      create: {
        fingerprint,
        level: input.level,
        source: input.source,
        scope,
        name,
        message,
        stack,
        path,
        requestId,
        digest,
        meta: Object.keys(meta).length > 0 ? (meta as Prisma.InputJsonValue) : undefined,
        occurrences: 1,
        firstSeenAt: now,
        lastSeenAt: now,
      },
      update: {
        occurrences: { increment: 1 },
        lastSeenAt: now,
        resolvedAt: null,
        stack: stack || undefined,
        path: path || undefined,
        requestId: requestId || undefined,
        digest: digest || undefined,
        meta: Object.keys(meta).length > 0 ? (meta as Prisma.InputJsonValue) : undefined,
      },
    });

    if (Math.random() < 0.02) {
      const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000);
      await prisma.appLog.deleteMany({
        where: { lastSeenAt: { lt: cutoff }, resolvedAt: { not: null } },
      });
    }
  } catch {
    // Jamais relancer le logger ici : éviter une boucle si la base est indisponible.
  }
}

export async function getOpenLogsCount() {
  try {
    return prisma.appLog.count({ where: { resolvedAt: null, level: "error" } });
  } catch {
    return 0;
  }
}

export async function getLogStats(): Promise<AppLogStats> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    const [openErrors, openWarnings, last24h, resolved, total] = await Promise.all([
      prisma.appLog.count({ where: { resolvedAt: null, level: "error" } }),
      prisma.appLog.count({ where: { resolvedAt: null, level: "warning" } }),
      prisma.appLog.count({ where: { lastSeenAt: { gte: since } } }),
      prisma.appLog.count({ where: { resolvedAt: { not: null } } }),
      prisma.appLog.count(),
    ]);
    return { available: true, openErrors, openWarnings, last24h, resolved, total };
  } catch {
    return { available: false, openErrors: 0, openWarnings: 0, last24h: 0, resolved: 0, total: 0 };
  }
}

export async function getAppLogs(filters: {
  status: LogStatusFilter;
  level: LogLevelFilter;
  query?: string;
}) {
  try {
    const where: Prisma.AppLogWhereInput = {};
    if (filters.status === "ouverts") where.resolvedAt = null;
    if (filters.status === "resolus") where.resolvedAt = { not: null };
    if (filters.level !== "tous") where.level = filters.level;
    const query = filters.query?.trim();
    if (query) {
      where.OR = [
        { message: { contains: query, mode: "insensitive" } },
        { scope: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
        { path: { contains: query, mode: "insensitive" } },
      ];
    }
    const rows = await prisma.appLog.findMany({
      where,
      orderBy: { lastSeenAt: "desc" },
      take: 80,
    });
    return rows.map(toView);
  } catch {
    return [];
  }
}

export async function getAppLog(id: string) {
  try {
    const row = await prisma.appLog.findUnique({ where: { id } });
    return row ? toView(row) : null;
  } catch {
    return null;
  }
}
