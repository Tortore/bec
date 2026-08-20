import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { MediaLibrary } from "@/components/admin/media-library";
import { requireAdmin } from "@/lib/cms/auth";
import { getMediaLibrary } from "@/lib/cms/queries";

export const metadata: Metadata = { title: "Médias" };

export default async function AdminMediaPage() {
  await requireAdmin();
  const items = await getMediaLibrary();
  return (
    <div>
      <AdminHeader
        title="Médias"
        description="Photos téléversées et images du site. Vous pouvez supprimer uniquement celles que vous avez ajoutées."
      />
      <MediaLibrary items={items} />
    </div>
  );
}
