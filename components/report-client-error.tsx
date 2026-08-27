"use client";

import { useEffect } from "react";

const recoverableModuleErrors = [
  /Cannot read properties of undefined \(reading ['"]call['"]\)/i,
  /module factory is not available/i,
  /ChunkLoadError/i,
  /Loading chunk .+ failed/i,
  /Failed to fetch dynamically imported module/i,
];

function scheduleRuntimeRecovery(error: Error) {
  const diagnostic = `${error.name}\n${error.message}\n${error.stack ?? ""}`;
  if (!recoverableModuleErrors.some((pattern) => pattern.test(diagnostic))) return;

  const runtimeVersion = diagnostic.match(/webpack\.js\?v=\d+/)?.[0] ?? error.message;
  const key = `bec:runtime-recovery:${window.location.pathname}:${runtimeVersion}`.slice(0, 240);
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, String(Date.now()));
  } catch {
    // Le stockage peut être indisponible en navigation privée : la page d'erreur reste utilisable.
    return;
  }

  window.setTimeout(() => window.location.reload(), 400);
}

export function ReportClientError({
  error,
  source,
}: {
  error: Error & { digest?: string };
  source: "client" | "admin";
}) {
  useEffect(() => {
    scheduleRuntimeRecovery(error);
    const payload = JSON.stringify({
      name: error.name,
      message: error.message || "Erreur d’affichage",
      stack: error.stack?.slice(0, 8000),
      digest: error.digest,
      path: window.location.pathname.slice(0, 180),
      source,
    });
    const blob = new Blob([payload], { type: "application/json" });
    if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon("/api/logs", blob)) {
      return;
    }
    void fetch("/api/logs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, [error, source]);

  return null;
}
