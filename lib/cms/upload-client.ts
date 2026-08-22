import { fetchWithTimeout } from "@/lib/fetch-with-timeout";

export async function uploadAdminImage(file: File) {
  const formData = new FormData();
  formData.set("file", file);
  const response = await fetchWithTimeout("/api/admin/images", { method: "POST", body: formData }, 45_000);
  const result = (await response.json().catch(() => null)) as { ok?: boolean; src?: string; error?: string } | null;
  if (!response.ok || !result?.ok || !result.src) {
    throw new Error(result?.error || "Impossible d’enregistrer l’image.");
  }
  return result.src;
}
