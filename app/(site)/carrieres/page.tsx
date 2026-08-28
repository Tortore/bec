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
import { getSettings } from "@/lib/cms/queries";
import { getSitePages } from "@/lib/cms/site-pages";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ApplicationForm } from "@/components/careers/application-form";
import { SiteImage } from "@/components/site-image";

const highlightIcons = [Compass, Shield, Users];
const documentIcons = [CheckCircle2, CheckCircle2, GraduationCap];

export async function generateMetadata(): Promise<Metadata> {
  const pages = await getSitePages();
  return createMetadata({
    title: pages.careers.heroEyebrow || "Recrutement",
    description: pages.careers.heroIntro,
    path: "/carrieres",
    image: pages.careers.heroImage,
  });
}

export default async function CareersPage() {
  const [pages, settings] = await Promise.all([getSitePages(), getSettings()]);
  const copy = pages.careers;

  return (
    <div>
      <section className="relative flex min-h-[22rem] items-end overflow-hidden md:min-h-[26rem]">
        <div className="absolute inset-0">
          <SiteImage
            src={copy.heroImage}
            alt={copy.heroTitle}
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
            items={[{ label: "Accueil", href: "/" }, { label: "Recrutement" }]}
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#00af84] sm:text-sm sm:tracking-[0.2em]">
            {copy.heroEyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">{copy.heroIntro}</p>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-12 md:py-16">
        <div className="container-site grid gap-6 md:grid-cols-3">
          {copy.highlights.map((item, index) => {
            const Icon = highlightIcons[index] ?? Compass;
            return (
              <article
                key={`${item.title}-${index}`}
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
              {copy.profilesEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">{copy.profilesTitle}</h2>
            <p className="mt-3 text-muted-foreground">{copy.profilesIntro}</p>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-2">
            {copy.positions.map((position) => (
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
              {copy.formEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">{copy.formTitle}</h2>
            <p className="mt-3 mb-8 text-muted-foreground">{copy.formIntro}</p>
            <ApplicationForm positions={copy.positions} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-3xl bg-[#065b48] p-7 text-white">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#00af84]">
                {copy.processEyebrow}
              </p>
              <ul className="mt-6 space-y-6">
                {copy.steps.map((step, index) => (
                  <li key={`${step.title}-${index}`} className="flex gap-4">
                    <span className="text-2xl font-bold text-[#00af84]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
              <h3 className="mt-4 font-bold text-[#065b48]">{copy.documentsTitle}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {copy.documents.map((item, index) => {
                  const Icon = documentIcons[index] ?? CheckCircle2;
                  return (
                    <li key={item} className="flex gap-2">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#00af84]" aria-hidden />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#065b48] text-white">
                <Briefcase className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-bold text-[#065b48]">{copy.contactTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {copy.contactText}{" "}
                <a className="font-medium text-[#065b48] hover:text-[#00af84]" href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
