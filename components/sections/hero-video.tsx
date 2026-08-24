"use client";

import { useEffect, useRef } from "react";
import { runtimeMediaUrl } from "@/lib/media-url";

export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const videoSrc = runtimeMediaUrl(src);
  const posterSrc = poster?.startsWith("/") ? runtimeMediaUrl(poster) : undefined;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.muted = true;
    const play = () => {
      void node.play().catch(() => undefined);
    };
    node.addEventListener("canplay", play);
    play();
    return () => node.removeEventListener("canplay", play);
  }, [videoSrc]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={videoSrc}
      poster={posterSrc}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      aria-hidden="true"
    />
  );
}
