"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchWithTimeout, RequestTimeoutError } from "@/lib/fetch-with-timeout";
import type { ServiceItem } from "@/types";

export function ServiceForm({ service, media }: { service?: ServiceItem; media: string[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetchWithTimeout(
        "/api/admin/services",
        { method: "POST", body: new FormData(event.currentTarget) },
        30_000,
      );
      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !result?.ok) {
        setError(result?.error || "Impossible d’enregistrer le service.");
        return;
      }
      router.push("/admin/services?ok=1");
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
      <input type="hidden" name="currentId" value={service?.id ?? ""} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" required minLength={2} defaultValue={service?.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="id">Identifiant (optionnel)</Label>
          <Input id="id" name="id" defaultValue={service?.id} placeholder="genere-automatiquement" />
        </div>
      </div>
      <ImageField name="image" label="Image" defaultValue={service?.image} media={media} required />
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Résumé (cartes)</Label>
        <Textarea
          id="shortDescription"
          name="shortDescription"
          rows={2}
          required
          minLength={10}
          defaultValue={service?.shortDescription}
        />
        <p className="text-xs text-slate-500">Au moins 10 caractères, affiché sur les cartes.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          required
          minLength={20}
          defaultValue={service?.description}
        />
        <p className="text-xs text-slate-500">Au moins 20 caractères, affiché dans la fiche détaillée.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="features">Prestations (une par ligne)</Label>
        <Textarea id="features" name="features" rows={6} defaultValue={(service?.features ?? []).join("\n")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="process">Processus (une étape par ligne : Étape | Description)</Label>
        <Textarea
          id="process"
          name="process"
          rows={6}
          placeholder={"Analyse des besoins | Écoute du projet\nEsquisse | Premières propositions"}
          defaultValue={(service?.process ?? []).map((item) => `${item.step} | ${item.description}`).join("\n")}
        />
      </div>
      {error ? (
        <p role="alert" aria-live="assertive" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Enregistrement…" : service ? "Enregistrer le service" : "Créer le service"}
      </Button>
    </form>
  );
}
