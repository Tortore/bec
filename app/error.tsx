"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f9f8] px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00af84]">Erreur temporaire</p>
        <h1 className="mt-3 text-2xl font-bold text-[#065b48]">La page n’a pas pu s’afficher</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Le service est temporairement indisponible. Réessayez dans quelques instants ou revenez à l’accueil.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-[#065b48] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00af84]"
          >
            Réessayer
          </button>
          <Link href="/" className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
            Retour à l’accueil
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Recharger la page
          </button>
        </div>
      </div>
    </main>
  );
}
