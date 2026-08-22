import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { ServiceForm } from "@/components/admin/service-form";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia } from "@/lib/cms/media";
import { AdminFormError } from "@/components/admin/form-error";

export const metadata: Metadata = { title: "Nouveau service" };

export default async function NewServicePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  return (
    <div>
      <AdminHeader title="Nouveau service" />
      <AdminFormError code={(await searchParams).error} />
      <ServiceForm media={await listMedia()} />
    </div>
  );
}
