"use client";

import { useState } from "react";
import { ImageField } from "@/components/admin/image-field";
import { VideoField } from "@/components/admin/video-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveHomeAction } from "@/lib/cms/actions";
import type { HomeContent } from "@/types";

export function HomeForm({
  home,
  media,
  videos,
}: {
  home: HomeContent;
  media: string[];
  videos: string[];
}) {
  const [uploadingVideo, setUploadingVideo] = useState(false);

  return (
    <form
      action={saveHomeAction}
      className="space-y-8"
      onSubmit={(event) => {
        if (uploadingVideo) event.preventDefault();
      }}
    >
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Bannière (hero)</h2>
        <p className="text-sm text-slate-500">
          Téléversez une image ou une vidéo (MP4/WebM), puis cliquez sur « Enregistrer l’accueil »
          tout en bas pour publier. Avec une vidéo, vous pouvez supprimer l’image pour ne garder que
          la vidéo.
        </p>
        <RichTextEditor
          name="heroTitle"
          label="Titre"
          preset="title"
          defaultValue={home.heroTitle}
          description="Sélectionnez un mot, puis changez la couleur, le gras ou l’alignement."
        />
        <div className="space-y-2">
          <Label htmlFor="heroSubtitle">Texte d’introduction</Label>
          <Textarea id="heroSubtitle" name="heroSubtitle" rows={3} defaultValue={home.heroSubtitle} />
        </div>
        <Field id="heroLocation" label="Lieu affiché" defaultValue={home.heroLocation} />
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="heroPrimaryLabel" label="Bouton principal" defaultValue={home.heroPrimaryLabel} />
          <Field id="heroSecondaryLabel" label="Bouton secondaire" defaultValue={home.heroSecondaryLabel} />
        </div>
        <ImageField
          name="heroImage"
          label="Image de fond et aperçu de secours"
          defaultValue={home.heroImage}
          media={media}
          clearable
        />
        <VideoField
          name="heroVideo"
          defaultValue={home.heroVideo}
          videos={videos}
          onUploadingChange={setUploadingVideo}
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Chiffres clés</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {home.stats.map((stat, index) => (
            <div key={stat.label} className="space-y-2 rounded-xl border border-slate-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Carte {index + 1}</p>
              <Input name={`statValue${index}`} type="number" defaultValue={stat.value} />
              <Input name={`statSuffix${index}`} placeholder="Suffixe (+ , %…)" defaultValue={stat.suffix} />
              <Input name={`statLabel${index}`} placeholder="Libellé" defaultValue={stat.label} />
              <Input name={`statDescription${index}`} placeholder="Description" defaultValue={stat.description} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Bloc services</h2>
        <Field id="servicesEyebrow" label="Pastille" defaultValue={home.servicesEyebrow} />
        <Field id="servicesTitle" label="Titre" defaultValue={home.servicesTitle} />
        <div className="space-y-2">
          <Label htmlFor="servicesIntro">Texte</Label>
          <Textarea id="servicesIntro" name="servicesIntro" rows={3} defaultValue={home.servicesIntro} />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Bloc projets</h2>
        <Field id="projectsEyebrow" label="Pastille" defaultValue={home.projectsEyebrow} />
        <Field id="projectsTitle" label="Titre" defaultValue={home.projectsTitle} />
        <div className="space-y-2">
          <Label htmlFor="projectsIntro">Texte</Label>
          <Textarea id="projectsIntro" name="projectsIntro" rows={3} defaultValue={home.projectsIntro} />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Bloc équipe</h2>
        <Field id="teamEyebrow" label="Pastille" defaultValue={home.teamEyebrow} />
        <Field id="teamTitle" label="Titre" defaultValue={home.teamTitle} />
        <div className="space-y-2">
          <Label htmlFor="teamIntro">Texte</Label>
          <Textarea id="teamIntro" name="teamIntro" rows={3} defaultValue={home.teamIntro} />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-[#00af84]/25 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-[#00af84]">Bas de l’accueil</p>
          <h2 className="text-lg font-semibold text-[#065b48]">Un projet à concevoir ou à construire ?</h2>
          <p className="mt-1 text-sm text-slate-500">
            C’est le bandeau vert en bas de la page d’accueil. Modifiez ici l’accroche, le titre, le texte et le bouton.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl bg-[#065b48] p-5 text-center text-white">
          <p className="text-xs font-semibold text-white/70">Aperçu</p>
          <p className="mt-2 text-sm font-semibold">{home.ctaEyebrow}</p>
          <p className="mt-1 text-lg font-bold">{home.ctaTitle}</p>
        </div>
        <Field
          id="ctaEyebrow"
          label="Accroche"
          defaultValue={home.ctaEyebrow}
          hint="Phrase courte au-dessus du titre, actuellement « Un projet à concevoir ou à construire ? »."
        />
        <Field id="ctaTitle" label="Titre" defaultValue={home.ctaTitle} />
        <div className="space-y-2">
          <Label htmlFor="ctaText">Texte</Label>
          <Textarea id="ctaText" name="ctaText" rows={3} defaultValue={home.ctaText} />
        </div>
        <Field id="ctaButton" label="Bouton" defaultValue={home.ctaButton} />
        <div className="space-y-2">
          <Label htmlFor="ctaBenefits">Points d’avantage (un par ligne)</Label>
          <Textarea id="ctaBenefits" name="ctaBenefits" rows={3} defaultValue={home.ctaBenefits.join("\n")} />
        </div>
      </section>

      <Button type="submit" disabled={uploadingVideo}>
        {uploadingVideo ? "Envoi de la vidéo…" : "Enregistrer l’accueil"}
      </Button>
    </form>
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
