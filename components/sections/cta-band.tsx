import Link from "next/link";
import { ArrowRight, CheckCircle, PhoneCall } from "lucide-react";
import { getHome } from "@/lib/cms/queries";
import type { HomeContent } from "@/types";

export async function CtaBand({
  home,
}: {
  home?: Pick<HomeContent, "ctaEyebrow" | "ctaTitle" | "ctaText" | "ctaButton" | "ctaBenefits">;
}) {
  const content = home ?? (await getHome());
  return (
    <section className="relative overflow-hidden bg-[#065b48] py-16 text-white md:py-20">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#00af84]/20" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-black/20" />

      <div className="container-site relative max-w-4xl text-center">
        <span className="inline-block max-w-full rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
          {content.ctaEyebrow}
        </span>
        <h2 className="mt-5 text-2xl font-bold sm:text-3xl md:text-4xl">{content.ctaTitle}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{content.ctaText}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
          {content.ctaBenefits.map((benefit) => (
            <p key={benefit} className="flex items-center gap-2 text-sm text-white/85">
              <CheckCircle className="h-5 w-5 shrink-0 text-[#00af84]" aria-hidden />
              {benefit}
            </p>
          ))}
        </div>
        <Link
          href="/contact#devis"
          className="mt-10 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-base font-bold text-[#065b48] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-[#00af84] hover:text-white sm:w-auto sm:px-8"
        >
          <PhoneCall className="h-5 w-5" />
          {content.ctaButton}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
