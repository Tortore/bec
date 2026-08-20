import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { RecentProjects } from "@/components/sections/recent-projects";
import { Services } from "@/components/sections/services";
import { Stats } from "@/components/sections/stats";
import { TeamPreview } from "@/components/sections/team-preview";
import { getCategoryLabels, getHome } from "@/lib/cms/queries";

export default async function HomePage() {
  const [home, labels] = await Promise.all([getHome(), getCategoryLabels()]);
  return (
    <>
      <Hero home={home} />
      <Stats stats={home.stats} />
      <Services home={home} />
      <RecentProjects home={home} labels={labels} />
      <TeamPreview home={home} />
      <CtaBand home={home} />
    </>
  );
}
