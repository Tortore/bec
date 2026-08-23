import type { Metadata } from "next";
import { Award, HardHat, PencilRuler, Users } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { ServicesExplorer } from "@/components/services/services-explorer";
import { getServices } from "@/lib/cms/queries";

export const metadata: Metadata = createMetadata({
  title: "Services",
  description:
    "Services de Bureau d'Études et Construction : conception architecturale, design d'intérieur, gestion de projet, urbanisme, études techniques et suivi de chantier.",
  path: "/services",
});

const steps = [
  {
    icon: Users,
    title: "Consultation",
    description: "Nous écoutons vos besoins et analysons votre projet.",
  },
  {
    icon: PencilRuler,
    title: "Conception",
    description: "L'équipe propose des solutions adaptées au site et au programme.",
  },
  {
    icon: HardHat,
    title: "Réalisation",
    description: "Nous suivons l'exécution avec rigueur, de l'étude au chantier.",
  },
  {
    icon: Award,
    title: "Livraison",
    description: "Le projet est remis conformément aux engagements convenus.",
  },
];

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div>
      <section className="relative overflow-hidden bg-[#065b48] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#065b48] via-[#054a3c] to-[#033a2e]" />
        <div className="container-site relative z-10 py-16 md:py-24">
          <Breadcrumbs
            className="text-white/70 [&_span]:text-white"
            items={[{ label: "Accueil", href: "/" }, { label: "Services" }]}
          />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl md:text-5xl">Nos services</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Architecture, études techniques et construction — de l&apos;idée à la
            livraison, à Lubumbashi et en RDC.
          </p>
        </div>
      </section>

      <ServicesExplorer services={services} />

      <section className="bg-white py-16 md:py-20">
        <div className="container-site">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Notre méthode
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Comment nous travaillons
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="text-center">
                  <div className="relative mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#065b48] text-white shadow-lg">
                    <Icon className="h-7 w-7" aria-hidden />
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#00af84] text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#065b48]">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
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
