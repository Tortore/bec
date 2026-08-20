"use client";

import { MapPin } from "lucide-react";
import { useConsent } from "@/components/consent/consent-provider";
import { siteConfig } from "@/lib/site";

export function MapEmbed({
  src,
  mapsUrl,
  address,
}: {
  src: string;
  mapsUrl: string;
  address: string;
}) {
  const { ready, choices, openBanner } = useConsent();

  if (!ready || !choices.maps) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-4 bg-slate-100 px-6 py-16 text-center md:h-[28rem]">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#065b48] text-white">
          <MapPin className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <p className="font-semibold text-[#065b48]">{siteConfig.shortName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{address}</p>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          La carte Google Maps n’est affichée que si vous acceptez les cookies de carte.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="rounded-lg bg-[#00af84] px-4 py-2 text-sm font-semibold text-white hover:bg-[#065b48]"
            onClick={openBanner}
          >
            Gérer les cookies
          </button>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ouvrir dans Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <iframe
      title="Carte de Lubumbashi — bureaux BEC"
      src={src}
      className="h-80 w-full border-0 md:h-[28rem]"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
