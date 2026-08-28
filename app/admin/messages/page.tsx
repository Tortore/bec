import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { InboxTabs } from "@/components/admin/inbox-tabs";
import { deleteMessageAction, deleteReviewAction, setReviewApprovedAction } from "@/lib/cms/actions";
import { getAdminReviews } from "@/lib/cms/queries";
import { getMessages } from "@/lib/cms/store";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

type Props = { searchParams: Promise<{ onglet?: string; statut?: string }> };

export default async function AdminMessagesPage({ searchParams }: Props) {
  const { onglet, statut } = await searchParams;
  const current = onglet === "avis" ? "avis" : "contact";
  const [messages, reviews] = await Promise.all([getMessages(), getAdminReviews()]);
  const unreadMessages = messages.filter((item) => !item.read).length;
  const pendingReviews = reviews.filter((item) => !item.approved).length;
  const selectedStatus = statut === "publies" || statut === "attente" ? statut : "tous";
  const visibleReviews =
    selectedStatus === "publies"
      ? reviews.filter((item) => item.approved)
      : selectedStatus === "attente"
        ? reviews.filter((item) => !item.approved)
        : reviews;

  return (
    <div>
      <AdminHeader
        title="Messages"
        description="Demandes de contact et avis envoyés depuis le site. Les textes de la page Contact se modifient dans Pages."
      />
      <Link
        href="/admin/pages/contact"
        className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#00af84]/25 bg-white px-5 py-4 text-sm shadow-sm transition hover:border-[#00af84]"
      >
        <span>
          <span className="font-semibold text-[#065b48]">Textes de la page Contact</span>
          <span className="mt-0.5 block text-slate-500">Bandeau, titres, carte et questions fréquentes.</span>
        </span>
        <span className="shrink-0 font-medium text-[#00af84]">Modifier</span>
      </Link>
      <InboxTabs
        current={current}
        messagesCount={messages.length}
        unreadMessages={unreadMessages}
        reviewsCount={reviews.length}
        pendingReviews={pendingReviews}
      />

      {current === "contact" ? (
        messages.length === 0 ? (
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
        )
      ) : (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {[
              { id: "tous", label: `Tous (${reviews.length})` },
              { id: "attente", label: `En attente (${pendingReviews})` },
              { id: "publies", label: `Publiés (${reviews.length - pendingReviews})` },
            ].map((item) => (
              <Link
                key={item.id}
                href={item.id === "tous" ? "/admin/messages?onglet=avis" : `/admin/messages?onglet=avis&statut=${item.id}`}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium",
                  selectedStatus === item.id ? "bg-[#065b48] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {visibleReviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Aucun avis pour le moment.
            </div>
          ) : (
            <div className="grid gap-4">
              {visibleReviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-[#065b48]">{review.name}</h2>
                        <span className="text-sm text-amber-500" aria-label={`${review.rating} étoiles sur 5`}>
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                            review.approved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {review.approved ? "Publié" : "En attente"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {review.email} · {formatDate(review.createdAt.toISOString())}
                      </p>
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{review.message}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/messages/avis/${review.id}`}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-[#065b48] hover:bg-slate-50"
                      >
                        Ouvrir
                      </Link>
                      <form action={setReviewApprovedAction.bind(null, review.id, !review.approved)}>
                        <button
                          type="submit"
                          className="rounded-lg bg-[#065b48] px-3 py-2 text-sm font-medium text-white hover:bg-[#00af84]"
                        >
                          {review.approved ? "Masquer" : "Publier"}
                        </button>
                      </form>
                      <ConfirmDelete
                        message="Supprimer cet avis ?"
                        action={deleteReviewAction.bind(null, review.id)}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
