"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  saveCareersPageAction,
  saveContactPageAction,
  saveProjectsPageAction,
  saveServicesPageAction,
} from "@/lib/cms/actions";
import { cn } from "@/lib/utils";
import type {
  CareersPageContent,
  ContactPageContent,
  ProjectsPageContent,
  ServicesPageContent,
} from "@/lib/cms/site-pages";

const pageLinks = [
  { href: "/admin/pages/services", label: "Services" },
  { href: "/admin/pages/recrutement", label: "Recrutement" },
  { href: "/admin/pages/projets", label: "Projets" },
  { href: "/admin/pages/contact", label: "Contact" },
] as const;

export function PagesNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {pageLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium",
            pathname === item.href
              ? "bg-[#065b48] text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-[#065b48]",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function SavedBanner({ children }: { children: string }) {
  return (
    <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {children}
    </p>
  );
}

export function ServicesPageForm({ page }: { page: ServicesPageContent }) {
  return (
    <form action={saveServicesPageAction} className="space-y-8">
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Bandeau du haut</h2>
        <p className="text-sm text-slate-500">
          Titre et introduction verts affichés en haut de la page Services.
        </p>
        <Field id="heroTitle" label="Titre" defaultValue={page.heroTitle} />
        <Area id="heroIntro" label="Introduction" defaultValue={page.heroIntro} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Catalogue des services</h2>
        <p className="text-sm text-slate-500">
          Textes au-dessus des cartes. Le contenu de chaque service se modifie dans Services.
        </p>
        <Field id="catalogEyebrow" label="Pastille" defaultValue={page.catalogEyebrow} />
        <Field id="catalogTitle" label="Titre" defaultValue={page.catalogTitle} />
        <Area id="catalogIntro" label="Texte" defaultValue={page.catalogIntro} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Notre méthode</h2>
        <Field id="methodEyebrow" label="Pastille" defaultValue={page.methodEyebrow} />
        <Field id="methodTitle" label="Titre" defaultValue={page.methodTitle} />
        <div className="grid gap-4 md:grid-cols-2">
          {page.steps.map((step, index) => (
            <PairFields
              key={index}
              prefix="step"
              index={index}
              label={`Étape ${index + 1}`}
              title={step.title}
              text={step.text}
            />
          ))}
        </div>
      </section>

      <PageSubmitButton label="Enregistrer la page Services" />
    </form>
  );
}

export function CareersPageForm({ page, media }: { page: CareersPageContent; media: string[] }) {
  return (
    <form action={saveCareersPageAction} className="space-y-8">
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Bandeau du haut</h2>
        <Field id="heroEyebrow" label="Accroche" defaultValue={page.heroEyebrow} />
        <Field id="heroTitle" label="Titre" defaultValue={page.heroTitle} />
        <Area id="heroIntro" label="Introduction" defaultValue={page.heroIntro} />
        <ImageField name="heroImage" label="Image de fond" defaultValue={page.heroImage} media={media} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Trois atouts</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {page.highlights.map((item, index) => (
            <PairFields
              key={index}
              prefix="highlight"
              index={index}
              label={`Carte ${index + 1}`}
              title={item.title}
              text={item.text}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Profils recherchés</h2>
        <Field id="profilesEyebrow" label="Pastille" defaultValue={page.profilesEyebrow} />
        <Field id="profilesTitle" label="Titre" defaultValue={page.profilesTitle} />
        <Area id="profilesIntro" label="Texte" defaultValue={page.profilesIntro} />
        <Area
          id="positions"
          label="Postes proposés (un par ligne)"
          defaultValue={page.positions.join("\n")}
          rows={8}
          hint="Ces libellés apparaissent en pastilles et dans le menu « Poste visé » du formulaire."
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Formulaire de candidature</h2>
        <Field id="formEyebrow" label="Pastille" defaultValue={page.formEyebrow} />
        <Field id="formTitle" label="Titre" defaultValue={page.formTitle} />
        <Area id="formIntro" label="Texte" defaultValue={page.formIntro} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Colonne de droite</h2>
        <Field id="processEyebrow" label="Accroche du déroulé" defaultValue={page.processEyebrow} />
        <div className="grid gap-4 md:grid-cols-3">
          {page.steps.map((step, index) => (
            <PairFields
              key={index}
              prefix="step"
              index={index}
              label={`Étape ${index + 1}`}
              title={step.title}
              text={step.text}
            />
          ))}
        </div>
        <Field id="documentsTitle" label="Titre des documents" defaultValue={page.documentsTitle} />
        <Area
          id="documents"
          label="Documents acceptés (un par ligne)"
          defaultValue={page.documents.join("\n")}
          rows={4}
        />
        <Field id="contactTitle" label="Titre du contact" defaultValue={page.contactTitle} />
        <Area
          id="contactText"
          label="Texte du contact"
          defaultValue={page.contactText}
          hint="L’adresse e-mail du cabinet (Paramètres) s’affiche juste après ce texte."
        />
      </section>

      <PageSubmitButton label="Enregistrer la page Recrutement" />
    </form>
  );
}

export function ProjectsPageForm({ page }: { page: ProjectsPageContent }) {
  return (
    <form action={saveProjectsPageAction} className="space-y-8">
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Introduction du portfolio</h2>
        <Field id="eyebrow" label="Accroche" defaultValue={page.eyebrow} />
        <Field id="title" label="Titre" defaultValue={page.title} />
        <Area id="intro" label="Texte" defaultValue={page.intro} />
      </section>
      <PageSubmitButton label="Enregistrer la page Projets" />
    </form>
  );
}

export function ContactPageForm({ page, media }: { page: ContactPageContent; media: string[] }) {
  const faqSlots = Array.from({ length: 6 }, (_, index) => page.faqs[index] ?? { q: "", a: "" });
  return (
    <form action={saveContactPageAction} className="space-y-8">
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Bandeau du haut</h2>
        <Field id="heroTitle" label="Titre" defaultValue={page.heroTitle} />
        <Area id="heroIntro" label="Introduction" defaultValue={page.heroIntro} />
        <ImageField name="heroImage" label="Image de fond" defaultValue={page.heroImage} media={media} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Formulaire</h2>
        <Field id="formEyebrow" label="Pastille" defaultValue={page.formEyebrow} />
        <Field id="formTitle" label="Titre" defaultValue={page.formTitle} />
        <Area id="formIntro" label="Texte" defaultValue={page.formIntro} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Coordonnées</h2>
        <p className="text-sm text-slate-500">
          Adresse, téléphones, e-mail et horaires viennent de Paramètres. Ici, seuls les titres de la colonne.
        </p>
        <Field id="infoEyebrow" label="Pastille" defaultValue={page.infoEyebrow} />
        <Field id="infoTitle" label="Titre" defaultValue={page.infoTitle} />
        <Area id="infoIntro" label="Texte" defaultValue={page.infoIntro} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Carte</h2>
        <Field id="mapEyebrow" label="Pastille" defaultValue={page.mapEyebrow} />
        <Field id="mapTitle" label="Titre" defaultValue={page.mapTitle} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Avis clients</h2>
        <Field id="reviewsEyebrow" label="Pastille" defaultValue={page.reviewsEyebrow} />
        <Field id="reviewsTitle" label="Titre" defaultValue={page.reviewsTitle} />
        <Area id="reviewsIntro" label="Texte" defaultValue={page.reviewsIntro} />
        <Area id="reviewsEmpty" label="Message si aucun avis" defaultValue={page.reviewsEmpty} />
        <Field id="reviewsFormTitle" label="Titre du formulaire d’avis" defaultValue={page.reviewsFormTitle} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Questions fréquentes</h2>
        <Field id="faqEyebrow" label="Pastille" defaultValue={page.faqEyebrow} />
        <Field id="faqTitle" label="Titre" defaultValue={page.faqTitle} />
        <div className="grid gap-4 md:grid-cols-2">
          {faqSlots.map((item, index) => (
            <div key={index} className="space-y-2 rounded-xl border border-slate-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Question {index + 1}</p>
              <Input name={`faqQ${index}`} placeholder="Question" defaultValue={item.q} />
              <Textarea name={`faqA${index}`} rows={3} placeholder="Réponse" defaultValue={item.a} />
            </div>
          ))}
        </div>
        <Field id="faqMoreTitle" label="Titre du bloc « autre question »" defaultValue={page.faqMoreTitle} />
        <Area id="faqMoreText" label="Texte du bloc" defaultValue={page.faqMoreText} />
      </section>

      <PageSubmitButton label="Enregistrer la page Contact" />
    </form>
  );
}

function PageSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement…" : label}
    </Button>
  );
}

function Field({
  id,
  label,
  defaultValue,
  hint,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      <Input id={id} name={id} defaultValue={defaultValue} />
    </div>
  );
}

function Area({
  id,
  label,
  defaultValue,
  rows = 3,
  hint,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      <Textarea id={id} name={id} rows={rows} defaultValue={defaultValue} />
    </div>
  );
}

function PairFields({
  prefix,
  index,
  label,
  title,
  text,
}: {
  prefix: string;
  index: number;
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-100 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <Input name={`${prefix}Title${index}`} placeholder="Titre" defaultValue={title} />
      <Textarea name={`${prefix}Text${index}`} rows={3} placeholder="Texte" defaultValue={text} />
    </div>
  );
}
