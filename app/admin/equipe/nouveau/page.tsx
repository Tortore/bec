import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { TeamForm } from "@/components/admin/team-form";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia } from "@/lib/cms/media";

export const metadata: Metadata = { title: "Ajouter un collaborateur" };

export default async function NewTeamPage() {
  await requireAdmin();
  return (
    <div>
      <AdminHeader title="Ajouter un collaborateur" />
      <TeamForm media={await listMedia()} />
    </div>
  );
}
