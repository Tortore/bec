import type { Metadata } from "next";
import { Award, HardHat, PencilRuler, Users } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { ServicesExplorer } from "@/components/services/services-explorer";
import { getServices } from "@/lib/cms/queries";
import { getSitePages } from "@/lib/cms/site-pages";

const stepIcons = [Users, PencilRuler, HardHat, Award];

export async function generateMetadata(): Promise<Metadata> {
  const pages = await getSitePages();
  return createMetadata({
    title: pages.services.heroTitle || "Services",
    description: pages.services.heroIntro,
    path: "/services",
  });
}

export default async function ServicesPage() {
  const [services, pages] = await Promise.all([getServices(), getSitePages()]);
  const copy = pages.services;
  return (
    <div>
      <section className="relative overflow-hidden bg-[#065b48] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#065b48] via-[#054a3c] to-[#033a2e]" />
        <div className="container-site relative z-10 py-16 md:py-24">
          <Breadcrumbs
            className="text-white/70 [&_span]:text-white"
            items={[{ label: "Accueil", href: "/" }, { label: "Services" }]}
          />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl md:text-5xl">{copy.heroTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">{copy.heroIntro}</p>
        </div>
      </section>

      <ServicesExplorer
        services={services}
        eyebrow={copy.catalogEyebrow}
        title={copy.catalogTitle}
        intro={copy.catalogIntro}
      />

      <section className="bg-white py-16 md:py-20">
        <div className="container-site">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              {copy.methodEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">{copy.methodTitle}</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.map((step, index) => {
              const Icon = stepIcons[index] ?? Users;
              return (
                <article key={`${step.title}-${index}`} className="text-center">
                  <div className="relative mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#065b48] text-white shadow-lg">
                    <Icon className="h-7 w-7" aria-hidden />
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#00af84] text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#065b48]">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
