import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { UserForm } from "@/components/admin/user-form";
import { AdminFormError } from "@/components/admin/form-error";

export const metadata: Metadata = { title: "Nouvel utilisateur" };

export default async function NewUserPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <div>
      <AdminHeader title="Nouvel utilisateur" description="Ce compte pourra se connecter à /admin." />
      <AdminFormError code={(await searchParams).error} />
      <UserForm />
    </div>
  );
}
