import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { deleteArticleAction } from "@/lib/cms/actions";
import { getAllArticles } from "@/lib/cms/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Actualités" };

export default async function AdminNewsPage() {
  const articles = await getAllArticles();
  return (
    <div>
      <AdminHeader
        title="Actualités"
        description="Rédigez et publiez les articles du cabinet."
        action={{ href: "/admin/actualites/nouveau", label: "Nouvel article" }}
      />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Article</th>
              <th className="hidden px-4 py-3 md:table-cell">Catégorie</th>
              <th className="hidden px-4 py-3 lg:table-cell">Date</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((article) => (
              <tr key={article.slug}>
                <td className="px-4 py-3 font-medium">{article.title}</td>
                <td className="hidden px-4 py-3 md:table-cell">{article.category}</td>
                <td className="hidden px-4 py-3 lg:table-cell">{formatDate(article.date)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                      article.published === false ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {article.published === false ? "Brouillon" : "Publié"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/actualites/${article.slug}`} className="mr-2 font-medium text-[#065b48]">
                    Modifier
                  </Link>
                  <ConfirmDelete
                    message={`Supprimer « ${article.title} » ?`}
                    action={deleteArticleAction.bind(null, article.slug)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
