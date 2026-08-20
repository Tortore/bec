import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { UserForm } from "@/components/admin/user-form";
import { getUser } from "@/lib/cms/queries";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Modifier l’utilisateur" };

export default async function EditUserPage({ params }: Props) {
  const user = await getUser((await params).id);
  if (!user) notFound();
  return (
    <div>
      <AdminHeader title={user.name} description={`Identifiant : ${user.username}`} />
      <UserForm user={user} />
    </div>
  );
}
