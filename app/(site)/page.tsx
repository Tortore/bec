import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { RecentProjects } from "@/components/sections/recent-projects";
import { getCategoryLabels, getHome } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "BEC RDC — Architecture et construction à Lubumbashi",
  description:
    "BEC est un bureau d’études, d’architecture et de construction basé à Lubumbashi en RDC : conception, études techniques, suivi de chantier et réalisation.",
  path: "/",
});

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
