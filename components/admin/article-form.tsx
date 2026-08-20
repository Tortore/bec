import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveArticleAction } from "@/lib/cms/actions";
import { articleCategories } from "@/lib/site";
import type { Article } from "@/types";

export function ArticleForm({ article, media }: { article?: Article; media: string[] }) {
  return (
    <form action={saveArticleAction} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="currentSlug" value={article?.slug ?? ""} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" required defaultValue={article?.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <select
            id="category"
            name="category"
            defaultValue={article?.category ?? "Architecture"}
            className="h-12 w-full rounded-md border border-input bg-white px-3 text-sm"
          >
            {articleCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" defaultValue={article?.date ?? new Date().toISOString().slice(0, 10)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="readingMinutes">Temps de lecture (min)</Label>
          <Input id="readingMinutes" name="readingMinutes" type="number" defaultValue={article?.readingMinutes ?? 4} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (optionnel)</Label>
          <Input id="slug" name="slug" defaultValue={article?.slug} />
        </div>
      </div>
      <ImageField name="cover" label="Image de couverture" defaultValue={article?.cover} media={media} />
      <div className="space-y-2">
        <Label htmlFor="excerpt">Chapeau</Label>
        <Textarea id="excerpt" name="excerpt" rows={3} required defaultValue={article?.excerpt} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Contenu (un paragraphe par ligne)</Label>
        <Textarea id="content" name="content" rows={10} defaultValue={(article?.content ?? []).join("\n\n")} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={article?.published !== false} />
        Publié sur le site
      </label>
      <Button type="submit">{article ? "Enregistrer l’article" : "Publier l’article"}</Button>
    </form>
  );
}
