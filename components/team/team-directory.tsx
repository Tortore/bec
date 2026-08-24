import { TeamCard } from "@/components/team/team-card";
import { getCompany, getTeam } from "@/lib/cms/queries";
import type { TeamMember } from "@/types";

export async function TeamDirectory({ members }: { members?: TeamMember[] }) {
  const [company, team] = await Promise.all([
    getCompany(),
    members ? Promise.resolve(members) : getTeam(),
  ]);
  return (
    <section id="equipe" className="scroll-mt-24 bg-slate-50 py-16 md:py-20">
      <div className="container-site">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
            {company.page.teamEyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
            {company.page.teamHeading}
          </h2>
          <p className="mt-3 text-muted-foreground">{company.teamIntro.lead}</p>
          {company.teamIntro.philosophy ? (
            <p className="mt-2 text-sm text-muted-foreground">{company.teamIntro.philosophy}</p>
          ) : null}
          {company.teamIntro.profiles.length ? (
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {company.teamIntro.profiles.map((profile) => (
                <li
                  key={profile}
                  className="rounded-full border border-[#00af84]/20 bg-white px-3 py-1 text-xs font-medium text-[#065b48]"
                >
                  {profile}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
