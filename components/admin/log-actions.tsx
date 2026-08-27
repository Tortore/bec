"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  RotateCcw,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  deleteAppLogAction,
  purgeResolvedLogsAction,
  reopenAppLogAction,
  resolveAppLogAction,
  resolveAllLogsAction,
} from "@/lib/cms/actions";
import {
  buildLogDiagnostic,
  formatLogRelative,
  logLevelLabels,
  logSourceLabels,
  type AppLogView,
} from "@/lib/cms/log-types";
import { cn } from "@/lib/utils";

export function LogActions({
  log,
  compact = false,
}: {
  log: AppLogView;
  compact?: boolean;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState<"resolve" | "reopen" | "delete" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState("");

  function diagnostic() {
    return buildLogDiagnostic(log);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(diagnostic());
      setCopied(true);
      setActionError("");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      setActionError("La copie a échoué. Utilisez Télécharger.");
    }
  }

  function download() {
    const blob = new Blob([diagnostic()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bec-log-${log.id.slice(0, 8)}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  async function run(kind: "resolve" | "reopen" | "delete", action: () => Promise<void>) {
    setPending(kind);
    setActionError("");
    try {
      await action();
      if (kind === "delete") router.push("/admin/logs");
      router.refresh();
    } catch (caught) {
      const digest =
        caught && typeof caught === "object" && "digest" in caught ? String(caught.digest) : "";
      if (digest.startsWith("NEXT_REDIRECT")) throw caught;
      setActionError("L’action n’a pas abouti. Rechargez la page puis réessayez.");
    } finally {
      setPending(null);
      setConfirmDelete(false);
    }
  }

  const btn = compact
    ? "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition"
    : "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={copy} className={cn(btn, "bg-[#065b48] text-white hover:bg-[#044a3a]")}>
        <Copy className="h-3.5 w-3.5" />
        {copied ? "Copié" : "Récupérer"}
      </button>
      <button
        type="button"
        onClick={download}
        className={cn(btn, "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}
      >
        <Download className="h-3.5 w-3.5" />
        {compact ? "Fichier" : "Télécharger"}
      </button>
      {log.resolved ? (
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("reopen", () => reopenAppLogAction(log.id))}
          className={cn(btn, "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50")}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {pending === "reopen" ? "…" : "Rouvrir"}
        </button>
      ) : (
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("resolve", () => resolveAppLogAction(log.id))}
          className={cn(btn, "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50")}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {pending === "resolve" ? "…" : "Résoudre"}
        </button>
      )}
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => setConfirmDelete(true)}
        className={cn(btn, "text-red-600 hover:bg-red-50 disabled:opacity-50")}
        aria-label="Supprimer"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {compact ? "" : "Supprimer"}
      </button>
      <ConfirmDialog
        open={confirmDelete}
        title="Supprimer ce log ?"
        description="Le diagnostic sera définitivement retiré du journal. Cette action ne peut pas être annulée."
        confirmLabel="Supprimer"
        pending={pending === "delete"}
        onCancel={() => {
          if (pending !== "delete") setConfirmDelete(false);
        }}
        onConfirm={() => run("delete", () => deleteAppLogAction(log.id))}
      />
      {actionError ? (
        <p role="alert" className="basis-full text-xs text-red-600">
          {actionError}
        </p>
      ) : null}
    </div>
  );
}

export function LogCard({ log, generatedAt }: { log: AppLogView; generatedAt: string }) {
  const error = log.level === "error";
  return (
    <article
      className={cn(
        "rounded-2xl border bg-white shadow-sm transition hover:shadow-md",
        log.resolved ? "border-slate-200" : error ? "border-rose-200" : "border-amber-200",
      )}
    >
      <div className="flex gap-0">
        <div className={cn("w-1.5 shrink-0 rounded-l-2xl", log.resolved ? "bg-slate-200" : error ? "bg-rose-500" : "bg-amber-400")} />
        <div className="min-w-0 flex-1 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    error ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800",
                  )}
                >
                  {error ? <ShieldAlert className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  {logLevelLabels[log.level]}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {logSourceLabels[log.source]}
                </span>
                {log.occurrences > 1 ? (
                  <span className="rounded-full bg-[#00af84]/12 px-2 py-0.5 text-[11px] font-semibold text-[#065b48]">
                    {log.occurrences} fois
                  </span>
                ) : null}
                {log.resolved ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    Résolu
                  </span>
                ) : null}
              </div>
              <h3 className="mt-2 truncate text-sm font-semibold text-[#065b48]">{log.scopeLabel}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{log.message}</p>
              <p className="mt-2 text-[11px] text-slate-400">
                {formatLogRelative(log.lastSeenAt, generatedAt)}
                {log.path ? ` · ${log.path}` : ""}
                {log.name && log.name !== "Error" ? ` · ${log.name}` : ""}
              </p>
            </div>
            <Link
              href={`/admin/logs/${log.id}`}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[#065b48] hover:text-[#00af84]"
            >
              Détail <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4">
            <LogActions log={log} compact />
          </div>
        </div>
      </div>
    </article>
  );
}

export function LogBulkActions({
  openTotal,
  resolvedTotal,
}: {
  openTotal: number;
  resolvedTotal: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<"resolve" | "purge" | null>(null);
  const [confirmPurge, setConfirmPurge] = useState(false);
  const [error, setError] = useState("");

  async function run(kind: "resolve" | "purge", action: () => Promise<void>) {
    setPending(kind);
    setError("");
    try {
      await action();
      setConfirmPurge(false);
      router.refresh();
    } catch {
      setError("L’action n’a pas abouti. Rechargez la page puis réessayez.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={openTotal === 0 || pending !== null}
        onClick={() => run("resolve", resolveAllLogsAction)}
        className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#065b48] hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending === "resolve" ? "Résolution…" : "Tout résoudre"}
      </button>
      <button
        type="button"
        disabled={resolvedTotal === 0 || pending !== null}
        onClick={() => setConfirmPurge(true)}
        className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Purger les résolus
      </button>
      <ConfirmDialog
        open={confirmPurge}
        title="Purger tous les logs résolus ?"
        description={`${resolvedTotal} diagnostic${resolvedTotal > 1 ? "s seront définitivement supprimés" : " sera définitivement supprimé"}. Cette action ne peut pas être annulée.`}
        confirmLabel="Purger"
        pending={pending === "purge"}
        pendingLabel="Purge…"
        onCancel={() => {
          if (pending !== "purge") setConfirmPurge(false);
        }}
        onConfirm={() => run("purge", purgeResolvedLogsAction)}
      />
      {error ? (
        <p role="alert" className="basis-full text-xs text-rose-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}
