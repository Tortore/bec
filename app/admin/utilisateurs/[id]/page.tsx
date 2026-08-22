import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { UserForm } from "@/components/admin/user-form";
import { getUser } from "@/lib/cms/queries";
import { AdminFormError } from "@/components/admin/form-error";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> };

export const metadata: Metadata = { title: "Modifier l’utilisateur" };

export default async function EditUserPage({ params, searchParams }: Props) {
  const user = await getUser((await params).id);
  if (!user) notFound();
  return (
    <div>
      <AdminHeader title={user.name} description={`Identifiant : ${user.username}`} />
      <AdminFormError code={(await searchParams).error} />
      <UserForm user={user} />
    </div>
  );
}
