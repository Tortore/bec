import type { ReactNode } from "react";

type Props = {
  href: string;
  fileName: string;
  label: string;
  meta?: string;
  missing?: boolean;
  icon: ReactNode;
};

export function ApplicationFileLink({ href, fileName, label, meta, missing, icon }: Props) {
  if (missing) {
    return (
      <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-medium">{label}</p>
        <p className="mt-1 text-xs">
          {fileName} — fichier introuvable sur le serveur. Il n’a peut-être pas été copié avec le site.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-medium text-[#065b48]">
          {icon}
          {label}
        </span>
        <span className="mt-1 block truncate text-xs text-slate-500">{meta ?? fileName}</span>
      </span>
      <a
        href={href}
        download={fileName}
        className="shrink-0 rounded-lg bg-[#065b48] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#044a3a]"
      >
        Télécharger
      </a>
    </div>
  );
}
