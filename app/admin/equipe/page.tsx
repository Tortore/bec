import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { TeamPhoto } from "@/components/team/team-card";
import { deleteTeamMemberAction } from "@/lib/cms/actions";
import { getTeam } from "@/lib/cms/queries";

export const metadata: Metadata = { title: "Équipe" };

const departmentLabels = {
  direction: "Direction",
  architecture: "Architecture",
  ingenierie: "Ingénierie",
  support: "Support",
} as const;

export default async function AdminTeamPage() {
  const team = await getTeam();
  return (
    <div>
      <AdminHeader
        title="Équipe"
        description="Les personnes affichées sur l’accueil et la page À propos."
        action={{ href: "/admin/equipe/nouveau", label: "Ajouter une personne" }}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {team.map((member) => (
          <article key={member.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <TeamPhoto src={member.image} alt={member.name} className="h-56" sizes="400px" />
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#00af84]">
                {departmentLabels[member.department]}
              </p>
              <h2 className="mt-1 font-semibold text-[#065b48]">{member.name}</h2>
              <p className="text-sm text-slate-500">{member.role}</p>
              <div className="mt-4 flex items-center justify-between">
                <Link href={`/admin/equipe/${member.id}`} className="text-sm font-medium text-[#065b48]">
                  Modifier
                </Link>
                <ConfirmDelete
                  message={`Retirer ${member.name} de l’équipe ?`}
                  action={deleteTeamMemberAction.bind(null, member.id)}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
