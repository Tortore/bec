export const servicesCatalog = [
  {
    id: "conception",
    title: "Conception architecturale",
    shortDescription:
      "Plans détaillés et designs personnalisés pour vos projets de construction.",
    description:
      "Nos architectes conçoivent des plans personnalisés, en alliant esthétique, fonctionnalité et contraintes du site.",
    features: [
      "Plans architecturaux (2D et 3D)",
      "Études de faisabilité et d'avant-projet",
      "Optimisation des espaces",
      "Respect des normes de construction",
      "Accompagnement des démarches administratives",
    ],
    process: [
      { step: "Analyse des besoins", description: "Écoute et compréhension de votre projet" },
      { step: "Esquisse", description: "Premières propositions et orientations" },
      { step: "Avant-projet", description: "Plans détaillés et validation" },
      { step: "Dossier final", description: "Plans d'exécution et documents techniques" },
    ],
    image: "/images/maison.jpg",
  },
  {
    id: "design-interieur",
    title: "Design d'intérieur",
    shortDescription: "Aménagement d'intérieurs élégants, fonctionnels et modernes.",
    description:
      "Nous aménageons des intérieurs esthétiques et fonctionnels, pour l'habitat comme pour les espaces professionnels.",
    features: [
      "Aménagement résidentiel et professionnel",
      "Choix des matériaux et du mobilier",
      "Conception de l'éclairage",
      "Optimisation des rangements",
      "Suivi jusqu'à la livraison",
    ],
    process: [
      { step: "Découverte", description: "Analyse de l'espace et des besoins" },
      { step: "Concept", description: "Ambiances et orientations de style" },
      { step: "Développement", description: "Plans détaillés et sélections" },
      { step: "Réalisation", description: "Mise en œuvre et finitions" },
    ],
    image: "/images/Resident/resident1.jpg",
  },
  {
    id: "gestion-projet",
    title: "Gestion de projet",
    shortDescription: "Pilotage de vos projets, du concept initial jusqu'à la livraison.",
    description:
      "Nous coordonnons le projet de bout en bout, pour tenir les délais, le budget convenu et le niveau de qualité attendu.",
    features: [
      "Planification du projet",
      "Coordination des intervenants",
      "Suivi du budget",
      "Contrôle qualité",
      "Points d'avancement avec le maître d'ouvrage",
    ],
    process: [
      { step: "Initialisation", description: "Objectifs et périmètre" },
      { step: "Planification", description: "Planning et budget" },
      { step: "Exécution", description: "Coordination et suivi" },
      { step: "Clôture", description: "Livraison et bilan" },
    ],
    image: "/images/chantier3.jpg",
  },
  {
    id: "urbanisme",
    title: "Urbanisme",
    shortDescription: "Planification urbaine et solutions d'aménagement durables.",
    description:
      "Nous travaillons des projets d'aménagement et de planification, ancrés dans le territoire congolais.",
    features: [
      "Plans d'urbanisme et d'aménagement",
      "Conception d'espaces publics",
      "Planification de zones résidentielles",
      "Conseil en développement durable",
    ],
    process: [
      { step: "Diagnostic", description: "Analyse du site et des enjeux" },
      { step: "Stratégie", description: "Orientations d'aménagement" },
      { step: "Planification", description: "Plans et documents" },
      { step: "Mise en œuvre", description: "Accompagnement du projet" },
    ],
    image: "/images/publique/publique1.jpg",
  },
  {
    id: "etudes-techniques",
    title: "Études techniques",
    shortDescription: "Ingénierie civile, BTP, électricité et topographie.",
    description:
      "Le bureau d'études réalise les analyses techniques nécessaires à la conception et à l'exécution : génie civil, BTP, électricité et topographie.",
    features: [
      "Études de structure",
      "Ingénierie civile et BTP",
      "Études électriques",
      "Relevés topographiques",
      "Documents techniques d'exécution",
    ],
    process: [
      { step: "Investigation", description: "Données de terrain" },
      { step: "Analyse", description: "Calculs et hypothèses" },
      { step: "Recommandations", description: "Solutions techniques" },
      { step: "Documentation", description: "Rapports et plans" },
    ],
    image: "/images/pexels-rezwan-1216544.jpg",
  },
  {
    id: "suivi-chantier",
    title: "Suivi de chantier",
    shortDescription: "Supervision des travaux pour la qualité et le respect des délais.",
    description:
      "Nous suivons l'exécution sur site : conformité aux plans, qualité, délais et coordination des corps de métier.",
    features: [
      "Supervision des travaux",
      "Contrôle de conformité aux plans",
      "Coordination des corps de métier",
      "Réception des ouvrages",
      "Comptes rendus de suivi",
    ],
    process: [
      { step: "Préparation", description: "Organisation du chantier" },
      { step: "Suivi", description: "Contrôle de l'exécution" },
      { step: "Validation", description: "Vérification de la conformité" },
      { step: "Réception", description: "Livraison du chantier" },
    ],
    image: "/images/chantier.jpg",
  },
] as const;

export type ServiceId = (typeof servicesCatalog)[number]["id"];

export function getService(id: string) {
  return servicesCatalog.find((service) => service.id === id);
}
