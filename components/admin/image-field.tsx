"use client";

import { useState } from "react";
import { validateImageFile } from "@/lib/cms/image-file";
import { uploadAdminImage } from "@/lib/cms/upload-client";
import { Label } from "@/components/ui/label";
import { SiteImage } from "@/components/site-image";
import { mediaFileName } from "@/lib/utils";

export function ImageField({
  name,
  label,
  defaultValue = "",
  media,
  previewClassName = "object-cover",
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  media: string[];
  previewClassName?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [uploading, setUploading] = useState(false);

  function choose(src: string, message: string) {
    setValue(src.trim());
    setError("");
    setOk(message);
  }

  async function onUpload(file: File | undefined) {
    if (!file) return;
    const invalid = validateImageFile(file);
    if (invalid) {
      setError(invalid);
      setOk("");
      return;
    }
    setUploading(true);
    setError("");
    setOk("");
    try {
      const src = await uploadAdminImage(file);
      choose(src, "L’image a bien été ajoutée. Enregistrez le formulaire pour la publier.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "L’envoi de l’image a été interrompu. Réessayez.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid gap-3 md:grid-cols-[8rem_1fr]">
        <div className="relative h-36 overflow-hidden rounded-xl bg-[#065b48]">
          {value ? (
            <SiteImage key={value} src={value} alt="" fill className={previewClassName} sizes="160px" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-white/60">Aperçu</span>
          )}
        </div>
        <div className="space-y-2">
          <label className="inline-flex cursor-pointer items-center rounded-lg bg-[#065b48] px-3 py-2 text-sm font-medium text-white hover:bg-[#00af84]">
            {uploading ? "Envoi…" : "Téléverser une image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="hidden"
              onChange={(event) => {
                onUpload(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          <div className="space-y-1">
            <Label htmlFor={name} className="text-xs font-medium text-slate-500">
              Image sélectionnée
            </Label>
            <input
              id={name}
              type="text"
              name={name}
              value={value}
              required={required}
              onChange={(event) => {
                setValue(event.target.value);
                setError("");
                setOk("");
              }}
              placeholder="/images/maison.jpg"
              className="h-11 w-full rounded-md border border-input bg-white px-3 text-sm"
            />
          </div>
          <details className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <summary className="cursor-pointer text-slate-600">Choisir une photo déjà en ligne</summary>
            <select
              className="mt-2 h-11 w-full rounded-md border border-input bg-white px-3 text-sm"
              value={media.includes(value) ? value : ""}
              onChange={(event) => {
                if (!event.target.value) return;
                choose(event.target.value, "Photo sélectionnée. Enregistrez le formulaire pour la publier.");
              }}
            >
              <option value="">Sélectionner</option>
              {media.map((src) => (
                <option key={src} value={src}>
                  {mediaFileName(src)}
                </option>
              ))}
            </select>
          </details>
          {ok ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{ok}</p> : null}
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
