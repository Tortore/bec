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
    let stopped = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let retryCount = 0;
    let reloadCount = 0;

    node.muted = true;
    node.defaultMuted = true;

    const schedulePlay = (delay = 0) => {
      if (stopped || document.visibilityState === "hidden") return;
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = setTimeout(() => {
        retryTimer = undefined;
        if (stopped || !node.paused || document.visibilityState === "hidden") return;
        node.muted = true;
        void node.play().catch(() => {
          retryCount += 1;
          if (retryCount < 10) schedulePlay(Math.min(500 * retryCount, 3_000));
        });
      }, delay);
    };

    const resume = () => {
      retryCount = 0;
      schedulePlay();
    };
    const handlePlaying = () => {
      retryCount = 0;
      reloadCount = 0;
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = undefined;
    };
    const handlePause = () => schedulePlay(300);
    const handleError = () => {
      if (!navigator.onLine || reloadCount >= 3) return;
      reloadCount += 1;
      setTimeout(() => {
        if (stopped || document.visibilityState === "hidden") return;
        node.load();
        schedulePlay(300);
      }, reloadCount * 1_000);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") resume();
    };

    node.addEventListener("loadedmetadata", resume);
    node.addEventListener("loadeddata", resume);
    node.addEventListener("canplay", resume);
    node.addEventListener("playing", handlePlaying);
    node.addEventListener("pause", handlePause);
    node.addEventListener("stalled", resume);
    node.addEventListener("error", handleError);
    window.addEventListener("focus", resume);
    window.addEventListener("pageshow", resume);
    window.addEventListener("online", resume);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("pointerdown", resume, { passive: true });
    schedulePlay();

    return () => {
      stopped = true;
      if (retryTimer) clearTimeout(retryTimer);
      node.removeEventListener("loadedmetadata", resume);
      node.removeEventListener("loadeddata", resume);
      node.removeEventListener("canplay", resume);
      node.removeEventListener("playing", handlePlaying);
      node.removeEventListener("pause", handlePause);
      node.removeEventListener("stalled", resume);
      node.removeEventListener("error", handleError);
      window.removeEventListener("focus", resume);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("online", resume);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("pointerdown", resume);
    };
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
      disablePictureInPicture
      aria-hidden="true"
    />
  );
}
