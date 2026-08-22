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

export function logServerError(scope: string, error: unknown, meta: LogMeta = {}) {
  console.error(
    JSON.stringify({
      level: "error",
      time: new Date().toISOString(),
      scope,
      ...meta,
      error: serializeError(error),
    }),
  );
}

export function logServerWarning(scope: string, error: unknown, meta: LogMeta = {}) {
  console.warn(
    JSON.stringify({
      level: "warn",
      time: new Date().toISOString(),
      scope,
      ...meta,
      error: serializeError(error),
    }),
  );
}
