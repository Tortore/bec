"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export function ConfirmDelete({
  label = "Supprimer",
  title = "Confirmer la suppression",
  message,
  action,
}: {
  label?: string;
  title?: string;
  message: string;
  action: () => Promise<void>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onConfirm() {
    setPending(true);
    setError("");
    try {
      await action();
      setOpen(false);
      router.refresh();
    } catch (caught) {
      const digest =
        caught && typeof caught === "object" && "digest" in caught ? String(caught.digest) : "";
      if (digest.startsWith("NEXT_REDIRECT")) throw caught;
      setError("Suppression impossible. Réessayez.");
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        {pending ? "Suppression…" : label}
      </button>
      {error ? <small role="alert" className="text-xs text-red-600">{error}</small> : null}
      <ConfirmDialog
        open={open}
        title={title}
        description={message}
        confirmLabel={label}
        pending={pending}
        onCancel={() => {
          if (!pending) setOpen(false);
        }}
        onConfirm={onConfirm}
      />
    </span>
  );
}
