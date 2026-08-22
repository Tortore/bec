"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConfirmDelete({
  label = "Supprimer",
  message,
  action,
}: {
  label?: string;
  message: string;
  action: () => Promise<void>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        onClick={async () => {
          if (!window.confirm(message)) return;
          setPending(true);
          setError("");
          try {
            await action();
            router.refresh();
          } catch (caught) {
            const digest =
              caught && typeof caught === "object" && "digest" in caught ? String(caught.digest) : "";
            if (digest.startsWith("NEXT_REDIRECT")) throw caught;
            setError("Suppression impossible. Réessayez.");
          } finally {
            setPending(false);
          }
        }}
      >
        {pending ? "Suppression…" : label}
      </button>
      {error ? <small role="alert" className="text-xs text-red-600">{error}</small> : null}
    </span>
  );
}
