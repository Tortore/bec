import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryDelete } from "@/components/admin/category-delete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveCategoryAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/auth";
import { getCategories } from "@/lib/cms/queries";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Catégories" };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getCategories();
  const counts = await Promise.all(
    categories.map(async (category) => ({
      id: category.id,
      count: await prisma.project.count({ where: { category: category.id } }),
    })),
  );
  const byId = Object.fromEntries(counts.map((item) => [item.id, item.count]));

  return (
    <div>
      <AdminHeader
        title="Catégories de projets"
        description="Ces catégories apparaissent dans le menu, les filtres et les fiches projets."
      />
      <form
        action={saveCategoryAction}
        className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-2">
          <Label htmlFor="label">Nouvelle catégorie</Label>
          <Input id="label" name="label" required placeholder="Ex. Industriel" />
        </div>
        <Button type="submit">Ajouter</Button>
      </form>
      <div className="space-y-3">
        {categories.map((category) => (
          <form
            key={category.id}
            action={saveCategoryAction}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
          >
            <input type="hidden" name="currentId" value={category.id} />
            <Input name="label" defaultValue={category.label} className="sm:max-w-xs" />
            <p className="flex-1 text-sm text-slate-500">
              {byId[category.id] ?? 0} projet{(byId[category.id] ?? 0) > 1 ? "s" : ""} · identifiant{" "}
              <code className="text-xs">{category.id}</code>
            </p>
            <Button type="submit" variant="outline" size="sm">
              Enregistrer
            </Button>
            <CategoryDelete id={category.id} label={category.label} />
          </form>
        ))}
      </div>
    </div>
  );
}
