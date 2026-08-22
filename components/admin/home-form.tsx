import { ImageField } from "@/components/admin/image-field";
import { VideoField } from "@/components/admin/video-field";
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
  return (
    <form action={saveHomeAction} className="space-y-8">
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Bannière (hero)</h2>
        <p className="text-sm text-slate-500">
          Après avoir téléversé ou choisi une image ou une vidéo, cliquez sur « Enregistrer l’accueil » tout en bas
          pour publier la modification.
        </p>
        <Field id="heroBadge" label="Pastille" defaultValue={home.heroBadge} />
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="heroTitle" label="Titre" defaultValue={home.heroTitle} />
          <Field id="heroAccent" label="Accent (ligne verte)" defaultValue={home.heroAccent} />
        </div>
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
        />
        <VideoField name="heroVideo" defaultValue={home.heroVideo} videos={videos} />
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

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#065b48]">Bandeau de contact</h2>
        <Field id="ctaEyebrow" label="Pastille" defaultValue={home.ctaEyebrow} />
        <Field id="ctaTitle" label="Titre" defaultValue={home.ctaTitle} />
        <div className="space-y-2">
          <Label htmlFor="ctaText">Texte</Label>
          <Textarea id="ctaText" name="ctaText" rows={3} defaultValue={home.ctaText} />
        </div>
        <Field id="ctaButton" label="Bouton" defaultValue={home.ctaButton} />
        <div className="space-y-2">
          <Label htmlFor="ctaBenefits">Points (un par ligne)</Label>
          <Textarea id="ctaBenefits" name="ctaBenefits" rows={3} defaultValue={home.ctaBenefits.join("\n")} />
        </div>
      </section>

      <Button type="submit">Enregistrer l’accueil</Button>
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
