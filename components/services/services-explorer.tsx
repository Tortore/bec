"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  HardHat,
  PencilRuler,
  Phone,
  Sofa,
  X,
} from "lucide-react";
import { SiteImage } from "@/components/site-image";
import type { ServiceItem } from "@/types";

const icons: Record<string, typeof PencilRuler> = {
  conception: PencilRuler,
  "design-interieur": Sofa,
  "gestion-projet": ClipboardCheck,
  urbanisme: Building2,
  "etudes-techniques": FileSearch,
  "suivi-chantier": HardHat,
};

export function ServicesExplorer({ services }: { services: ServiceItem[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const service = selected ? services.find((item) => item.id === selected) : undefined;
  const DetailIcon = selected ? icons[selected] ?? PencilRuler : PencilRuler;

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <>
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container-site">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Notre expertise
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Des services complets
            </h2>
            <p className="mt-3 text-muted-foreground">
              De la conception au chantier, BEC accompagne chaque étape du projet.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((item) => {
              const Icon = icons[item.id] ?? PencilRuler;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  className="group rounded-2xl border border-slate-100 bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#065b48] text-white shadow-md transition-colors group-hover:bg-[#00af84]">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-[#065b48]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.shortDescription}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#00af84]">
                    En savoir plus
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {service ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative my-8 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label="Fermer"
            >
              <X className="h-5 w-5 text-slate-700" />
            </button>
            <div className="grid md:grid-cols-[minmax(0,17rem)_1fr] lg:grid-cols-[minmax(0,20rem)_1fr]">
              <div className="relative h-52 md:h-auto md:min-h-[28rem]">
                <SiteImage
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#065b48] text-white">
                  <DetailIcon className="h-5 w-5" aria-hidden />
                </span>
                <h2 id="service-title" className="text-2xl font-bold text-[#065b48] md:text-3xl">
                  {service.title}
                </h2>
              </div>
              <p className="mt-5 leading-relaxed text-muted-foreground">{service.description}</p>
              <h3 className="mt-8 text-lg font-bold text-[#065b48]">Ce que nous offrons</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00af84]" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <h3 className="mt-8 text-lg font-bold text-[#065b48]">Notre processus</h3>
              <ol className="mt-4 space-y-4">
                {service.process.map((step, index) => (
                  <li key={step.step} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#065b48] text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block font-semibold text-[#065b48]">{step.step}</span>
                      <span className="text-sm text-muted-foreground">{step.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <Link
                href="/contact#devis"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#00af84] px-6 py-3 font-semibold text-white hover:bg-[#065b48]"
              >
                <Phone className="h-4 w-4" />
                Demander ce service
              </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
