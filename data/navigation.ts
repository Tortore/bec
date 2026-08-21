import type { NavItem } from "@/types";

export const navigation: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Projets",
    href: "/projets",
    children: [
      { label: "Tous les projets", href: "/projets" },
      { label: "Résidentiel", href: "/projets?categorie=residentiel" },
      { label: "Logement social", href: "/projets?categorie=logement-social" },
      { label: "Public", href: "/projets?categorie=public" },
      { label: "Hospitalité", href: "/projets?categorie=hospitalite" },
      { label: "Commercial", href: "/projets?categorie=commercial" },
      { label: "Académique", href: "/projets?categorie=academique" },
      { label: "Santé", href: "/projets?categorie=sante" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Recrutement", href: "/carrieres" },
  { label: "Contact", href: "/contact" },
  { label: "À propos", href: "/a-propos" },
];
