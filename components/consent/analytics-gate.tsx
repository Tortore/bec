"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsent } from "@/components/consent/consent-provider";
import { GoogleAnalytics } from "@/components/consent/google-analytics";

const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();

export function AnalyticsGate() {
  const { ready, choices } = useConsent();
  if (!ready || !choices.analytics) return null;

  return (
    <>
      {gaId && gaId.startsWith("G-") ? <GoogleAnalytics id={gaId} /> : null}
      <Analytics />
    </>
  );
}
