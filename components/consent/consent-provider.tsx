"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { defaultChoices, readConsent, writeConsent, type ConsentChoices } from "@/lib/consent";

type ConsentContextValue = {
  ready: boolean;
  choices: ConsentChoices;
  decided: boolean;
  bannerOpen: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  saveChoices: (choices: ConsentChoices) => void;
  openBanner: () => void;
};

export const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const value = useContext(ConsentContext);
  if (!value) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return value;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [choices, setChoices] = useState<ConsentChoices>(defaultChoices);
  const [decided, setDecided] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(defaultChoices);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setChoices({ analytics: stored.analytics, maps: stored.maps });
      setDecided(true);
    } else {
      setBannerOpen(true);
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: ConsentChoices) => {
    writeConsent(next);
    setChoices(next);
    setDecided(true);
    setBannerOpen(false);
    setCustomize(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      ready,
      choices,
      decided,
      bannerOpen,
      acceptAll: () => persist({ analytics: true, maps: true }),
      rejectOptional: () => persist({ analytics: false, maps: false }),
      saveChoices: persist,
      openBanner: () => {
        setDraft(choices);
        setCustomize(true);
        setBannerOpen(true);
      },
    }),
    [ready, choices, decided, bannerOpen, persist],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {ready && bannerOpen ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[80] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6"
          role="dialog"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-text"
        >
          <div className="mx-auto max-h-[min(85dvh,36rem)] max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
            <p id="cookie-title" className="text-base font-semibold text-[#065b48]">
              Cookies et confidentialité
            </p>
            <p id="cookie-text" className="mt-2 text-sm leading-relaxed text-slate-600">
              BEC utilise des cookies et outils similaires : indispensables au fonctionnement du
              site, mesure d’audience interne, Vercel Analytics, Google Analytics et carte Google Maps. Vous pouvez tout
              accepter, tout refuser hors cookies nécessaires, ou choisir. Détails :{" "}
              <Link href="/cookies" className="font-medium text-[#00af84] hover:text-[#065b48]">
                politique de cookies
              </Link>
              .
            </p>
            {customize ? (
              <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                <label className="flex items-start gap-3 text-slate-700">
                  <input type="checkbox" checked disabled className="mt-1" />
                  <span>
                    <span className="font-medium">Nécessaires</span> — mémorisation de votre choix
                    et connexion à l’administration. Toujours actifs.
                  </span>
                </label>
                <label className="flex items-start gap-3 text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={draft.analytics}
                    onChange={(event) => setDraft((current) => ({ ...current, analytics: event.target.checked }))}
                  />
                  <span>
                    <span className="font-medium">Mesure d’audience</span> — statistiques de
                    fréquentation interne, Vercel Analytics et Google Analytics.
                  </span>
                </label>
                <label className="flex items-start gap-3 text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={draft.maps}
                    onChange={(event) => setDraft((current) => ({ ...current, maps: event.target.checked }))}
                  />
                  <span>
                    <span className="font-medium">Carte</span> — affichage de Google Maps sur la
                    page Contact.
                  </span>
                </label>
              </div>
            ) : null}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                className="rounded-lg bg-[#00af84] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#065b48]"
                onClick={value.acceptAll}
              >
                Tout accepter
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={value.rejectOptional}
              >
                Tout refuser
              </button>
              {customize ? (
                <button
                  type="button"
                  className="rounded-lg bg-[#065b48] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#044a3a]"
                  onClick={() => persist(draft)}
                >
                  Enregistrer mes choix
                </button>
              ) : (
                <button
                  type="button"
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#065b48] hover:underline"
                  onClick={() => {
                    setDraft(choices);
                    setCustomize(true);
                  }}
                >
                  Personnaliser
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </ConsentContext.Provider>
  );
}
