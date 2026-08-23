import type { Article } from "@/types";

export const articles: Article[] = [
  {
    slug: "nouvelles-technologies-de-construction",
    title: "Les Nouvelles Technologies de Construction",
    excerpt:
      "Impression 3D, bâtiments intelligents, et nouvelles méthodes de construction révolutionnent le secteur...",
    content: [
      "Impression 3D, bâtiments intelligents, et nouvelles méthodes de construction révolutionnent le secteur. Grâce aux avancées technologiques, la construction devient plus rapide, plus économique et plus écologique, permettant de répondre aux défis actuels.",
      "Chez Bureau d'Études et Construction, ces évolutions nourrissent une pratique déjà tournée vers la modernité et la durabilité : de la conception architecturale au suivi de chantier, chaque projet peut bénéficier d'outils plus précis, d'une meilleure coordination et d'une qualité d'exécution renforcée.",
      "L'impression 3D ouvre des pistes pour des composants sur mesure et des délais maîtrisés. Les bâtiments intelligents, de leur côté, intègrent supervision, confort et performance énergétique. Ensemble, ces méthodes redessinent le futur du bâtiment en République Démocratique du Congo comme ailleurs.",
    ],
    cover: "/images/logement/logement3.jpg",
    category: "Technologie",
    date: "2024-11-12",
    readingMinutes: 4,
  },
  {
    slug: "batiments-intelligents-et-innovation",
    title: "Bâtiments intelligents : innover sans perdre le geste architectural",
    excerpt:
      "Les bâtiments intelligents transforment le confort, la maintenance et la performance des ouvrages contemporains.",
    content: [
      "Impression 3D, bâtiments intelligents, et nouvelles méthodes de construction révolutionnent le secteur. Le bâtiment intelligent n'est pas un gadget : c'est une architecture capable d'apprendre de ses usages, de mieux gérer l'énergie et d'offrir un confort mesurable.",
      "Grâce aux avancées technologiques, la construction devient plus rapide, plus économique et plus écologique, permettant de répondre aux défis actuels. Pour BEC, l'innovation reste au service du projet : elle ne remplace ni la rigueur, ni la créativité, ni la confiance avec le maître d'ouvrage.",
      "De Lubumbashi à Kinshasa, intégrer ces systèmes dès la conception — électricité, CVC, supervision — permet d'éviter les reprises et d'aligner le geste architectural avec la technique.",
    ],
    cover: "/images/publique/publique1.jpg",
    category: "Architecture",
    date: "2024-09-03",
    readingMinutes: 5,
  },
  {
    slug: "methodes-de-construction-durables",
    title: "Nouvelles méthodes de construction et durabilité",
    excerpt:
      "Des méthodes plus rapides, plus économiques et plus écologiques pour répondre aux défis du bâtiment.",
    content: [
      "Les nouvelles méthodes de construction révolutionnent le secteur. Grâce aux avancées technologiques, la construction devient plus rapide, plus économique et plus écologique, permettant de répondre aux défis actuels.",
      "BEC s'engage à promouvoir l'usage de matériaux durables, à respecter les délais et les budgets convenus, et à garantir une qualité d'exécution irréprochable. La durabilité n'est pas un supplément : elle oriente le choix des matériaux, la conception climatique et le suivi de chantier.",
      "Impression 3D, préfabrication et coordination numérique sont autant de leviers pour réduire les déchets, fiabiliser les quantités et offrir au client une expérience plus claire, de l'idée initiale à l'aboutissement du projet.",
    ],
    cover: "/images/chantier.jpg",
    category: "Durabilité",
    date: "2024-06-18",
    readingMinutes: 4,
  },
];

export function getPublishedArticles() {
  return articles.filter((article) => article.published !== false);
}

export function getArticle(slug: string) {
  return getPublishedArticles().find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 2) {
  const current = getArticle(slug);
  return getPublishedArticles()
    .filter((article) => article.slug !== slug)
    .sort((a, b) => {
      if (!current) return 0;
      if (a.category === current.category) return -1;
      if (b.category === current.category) return 1;
      return 0;
    })
    .slice(0, limit);
}
