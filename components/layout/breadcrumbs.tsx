import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn("text-sm text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-[#00af84]">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground line-clamp-1 max-w-[12rem] sm:max-w-xs md:max-w-md" aria-current="page">
                {item.label}
              </span>
            )}
            {index < items.length - 1 ? (
              <ChevronRight className="size-3.5 opacity-50" aria-hidden />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
