"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cookies", label: "Cookies" },
  { href: "/conditions-utilisation", label: "Conditions d’utilisation" },
];

export function LegalNav() {
  const pathname = usePathname();
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="rounded-2xl border border-[#00af84]/15 bg-white p-6 shadow-sm">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00af84]">
          <Scale className="h-4 w-4" aria-hidden />
          Documents
        </p>
        <nav aria-label="Pages légales" className="mt-4 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#065b48] text-white"
                    : "text-slate-600 hover:bg-[#00af84]/10 hover:text-[#065b48]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
