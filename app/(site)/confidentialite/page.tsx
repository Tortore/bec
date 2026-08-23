import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité RGPD de Bureau d'Études et Construction : données collectées, finalités, durées et vos droits.",
  path: "/confidentialite",
});

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      intro="Comment BEC collecte, utilise et protège vos données, et quels droits vous pouvez exercer."
    >
      <section>
        <h2>1. Responsable du traitement</h2>
        <p>
          {siteConfig.name} ({siteConfig.shortName}), {siteConfig.address.full}, e-mail{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>, est responsable du
          traitement des données personnelles collectées via ce site.
        </p>
        <p>
          Cette politique s’inspire du règlement européen (UE) 2016/679 (RGPD) et tient compte
          de la loi n° 20/017 du 2 juillet 2020 relative à la protection des données à
          caractère personnel en République Démocratique du Congo.
        </p>
      </section>
      <section>
        <h2>2. Données collectées</h2>
        <ul>
          <li>
            Formulaire de contact : nom, e-mail, téléphone (facultatif), sujet et message.
          </li>
          <li>
            Candidatures envoyées par e-mail : les informations que vous choisissez de
            transmettre.
          </li>
          <li>
            Données de navigation, uniquement si vous acceptez la mesure d’audience : pages
            consultées, date et données techniques agrégées (Vercel Analytics, éventuellement
            Google Analytics 4 si vous acceptez la mesure d’audience).
          </li>
          <li>
            Cookies et outils similaires décrits dans la{" "}
            <a href="/cookies">politique de cookies</a>.
          </li>
        </ul>
        <p>Nous ne demandons pas de données sensibles (santé, opinions, etc.).</p>
      </section>
      <section>
        <h2>3. Finalités et bases légales</h2>
        <ul>
          <li>
            Répondre à une demande de devis ou de renseignement : exécution de mesures
            précontractuelles et consentement (case du formulaire).
          </li>
          <li>Assurer le fonctionnement et la sécurité du site : intérêt légitime.</li>
          <li>Mesure d’audience : consentement.</li>
          <li>Affichage de la carte Google Maps : consentement.</li>
        </ul>
      </section>
      <section>
        <h2>4. Destinataires</h2>
        <p>
          Les messages sont lus par l’équipe BEC. Ils ne sont pas vendus. Des prestataires
          techniques (hébergement Vercel, éventuellement Google pour la carte) peuvent traiter
          des données pour notre compte, dans la limite de leurs fonctions.
        </p>
      </section>
      <section>
        <h2>5. Transferts hors RDC / Union européenne</h2>
        <p>
          L’hébergement et l’éventuelle mesure d’audience (Vercel) peuvent impliquer un
          traitement aux États-Unis. La carte Google Maps peut également transférer des
          données vers Google. Ces outils ne sont activés (hors hébergement du site) qu’avec
          votre consentement lorsqu’il s’agit de cookies non essentiels.
        </p>
      </section>
      <section>
        <h2>6. Durées de conservation</h2>
        <ul>
          <li>
            Messages de contact : le temps de traiter la demande, puis jusqu’à 3 ans pour le
            suivi, sauf obligation légale contraire.
          </li>
          <li>Candidatures : durée du recrutement, puis suppression ou archivage limité.</li>
          <li>Choix cookies : jusqu’à modification ou suppression de vos données locales.</li>
        </ul>
      </section>
      <section>
        <h2>7. Vos droits</h2>
        <p>Vous pouvez demander :</p>
        <ul>
          <li>l’accès à vos données ;</li>
          <li>leur rectification ;</li>
          <li>leur effacement ;</li>
          <li>la limitation du traitement ;</li>
          <li>l’opposition, lorsque le traitement repose sur l’intérêt légitime ;</li>
          <li>la portabilité, lorsque le traitement repose sur le consentement ou un contrat ;</li>
          <li>le retrait de votre consentement, à tout moment, sans effet rétroactif.</li>
        </ul>
        <p>
          Pour exercer ces droits : <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>{" "}
          ou courrier à l’adresse du siège. Vous pouvez aussi introduire une réclamation
          auprès de l’autorité compétente de votre pays de résidence.
        </p>
      </section>
      <section>
        <h2>8. Sécurité</h2>
        <p>
          L’accès à l’espace d’administration est protégé. Les messages sont stockés sur
          notre base interne. Aucun système n’est infaillible ; signalez-nous tout doute à{" "}
          {siteConfig.email}.
        </p>
      </section>
    </LegalLayout>
  );
}
