import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { deleteUserAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/auth";
import { getUsers } from "@/lib/cms/queries";

export const metadata: Metadata = { title: "Utilisateurs" };

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const users = await getUsers();
  return (
    <div>
      <AdminHeader
        title="Utilisateurs"
        description="Créez, modifiez ou désactivez les comptes qui accèdent à l’administration."
        action={{ href: "/admin/utilisateurs/nouveau", label: "Nouvel utilisateur" }}
      />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="hidden px-4 py-3 md:table-cell">Identifiant</th>
              <th className="hidden px-4 py-3 lg:table-cell">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">{user.username}</td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {user.role === "admin" ? "Administrateur" : "Éditeur"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                      user.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/utilisateurs/${user.id}`} className="mr-2 font-medium text-[#065b48]">
                    Modifier
                  </Link>
                  {users.length > 1 && user.username !== session.user ? (
                    <ConfirmDelete
                      message={`Supprimer le compte « ${user.username} » ?`}
                      action={deleteUserAction.bind(null, user.id)}
                    />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
