"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "@/lib/cms/actions";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export function CategoryDelete({ id, label }: { id: string; label: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onConfirm() {
    setPending(true);
    setError("");
    const result = await deleteCategoryAction(id);
    setPending(false);
    if (result && "error" in result && result.error) {
      setError(result.error);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        {pending ? "Suppression…" : "Supprimer"}
      </button>
      <ConfirmDialog
        open={open}
        title="Supprimer cette catégorie ?"
        description={
          error
            ? error
            : `La catégorie « ${label} » sera retirée. Cette action est définitive.`
        }
        confirmLabel="Supprimer"
        pending={pending}
        onCancel={() => {
          if (!pending) {
            setOpen(false);
            setError("");
          }
        }}
        onConfirm={onConfirm}
      />
    </>
  );
}
