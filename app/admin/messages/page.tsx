import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { deleteMessageAction } from "@/lib/cms/actions";
import { getMessages } from "@/lib/cms/store";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  return (
    <div>
      <AdminHeader
        title="Messages"
        description="Demandes reçues depuis le formulaire de contact."
      />
      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Aucune demande pour le moment.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Expéditeur</th>
                <th className="hidden px-4 py-3 md:table-cell">Sujet</th>
                <th className="hidden px-4 py-3 lg:table-cell">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.map((message) => (
                <tr key={message.id} className={message.read ? "" : "bg-[#00af84]/5"}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{message.name}</p>
                    <p className="text-xs text-slate-500">{message.email}</p>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">{message.subject}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">{formatDate(message.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        message.read ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {message.read ? "Lu" : "Non lu"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/messages/${message.id}`} className="mr-2 font-medium text-[#065b48]">
                      Ouvrir
                    </Link>
                    <ConfirmDelete
                      message="Supprimer ce message ?"
                      action={deleteMessageAction.bind(null, message.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
