"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/components/consent/consent-provider";

const recent = new Map<string, number>();

export function VisitTracker() {
  const pathname = usePathname();
  const { ready, choices } = useConsent();
  const first = useRef(true);

  useEffect(() => {
    if (!ready || !choices.analytics || !pathname) return;
    const now = Date.now();
    const last = recent.get(pathname) ?? 0;
    if (now - last < 4000) return;
    recent.set(pathname, now);

    const payload = JSON.stringify({
      path: pathname,
      referrer: first.current ? document.referrer : "",
    });
    first.current = false;

    const blob = new Blob([payload], { type: "application/json" });
    if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon("/api/visite", blob)) {
      return;
    }
    void fetch("/api/visite", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, [choices.analytics, pathname, ready]);

  return null;
}
