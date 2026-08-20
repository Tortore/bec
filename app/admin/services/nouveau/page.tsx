import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { ServiceForm } from "@/components/admin/service-form";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia } from "@/lib/cms/media";

export const metadata: Metadata = { title: "Nouveau service" };

export default async function NewServicePage() {
  await requireAdmin();
  return (
    <div>
      <AdminHeader title="Nouveau service" />
      <ServiceForm media={await listMedia()} />
    </div>
  );
}
