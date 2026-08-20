"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "@/lib/cms/actions";

export function CategoryDelete({ id, label }: { id: string; label: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      onClick={async () => {
        if (!window.confirm(`Supprimer la catégorie « ${label} » ?`)) return;
        setPending(true);
        const result = await deleteCategoryAction(id);
        setPending(false);
        if (result && "error" in result) {
          window.alert(result.error);
          return;
        }
        router.refresh();
      }}
    >
      {pending ? "Suppression…" : "Supprimer"}
    </button>
  );
}
