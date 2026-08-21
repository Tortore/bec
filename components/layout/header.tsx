"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Home,
  Mail,
  Menu,
  Newspaper,
  PencilRuler,
  Phone,
  Users,
  X,
} from "lucide-react";
import { navigation } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SiteImage } from "@/components/site-image";
import type { Category } from "@/types";

const navIcons = {
  "/": Home,
  "/services": PencilRuler,
  "/projets": FolderOpen,
  "/a-propos": Users,
  "/actualites": Newspaper,
  "/contact": Mail,
  "/carrieres": Briefcase,
} as const;

export function Header({ categories = [] }: { categories?: Category[] }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const items = useMemo(
    () =>
      navigation.map((item) =>
        item.href === "/projets" && categories.length > 0
          ? {
              ...item,
              children: [
                { label: "Tous les projets", href: "/projets" },
                ...categories.map((category) => ({
                  label: category.label,
                  href: `/projets?categorie=${category.id}`,
                })),
              ],
            }
          : item,
      ),
    [categories],
  );

  const currentPath = isMounted ? pathname : "";
  const headerScrolled = isMounted && scrolled;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMounted]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!isMounted) return;
    setOpen(false);
    setMobileProjectsOpen(false);
  }, [pathname, isMounted]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-16 text-white transition-all duration-300 sm:h-20",
          headerScrolled ? "bg-[#044a3a] shadow-lg shadow-black/20" : "bg-[#065b48]",
        )}
      >
        <div className="container-site flex h-full items-center justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-lg p-2 text-white transition-colors hover:bg-white/10 xl:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="inline-flex min-w-0 items-center gap-2 sm:gap-3"
              aria-label="Retour à l’accueil BEC"
            >
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white/10 sm:h-12 sm:w-12">
                <SiteImage
                  src="/images/logo/LOGOBLANC.png.jpg"
                  alt=""
                  fill
                  className="object-contain mix-blend-screen scale-125"
                  sizes="48px"
                  priority
                />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-bold leading-tight text-white sm:text-xl">
                  {siteConfig.shortName}
                </span>
                <span className="block truncate text-[10px] leading-tight text-white/70 sm:text-xs">
                  Bureau d&apos;Études et Constructions
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-0.5 xl:flex 2xl:gap-1" aria-label="Navigation principale">
            {items.map((item) =>
              item.children ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setProjectsOpen(true)}
                  onMouseLeave={() => setProjectsOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium transition-colors 2xl:px-3",
                      currentPath.startsWith("/projets")
                        ? "text-white"
                        : "text-white/85 hover:text-white",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        projectsOpen && "rotate-180",
                      )}
                    />
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 origin-left scale-x-0 bg-[#00af84] transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                  {projectsOpen ? (
                    <div className="absolute left-0 top-full z-50 w-56 pt-2">
                      <div className="overflow-hidden rounded-xl border border-[#00af84]/15 bg-white py-2 shadow-2xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group/item flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-[#00af84]/10 hover:text-[#065b48]"
                        >
                          <ChevronRight className="h-4 w-4 text-[#00af84] opacity-0 transition-opacity group-hover/item:opacity-100" />
                          <span className="transition-transform group-hover/item:translate-x-0.5">
                            {child.label}
                          </span>
                        </Link>
                      ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center px-2.5 py-2 text-sm font-medium transition-colors 2xl:px-3",
                    currentPath === item.href ? "text-white" : "text-white/85 hover:text-white",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#00af84] transition-transform duration-300",
                      currentPath === item.href ? "scale-x-100" : "origin-left scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact#devis"
              className="hidden shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#065b48] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#00af84] hover:text-white xl:inline-flex"
            >
              <Phone className="h-4 w-4" />
              Demander un devis
            </Link>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 xl:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex h-dvh w-[min(100%,20rem)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[24rem] xl:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between bg-[#065b48] p-6 text-white">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Retour à l’accueil BEC"
          >
            <span className="block text-xl font-bold">BEC</span>
            <span className="text-xs text-white/75">Bureau d&apos;Études et Constructions</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 hover:bg-white/10"
            aria-label="Fermer le menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4" aria-label="Navigation mobile">
          <div className="space-y-1 px-4">
            {items.map((item) => {
              const Icon = navIcons[item.href as keyof typeof navIcons];
              if (item.children) {
                return (
                  <div key={item.href}>
                    <button
                      type="button"
                      onClick={() => setMobileProjectsOpen((value) => !value)}
                      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-slate-800 hover:bg-[#00af84]/10"
                    >
                      <span className="flex items-center gap-3">
                        {Icon ? <Icon className="h-5 w-5 text-[#00af84]" aria-hidden /> : null}
                        <span className="font-medium">{item.label}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-slate-500 transition-transform",
                          mobileProjectsOpen && "rotate-180",
                        )}
                      />
                    </button>
                    {mobileProjectsOpen ? (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#00af84]/30 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-slate-600 hover:bg-[#00af84]/10 hover:text-[#065b48]"
                          >
                            <ChevronRight className="h-4 w-4 text-[#00af84]" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-800 hover:bg-[#00af84]/10"
                >
                  {Icon ? <Icon className="h-5 w-5 text-[#00af84]" aria-hidden /> : null}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-200 bg-slate-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Link
            href="/contact#devis"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#065b48] px-5 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-[#044a3a]"
          >
            <Phone className="h-5 w-5" />
            Demander un devis
          </Link>
        </div>
      </div>
    </>
  );
}
