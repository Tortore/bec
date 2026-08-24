import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/cms/queries";
import { listMedia } from "@/lib/cms/media";
import { AdminFormError } from "@/components/admin/form-error";

export const metadata: Metadata = { title: "Paramètres" };

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const settings = await getSettings();
  const media = await listMedia();
  const query = await searchParams;
  const saved = query.ok === "1";
  return (
    <div>
      <AdminHeader
        title="Paramètres"
        description="Coordonnées, logo du site (en-tête et pied de page) et textes du pied de page."
      />
      <AdminFormError code={query.error} />
      {saved ? (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Paramètres enregistrés. Le site public est à jour.
        </p>
      ) : null}
      <SettingsForm settings={settings} media={media} />
    </div>
  );
}
