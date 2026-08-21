import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { RecentProjects } from "@/components/sections/recent-projects";
import { getCategoryLabels, getHome } from "@/lib/cms/queries";

export default async function HomePage() {
  const [home, labels] = await Promise.all([getHome(), getCategoryLabels()]);
  return (
    <>
      <Hero home={home} />
      <RecentProjects home={home} labels={labels} />
      <CtaBand home={home} />
    </>
  );
}
