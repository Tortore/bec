import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { TeamForm } from "@/components/admin/team-form";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia } from "@/lib/cms/media";
import { getTeamMember } from "@/lib/cms/queries";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = await getTeamMember((await params).id);
  return { title: member?.name ?? "Équipe" };
}

export default async function EditTeamPage({ params }: Props) {
  await requireAdmin();
  const member = await getTeamMember((await params).id);
  if (!member) notFound();
  return (
    <div>
      <AdminHeader title={member.name} />
      <TeamForm member={member} media={await listMedia()} />
    </div>
  );
}
