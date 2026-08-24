"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor, syncRichTextEditors } from "@/components/admin/rich-text-editor";
import { fetchWithTimeout, RequestTimeoutError } from "@/lib/fetch-with-timeout";
import type { LegalDocument, LegalKey } from "@/data/legal";

export function LegalForm({
  pageKey,
  document,
  publicPath,
}: {
  pageKey: LegalKey;
  document: LegalDocument;
  publicPath: string;
}) {
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
        "/api/admin/legal",
        { method: "POST", body: new FormData(form) },
        30_000,
      );
      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !result?.ok) {
        setError(result?.error || "Impossible d’enregistrer cette page.");
        return;
      }
      router.push("/admin/legal?ok=1");
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
      <input type="hidden" name="key" value={pageKey} />
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" defaultValue={document.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="intro">Introduction (bandeau)</Label>
        <Textarea id="intro" name="intro" rows={3} defaultValue={document.intro} />
      </div>
      <RichTextEditor
        name="body"
        label="Contenu"
        defaultValue={document.body}
        description="Utilisez Style → Grand titre pour les rubriques, et ↗ pour ajouter un lien (e-mail, /contact, etc.)."
      />
      <p className="text-xs text-slate-500">
        Les coordonnées de Paramètres ne se recopient pas toutes seules ici. Après un changement d’adresse ou
        d’e-mail, mettez aussi à jour cette page. Aperçu public : {publicPath}
      </p>
      {error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Enregistrement…" : "Enregistrer la page"}
      </Button>
    </form>
  );
}
