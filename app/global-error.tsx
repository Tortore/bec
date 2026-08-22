"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "sans-serif" }}>
          <div style={{ maxWidth: 520, textAlign: "center" }}>
            <h1>Une erreur inattendue est survenue</h1>
            <p>Réessayez. Si le problème continue, rechargez complètement la page.</p>
            <button type="button" onClick={reset} style={{ padding: "12px 20px", cursor: "pointer" }}>
              Réessayer
            </button>
            <p>
              <button type="button" onClick={() => window.location.reload()} style={{ cursor: "pointer" }}>
                Recharger complètement la page
              </button>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
