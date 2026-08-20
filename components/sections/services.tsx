import Link from "next/link";
import {
  ArrowRight,
  Building,
  ClipboardCheck,
  FileSearch,
  HardHat,
  PencilRuler,
  Sofa,
} from "lucide-react";
import { getServices } from "@/lib/cms/queries";
import type { HomeContent, ServiceItem } from "@/types";

const icons = [PencilRuler, Sofa, ClipboardCheck, Building, FileSearch, HardHat];

export async function Services({
  items,
  home,
}: {
  items?: ServiceItem[];
  home: Pick<HomeContent, "servicesEyebrow" | "servicesTitle" | "servicesIntro">;
}) {
  const services = items ?? (await getServices());
  return (
    <section id="savoir-faire" className="bg-slate-50 py-16 md:py-20">
      <div className="container-site">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
            {home.servicesEyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
            {home.servicesTitle}
          </h2>
          <p className="mt-4 text-muted-foreground">{home.servicesIntro}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index] ?? PencilRuler;
            return (
              <article
                key={service.id}
                className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#065b48] text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#00af84]">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold text-[#065b48]">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.shortDescription}
                </p>
                <Link
                  href="/services"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#00af84] transition-colors hover:text-[#065b48]"
                >
                  En savoir plus
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
