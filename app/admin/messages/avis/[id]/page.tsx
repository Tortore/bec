import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { deleteReviewAction, setReviewApprovedAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/auth";
import { getReview } from "@/lib/cms/queries";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Avis" };

export default async function AdminReviewPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const review = await getReview(id);
  if (!review) notFound();

  return (
    <div>
      <AdminHeader
        title={`Avis de ${review.name}`}
        description={`${review.rating} / 5 · ${formatDate(review.createdAt.toISOString())}`}
      />
      <p className="mb-4">
        <Link href="/admin/messages?onglet=avis" className="text-sm font-medium text-[#065b48] hover:underline">
          ← Tous les avis
        </Link>
      </p>
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg text-amber-500" aria-label={`${review.rating} étoiles sur 5`}>
            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              review.approved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {review.approved ? "Publié sur le site" : "En attente de validation"}
          </span>
        </div>
        <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt className="text-slate-500">Nom</dt>
            <dd className="font-medium">{review.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">E-mail</dt>
            <dd>
              <a className="text-[#065b48] hover:underline" href={`mailto:${review.email}`}>
                {review.email}
              </a>
            </dd>
          </div>
        </dl>
        <p className="mt-6 whitespace-pre-wrap leading-relaxed text-slate-700">{review.message}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <form action={setReviewApprovedAction.bind(null, review.id, !review.approved)}>
            <button
              type="submit"
              className="rounded-xl bg-[#00af84] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#065b48]"
            >
              {review.approved ? "Masquer du site" : "Publier sur le site"}
            </button>
          </form>
          <Link
            href={`mailto:${review.email}?subject=${encodeURIComponent("Votre avis — BEC")}`}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Répondre par e-mail
          </Link>
          <ConfirmDelete message="Supprimer cet avis ?" action={deleteReviewAction.bind(null, id)} />
        </div>
      </article>
    </div>
  );
}
