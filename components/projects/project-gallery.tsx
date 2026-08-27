"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteImage } from "@/components/site-image";

export function ProjectGallery({
  title,
  images,
  hasVideo = false,
}: {
  title: string;
  images: string[];
  hasVideo?: boolean;
}) {
  const views = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const current = views[index] ?? views[0];
  if (!current) return null;

  const previous = () => setIndex((value) => (value === 0 ? views.length - 1 : value - 1));
  const next = () => setIndex((value) => (value === views.length - 1 ? 0 : value + 1));

  return (
    <div className="container-site mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#00af84]">Galerie</p>
          <h2 className="text-xl font-semibold text-[#065b48]">L’ensemble du projet</h2>
        </div>
        <div className="flex items-center gap-3">
          {hasVideo ? (
            <a
              href="#video"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#065b48] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#00af84]"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Voir la vidéo
            </a>
          ) : null}
          {views.length > 1 ? (
            <p className="text-sm text-muted-foreground">
              Vue {index + 1} / {views.length}
            </p>
          ) : null}
        </div>
      </div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-neutral-900 md:aspect-[2/1]">
        <SiteImage
          src={current}
          alt={`${title} — vue ${index + 1}`}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
        />
        {views.length > 1 ? (
          <>
            <Button
              variant="inverted"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={previous}
              aria-label="Image précédente"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="inverted"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={next}
              aria-label="Image suivante"
            >
              <ChevronRight />
            </Button>
          </>
        ) : null}
      </div>
      {views.length > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {views.map((image, imageIndex) => (
            <button
              key={`${image}-${imageIndex}`}
              type="button"
              onClick={() => setIndex(imageIndex)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-md ${
                imageIndex === index ? "ring-2 ring-[#00af84]" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Afficher l'image ${imageIndex + 1}`}
              aria-current={imageIndex === index}
            >
              <SiteImage src={image} alt="" fill sizes="112px" className="object-cover" />
              {imageIndex === 0 ? (
                <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Principale
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
