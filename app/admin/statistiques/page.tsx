import type { Metadata } from "next";
import { VisitDashboard } from "@/components/admin/visit-dashboard";
import { getVisitStats, parseVisitPeriod } from "@/lib/cms/visits";

export const metadata: Metadata = { title: "Statistiques" };

type Props = { searchParams: Promise<{ periode?: string }> };

export default async function AdminStatsPage({ searchParams }: Props) {
  const { periode } = await searchParams;
  const stats = await getVisitStats(parseVisitPeriod(periode));
  return <VisitDashboard stats={stats} />;
}
