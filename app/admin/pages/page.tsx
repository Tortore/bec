import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, FolderKanban, Mail, PencilRuler } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/cms/auth";

export const metadata: Metadata = { title: "Pages" };

const pages = [
  {
    href: "/admin/pages/services",
    label: "Services",
    text: "Bandeau « Nos services », titres du catalogue et méthode de travail.",
    icon: PencilRuler,
  },
  {
    href: "/admin/pages/recrutement",
    label: "Recrutement",
    text: "Image, titres, atouts, profils, formulaire et déroulé de candidature.",
    icon: Briefcase,
  },
  {
    href: "/admin/pages/projets",
    label: "Projets",
    text: "Accroche, titre et introduction du portfolio.",
    icon: FolderKanban,
  },
  {
    href: "/admin/pages/contact",
    label: "Contact",
    text: "Bandeau, titres du formulaire, coordonnées, carte et questions fréquentes.",
    icon: Mail,
  },
];

export default async function AdminPagesHub() {
  await requireAdmin();
  return (
    <div>
      <AdminHeader
        title="Textes des pages"
        description="Modifiez les titres et introductions encore figés sur Services, Recrutement, Projets et Contact. Les prestations, projets et coordonnées se gèrent dans leurs menus respectifs."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <Link
              key={page.href}
              href={page.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#065b48] text-white">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-lg font-semibold text-[#065b48]">{page.label}</p>
              <p className="mt-2 text-sm text-slate-500">{page.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#00af84]">
                Modifier <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
