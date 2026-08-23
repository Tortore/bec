import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Politique de cookies",
  description: "Politique de cookies de Bureau d'Études et Construction, avec gestion du consentement.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Politique de cookies"
      intro="Les traceurs utilisés sur ce site, et la façon dont vous choisissez ce qui est activé."
    >
      <section>
        <h2>Qu’est-ce qu’un cookie ?</h2>
        <p>
          Un cookie ou un outil similaire (stockage local, traceur) est un petit fichier ou
          identifiant déposé sur votre appareil. BEC n’utilise des traceurs non essentiels
          qu’après votre choix dans la bannière.
        </p>
      </section>
      <section>
        <h2>Cookies et outils utilisés</h2>
        <ul>
          <li>
            <strong>Nécessaires</strong> — mémorisation de votre consentement (stockage local
            « bec-cookie-consent ») ; cookie de session d’administration si vous vous
            connectez à l’espace interne. Ils ne nécessitent pas de consentement.
          </li>
          <li>
            <strong>Mesure d’audience</strong> — Vercel Analytics et, si un identifiant
            Google Analytics est configuré, Google Analytics 4. Uniquement si vous acceptez.
          </li>
          <li>
            <strong>Carte</strong> — iframe Google Maps sur la page Contact, uniquement si
            vous acceptez. Google peut déposer ses propres cookies.
          </li>
        </ul>
      </section>
      <section>
        <h2>Votre choix</h2>
        <p>
          À la première visite, une bannière propose d’accepter, de refuser les options non
          essentielles, ou de personnaliser. Vous pouvez modifier ce choix à tout moment via
          « Gérer les cookies » en bas de page.
        </p>
        <p>
          Le refus n’empêche pas de consulter le site. La carte peut alors être ouverte dans
          Google Maps sans être embarquée ici.
        </p>
      </section>
      <section>
        <h2>Durée</h2>
        <p>
          Votre choix est conservé dans votre navigateur jusqu’à ce que vous le changiez ou
          effaciez les données du site. Le cookie de session admin expire automatiquement.
        </p>
      </section>
      <section>
        <h2>Plus d’informations</h2>
        <p>
          Voir aussi la <a href="/confidentialite">politique de confidentialité</a>. Contact :{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
