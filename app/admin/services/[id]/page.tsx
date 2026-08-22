import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { ServiceForm } from "@/components/admin/service-form";
import { requireAdmin } from "@/lib/cms/auth";
import { listMedia } from "@/lib/cms/media";
import { getService } from "@/lib/cms/queries";
import { AdminFormError } from "@/components/admin/form-error";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService((await params).id);
  return { title: service?.title ?? "Service" };
}

export default async function EditServicePage({ params, searchParams }: Props) {
  await requireAdmin();
  const service = await getService((await params).id);
  if (!service) notFound();
  return (
    <div>
      <AdminHeader title={service.title} />
      <AdminFormError code={(await searchParams).error} />
      <ServiceForm service={service} media={await listMedia()} />
    </div>
  );
}
