import type { Metadata } from "next";
import { LogsDashboard } from "@/components/admin/logs-dashboard";
import { getAppLogs, getLogStats } from "@/lib/cms/logs";
import { parseLogLevelFilter, parseLogStatus } from "@/lib/cms/log-types";

export const metadata: Metadata = { title: "Logs" };

type Props = { searchParams: Promise<{ statut?: string; niveau?: string; q?: string }> };

export default async function AdminLogsPage({ searchParams }: Props) {
  const query = await searchParams;
  const status = parseLogStatus(query.statut);
  const level = parseLogLevelFilter(query.niveau);
  const search = (query.q ?? "").trim().slice(0, 80);
  const [logs, stats] = await Promise.all([getAppLogs({ status, level, query: search }), getLogStats()]);

  return (
    <LogsDashboard
      logs={logs}
      stats={stats}
      status={status}
      level={level}
      query={search}
      generatedAt={new Date().toISOString()}
    />
  );
}
