"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Label } from "@/components/ui/label";
import { fetchWithTimeout, RequestTimeoutError } from "@/lib/fetch-with-timeout";
import { mediaFileName, runtimeMediaUrl } from "@/lib/media-url";
import { parseYouTube, youtubeEmbedUrl } from "@/lib/cms/youtube";

const maxVideoSize = 50 * 1024 * 1024;
const videoExt = /\.(mp4|webm|mov|m4v)$/i;

export function ProjectVideoField({
  name,
  defaultValue = "",
  videos,
  onUploadingChange,
}: {
  name: string;
  defaultValue?: string;
  videos: string[];
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const youtube = parseYouTube(value);
  const localSrc = value.startsWith("/") ? runtimeMediaUrl(value) : "";

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
      setError("La vidéo ne doit pas dépasser 50 Mo. Préférez un lien YouTube pour les fichiers plus lourds.");
      setOk("");
      return;
    }
    setUploading(true);
    onUploadingChange?.(true);
    setError("");
    setOk("");
    const data = new FormData();
    data.set("file", file);
    try {
      const response = await fetchWithTimeout("/api/admin/videos", { method: "POST", body: data }, 90_000);
      const result = (await response.json().catch(() => null)) as { ok?: boolean; src?: string; error?: string } | null;
      if (!response.ok || !result?.ok || !result.src) {
        setError(result?.error || "Impossible d’enregistrer la vidéo.");
        return;
      }
      choose(result.src, "Vidéo téléversée. Enregistrez le projet pour la publier sur la fiche.");
    } catch (caught) {
      setError(
        caught instanceof RequestTimeoutError
          ? "L’envoi prend trop de temps. Utilisez plutôt un lien YouTube, ou réessayez."
          : "L’envoi a été interrompu. Vérifiez la connexion, puis réessayez.",
      );
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
      <div>
        <Label htmlFor={name}>Vidéo du projet (facultative)</Label>
        <p className="mt-1 text-sm text-slate-500">
          Collez un lien YouTube, ou téléversez un MP4 H.264 optimisé « Fast Start » (50 Mo max).
        </p>
      </div>

      {youtube ? (
        <div className="overflow-hidden rounded-xl bg-black">
          <iframe
            title="Aperçu YouTube"
            src={youtubeEmbedUrl(youtube)}
            className="aspect-video w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : localSrc ? (
        <video
          key={localSrc}
          className="aspect-video w-full rounded-xl bg-black object-cover"
          src={localSrc}
          controls
          playsInline
          preload="metadata"
        />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor={`${name}-url`} className="text-xs font-medium text-slate-500">
          Lien YouTube
        </Label>
        <input type="hidden" name={name} value={value} />
        <input
          id={`${name}-url`}
          type="url"
          value={value.startsWith("/") ? "" : value}
          placeholder="https://www.youtube.com/watch?v=…"
          className="h-11 w-full rounded-md border border-input bg-white px-3 text-sm"
          onChange={(event) => choose(event.target.value, "")}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-lg bg-[#065b48] px-3 py-2 text-sm font-medium text-white hover:bg-[#00af84]">
          {uploading ? "Envoi en cours…" : value.startsWith("/") ? "Remplacer le fichier" : "Téléverser un fichier"}
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

      {videos.length ? (
        <details className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <summary className="cursor-pointer text-slate-600">Choisir une vidéo déjà téléversée</summary>
          <select
            className="mt-2 h-11 w-full rounded-md border border-input bg-white px-3 text-sm"
            value={videos.includes(value) ? value : ""}
            onChange={(event) => {
              if (!event.target.value) return;
              choose(event.target.value, "Vidéo sélectionnée. Enregistrez le projet pour la publier.");
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
        description="La vidéo disparaîtra de la fiche projet après l’enregistrement. Les photos restent en place."
        confirmLabel="Retirer la vidéo"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          choose("", "La vidéo sera retirée après l’enregistrement.");
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
