"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConsent } from "@/components/consent/consent-provider";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { bannerOpen } = useConsent();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#065b48] text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#00af84] sm:right-6 sm:h-12 sm:w-12",
        bannerOpen
          ? "bottom-[min(18rem,45dvh)] sm:bottom-44"
          : "bottom-[max(1.25rem,env(safe-area-inset-bottom))]",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-label="Retour en haut"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
