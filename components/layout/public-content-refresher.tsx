"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const refreshInterval = 10_000;

export function PublicContentRefresher({ initialVersion }: { initialVersion: string }) {
  const router = useRouter();
  const version = useRef(initialVersion);
  const checking = useRef(false);

  useEffect(() => {
    let active = true;

    const check = async () => {
      if (!active || checking.current || document.visibilityState === "hidden") return;
      checking.current = true;
      try {
        const response = await fetch("/api/contenu-version", { cache: "no-store" });
        const result = (await response.json().catch(() => null)) as { version?: string | null } | null;
        const next = result?.version;
        if (!response.ok || !next) return;
        if (version.current !== next) {
          version.current = next;
          router.refresh();
        }
      } catch {
        // Une coupure réseau ne doit jamais perturber la navigation publique.
      } finally {
        checking.current = false;
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };
    const interval = window.setInterval(() => void check(), refreshInterval);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  return null;
}
