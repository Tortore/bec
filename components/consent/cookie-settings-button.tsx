"use client";

import { useContext } from "react";
import Link from "next/link";
import { ConsentContext } from "@/components/consent/consent-provider";

export function CookieSettingsButton({ className }: { className?: string }) {
  const consent = useContext(ConsentContext);
  if (!consent) {
    return (
      <Link href="/cookies" className={className}>
        Gérer les cookies
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={`cursor-pointer bg-transparent p-0 text-left ${className ?? "text-inherit"}`}
      onClick={consent.openBanner}
    >
      Gérer les cookies
    </button>
  );
}
