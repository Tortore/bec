"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/image-field";
import { saveSettingsAction } from "@/lib/cms/actions";
import { defaultFooter } from "@/lib/cms/footer-content";
import type { CmsSettings } from "@/types";

export function SettingsForm({ settings, media }: { settings: CmsSettings; media: string[] }) {
  const footer = settings.footer ?? defaultFooter;
  return (
    <form action={saveSettingsAction} className="space-y-8">
      <Section
        title="Coordonnées"
        description="Affichées dans Informations pratiques (page Contact) et dans le bloc Contact du pied de page."
      >
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" defaultValue={settings.email} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp (indicatif sans +)</Label>
          <Input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="phones">Téléphones (un par ligne)</Label>
          <Textarea id="phones" name="phones" rows={3} defaultValue={settings.phones.join("\n")} />
        </div>
      </Section>

      <Section
        title="Adresse"
        description="Rue, quartier, commune, ville et pays : même texte sur Contact et dans le pied de page."
      >
        <Field id="street" label="Rue / avenue" defaultValue={settings.address.street} />
        <Field id="neighborhood" label="Quartier" defaultValue={settings.address.neighborhood} />
        <Field id="commune" label="Commune" defaultValue={settings.address.commune} />
        <Field id="city" label="Ville" defaultValue={settings.address.city} />
        <Field id="country" label="Pays" defaultValue={settings.address.country} />
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="full">Adresse complète (carte et légende)</Label>
          <Input id="full" name="full" defaultValue={settings.address.full} />
        </div>
      </Section>

      <Section
        title="Identité du site"
        description="Logo et nom affichés dans l’en-tête, le pied de page, le menu mobile et l’administration."
      >
        <div className="md:col-span-2">
          <ImageField
            name="footerLogo"
            label="Logo"
            defaultValue={footer.logo}
            media={media}
            previewClassName="object-contain p-2"
          />
        </div>
        <Field id="footerBrandName" label="Nom court (ex. BEC)" defaultValue={footer.brandName} />
        <Field id="footerBrandSubtitle" label="Nom complet sous le logo" defaultValue={footer.brandSubtitle} />
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tagline">Accroche du pied de page</Label>
          <Textarea id="tagline" name="tagline" rows={2} defaultValue={settings.tagline} />
        </div>
        <Field id="footerWatermark" label="Filigrane du pied de page" defaultValue={footer.watermark} />
      </Section>

      <Section
        title="Pied de page — titres et bouton"
        description="Titres des colonnes, phrase du bloc Contact et bouton de devis."
      >
        <Field id="footerNavTitle" label="Titre colonne Navigation" defaultValue={footer.navigationTitle} />
        <Field id="footerLegalTitle" label="Titre colonne Informations" defaultValue={footer.legalTitle} />
        <Field id="footerContactTitle" label="Titre du bloc Contact" defaultValue={footer.contactTitle} />
        <Field id="footerContactIntro" label="Phrase sous Contact" defaultValue={footer.contactIntro} />
        <Field id="footerCtaLabel" label="Bouton de devis" defaultValue={footer.ctaLabel} />
        <Field id="footerCookiesLabel" label="Lien cookies" defaultValue={footer.cookiesLabel} />
      </Section>

      <Section
        title="Pied de page — liens Navigation"
        description="Libellés uniquement : les pages restent les mêmes."
      >
        <Field id="footerNavHome" label="Accueil" defaultValue={footer.nav.home} />
        <Field id="footerNavAbout" label="À propos" defaultValue={footer.nav.about} />
        <Field id="footerNavServices" label="Services" defaultValue={footer.nav.services} />
        <Field id="footerNavProjects" label="Projets" defaultValue={footer.nav.projects} />
        <Field id="footerNavCareers" label="Recrutement" defaultValue={footer.nav.careers} />
        <Field id="footerNavContact" label="Contact" defaultValue={footer.nav.contact} />
      </Section>

      <Section
        title="Pied de page — liens Informations"
        description="Libellés de la colonne légale. Le contenu des pages se modifie dans le menu Légal."
      >
        <Field id="footerLegalMentions" label="Mentions légales" defaultValue={footer.legal.mentions} />
        <Field id="footerLegalPrivacy" label="Confidentialité" defaultValue={footer.legal.privacy} />
        <Field id="footerLegalCookies" label="Cookies" defaultValue={footer.legal.cookies} />
        <Field id="footerLegalTerms" label="Conditions d’utilisation" defaultValue={footer.legal.terms} />
      </Section>

      <Section
        title="Pied de page — bandeau du bas"
        description="Copyright et lien d’administration."
      >
        <Field id="footerLegalName" label="Nom légal (copyright)" defaultValue={footer.legalName} />
        <Field id="footerCopyrightSuffix" label="Texte après le nom" defaultValue={footer.copyrightSuffix} />
        <Field id="footerAdminLabel" label="Lien administration" defaultValue={footer.adminLabel} />
      </Section>

      <Section
        title="Horaires"
        description="Jours et heures affichés dans Informations pratiques."
      >
        <Field id="hoursWeekDays" label="Jours (ligne 1)" defaultValue={settings.hours[0]?.days} />
        <Field id="hoursWeek" label="Horaires (ligne 1)" defaultValue={settings.hours[0]?.time} />
        <Field id="hoursSaturdayDays" label="Jours (ligne 2)" defaultValue={settings.hours[1]?.days} />
        <Field id="hoursSaturday" label="Horaires (ligne 2)" defaultValue={settings.hours[1]?.time} />
        <Field id="hoursSundayDays" label="Jours (ligne 3)" defaultValue={settings.hours[2]?.days} />
        <Field id="hoursSunday" label="Horaires (ligne 3)" defaultValue={settings.hours[2]?.time} />
      </Section>

      <Section title="Carte" description="Lien et intégration Google Maps de la page Contact.">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mapsUrl">Lien Google Maps</Label>
          <Input id="mapsUrl" name="mapsUrl" defaultValue={settings.mapsUrl} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mapsEmbed">Code d’intégration Maps</Label>
          <Textarea id="mapsEmbed" name="mapsEmbed" rows={3} defaultValue={settings.mapsEmbed} />
        </div>
      </Section>

      <Section
        title="Réseaux sociaux"
        description="Collez l’adresse complète de chaque profil (https://…). Laissez vide ou mettez « # » pour masquer l’icône."
      >
        <Field id="facebook" label="Facebook" defaultValue={settings.social.facebook} />
        <Field id="linkedin" label="LinkedIn" defaultValue={settings.social.linkedin} />
        <Field id="twitter" label="X (anciennement Twitter)" defaultValue={settings.social.twitter} />
        <Field id="instagram" label="Instagram" defaultValue={settings.social.instagram} />
        <Field id="tiktok" label="TikTok" defaultValue={settings.social.tiktok} />
      </Section>

      <Button type="submit">Enregistrer les paramètres</Button>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[#065b48]">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ id, label, defaultValue }: { id: string; label: string; defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} defaultValue={defaultValue} />
    </div>
  );
}
