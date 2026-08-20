"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { deleteMediaAction, uploadMediaAction } from "@/lib/cms/actions";
import { validateImageFile } from "@/lib/cms/image-file";
import { Button } from "@/components/ui/button";
import { SiteImage } from "@/components/site-image";
import { mediaFileName } from "@/lib/utils";

type MediaItem = {
  src: string;
  uploaded: boolean;
  usedBy: string[];
};

function Notice({
  tone,
  children,
}: {
  tone: "ok" | "error";
  children: React.ReactNode;
}) {
  return (
    <p
      role="status"
      className={`rounded-xl px-4 py-3 text-sm ${
        tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
      }`}
    >
      {children}
    </p>
  );
}

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function onUpload(formData: FormData) {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setNotice({ tone: "error", text: "Choisissez une image à téléverser." });
      return;
    }
    const invalid = validateImageFile(file);
    if (invalid) {
      setNotice({ tone: "error", text: invalid });
      return;
    }
    setPending(true);
    setNotice(null);
    const result = await uploadMediaAction(formData);
    setPending(false);
    if (!result.ok) {
      setNotice({ tone: "error", text: result.error });
      return;
    }
    setNotice({ tone: "ok", text: `L’image « ${file.name} » a bien été ajoutée.` });
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  async function onDelete(item: MediaItem) {
    const used = item.usedBy.length
      ? `\n\nElle est utilisée ici :\n• ${item.usedBy.join("\n• ")}`
      : "";
    if (!window.confirm(`Supprimer « ${mediaFileName(item.src)} » ?${used}`)) return;
    setDeleting(item.src);
    setNotice(null);
    const result = await deleteMediaAction(item.src);
    setDeleting("");
    if (!result.ok) {
      setNotice({ tone: "error", text: result.error });
      return;
    }
    setNotice({ tone: "ok", text: `L’image « ${mediaFileName(item.src)} » a été supprimée.` });
    router.refresh();
  }

  const uploaded = items.filter((item) => item.uploaded).length;

  return (
    <div>
      <form action={onUpload} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-800">Ajouter une image</p>
          <p className="mt-1 text-sm text-slate-500">JPG, PNG, WEBP ou GIF — 8 Mo maximum.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={inputRef}
            id="file"
            name="file"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
          />
          <Button type="submit" disabled={pending} className="shrink-0">
            <Upload className="h-4 w-4" />
            {pending ? "Envoi en cours…" : "Téléverser"}
          </Button>
        </div>
        {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}
      </form>

      <p className="mt-8 text-sm text-slate-500">
        {items.length} image{items.length > 1 ? "s" : ""}
        {uploaded ? ` · ${uploaded} téléversée${uploaded > 1 ? "s" : ""}` : ""}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <figure key={item.src} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3]">
              <SiteImage src={item.src} alt="" fill className="object-cover" sizes="300px" />
            </div>
            <figcaption className="space-y-2 px-3 py-3">
              <p className="truncate text-sm font-medium text-slate-700" title={mediaFileName(item.src)}>
                {mediaFileName(item.src)}
              </p>
              {item.usedBy.length ? (
                <p className="text-xs text-slate-500">Utilisée · {item.usedBy[0]}</p>
              ) : (
                <p className="text-xs text-slate-400">
                  {item.uploaded ? "Non utilisée" : "Photo du site"}
                </p>
              )}
              {item.uploaded ? (
                <button
                  type="button"
                  disabled={deleting === item.src}
                  className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                  onClick={() => onDelete(item)}
                >
                  {deleting === item.src ? "Suppression…" : "Supprimer"}
                </button>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
