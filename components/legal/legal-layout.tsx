import Link from "next/link";
import { FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LegalNav } from "@/components/legal/legal-nav";

export function LegalLayout({
  title,
  intro,
  updatedLabel,
  children,
}: {
  title: string;
  intro: string;
  updatedLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-[#065b48] text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#00af84]/20" />
        <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-black/20" />
        <div className="container-site relative py-14 md:py-20">
          <Breadcrumbs
            className="text-white/55 [&_span]:text-white"
            items={[{ label: "Accueil", href: "/" }, { label: title }]}
          />
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-[#00af84]">
            <FileText className="h-4 w-4" aria-hidden />
            Informations légales
          </p>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{intro}</p>
          {updatedLabel ? (
            <p className="mt-6 inline-flex rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-white/70">
              Mise à jour le {updatedLabel}
            </p>
          ) : null}
        </div>
      </section>

      <div className="container-site grid gap-10 py-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-16">
        <LegalNav />
        <article
          className="space-y-5
            [&_a]:font-semibold [&_a]:text-[#00af84] [&_a]:underline-offset-4 hover:[&_a]:text-[#065b48] hover:[&_a]:underline
            [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#065b48]
            [&_li]:relative [&_li]:pl-6
            [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.55em] [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-[#00af84]
            [&_p]:text-[1.05rem] [&_p]:leading-[1.85] [&_p]:text-slate-600
            [&_section]:rounded-2xl [&_section]:border [&_section]:border-[#00af84]/10 [&_section]:border-l-[3px] [&_section]:border-l-[#00af84] [&_section]:bg-white [&_section]:p-5 [&_section]:shadow-sm [&_section]:sm:p-7 [&_section]:md:p-9
            [&_ul]:mt-4 [&_ul]:list-none [&_ul]:space-y-3 [&_ul]:pl-0 [&_ul]:text-[1.05rem] [&_ul]:leading-[1.7] [&_ul]:text-slate-600"
        >
          {children}
        </article>
      </div>

      <section className="border-t border-[#00af84]/10 bg-white py-12">
        <div className="container-site flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-[#00af84]">Une question sur ces documents ?</p>
            <p className="mt-1 max-w-xl text-slate-600">
              L’équipe BEC vous répond depuis Lubumbashi, aux horaires d’ouverture.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex rounded-xl bg-[#00af84] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#00af84]/20 transition hover:-translate-y-0.5 hover:bg-[#065b48]"
          >
            Nous écrire
          </Link>
        </div>
      </section>
    </div>
  );
}
