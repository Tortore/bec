import Link from "next/link";
import { ArrowRight, ClipboardList, MapPin } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import type { HomeContent } from "@/types";

export function Hero({ home }: { home: HomeContent }) {
  return (
    <section className="relative flex min-h-[28rem] items-end overflow-hidden py-12 sm:min-h-[32rem] sm:items-center sm:py-16 md:min-h-[38rem] md:py-0">
      <div className="absolute inset-0">
        <SiteImage
          src={home.heroImage}
          alt="Réalisation Bureau d'Études et Constructions"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="container-site relative z-10 w-full">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[#00af84]/30 bg-[#00af84]/15 px-3 py-1.5 text-xs font-medium text-[#00af84] backdrop-blur-sm sm:mb-5 sm:px-4 sm:text-sm">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#00af84]" />
            <span className="min-w-0 truncate">{home.heroBadge}</span>
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            {home.heroTitle}
            <span className="mt-2 block text-[#00af84]">{home.heroAccent}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
            {home.heroSubtitle}
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm text-white/60 sm:mt-5 sm:items-center">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00af84] sm:mt-0" aria-hidden />
            <span>{home.heroLocation}</span>
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link
              href="/projets"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00af84] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#00af84]/25 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[#065b48] sm:px-7"
            >
              <ClipboardList className="h-5 w-5" />
              {home.heroPrimaryLabel}
            </Link>
            <Link
              href="/contact#devis"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[#065b48] sm:px-7"
            >
              {home.heroSecondaryLabel}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
