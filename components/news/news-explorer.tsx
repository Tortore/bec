"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Article } from "@/types";
import { articleCategories } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SiteImage } from "@/components/site-image";

export function NewsExplorer({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = category === "Tous" || article.category === category;
      const haystack = `${article.title} ${article.excerpt}`.toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [articles, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un article..."
            className="pl-10"
            aria-label="Rechercher un article"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Tous", ...articleCategories].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm ${
              category === item
                ? "bg-[#065b48] text-white"
                : "bg-secondary text-muted-foreground hover:text-[#065b48]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {results.map((article) => (
          <article
            key={article.slug}
            className="overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <Link href={`/actualites/${article.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <SiteImage
                  src={article.cover}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-[#00af84]">
                  {article.category} · {formatDate(article.date)} · {article.readingMinutes} min
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#065b48] group-hover:text-[#00af84]">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{article.excerpt}</p>
                <span className="mt-3 inline-block text-sm font-medium text-[#065b48]">
                  Lire plus →
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
      {results.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">Aucun article trouvé.</p>
      ) : null}
    </div>
  );
}
