"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
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
    <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold text-red-700">Une erreur empêche l’affichage de cette rubrique.</p>
      <p className="mt-2 text-sm text-slate-600">Réessayez. Les données déjà enregistrées ne sont pas supprimées.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="rounded-lg bg-[#065b48] px-4 py-2 text-sm font-semibold text-white">
          Réessayer
        </button>
        <Link href="/admin" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
          Tableau de bord
        </Link>
      </div>
    </div>
  );
}
