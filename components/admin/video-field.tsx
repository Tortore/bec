"use client";

import { useState } from "react";
import { uploadVideoAction } from "@/lib/cms/actions";
import { Label } from "@/components/ui/label";
import { mediaFileName, runtimeMediaUrl } from "@/lib/utils";

const maxVideoSize = 50 * 1024 * 1024;
const videoTypes = new Set(["video/mp4", "video/webm"]);

export function VideoField({
  name,
  defaultValue = "",
  videos,
}: {
  name: string;
  defaultValue?: string;
  videos: string[];
}) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [uploading, setUploading] = useState(false);

  async function onUpload(file: File | undefined) {
    if (!file) return;
    if (!videoTypes.has(file.type)) {
      setError("Choisissez une vidéo MP4 ou WebM.");
      setOk("");
      return;
    }
    if (file.size > maxVideoSize) {
      setError("La vidéo ne doit pas dépasser 50 Mo.");
      setOk("");
      return;
    }
    setUploading(true);
    setError("");
    setOk("");
    const data = new FormData();
    data.set("file", file);
    const result = await uploadVideoAction(data);
    setUploading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setValue(result.src);
    setOk("La vidéo a bien été ajoutée. Enregistrez l’accueil pour la publier.");
  }

  function removeVideo() {
    setValue("");
    setError("");
    setOk("La vidéo sera retirée après l’enregistrement. L’image sera affichée à sa place.");
  }

  return (
    <div className="space-y-2">
      <Label>Vidéo de fond (facultative)</Label>
      <input type="hidden" name={name} value={value} />
      <p className="text-sm text-slate-500">
        MP4 ou WebM, 50 Mo maximum. Sans vidéo, l’image ci-dessus reste affichée.
      </p>
      {value ? (
        <video
          className="aspect-video w-full max-w-xl rounded-xl bg-black object-cover"
          src={runtimeMediaUrl(value)}
          controls
          muted
          playsInline
          preload="metadata"
        />
      ) : null}
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-lg bg-[#065b48] px-3 py-2 text-sm font-medium text-white hover:bg-[#00af84]">
          {uploading ? "Envoi…" : value ? "Remplacer la vidéo" : "Téléverser une vidéo"}
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            disabled={uploading}
            onChange={(event) => onUpload(event.target.files?.[0])}
          />
        </label>
        {value ? (
          <button
            type="button"
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            onClick={removeVideo}
          >
            Retirer la vidéo
          </button>
        ) : null}
      </div>
      {videos.length ? (
        <details className="max-w-xl rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <summary className="cursor-pointer text-slate-600">Choisir une vidéo déjà téléversée</summary>
          <select
            className="mt-2 h-11 w-full rounded-md border border-input bg-white px-3 text-sm"
            value={videos.includes(value) ? value : ""}
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
              setOk("");
            }}
          >
            <option value="">Sélectionner</option>
            {videos.map((src) => (
              <option key={src} value={src}>
                {mediaFileName(src)}
              </option>
            ))}
          </select>
        </details>
      ) : null}
      {ok ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{ok}</p> : null}
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
