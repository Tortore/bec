import { persistAppLog } from "@/lib/cms/logs";

type LogMeta = Record<string, string | number | boolean | null | undefined>;

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };
  }
  return { name: "UnknownError", message: String(error) };
}

export function requestId(request?: Request) {
  return request?.headers.get("x-request-id")?.slice(0, 100) || crypto.randomUUID();
}

function consolePayload(level: "error" | "warn", scope: string, error: unknown, meta: LogMeta) {
  return {
    level,
    time: new Date().toISOString(),
    scope,
    ...meta,
    error: serializeError(error),
  };
}

export function logServerError(scope: string, error: unknown, meta: LogMeta = {}) {
  console.error(JSON.stringify(consolePayload("error", scope, error, meta)));
  return persistAppLog({
    level: "error",
    source: "server",
    scope,
    error,
    requestId: typeof meta.requestId === "string" ? meta.requestId : undefined,
    path: typeof meta.path === "string" ? meta.path : undefined,
    meta,
  });
}

export function logServerWarning(scope: string, error: unknown, meta: LogMeta = {}) {
  console.warn(JSON.stringify(consolePayload("warn", scope, error, meta)));
  return persistAppLog({
    level: "warning",
    source: "server",
    scope,
    error,
    requestId: typeof meta.requestId === "string" ? meta.requestId : undefined,
    path: typeof meta.path === "string" ? meta.path : undefined,
    meta,
  });
}
