"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { runtimeMediaUrl } from "@/lib/media-url";
import { isLocalProjectVideo, parseYouTube, youtubeEmbedUrl, youtubePoster } from "@/lib/cms/youtube";

export function ProjectVideo({
  title,
  video,
  poster,
}: {
  title: string;
  video: string;
  poster?: string;
}) {
  const youtube = parseYouTube(video);
  const isLocalVideo = isLocalProjectVideo(video);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const posterSrc = youtube
    ? youtubePoster(youtube.id, "hq")
    : poster?.startsWith("/")
      ? poster
      : undefined;

  if (!youtube && !isLocalVideo) return null;

  return (
    <section id="video" className="container-site mt-10 scroll-mt-24">
      <div className="mb-5">
        <p className="text-sm font-semibold text-[#00af84]">Vidéo</p>
        <h2 className="text-xl font-semibold text-[#065b48] md:text-2xl">Comment ce projet a été réalisé</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Lecture directe sur le site, à côté des photos du projet.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-black shadow-xl shadow-black/20 ring-1 ring-black/10">
        {youtube ? (
          playing ? (
            <iframe
              title={`Vidéo du projet ${title}`}
              src={youtubeEmbedUrl(youtube, true)}
              className="aspect-video w-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group relative block aspect-video w-full overflow-hidden"
              aria-label={`Lire la vidéo du projet ${title}`}
            >
              {posterSrc ? (
                <SiteImage
                  src={posterSrc}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <span className="absolute inset-0 bg-neutral-900" />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00af84] text-white shadow-lg shadow-black/30 transition group-hover:scale-110 group-hover:bg-[#065b48] md:h-20 md:w-20">
                  <Play className="ml-1 h-7 w-7 fill-current md:h-8 md:w-8" />
                </span>
              </span>
              <span className="absolute bottom-4 left-4 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur">
                YouTube · Lecture sur le site
              </span>
            </button>
          )
        ) : failed ? (
          <div className="flex aspect-video items-center justify-center px-6 text-center text-sm text-white/80">
            Cette vidéo ne peut pas être lue pour le moment. Réessayez après avoir rechargé la page.
          </div>
        ) : (
          <video
            className="aspect-video w-full bg-black"
            src={runtimeMediaUrl(video)}
            poster={poster?.startsWith("/") ? runtimeMediaUrl(poster) : undefined}
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
            onError={() => setFailed(true)}
          >
            Votre navigateur ne peut pas lire cette vidéo.
          </video>
        )}
      </div>
    </section>
  );
}
