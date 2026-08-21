import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { HomeForm } from "@/components/admin/home-form";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia, listVideos } from "@/lib/cms/media";
import { getHome } from "@/lib/cms/queries";

export const metadata: Metadata = { title: "Accueil" };

export default async function AdminAccueilPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const [home, media, videos] = await Promise.all([getHome(), listMedia(), listVideos()]);
  const saved = (await searchParams).ok === "1";
  return (
    <div>
      <AdminHeader
        title="Page d’accueil"
        description="Modifiez la bannière, les chiffres, les titres des blocs et le bandeau de contact."
      />
      {saved ? (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          L’accueil a été mis à jour.
        </p>
      ) : null}
      <HomeForm home={home} media={media} videos={videos} />
    </div>
  );
}
