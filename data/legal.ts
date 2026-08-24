import { siteConfig } from "@/lib/site";

export const legalSlugs = [
  "mentions-legales",
  "confidentialite",
  "cookies",
  "conditions-utilisation",
] as const;

export type LegalSlug = (typeof legalSlugs)[number];
export type LegalKey = "mentions" | "privacy" | "cookies" | "terms";

export type LegalDocument = {
  title: string;
  intro: string;
  body: string;
  updatedAt: string;
};

export type LegalPagesContent = Record<LegalKey, LegalDocument>;

export const legalPagesMeta: {
  slug: LegalSlug;
  key: LegalKey;
  label: string;
  path: string;
}[] = [
  { slug: "mentions-legales", key: "mentions", label: "Mentions légales", path: "/mentions-legales" },
  { slug: "confidentialite", key: "privacy", label: "Confidentialité", path: "/confidentialite" },
  { slug: "cookies", key: "cookies", label: "Cookies", path: "/cookies" },
  { slug: "conditions-utilisation", key: "terms", label: "Conditions d’utilisation", path: "/conditions-utilisation" },
];

const updatedAt = "2026-08-20T12:00:00.000Z";

export const defaultLegalPages: LegalPagesContent = {
  mentions: {
    title: "Mentions légales",
    intro:
      "L’identité de Bureau d’Études et Construction, l’hébergement du site et les règles d’usage des contenus.",
    updatedAt,
    body: `
<section>
  <h2>Éditeur du site</h2>
  <p>Le site ${siteConfig.url} est édité par ${siteConfig.name} (${siteConfig.shortName}), cabinet d’architecture, d’ingénierie et de construction fondé à Lubumbashi en ${siteConfig.founded} par ${siteConfig.founders.join(" et ")}.</p>
  <ul>
    <li>Dénomination : ${siteConfig.legalName}</li>
    <li>Siège : ${siteConfig.address.full}</li>
    <li>Téléphones : ${siteConfig.phones.join(" · ")}</li>
    <li>E-mail : <a href="mailto:${siteConfig.email}">${siteConfig.email}</a></li>
  </ul>
</section>
<section>
  <h2>Directeur de la publication</h2>
  <p>La publication est assurée par la direction de BEC (${siteConfig.founders.join(" et ")}).</p>
</section>
<section>
  <h2>Hébergement</h2>
  <p>Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis.</p>
</section>
<section>
  <h2>Propriété intellectuelle</h2>
  <p>Les textes, photographies, logos et contenus du site sont protégés. Toute reproduction non autorisée est interdite, sauf usage privé ou citation courte avec mention de la source.</p>
</section>
<section>
  <h2>Contact</h2>
  <p>Pour toute question relative au site : <a href="mailto:${siteConfig.email}">${siteConfig.email}</a> ou via la page <a href="/contact">Contact</a>.</p>
</section>`.trim(),
  },
  privacy: {
    title: "Politique de confidentialité",
    intro: "Comment BEC collecte, utilise et protège vos données, et quels droits vous pouvez exercer.",
    updatedAt,
    body: `
<section>
  <h2>1. Responsable du traitement</h2>
  <p>${siteConfig.name} (${siteConfig.shortName}), ${siteConfig.address.full}, e-mail <a href="mailto:${siteConfig.email}">${siteConfig.email}</a>, est responsable du traitement des données personnelles collectées via ce site.</p>
  <p>Cette politique s’inspire du règlement européen (UE) 2016/679 (RGPD) et tient compte de la loi n° 20/017 du 2 juillet 2020 relative à la protection des données à caractère personnel en République Démocratique du Congo.</p>
</section>
<section>
  <h2>2. Données collectées</h2>
  <ul>
    <li>Formulaire de contact : nom, e-mail, téléphone (facultatif), sujet et message.</li>
    <li>Candidatures envoyées par e-mail : les informations que vous choisissez de transmettre.</li>
    <li>Données de navigation, uniquement si vous acceptez la mesure d’audience : pages consultées, date et données techniques agrégées (Vercel Analytics, éventuellement Google Analytics 4 si vous acceptez la mesure d’audience).</li>
    <li>Cookies et outils similaires décrits dans la <a href="/cookies">politique de cookies</a>.</li>
  </ul>
  <p>Nous ne demandons pas de données sensibles (santé, opinions, etc.).</p>
</section>
<section>
  <h2>3. Finalités et bases légales</h2>
  <ul>
    <li>Répondre à une demande de devis ou de renseignement : exécution de mesures précontractuelles et consentement (case du formulaire).</li>
    <li>Assurer le fonctionnement et la sécurité du site : intérêt légitime.</li>
    <li>Mesure d’audience : consentement.</li>
    <li>Affichage de la carte Google Maps : consentement.</li>
  </ul>
</section>
<section>
  <h2>4. Destinataires</h2>
  <p>Les messages sont lus par l’équipe BEC. Ils ne sont pas vendus. Des prestataires techniques (hébergement Vercel, éventuellement Google pour la carte) peuvent traiter des données pour notre compte, dans la limite de leurs fonctions.</p>
</section>
<section>
  <h2>5. Transferts hors RDC / Union européenne</h2>
  <p>L’hébergement et l’éventuelle mesure d’audience (Vercel) peuvent impliquer un traitement aux États-Unis. La carte Google Maps peut également transférer des données vers Google. Ces outils ne sont activés (hors hébergement du site) qu’avec votre consentement lorsqu’il s’agit de cookies non essentiels.</p>
</section>
<section>
  <h2>6. Durées de conservation</h2>
  <ul>
    <li>Messages de contact : le temps de traiter la demande, puis jusqu’à 3 ans pour le suivi, sauf obligation légale contraire.</li>
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
  <p>Pour exercer ces droits : <a href="mailto:${siteConfig.email}">${siteConfig.email}</a> ou courrier à l’adresse du siège. Vous pouvez aussi introduire une réclamation auprès de l’autorité compétente de votre pays de résidence.</p>
</section>
<section>
  <h2>8. Sécurité</h2>
  <p>L’accès à l’espace d’administration est protégé. Les messages sont stockés sur notre base interne. Aucun système n’est infaillible ; signalez-nous tout doute à ${siteConfig.email}.</p>
</section>`.trim(),
  },
  cookies: {
    title: "Politique de cookies",
    intro: "Les traceurs utilisés sur ce site, et la façon dont vous choisissez ce qui est activé.",
    updatedAt,
    body: `
<section>
  <h2>Qu’est-ce qu’un cookie ?</h2>
  <p>Un cookie ou un outil similaire (stockage local, traceur) est un petit fichier ou identifiant déposé sur votre appareil. BEC n’utilise des traceurs non essentiels qu’après votre choix dans la bannière.</p>
</section>
<section>
  <h2>Cookies et outils utilisés</h2>
  <ul>
    <li><strong>Nécessaires</strong> — mémorisation de votre consentement (stockage local « bec-cookie-consent ») ; cookie de session d’administration si vous vous connectez à l’espace interne. Ils ne nécessitent pas de consentement.</li>
    <li><strong>Mesure d’audience</strong> — Vercel Analytics et, si un identifiant Google Analytics est configuré, Google Analytics 4. Uniquement si vous acceptez.</li>
    <li><strong>Carte</strong> — iframe Google Maps sur la page Contact, uniquement si vous acceptez. Google peut déposer ses propres cookies.</li>
  </ul>
</section>
<section>
  <h2>Votre choix</h2>
  <p>À la première visite, une bannière propose d’accepter, de refuser les options non essentielles, ou de personnaliser. Vous pouvez modifier ce choix à tout moment via « Gérer les cookies » en bas de page.</p>
  <p>Le refus n’empêche pas de consulter le site. La carte peut alors être ouverte dans Google Maps sans être embarquée ici.</p>
</section>
<section>
  <h2>Durée</h2>
  <p>Votre choix est conservé dans votre navigateur jusqu’à ce que vous le changiez ou effaciez les données du site. Le cookie de session admin expire automatiquement.</p>
</section>
<section>
  <h2>Plus d’informations</h2>
  <p>Voir aussi la <a href="/confidentialite">politique de confidentialité</a>. Contact : <a href="mailto:${siteConfig.email}">${siteConfig.email}</a>.</p>
</section>`.trim(),
  },
  terms: {
    title: "Conditions d’utilisation",
    intro: "Les règles de consultation du site, du formulaire de contact et des contenus présentés.",
    updatedAt,
    body: `
<section>
  <h2>Objet</h2>
  <p>Les présentes conditions régissent l’accès au site de ${siteConfig.name}, vitrine d’information et de prise de contact. La consultation du site vaut acceptation de ces conditions.</p>
</section>
<section>
  <h2>Contenu et devis</h2>
  <p>Les projets, textes et photographies sont présentés à titre illustratif. Un devis ou un contrat n’est formé qu’après échange avec BEC et accord écrit. Les informations du site peuvent être mises à jour sans préavis.</p>
</section>
<section>
  <h2>Usage du site</h2>
  <p>Vous vous engagez à ne pas perturber le site, à ne pas envoyer de contenus illicites via le formulaire, et à fournir des informations sincères. BEC peut ignorer ou supprimer un message abusif.</p>
</section>
<section>
  <h2>Propriété intellectuelle</h2>
  <p>Le nom BEC, le logo, les textes et les images restent la propriété de leurs titulaires. Toute réutilisation commerciale non autorisée est interdite.</p>
</section>
<section>
  <h2>Responsabilité</h2>
  <p>BEC s’efforce de maintenir un site accessible et exact. Des interruptions, erreurs ou liens vers des sites tiers (WhatsApp, Google Maps, réseaux sociaux) peuvent survenir. BEC n’est pas responsable du contenu de ces services tiers.</p>
</section>
<section>
  <h2>Droit applicable</h2>
  <p>Les présentes conditions sont régies par le droit de la République Démocratique du Congo. En cas de litige, les juridictions de Lubumbashi sont compétentes, sous réserve des règles impératives applicables à votre situation.</p>
</section>
<section>
  <h2>Contact</h2>
  <p><a href="mailto:${siteConfig.email}">${siteConfig.email}</a> — ${siteConfig.address.full}</p>
</section>`.trim(),
  },
};

export function legalMetaBySlug(slug: string) {
  return legalPagesMeta.find((item) => item.slug === slug);
}
