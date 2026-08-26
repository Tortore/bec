"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/image-field";
import { RichTextEditor, syncRichTextEditors } from "@/components/admin/rich-text-editor";
import { fetchWithTimeout, RequestTimeoutError } from "@/lib/fetch-with-timeout";
import type { CompanyContent } from "@/lib/cms/company-content";

export function CompanyForm({ company, media }: { company: CompanyContent; media: string[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    syncRichTextEditors(form);
    setSaving(true);
    setError("");
    try {
      const response = await fetchWithTimeout(
        "/api/admin/company",
        { method: "POST", body: new FormData(form) },
        30_000,
      );
      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !result?.ok) {
        setError(result?.error || "Impossible d’enregistrer les textes du cabinet.");
        return;
      }
      router.push("/admin/cabinet?ok=1");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof RequestTimeoutError
          ? "Le serveur met trop de temps à répondre. Vérifiez votre connexion puis réessayez."
          : "La connexion au serveur a été interrompue. Réessayez sans fermer cette page.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Image de bannière</h2>
        <p className="text-sm text-slate-500">
          Ces deux textes apparaissent directement sur la grande image en haut de la page À propos.
        </p>
        <Field id="historyTitle" label="Titre affiché sur l’image" defaultValue={company.history.title} />
        <Lines
          id="heroSubtitle"
          label="Texte affiché sous le titre sur l’image"
          rows={2}
          defaultValue={company.page.heroSubtitle}
        />
        <ImageField name="heroImage" label="Image de bannière" defaultValue={company.page.heroImage} media={media} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Contenu après la bannière</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="historyEyebrow"
            label="Pastille avant le titre"
            defaultValue={company.page.historyEyebrow}
          />
          <Field
            id="historyHeading"
            label="Titre affiché après l’image de bannière"
            defaultValue={company.page.historyHeading}
          />
        </div>
        <RichTextEditor
          name="historyFounding"
          label="Phrase de fondation"
          defaultValue={company.history.founding}
          description="Premier paragraphe sous le titre d’histoire."
        />
        <RichTextEditor
          name="historyLead"
          label="Introduction"
          defaultValue={company.history.lead}
          description="Vous pouvez mettre le texte en forme, le colorer et modifier son alignement."
        />
        <RichTextEditor name="historyBody" label="Texte de présentation" defaultValue={company.history.body} />
        <ImageField
          name="historyImage"
          label="Photo à droite"
          defaultValue={company.page.historyImage}
          media={media}
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="historyBadge" label="Pastille sur la photo" defaultValue={company.page.historyBadge} />
          <Field id="historyLocation" label="Lieu sur la photo" defaultValue={company.page.historyLocation} />
        </div>
        <Field id="hqTitle" label="Titre du bloc siège" defaultValue={company.page.hqTitle} />
        <p className="text-xs text-slate-500">
          L’adresse du siège se modifie dans Paramètres. Les villes ci-dessous apparaissent sous le siège.
        </p>
        <Lines id="cities" label="Villes d’intervention (une par ligne)" rows={4} defaultValue={company.page.cities.join("\n")} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Vision et mission</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="visionEyebrow" label="Pastille" defaultValue={company.page.visionEyebrow} />
          <Field id="visionHeading" label="Titre de section" defaultValue={company.page.visionHeading} />
          <Field id="visionTitle" label="Titre Vision" defaultValue={company.page.visionTitle} />
          <Field id="missionTitle" label="Titre Mission" defaultValue={company.page.missionTitle} />
        </div>
        <RichTextEditor name="vision" label="Vision" defaultValue={company.vision} />
        <RichTextEditor name="missionLead" label="Mission — introduction" defaultValue={company.mission.lead} />
        <Lines
          id="missionItems"
          label="Mission — points (un par ligne)"
          rows={5}
          defaultValue={company.mission.items.join("\n")}
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Équipe (textes de la page À propos)</h2>
        <p className="text-sm text-slate-500">Les fiches collaborateurs se gèrent dans le menu Équipe.</p>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="teamEyebrow" label="Pastille" defaultValue={company.page.teamEyebrow} />
          <Field id="teamHeading" label="Titre de section" defaultValue={company.page.teamHeading} />
        </div>
        <Lines id="teamLead" label="Introduction" rows={3} defaultValue={company.teamIntro.lead} />
        <Lines
          id="teamProfiles"
          label="Profils (un par ligne)"
          rows={4}
          defaultValue={company.teamIntro.profiles.join("\n")}
        />
        <Lines id="teamPhilosophy" label="Philosophie" rows={3} defaultValue={company.teamIntro.philosophy} />
      </section>

      {error ? (
        <p role="alert" aria-live="assertive" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Enregistrement…" : "Enregistrer le cabinet"}
      </Button>
    </form>
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

function Lines({
  id,
  label,
  rows,
  defaultValue,
}: {
  id: string;
  label: string;
  rows: number;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} name={id} rows={rows} defaultValue={defaultValue} />
    </div>
  );
}
