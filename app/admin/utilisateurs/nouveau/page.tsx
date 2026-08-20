import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { UserForm } from "@/components/admin/user-form";

export const metadata: Metadata = { title: "Nouvel utilisateur" };

export default function NewUserPage() {
  return (
    <div>
      <AdminHeader title="Nouvel utilisateur" description="Ce compte pourra se connecter à /admin." />
      <UserForm />
    </div>
  );
}
