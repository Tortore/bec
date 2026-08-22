import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { runtimeMediaUrl } from "@/lib/utils";
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
        {home.heroVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={runtimeMediaUrl(home.heroVideo)}
            poster={runtimeMediaUrl(home.heroImage)}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : null}
        {!home.heroVideo ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : null}
      </div>

      {!home.heroVideo ? (
        <div className="container-site relative z-10 w-full">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
              {home.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
              {home.heroSubtitle}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
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
      ) : null}
    </section>
  );
}
