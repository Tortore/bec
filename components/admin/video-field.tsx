"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Label } from "@/components/ui/label";
import { mediaFileName, runtimeMediaUrl } from "@/lib/media-url";
import { fetchWithTimeout, RequestTimeoutError } from "@/lib/fetch-with-timeout";

const maxVideoSize = 50 * 1024 * 1024;
const videoExt = /\.(mp4|webm|mov|m4v)$/i;

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const playbackSrc = value.startsWith("/") ? runtimeMediaUrl(value) : "";

  function choose(src: string, message: string) {
    setValue(src.trim());
    setError("");
    setOk(message);
  }

  async function onUpload(file: File | undefined) {
    if (!file) return;
    if (!videoExt.test(file.name) && !file.type.startsWith("video/")) {
      setError("Choisissez une vidéo MP4, WebM ou MOV.");
      setOk("");
      return;
    }
    if (file.size > maxVideoSize) {
      setError("La vidéo ne doit pas dépasser 50 Mo. Compressez-la si besoin.");
      setOk("");
      return;
    }
    setUploading(true);
    setError("");
    setOk("");
    const data = new FormData();
    data.set("file", file);
    try {
      const response = await fetchWithTimeout("/api/admin/videos", {
        method: "POST",
        body: data,
      }, 90_000);
      const result = (await response.json().catch(() => null)) as { ok?: boolean; src?: string; error?: string } | null;
      if (!response.ok || !result?.ok || !result.src) {
        setError(result?.error || "Impossible d’enregistrer la vidéo.");
        return;
      }
      choose(result.src, "La vidéo a bien été téléversée. Cliquez sur « Enregistrer l’accueil » tout en bas.");
    } catch (caught) {
      setError(
        caught instanceof RequestTimeoutError
          ? "L’envoi prend trop de temps. Vérifiez votre connexion, puis réessayez."
          : "L’envoi a été interrompu. Vérifiez la connexion, puis réessayez.",
      );
    } finally {
      setUploading(false);
    }
  }

  function removeVideo() {
    choose("", "La vidéo sera retirée après l’enregistrement. L’image sera affichée à sa place.");
    setConfirmOpen(false);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>Vidéo de fond (facultative)</Label>
      <p className="text-sm text-slate-500">
        Téléversez un fichier MP4 (H.264), WebM ou MOV, 50 Mo maximum. Puis enregistrez l’accueil.
      </p>
      {playbackSrc ? (
        <video
          key={playbackSrc}
          className="aspect-video w-full max-w-xl rounded-xl bg-black object-cover"
          src={playbackSrc}
          controls
          muted
          playsInline
          preload="metadata"
          onError={() => {
            setError("Cette vidéo ne peut pas être lue par le navigateur. Utilisez de préférence un MP4 H.264.");
          }}
        />
      ) : null}
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-lg bg-[#065b48] px-3 py-2 text-sm font-medium text-white hover:bg-[#00af84]">
          {uploading ? "Envoi en cours, patientez…" : value ? "Remplacer la vidéo" : "Téléverser une vidéo"}
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-m4v,.mp4,.webm,.mov,.m4v"
            className="hidden"
            disabled={uploading}
            onChange={(event) => {
              onUpload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        {value ? (
          <button
            type="button"
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            onClick={() => setConfirmOpen(true)}
          >
            Retirer la vidéo
          </button>
        ) : null}
      </div>
      <div className="max-w-xl space-y-1">
        <Label htmlFor={name} className="text-xs font-medium text-slate-500">
          Vidéo sélectionnée
        </Label>
        <input
          id={name}
          type="text"
          name={name}
          value={value}
          readOnly
          className="h-11 w-full rounded-md border border-input bg-slate-50 px-3 text-sm text-slate-700"
        />
      </div>
      {videos.length ? (
        <details className="max-w-xl rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <summary className="cursor-pointer text-slate-600">Choisir une vidéo déjà téléversée</summary>
          <select
            className="mt-2 h-11 w-full rounded-md border border-input bg-white px-3 text-sm"
            value={videos.includes(value) ? value : ""}
            onChange={(event) => {
              if (!event.target.value) return;
              choose(event.target.value, "Vidéo sélectionnée. Enregistrez l’accueil pour la publier.");
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
      <ConfirmDialog
        open={confirmOpen}
        title="Retirer la vidéo ?"
        description="La vidéo sera retirée de la bannière après l’enregistrement. L’image sera affichée à sa place."
        confirmLabel="Retirer la vidéo"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={removeVideo}
      />
    </div>
  );
}
