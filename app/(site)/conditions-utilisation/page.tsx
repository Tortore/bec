import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Conditions d’utilisation",
  description: "Conditions d’utilisation du site Bureau d'Études et Construction.",
  path: "/conditions-utilisation",
});

export default function TermsPage() {
  return (
    <LegalLayout
      title="Conditions d’utilisation"
      intro="Les règles de consultation du site, du formulaire de contact et des contenus présentés."
    >
      <section>
        <h2>Objet</h2>
        <p>
          Les présentes conditions régissent l’accès au site de {siteConfig.name}, vitrine
          d’information et de prise de contact. La consultation du site vaut acceptation de
          ces conditions.
        </p>
      </section>
      <section>
        <h2>Contenu et devis</h2>
        <p>
          Les projets, textes et photographies sont présentés à titre illustratif. Un devis
          ou un contrat n’est formé qu’après échange avec BEC et accord écrit. Les
          informations du site peuvent être mises à jour sans préavis.
        </p>
      </section>
      <section>
        <h2>Usage du site</h2>
        <p>
          Vous vous engagez à ne pas perturber le site, à ne pas envoyer de contenus illicites
          via le formulaire, et à fournir des informations sincères. BEC peut ignorer ou
          supprimer un message abusif.
        </p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Le nom BEC, le logo, les textes et les images restent la propriété de leurs
          titulaires. Toute réutilisation commerciale non autorisée est interdite.
        </p>
      </section>
      <section>
        <h2>Responsabilité</h2>
        <p>
          BEC s’efforce de maintenir un site accessible et exact. Des interruptions,
          erreurs ou liens vers des sites tiers (WhatsApp, Google Maps, réseaux sociaux)
          peuvent survenir. BEC n’est pas responsable du contenu de ces services tiers.
        </p>
      </section>
      <section>
        <h2>Droit applicable</h2>
        <p>
          Les présentes conditions sont régies par le droit de la République Démocratique du
          Congo. En cas de litige, les juridictions de Lubumbashi sont compétentes, sous
          réserve des règles impératives applicables à votre situation.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> — {siteConfig.address.full}
        </p>
      </section>
    </LegalLayout>
  );
}
