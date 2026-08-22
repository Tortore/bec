"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryField } from "@/components/admin/gallery-field";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Project } from "@/types";
import { fetchWithTimeout, RequestTimeoutError } from "@/lib/fetch-with-timeout";

export function ProjectForm({
  project,
  media,
  categories,
}: {
  project?: Project;
  media: string[];
  categories: Category[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetchWithTimeout("/api/admin/projects", {
        method: "POST",
        body: new FormData(event.currentTarget),
      }, 30_000);
      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !result?.ok) {
        setError(result?.error || "Impossible d’enregistrer le projet.");
        return;
      }
      router.push("/admin/projets?ok=1");
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
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="currentSlug" value={project?.slug ?? ""} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Titre" name="title" defaultValue={project?.title} required />
        <Field label="Sous-titre" name="subtitle" defaultValue={project?.subtitle} required />
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <select
            id="category"
            name="category"
            defaultValue={project?.category ?? categories[0]?.id}
            className="h-12 w-full rounded-md border border-input bg-white px-3 text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <Field label="Ville" name="city" defaultValue={project?.city} required />
        <Field
          label="Année"
          name="year"
          type="number"
          defaultValue={String(project?.year ?? new Date().getFullYear())}
        />
      </div>
      <ImageField name="cover" label="Image principale" defaultValue={project?.cover} media={media} />
      <GalleryField
        name="images"
        label="Photos complémentaires"
        defaultValue={(project?.images ?? []).filter((src) => src && src !== project?.cover)}
        media={media}
      />
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={6} required defaultValue={project?.description} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="features">Points forts (une ligne = un point)</Label>
        <Textarea id="features" name="features" rows={5} defaultValue={(project?.features ?? []).join("\n")} />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={project?.published !== false} />
          Publié sur le site
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={Boolean(project?.featured)} />
          Mis en avant sur l’accueil
        </label>
      </div>

      <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-600">
          Informations complémentaires
        </summary>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field label="Pays" name="country" defaultValue={project?.country ?? "RDC"} />
          <Field label="Adresse web (optionnel)" name="slug" defaultValue={project?.slug} placeholder="genere-automatiquement" />
          <Field label="Surface" name="area" defaultValue={project?.area} />
          <Field label="Client" name="client" defaultValue={project?.client} />
          <Field label="Durée" name="duration" defaultValue={project?.duration} />
          <Field label="Budget / prix (affiché)" name="price" defaultValue={project?.price} />
        </div>
        <div className="mt-5 space-y-2">
          <Label htmlFor="excerpt">Chapeau (court texte de liste)</Label>
          <Textarea id="excerpt" name="excerpt" rows={3} defaultValue={project?.excerpt} />
        </div>
        <div className="mt-5 space-y-2">
          <Label htmlFor="materials">Matériaux / technique</Label>
          <Textarea id="materials" name="materials" rows={4} defaultValue={(project?.materials ?? []).join("\n")} />
        </div>
      </details>

      {error ? (
        <p role="alert" aria-live="assertive" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Enregistrement…" : project ? "Enregistrer le projet" : "Créer le projet"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
