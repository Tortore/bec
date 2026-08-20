import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TeamCard } from "@/components/team/team-card";
import { getTeam } from "@/lib/cms/queries";
import type { HomeContent, TeamMember } from "@/types";

export async function TeamPreview({
  members,
  home,
}: {
  members?: TeamMember[];
  home: Pick<HomeContent, "teamEyebrow" | "teamTitle" | "teamIntro">;
}) {
  const preview = (members ?? (await getTeam())).slice(0, 4);

  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <div className="container-site">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
            {home.teamEyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
            {home.teamTitle}
          </h2>
          <p className="mt-3 text-muted-foreground">{home.teamIntro}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/a-propos#equipe"
            className="group inline-flex items-center gap-2 font-semibold text-[#00af84] hover:text-[#065b48]"
          >
            Découvrir toute l&apos;équipe
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
