"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Building2,
  FolderKanban,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PencilRuler,
  Settings,
  Tags,
  Scale,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { logoutAction } from "@/lib/cms/actions";
import { BrandLogo } from "@/components/layout/brand-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/accueil", label: "Accueil", icon: Home },
  { href: "/admin/projets", label: "Projets", icon: FolderKanban },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
  { href: "/admin/services", label: "Services", icon: PencilRuler },
  { href: "/admin/equipe", label: "Équipe", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/recrutement", label: "Recrutement", icon: Briefcase },
  { href: "/admin/medias", label: "Médias", icon: ImageIcon },
  { href: "/admin/cabinet", label: "Cabinet", icon: Building2 },
  { href: "/admin/legal", label: "Légal", icon: Scale },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: UserCog },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
] as const;

export function AdminShell({
  user,
  unread,
  unreadApplications = 0,
  unreadReviews = 0,
  logo,
  brandName = "BEC",
  brandSubtitle = "Bureau d’Études et Construction",
  children,
}: {
  user: string;
  unread: number;
  unreadApplications?: number;
  unreadReviews?: number;
  logo?: string;
  brandName?: string;
  brandSubtitle?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f6f5] text-slate-900">
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#044a3a] text-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <span className="relative flex h-11 w-11 overflow-hidden rounded-xl bg-white/10">
            <BrandLogo src={logo} sizes="44px" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide">{brandName} Admin</p>
            <p className="text-xs text-white/60">Espace de gestion</p>
          </div>
          <button
            type="button"
            className="ml-auto rounded-lg p-2 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 pb-6">
          {links.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-white text-[#044a3a]" : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.href === "/admin/messages" && unread + unreadReviews > 0 ? (
                  <span className="rounded-full bg-[#00af84] px-2 py-0.5 text-[11px] font-semibold text-white">
                    {unread + unreadReviews}
                  </span>
                ) : null}
                {item.href === "/admin/recrutement" && unreadApplications > 0 ? (
                  <span className="rounded-full bg-[#00af84] px-2 py-0.5 text-[11px] font-semibold text-white">
                    {unreadApplications}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate px-2 text-xs text-white/50">{user}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="hidden text-sm text-slate-500 lg:block">{brandSubtitle}</p>
          <Link
            href="/"
            target="_blank"
            className="text-sm font-medium text-[#065b48] hover:text-[#00af84]"
          >
            Voir le site
          </Link>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
