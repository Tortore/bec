import { projectCategories, type Category, type HomeContent } from "@/types";
import { categoryLabels } from "@/lib/site";

export const seedCategories: Category[] = projectCategories.map((id, index) => ({
  id,
  label: categoryLabels[id] ?? id,
  sortOrder: index,
}));

export const defaultHome: HomeContent = {
  heroBadge: "Bureau d'Études et Constructions",
  heroTitle: "Concevoir et construire",
  heroAccent: "à Lubumbashi",
  heroSubtitle:
    "Architecture, études techniques et construction. BEC vous accompagne de l'idée à la livraison.",
  heroLocation: "Lubumbashi, République Démocratique du Congo",
  heroImage: "/images/maison.jpg",
  heroPrimaryLabel: "Nos réalisations",
  heroSecondaryLabel: "Demander un devis",
  servicesEyebrow: "Nos services",
  servicesTitle: "De la conception au chantier",
  servicesIntro:
    "Fondé en 2022 à Lubumbashi par Caleb Tshileu et Fidèle Djese, BEC accompagne chaque projet de l'idée initiale à son aboutissement.",
  projectsEyebrow: "Portfolio",
  projectsTitle: "Projets récents",
  projectsIntro: "Quelques réalisations qui illustrent notre savoir-faire en architecture et construction.",
  teamEyebrow: "Notre équipe",
  teamTitle: "Les personnes de BEC",
  teamIntro: "Architectes, ingénieurs et spécialistes réunis autour de chaque projet.",
  ctaEyebrow: "Un projet à concevoir ou à construire ?",
  ctaTitle: "Contactez Bureau d'Études et Constructions",
  ctaText:
    "Demandez un devis ou un rendez-vous à Lubumbashi. Notre équipe vous répond aux horaires d'ouverture.",
  ctaButton: "Demander un devis",
  ctaBenefits: ["Devis sur demande", "De l'idée au chantier", "Cabinet basé à Lubumbashi"],
  stats: [
    { value: 2022, suffix: "", label: "Année de fondation", description: "Cabinet fondé à Lubumbashi" },
    { value: 11, suffix: "", label: "Collaborateurs", description: "Une équipe pluridisciplinaire" },
    { value: 5, suffix: "+", label: "Villes d'intervention", description: "Présence dans plusieurs villes de RDC" },
    { value: 20, suffix: "+", label: "Réalisations présentées", description: "Projets présentés dans le portfolio" },
  ],
};

export function labelsFrom(categories: Category[]) {
  return {
    ...categoryLabels,
    ...Object.fromEntries(categories.map((item) => [item.id, item.label])),
  } as Record<string, string>;
}
