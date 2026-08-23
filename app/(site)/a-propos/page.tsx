import type { Metadata } from "next";
import {
  Award,
  Building,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  HardHat,
  Heart,
  Home,
  Lightbulb,
  MapPin,
  Shield,
  Sofa,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { getCompany } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { TeamDirectory } from "@/components/team/team-directory";
import { SiteImage } from "@/components/site-image";

export const metadata: Metadata = createMetadata({
  title: "À propos",
  description:
    "Fondé en 2022 à Lubumbashi par Caleb Tshileu et Fidèle Djese, BEC réunit architecture, ingénierie et construction.",
  path: "/a-propos",
});

const cities = ["Kinshasa", "Kolwezi", "Goma", "Bukavu"];

const valueIcons = [Sparkles, Lightbulb, Shield, Heart];
const timelineIcons = [Sparkles, TrendingUp, Award, Compass];
const strengthIcons = [Users, Award, MapPin];
const achievementIcons = [Home, Sofa, Building2, Building];
const commitmentIcons = [Clock, Award, HardHat, Heart];

export default async function AboutPage() {
  const company = await getCompany();
  return (
    <div>
      <section className="relative flex min-h-[22rem] items-end overflow-hidden md:min-h-[26rem]">
        <div className="absolute inset-0">
          <SiteImage
            src="/images/chantier.jpg"
            alt="Chantier Bureau d'Études et Construction"
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
            items={[{ label: "Accueil", href: "/" }, { label: "À propos" }]}
          />
          <h1 className="mt-6 max-w-3xl text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {company.history.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Histoire, valeurs et équipe de Bureau d&apos;Études et Construction,
            fondé à Lubumbashi en 2022.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Notre histoire
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Un cabinet ancré à Lubumbashi
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-[#065b48]">
                  Bureau d&apos;Études et Construction (BEC)
                </strong>{" "}
                a été fondé en 2022 par{" "}
                <strong className="text-[#00af84]">Caleb Tshileu</strong> et{" "}
                <strong className="text-[#00af84]">Fidèle Djese</strong>.
              </p>
              <p>{company.history.lead}</p>
              <p>{company.history.body}</p>
            </div>
            <div className="mt-8 rounded-2xl border border-[#00af84]/20 bg-[#00af84]/5 p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-6 w-6 shrink-0 text-[#00af84]" aria-hidden />
                <div>
                  <h3 className="font-bold text-[#065b48]">Siège</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Avenue de la Moto, Quartier Gambela 2
                    <br />
                    Commune de Lubumbashi, RDC
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cities.map((city) => (
                      <span
                        key={city}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#00af84]/20 bg-white px-3 py-1 text-xs font-medium text-[#065b48]"
                      >
                        <MapPin className="h-3 w-3 text-[#00af84]" aria-hidden />
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative pb-12">
            <div className="relative h-56 overflow-hidden rounded-2xl shadow-xl sm:h-72 md:h-96">
              <SiteImage
                src="/images/img2.jpg"
                alt="Réalisation architecturale BEC"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-3 right-3 max-w-xs rounded-2xl bg-white p-4 shadow-xl sm:left-4 sm:right-auto sm:p-5 md:left-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#00af84]">
                Depuis 2022
              </p>
              <p className="mt-1 font-semibold text-[#065b48]">Lubumbashi, RDC</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container-site">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Notre raison d&apos;être
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Vision et mission
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 md:p-10">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#065b48] text-white shadow-md">
                <Eye className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-bold text-[#065b48]">Notre vision</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{company.vision}</p>
            </article>
            <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 md:p-10">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00af84] text-white shadow-md">
                <Target className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-bold text-[#065b48]">Notre mission</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{company.mission.lead}</p>
              <ul className="mt-6 space-y-3">
                {company.mission.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00af84]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-site">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Nos valeurs
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Ce qui nous guide
            </h2>
            <p className="mt-3 text-muted-foreground">
              Quatre piliers animent le travail du cabinet au quotidien.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {company.values.map((value, index) => {
              const Icon = valueIcons[index];
              return (
                <article
                  key={value.name}
                  className="group rounded-2xl border border-slate-100 bg-slate-50 p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#065b48] text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#00af84]">
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-[#065b48]">{value.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container-site">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Notre parcours
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">Chronologie</h2>
          </div>
          <ol className="relative space-y-8 before:absolute before:left-6 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-[#00af84]/25 lg:before:left-1/2 lg:before:-translate-x-px">
            {company.timeline.map((item, index) => {
              const Icon = timelineIcons[index];
              const left = index % 2 === 0;
              return (
                <li
                  key={item.year}
                  className={`relative flex items-start gap-6 lg:items-center ${
                    left ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#065b48] text-white shadow-md lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className={`w-full pl-0 lg:w-1/2 ${left ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}>
                    <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                      <span className="inline-block rounded-full bg-[#00af84]/10 px-3 py-1 text-xs font-bold text-[#065b48]">
                        {item.year}
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-[#065b48]">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </article>
                  </div>
                  <div className="hidden lg:block lg:w-1/2" />
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-site">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Nos atouts
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Pourquoi BEC
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {company.certifications.map((item, index) => {
              const Icon = strengthIcons[index];
              return (
                <article
                  key={item.title}
                  className="relative rounded-2xl border border-[#00af84]/15 bg-gradient-to-br from-[#00af84]/8 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="absolute right-6 top-4 text-5xl font-bold text-[#00af84]/15">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#065b48] text-white shadow-md">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-[#065b48]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <TeamDirectory />

      <section className="bg-white py-16 md:py-20">
        <div className="container-site">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Nos domaines
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Types de projets
            </h2>
          </div>
          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {company.achievements.map((item, index) => {
              const Icon = achievementIcons[index];
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[#00af84]/15 bg-[#00af84]/5 p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#00af84] shadow-sm">
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-bold text-[#065b48]">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </article>
              );
            })}
          </div>

          <div className="rounded-3xl bg-[#065b48] p-5 text-white sm:p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">Nos engagements</h2>
              <p className="mt-2 text-white/75">Quatre engagements concrets pour chaque projet.</p>
            </div>
            <ul className="grid gap-6 md:grid-cols-2">
              {company.commitments.map((item, index) => {
                const Icon = commitmentIcons[index];
                return (
                  <li key={item} className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Icon className="h-6 w-6 text-[#00af84]" aria-hidden />
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
