import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { deleteReviewAction, setReviewApprovedAction } from "@/lib/cms/actions";
import { getAdminReviews } from "@/lib/cms/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Avis" };

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();
  return (
    <div>
      <AdminHeader
        title="Avis et opinions"
        description="Validez les avis avant leur affichage sur la page d’accueil."
      />
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Aucun avis pour le moment.
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
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
                        review.approved
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
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
                <div className="flex shrink-0 flex-wrap gap-2">
                  <form action={setReviewApprovedAction.bind(null, review.id, !review.approved)}>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#065b48] px-3 py-2 text-sm font-medium text-white hover:bg-[#00af84]"
                    >
                      {review.approved ? "Masquer" : "Publier"}
                    </button>
                  </form>
                  <form action={deleteReviewAction.bind(null, review.id)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
