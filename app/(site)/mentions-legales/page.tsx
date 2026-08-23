import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Mentions légales",
  description: "Mentions légales de Bureau d'Études et Construction (BEC), Lubumbashi.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <LegalLayout
      title="Mentions légales"
      intro="L’identité de Bureau d’Études et Construction, l’hébergement du site et les règles d’usage des contenus."
    >
      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le site {siteConfig.url} est édité par {siteConfig.name} ({siteConfig.shortName}),
          cabinet d’architecture, d’ingénierie et de construction fondé à Lubumbashi en{" "}
          {siteConfig.founded} par {siteConfig.founders.join(" et ")}.
        </p>
        <ul>
          <li>Dénomination : {siteConfig.legalName}</li>
          <li>Siège : {siteConfig.address.full}</li>
          <li>Téléphones : {siteConfig.phones.join(" · ")}</li>
          <li>
            E-mail : <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </li>
        </ul>
      </section>
      <section>
        <h2>Directeur de la publication</h2>
        <p>
          La publication est assurée par la direction de BEC ({siteConfig.founders.join(" et ")}
          ).
        </p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723,
          États-Unis.
        </p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, photographies, logos et contenus du site sont protégés. Toute
          reproduction non autorisée est interdite, sauf usage privé ou citation courte avec
          mention de la source.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Pour toute question relative au site :{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> ou via la page{" "}
          <a href="/contact">Contact</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
