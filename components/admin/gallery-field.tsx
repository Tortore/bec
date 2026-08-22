"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload } from "lucide-react";
import { validateImageFile } from "@/lib/cms/image-file";
import { uploadAdminImage } from "@/lib/cms/upload-client";
import { Label } from "@/components/ui/label";
import { SiteImage } from "@/components/site-image";
import { mediaFileName } from "@/lib/utils";

export function GalleryField({
  name,
  label,
  defaultValue = [],
  media,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  media: string[];
}) {
  const [images, setImages] = useState(defaultValue.filter(Boolean));
  const [pick, setPick] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [uploading, setUploading] = useState(false);

  function add(src: string) {
    const next = src.trim();
    if (!next || images.includes(next)) return;
    setImages((current) => [...current, next]);
  }

  function remove(src: string) {
    setImages((current) => current.filter((item) => item !== src));
  }

  function move(src: string, direction: -1 | 1) {
    setImages((current) => {
      const index = current.indexOf(src);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    setOk("");
    let added = 0;
    try {
      for (const file of Array.from(files)) {
        const invalid = validateImageFile(file);
        if (invalid) {
          setError(invalid);
          break;
        }
        const src = await uploadAdminImage(file);
        add(src);
        added += 1;
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "L’envoi des photos a été interrompu. Réessayez.");
    } finally {
      setUploading(false);
    }
    if (added) {
      setOk(added > 1 ? `${added} photos ont bien été ajoutées.` : "La photo a bien été ajoutée.");
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>{label}</Label>
        <p className="mt-1 text-sm text-slate-500">
          Ajoutez autant de vues que nécessaire (façade, intérieur, pièces, jardin) pour montrer
          l’ensemble de la maison. Elles s’affichent avec la photo principale sur la fiche projet.
        </p>
      </div>
      <input type="hidden" name={name} value={images.join("\n")} />

      {images.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, index) => (
            <li key={`${src}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <div className="relative aspect-[4/3]">
                <SiteImage src={src} alt="" fill sizes="280px" className="object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-0.5 text-[11px] font-semibold text-white">
                  Vue {index + 1}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-600 hover:bg-white disabled:opacity-30"
                    onClick={() => move(src, -1)}
                    disabled={index === 0}
                    aria-label="Monter"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-600 hover:bg-white disabled:opacity-30"
                    onClick={() => move(src, 1)}
                    disabled={index === images.length - 1}
                    aria-label="Descendre"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  onClick={() => remove(src)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Retirer
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Aucune vue complémentaire pour le moment.
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-end">
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#065b48] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#00af84]">
          <Upload className="h-4 w-4" />
          {uploading ? "Envoi…" : "Téléverser des photos"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            multiple
            className="hidden"
            onChange={(event) => {
              onUpload(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
        <details className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <summary className="cursor-pointer text-slate-600">Choisir une photo déjà en ligne</summary>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <select
              id={`${name}-pick`}
              className="h-11 w-full rounded-md border border-input bg-white px-3 text-sm"
              value={pick}
              onChange={(event) => setPick(event.target.value)}
            >
              <option value="">Sélectionner</option>
              {media.map((src) => (
                <option key={src} value={src}>
                  {mediaFileName(src)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                add(pick);
                setPick("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </div>
        </details>
      </div>
      {ok ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{ok}</p> : null}
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
