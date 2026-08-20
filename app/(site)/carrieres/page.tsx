import type { Metadata } from "next";
import {
  Briefcase,
  CheckCircle2,
  Compass,
  FileCheck2,
  GraduationCap,
  Shield,
  Users,
} from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { careerPositions } from "@/lib/recruitment";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ApplicationForm } from "@/components/careers/application-form";
import { SiteImage } from "@/components/site-image";

export const metadata: Metadata = createMetadata({
  title: "Carrières",
  description:
    "Rejoindre Bureau d'Études et Constructions à Lubumbashi : déposez votre identité, votre CV et votre candidature en ligne.",
  path: "/carrieres",
  image: "/images/chantier.jpg",
});

const highlights = [
  {
    icon: Compass,
    title: "Cabinet pluridisciplinaire",
    text: "Architecture, ingénierie et construction réunies autour des projets du cabinet.",
  },
  {
    icon: Shield,
    title: "Exigence professionnelle",
    text: "Rigueur technique, suivi de chantier et exigence de qualité sur chaque mission.",
  },
  {
    icon: Users,
    title: "Ancré à Lubumbashi",
    text: `Fondé en ${siteConfig.founded}, BEC recrute des profils qui veulent construire en RDC.`,
  },
];

const steps = [
  {
    n: "01",
    title: "Identité et parcours",
    text: "Renseignez vos coordonnées, le poste visé et votre formation.",
  },
  {
    n: "02",
    title: "CV et pièce d’identité",
    text: "Joignez votre CV (PDF ou Word) et, si vous le souhaitez, une pièce d’identité.",
  },
  {
    n: "03",
    title: "Examen par BEC",
    text: "Le dossier arrive dans l’espace administration. Nous vous recontactons si le profil convient.",
  },
];

export default function CareersPage() {
  return (
    <div>
      <section className="relative flex min-h-[22rem] items-end overflow-hidden md:min-h-[26rem]">
        <div className="absolute inset-0">
          <SiteImage
            src="/images/chantier.jpg"
            alt="Chantier Bureau d'Études et Constructions"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
        <div className="container-site relative z-10 w-full pb-12 pt-10 md:pb-16">
          <Breadcrumbs
            className="text-white/70 [&_span]:text-[#00af84]"
            items={[{ label: "Accueil", href: "/" }, { label: "Carrières" }]}
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#00af84] sm:text-sm sm:tracking-[0.2em]">
            Recrutement
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Rejoindre Bureau d&apos;Études et Constructions
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Déposez votre identité, votre CV et votre lettre de motivation.
            Chaque dossier est reçu et géré par l&apos;administration du cabinet.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-12 md:py-16">
        <div className="container-site grid gap-6 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#065b48] text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-bold text-[#065b48]">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#f6f8f7] py-16 md:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Profils recherchés
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Architectes, ingénieurs et talents du bâtiment
            </h2>
            <p className="mt-3 text-muted-foreground">
              BEC reçoit les candidatures spontanées et les dossiers correspondant
              aux métiers du cabinet. Aucune offre fictive n&apos;est publiée ici :
              chaque dépôt est étudié selon les besoins réels.
            </p>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-2">
            {careerPositions.map((position) => (
              <li
                key={position}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#065b48]"
              >
                {position}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="candidater" className="scroll-mt-24 bg-white py-16 md:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-10">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Candidature en ligne
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Déposer votre dossier
            </h2>
            <p className="mt-3 mb-8 text-muted-foreground">
              Identité, CV (PDF, Word, ODT ou RTF) et, si possible, une pièce
              d&apos;identité. Les fichiers sont conservés hors du site public.
            </p>
            <ApplicationForm />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-3xl bg-[#065b48] p-7 text-white">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#00af84]">
                Comment ça se passe
              </p>
              <ul className="mt-6 space-y-6">
                {steps.map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="text-2xl font-bold text-[#00af84]">{step.n}</span>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="mt-1 text-sm text-white/75">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#00af84] text-white">
                <FileCheck2 className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-bold text-[#065b48]">Documents acceptés</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00af84]" aria-hidden />
                  CV : PDF, DOC, DOCX, ODT, RTF (8 Mo max.)
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00af84]" aria-hidden />
                  Identité : PDF, JPG ou PNG (8 Mo max.)
                </li>
                <li className="flex gap-2">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[#00af84]" aria-hidden />
                  Lettre de motivation dans le formulaire
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#065b48] text-white">
                <Briefcase className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-bold text-[#065b48]">Contact recrutement</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pour une question hors formulaire :{" "}
                <a className="font-medium text-[#065b48] hover:text-[#00af84]" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
