import type { Metadata } from "next";
import { CheckCircle2, Eye, MapPin, Target } from "lucide-react";
import { getCompany, getSettings } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";
import { formatPublicAddress } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { TeamDirectory } from "@/components/team/team-directory";
import { SiteImage } from "@/components/site-image";
import { RichText } from "@/components/rich-text";
import { richTextToPlainText } from "@/lib/rich-text";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  return createMetadata({
    title: company.history.title || "À propos",
    description: company.page.heroSubtitle || richTextToPlainText(company.history.founding),
    path: "/a-propos",
  });
}

export default async function AboutPage() {
  const [company, settings] = await Promise.all([getCompany(), getSettings()]);
  const address = formatPublicAddress(settings.address);

  return (
    <div>
      <section className="relative flex min-h-[22rem] items-end overflow-hidden md:min-h-[26rem]">
        <div className="absolute inset-0">
          <SiteImage
            src={company.page.heroImage}
            alt={company.history.title}
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
          <p className="mt-4 max-w-2xl text-lg text-white/80">{company.page.heroSubtitle}</p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              {company.page.historyEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              {company.page.historyHeading}
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <RichText
                content={company.history.founding}
                className="[&_strong]:font-bold [&_strong]:text-[#00af84]"
              />
              <RichText content={company.history.lead} />
              <RichText content={company.history.body} />
            </div>
            <div className="mt-8 rounded-2xl border border-[#00af84]/20 bg-[#00af84]/5 p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-6 w-6 shrink-0 text-[#00af84]" aria-hidden />
                <div>
                  <h3 className="font-bold text-[#065b48]">{company.page.hqTitle}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {address.line1}
                    {address.line2 ? (
                      <>
                        <br />
                        {address.line2}
                      </>
                    ) : null}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {company.page.cities.map((city) => (
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
                src={company.page.historyImage}
                alt={company.page.historyHeading}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-3 right-3 max-w-xs rounded-2xl bg-white p-4 shadow-xl sm:left-4 sm:right-auto sm:p-5 md:left-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#00af84]">
                {company.page.historyBadge}
              </p>
              <p className="mt-1 font-semibold text-[#065b48]">{company.page.historyLocation}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container-site">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              {company.page.visionEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              {company.page.visionHeading}
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 md:p-10">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#065b48] text-white shadow-md">
                <Eye className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-bold text-[#065b48]">{company.page.visionTitle}</h3>
              <RichText content={company.vision} className="mt-4 text-muted-foreground" />
            </article>
            <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 md:p-10">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00af84] text-white shadow-md">
                <Target className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-bold text-[#065b48]">{company.page.missionTitle}</h3>
              <RichText content={company.mission.lead} className="mt-4 text-muted-foreground" />
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

      <TeamDirectory />
      <CtaBand />
    </div>
  );
}
