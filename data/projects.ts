import type { Project, ProjectCategory, ProjectSort } from "@/types";

/**
 * Réalisations du cabinet.
 * Pour publier : ajouter un projet (slug unique, photos dans /public/images).
 * `featured: true` → mis en avant sur l’accueil.
 * `published: false` → masqué tant que le contenu n’est pas prêt.
 */
export const projects: Project[] = [
  {
    slug: "residence-moderne-lubumbashi",
    title: "Résidence moderne",
    subtitle: "Villa contemporaine",
    category: "residentiel",
    city: "Lubumbashi",
    country: "RDC",
    year: 2024,
    cover: "/images/multiresident/multiresident2.jpg",
    images: [
      "/images/logement/logement3.jpg",
      "/images/logement/logement2.jpg",
      "/images/logement/logement4.jpg",
      "/images/logement/logement1.jpg",
      "/images/maison.jpg",
    ],
    excerpt: "Résidence contemporaine à Lubumbashi, alliant confort familial et matériaux de qualité.",
    description:
      "Découvrez la Résidence Moderne : une villa contemporaine conçue pour le confort familial à Lubumbashi. Le projet traduit une lecture claire des volumes, une lumière généreuse et une exécution soignée, de la structure jusqu'aux finitions.",
    features: [
      "Superficie : 250 m²",
      "3 Chambres spacieuses",
      "2 Salles de bains modernes",
      "Terrasse avec vue panoramique",
      "Garage pour 2 voitures",
    ],
    materials: [
      "Fondations en béton armé",
      "Fenêtres en double vitrage",
      "Sol en marbre luxueux",
      "Toiture résistante en tuiles",
      "Isolation thermique et acoustique",
    ],
    area: "250 m²",
    client: "Maître d'ouvrage privé",
    duration: "18 mois",
    price: "250 000 $",
    featured: true,
  },
  {
    slug: "villa-familiale-bukavu",
    title: "Villa familiale",
    subtitle: "Résidence unique",
    category: "residentiel",
    city: "Bukavu",
    country: "RDC",
    year: 2023,
    cover: "/images/img1.jpg",
    images: ["/images/img1.jpg", "/images/maison.jpg", "/images/maison2.jpg", "/images/Resident/resident1.jpg"],
    excerpt: "Villa familiale à Bukavu, pensée pour la vie quotidienne et le paysage local.",
    description:
      "Cette villa familiale à Bukavu articule les espaces de vie autour de la lumière naturelle et d'une relation directe avec l'extérieur. Le projet poursuit l'engagement de BEC : transformer une idée en une œuvre architecturale unique, alliant modernité et durabilité.",
    features: ["Espaces de vie généreux", "Relation intérieur-extérieur", "Programme familial complet"],
    materials: ["Béton armé", "Menuiseries contemporaines", "Finitions minérales"],
    client: "Maître d'ouvrage privé",
    featured: true,
  },
  {
    slug: "residence-unique-immeuble-a",
    title: "Immeuble A",
    subtitle: "Résidence unique",
    category: "residentiel",
    city: "Lubumbashi",
    country: "RDC",
    year: 2024,
    cover: "/images/Resident/resident1.jpg",
    images: [
      "/images/Resident/resident1.jpg",
      "/images/Resident/1 (2).jpg",
      "/images/Resident/1 (5).jpg",
      "/images/Resident/1 (7).jpg",
    ],
    excerpt: "Résidence unique à Lubumbashi, volume contemporain et lecture claire des façades.",
    description:
      "Immeuble A à Lubumbashi appartient au programme de résidences uniques de BEC. Le projet valorise une composition sobre, des matériaux durables et un confort d'usage adapté aux familles.",
    features: ["Résidence unique", "Façade contemporaine", "Espaces de vie lumineux"],
    materials: ["Structure béton", "Enduits minéraux", "Menuiseries aluminium"],
    client: "Maître d'ouvrage privé",
  },
  {
    slug: "residence-unique-immeuble-b",
    title: "Immeuble B",
    subtitle: "Résidence unique",
    category: "residentiel",
    city: "Kinshasa",
    country: "RDC",
    year: 2023,
    cover: "/images/Resident/resident2.jpg",
    images: ["/images/Resident/resident2.jpg", "/images/Resident/1 (8).jpg", "/images/Resident/1 (9).jpg"],
    excerpt: "Résidence unique à Kinshasa, équilibrant densité urbaine et intimité domestique.",
    description:
      "Immeuble B à Kinshasa explore une architecture résidentielle contemporaine, attentive au climat, à la ventilation naturelle et à la qualité des espaces intérieurs.",
    features: ["Implantation urbaine", "Confort climatique", "Espaces privatifs"],
    materials: ["Béton armé", "Brise-soleil", "Revêtements durables"],
  },
  {
    slug: "residence-unique-immeuble-c",
    title: "Immeuble C",
    subtitle: "Résidence unique",
    category: "residentiel",
    city: "Goma",
    country: "RDC",
    year: 2023,
    cover: "/images/Resident/resident3.jpg",
    images: ["/images/Resident/resident3.jpg", "/images/Resident/1 (10).jpg", "/images/maison2.jpg"],
    excerpt: "Résidence unique à Goma, ancrée dans son paysage et ses usages familiaux.",
    description:
      "Immeuble C à Goma propose une résidence unique dont les volumes dialoguent avec le site. Le projet privilégie la clarté structurelle et des matériaux adaptés au contexte.",
    features: ["Lecture du site", "Programme familial", "Espaces extérieurs"],
    materials: ["Maçonnerie", "Toiture résistante", "Menuiseries contemporaines"],
  },
  {
    slug: "residence-unique-immeuble-d",
    title: "Immeuble D",
    subtitle: "Résidence unique",
    category: "residentiel",
    city: "Kolwezi",
    country: "RDC",
    year: 2024,
    cover: "/images/Resident/resident4.jpg",
    images: ["/images/Resident/resident4.jpg", "/images/Resident/1 (7).jpg", "/images/img6.jpg"],
    excerpt: "Résidence unique à Kolwezi, précision constructive et confort contemporain.",
    description:
      "Immeuble D à Kolwezi poursuit la recherche de BEC sur l'habitat contemporain : plans clairs, matériaux pérennes et exécution soignée.",
    features: ["Plan fonctionnel", "Finitions soignées", "Garage et annexes"],
    materials: ["Fondations béton", "Isolation thermique", "Revêtements intérieurs"],
  },
  {
    slug: "multi-residentiel-immeuble-a",
    title: "Immeuble A",
    subtitle: "Multi-résidentiel",
    category: "residentiel",
    city: "Lubumbashi",
    country: "RDC",
    year: 2024,
    cover: "/images/multiresident/multiresident1.jpg",
    images: [
      "/images/multiresident/multiresident1.jpg",
      "/images/multiresident/1 (2).jpg",
      "/images/multiresident/1 (3).jpg",
      "/images/multiresident/1 (6).jpg",
    ],
    excerpt: "Ensemble multi-résidentiel à Lubumbashi, typologies mixtes et espaces partagés.",
    description:
      "Cet immeuble multi-résidentiel à Lubumbashi organise plusieurs logements autour d'une circulation claire et d'espaces communs. Le projet illustre la capacité de BEC à traiter la densité sans sacrifier la qualité d'habiter.",
    features: ["Logements multiples", "Circulations naturelles", "Espaces communs"],
    materials: ["Béton armé", "Façades ventilées", "Menuiseries série"],
  },
  {
    slug: "multi-residentiel-immeuble-b",
    title: "Immeuble B",
    subtitle: "Multi-résidentiel",
    category: "residentiel",
    city: "Kinshasa",
    country: "RDC",
    year: 2023,
    cover: "/images/multiresident/multiresident2.jpg",
    images: [
      "/images/multiresident/multiresident2.jpg",
      "/images/multiresident/1 (7).jpg",
      "/images/multiresident/1 (8).jpg",
      "/images/multiresident/1 (9).jpg",
    ],
    excerpt: "Programme multi-résidentiel à Kinshasa, conçu pour la vie urbaine contemporaine.",
    description:
      "Immeuble B à Kinshasa propose une lecture urbaine du logement collectif : balcons, protections solaires et une structure capable d'évoluer avec les usages.",
    features: ["Logements collectifs", "Balcons et terrasses", "Accès contrôlés"],
    materials: ["Structure béton", "Garde-corps métalliques", "Enduits de façade"],
  },
  {
    slug: "multi-residentiel-immeuble-c",
    title: "Immeuble C",
    subtitle: "Multi-résidentiel",
    category: "residentiel",
    city: "Goma",
    country: "RDC",
    year: 2023,
    cover: "/images/multiresident/multiresident3.jpg",
    images: [
      "/images/multiresident/multiresident3.jpg",
      "/images/multiresident/1 (11).jpg",
      "/images/multiresident/1 (12).jpg",
    ],
    excerpt: "Immeuble collectif à Goma, pensé pour le confort et la durabilité.",
    description:
      "Le projet multi-résidentiel de Goma s'attache à la qualité des logements, à la ventilation et à une construction robuste, fidèle à la mission de BEC : accompagner le projet de l'idée à son aboutissement.",
    features: ["Typologies variées", "Confort climatique", "Espaces extérieurs"],
    materials: ["Béton armé", "Toiture durable", "Isolants thermiques"],
  },
  {
    slug: "multi-residentiel-immeuble-d",
    title: "Immeuble D",
    subtitle: "Multi-résidentiel",
    category: "residentiel",
    city: "Kolwezi",
    country: "RDC",
    year: 2024,
    cover: "/images/multiresident/multiresident4.jpg",
    images: [
      "/images/multiresident/multiresident4.jpg",
      "/images/multiresident/1 (13).jpg",
      "/images/multiresident/1 (14).jpg",
      "/images/multiresident/1 (15).jpg",
      "/images/multiresident/1 (16).jpg",
    ],
    excerpt: "Ensemble résidentiel à Kolwezi, densité maîtrisée et expression minérale.",
    description:
      "Immeuble D à Kolwezi compose un ensemble multi-résidentiel aux lignes nettes. La répétition des baies et la matière de la façade donnent au bâtiment une présence urbaine sereine.",
    features: ["Rythme de façade", "Logements traversants", "Parkings"],
    materials: ["Béton apparent", "Menuiseries aluminium", "Revêtements pierre"],
  },
  {
    slug: "logement-social-immeuble-a",
    title: "Immeuble A",
    subtitle: "Logement social",
    category: "logement-social",
    city: "Lubumbashi",
    country: "RDC",
    year: 2024,
    cover: "/images/logement/logement1.jpg",
    images: [
      "/images/logement/logement1.jpg",
      "/images/logement/1 (1).jpg",
      "/images/logement/1 (2).jpg",
      "/images/logement/1 (7).jpg",
    ],
    excerpt: "Logement social à Lubumbashi : qualité d'usage, durabilité et économie de moyens.",
    description:
      "Le programme de logement social à Lubumbashi démontre qu'une architecture précise peut servir le plus grand nombre. Plans efficaces, matériaux durables et espaces communs généreux.",
    features: ["Logements abordables", "Espaces communs", "Robustesse d'usage"],
    materials: ["Maçonnerie", "Béton armé", "Menuiseries standardisées"],
  },
  {
    slug: "logement-social-immeuble-b",
    title: "Immeuble B",
    subtitle: "Logement social",
    category: "logement-social",
    city: "Kinshasa",
    country: "RDC",
    year: 2023,
    cover: "/images/logement/logement2.jpg",
    images: [
      "/images/logement/logement2.jpg",
      "/images/logement/1 (8).jpg",
      "/images/logement/1 (9).jpg",
      "/images/logement/1 (10).jpg",
    ],
    excerpt: "Immeuble de logement social à Kinshasa, conçu pour la durabilité et le confort.",
    description:
      "Immeuble B à Kinshasa inscrit le logement social dans une architecture contemporaine : lumière, ventilation et une maintenance aisée dans le temps.",
    features: ["Typologies compactes", "Ventilation naturelle", "Espaces partagés"],
    materials: ["Béton", "Enduits", "Équipements pérennes"],
  },
  {
    slug: "logement-social-immeuble-c",
    title: "Immeuble C",
    subtitle: "Logement social",
    category: "logement-social",
    city: "Goma",
    country: "RDC",
    year: 2023,
    cover: "/images/logement/logement3.jpg",
    images: ["/images/logement/logement3.jpg", "/images/logement/1 (11).jpg", "/images/logement/1 (12).jpg"],
    excerpt: "Programme de logements à Goma, alliant dignité d'habiter et économie de projet.",
    description:
      "À Goma, ce logement social privilégie la dignité d'habiter : pièces bien proportionnées, accès clairs et une construction pensée pour durer.",
    features: ["Accessibilité", "Espaces extérieurs", "Maintenance simplifiée"],
    materials: ["Structure béton", "Toiture résistante", "Finitions robustes"],
  },
  {
    slug: "logement-social-immeuble-d",
    title: "Immeuble D",
    subtitle: "Logement social",
    category: "logement-social",
    city: "Kolwezi",
    country: "RDC",
    year: 2024,
    cover: "/images/logement/logement4.jpg",
    images: [
      "/images/logement/logement4.jpg",
      "/images/logement/1 (13).jpg",
      "/images/logement/1 (14).jpg",
    ],
    excerpt: "Logement social à Kolwezi, une architecture utile, claire et durable.",
    description:
      "Immeuble D à Kolwezi prolonge l'engagement de BEC pour des projets mixtes et urbanistiques, ici au service du logement social.",
    features: ["Densité maîtrisée", "Espaces communautaires", "Construction rationnelle"],
    materials: ["Béton armé", "Maçonnerie", "Revêtements minéraux"],
  },
  {
    slug: "public-immeuble-a",
    title: "Immeuble A",
    subtitle: "Équipement public",
    category: "public",
    city: "Lubumbashi",
    country: "RDC",
    year: 2024,
    cover: "/images/publique/publique1.jpg",
    images: [
      "/images/publique/publique1.jpg",
      "/images/publique/ok2.jpg",
      "/images/publique/OK_1 - Photo.jpg",
      "/images/publique/OK_2 - Photo.jpg",
    ],
    excerpt: "Bâtiment public à Lubumbashi, présence urbaine et lisibilité des usages.",
    description:
      "Cet équipement public à Lubumbashi affirme une présence urbaine claire. Halls, circulations et salles de travail sont organisés pour accueillir le public avec dignité.",
    features: ["Accueil du public", "Circulations lisibles", "Espaces administratifs"],
    materials: ["Béton", "Pierre", "Menuiseries grandes portées"],
  },
  {
    slug: "public-immeuble-b",
    title: "Immeuble B",
    subtitle: "Équipement public",
    category: "public",
    city: "Kinshasa",
    country: "RDC",
    year: 2023,
    cover: "/images/publique/publique3.jpg",
    images: [
      "/images/publique/publique3.jpg",
      "/images/publique/ok_2 - Photo (2).jpg",
      "/images/publique/OK_3 - Photo (1).jpg",
    ],
    excerpt: "Équipement public à Kinshasa, architecture institutionnelle contemporaine.",
    description:
      "Immeuble B à Kinshasa propose une architecture institutionnelle contemporaine, attentive à l'accessibilité, à la lumière et à la représentation.",
    features: ["Salles de réunion", "Accessibilité", "Image institutionnelle"],
    materials: ["Béton architectonique", "Vitrages", "Revêtements pierre"],
  },
  {
    slug: "public-immeuble-c",
    title: "Immeuble C",
    subtitle: "Équipement public",
    category: "public",
    city: "Goma",
    country: "RDC",
    year: 2023,
    cover: "/images/publique/publique4.jpg",
    images: [
      "/images/publique/publique4.jpg",
      "/images/publique/ok_4 - Photo (1).jpg",
      "/images/publique/OK_5 - Photo.jpg",
    ],
    excerpt: "Bâtiment public à Goma, pensé pour l'accueil et le service.",
    description:
      "À Goma, ce bâtiment public organise les flux d'usagers et les espaces de travail dans une enveloppe sobre, durable et représentative.",
    features: ["Hall d'accueil", "Bureaux", "Espaces de service"],
    materials: ["Maçonnerie", "Béton", "Toiture performante"],
  },
  {
    slug: "public-immeuble-d",
    title: "Immeuble D",
    subtitle: "Équipement public",
    category: "public",
    city: "Kolwezi",
    country: "RDC",
    year: 2024,
    cover: "/images/publique/publique5.jpg",
    images: [
      "/images/publique/publique5.jpg",
      "/images/publique/publique7.jpg",
      "/images/publique/ok_6 - Photo (1).jpg",
      "/images/publique/ok_7 - Photo.jpg",
    ],
    excerpt: "Équipement public à Kolwezi, volumes clairs et matériaux pérennes.",
    description:
      "Immeuble D à Kolwezi inscrit l'équipement public dans une écriture architecturale contemporaine, fidèle à la rigueur constructive de BEC.",
    features: ["Programme administratif", "Espaces publics", "Durabilité"],
    materials: ["Béton", "Pierre", "Menuiseries aluminium"],
  },
  {
    slug: "complexe-commercial-kolwezi",
    title: "Complexe commercial",
    subtitle: "Commerce et services",
    category: "commercial",
    city: "Kolwezi",
    country: "RDC",
    year: 2024,
    cover: "/images/chantier.jpg",
    images: [
      "/images/chantier.jpg",
      "/images/chantier1.jpg",
      "/images/chantier3.jpg",
      "/images/chantier4.jpg",
      "/images/img2.jpg",
    ],
    excerpt: "Complexe commercial à Kolwezi, espaces de vente, services et flux maîtrisés.",
    description:
      "Le complexe commercial de Kolwezi rassemble commerces et services dans une structure claire, pensée pour les flux, la visibilité et une exécution de chantier professionnelle.",
    features: ["Locaux commerciaux", "Circulations publiques", "Parkings"],
    materials: ["Structure béton", "Vitrines", "Revêtements techniques"],
    featured: true,
  },
  {
    slug: "bureaux-modernes-lubumbashi",
    title: "Bureaux modernes",
    subtitle: "Immeuble tertiaire",
    category: "commercial",
    city: "Lubumbashi",
    country: "RDC",
    year: 2023,
    cover: "/images/logement/logement2.jpg",
    images: [
      "/images/logement/logement2.jpg",
      "/images/img3.jpg",
      "/images/img4.jpg",
      "/images/publique/publique8.jpg",
    ],
    excerpt: "Bureaux modernes à Lubumbashi, espaces de travail lumineux et flexibles.",
    description:
      "Cet immeuble de bureaux à Lubumbashi offre des plateaux clairs, une image professionnelle et des espaces de travail pensés pour l'évolutivité.",
    features: ["Plateaux flexibles", "Salles de réunion", "Accueil d'entreprise"],
    materials: ["Béton", "Verre", "Revêtements intérieurs contemporains"],
    featured: true,
  },
  {
    slug: "commercial-immeuble-b",
    title: "Immeuble B",
    subtitle: "Commercial",
    category: "commercial",
    city: "Kinshasa",
    country: "RDC",
    year: 2023,
    cover: "/images/img6.jpg",
    images: ["/images/img6.jpg", "/images/img7.jpg", "/images/pexels-rezwan-1216589.jpg"],
    excerpt: "Immeuble commercial à Kinshasa, visibilité urbaine et locaux adaptables.",
    description:
      "Immeuble B à Kinshasa propose des locaux commerciaux adaptables, une façade visible et une structure capable d'accueillir des enseignes variées.",
    features: ["Locaux modulables", "Façade commerciale", "Accès marchandises"],
    materials: ["Béton armé", "Vitrages", "Éclairage architectural"],
  },
  {
    slug: "commercial-immeuble-c",
    title: "Immeuble C",
    subtitle: "Commercial",
    category: "commercial",
    city: "Goma",
    country: "RDC",
    year: 2022,
    cover: "/images/img8.jpg",
    images: ["/images/img8.jpg", "/images/pexels-rezwan-1078884.jpg", "/images/chantier2.jpg"],
    excerpt: "Programme commercial à Goma, conçu pour l'activité et la durabilité.",
    description:
      "À Goma, cet immeuble commercial met l'activité au centre : vitrines, accès clients et une construction robuste pour un usage intensif.",
    features: ["Vitrines", "Espaces de service", "Robustesse"],
    materials: ["Béton", "Menuiseries commerciales", "Revêtements résistants"],
  },
  {
    slug: "hotel-de-luxe-goma",
    title: "Hôtel de luxe",
    subtitle: "Hospitalité",
    category: "hospitalite",
    city: "Goma",
    country: "RDC",
    year: 2022,
    cover: "/images/img1.jpg",
    images: ["/images/img1.jpg", "/images/maison.jpg", "/images/maison2.jpg", "/images/hospise2.jpg"],
    excerpt: "Hôtel de luxe à Goma, une hospitalité contemporaine ancrée dans le paysage.",
    description:
      "L'hôtel de luxe à Goma compose une expérience d'hospitalité contemporaine : chambres, espaces communs et une relation attentive au site.",
    features: ["Chambres et suites", "Espaces communs", "Expérience d'accueil"],
    materials: ["Matériaux nobles", "Menuiseries sur mesure", "Éclairage d'ambiance"],
    featured: true,
  },
  {
    slug: "hospitalite-immeuble-a",
    title: "Immeuble A",
    subtitle: "Hospitalité",
    category: "hospitalite",
    city: "Lubumbashi",
    country: "RDC",
    year: 2024,
    cover: "/images/hospise.jpg",
    images: ["/images/hospise.jpg", "/images/hospise2.jpg", "/images/maison.jpg"],
    excerpt: "Programme d'hospitalité à Lubumbashi, accueil, confort et image de marque.",
    description:
      "Cet établissement d'hospitalité à Lubumbashi organise l'accueil, les chambres et les services dans une architecture calme et contemporaine.",
    features: ["Hall d'accueil", "Hébergement", "Services aux hôtes"],
    materials: ["Finitions chaudes", "Éclairage contrôlé", "Revêtements durables"],
  },
  {
    slug: "hospitalite-immeuble-b",
    title: "Immeuble B",
    subtitle: "Hospitalité",
    category: "hospitalite",
    city: "Kinshasa",
    country: "RDC",
    year: 2023,
    cover: "/images/hospise2.jpg",
    images: ["/images/hospise2.jpg", "/images/pexels-hassan-yahia-3582980-5362681.jpg", "/images/img7.jpg"],
    excerpt: "Hospitalité à Kinshasa, une architecture tournée vers l'expérience client.",
    description:
      "Immeuble B à Kinshasa traduit l'hospitalité en séquences spatiales : arrivée, séjour, services. Une architecture au service de l'expérience.",
    features: ["Parcours d'arrivée", "Espaces de restauration", "Chambres"],
    materials: ["Bois et minéral", "Textiles techniques", "Éclairage architectural"],
  },
  {
    slug: "hospitalite-immeuble-d",
    title: "Immeuble D",
    subtitle: "Hospitalité",
    category: "hospitalite",
    city: "Kolwezi",
    country: "RDC",
    year: 2024,
    cover: "/images/maison2.jpg",
    images: ["/images/maison2.jpg", "/images/maison.jpg", "/images/img4.jpg"],
    excerpt: "Établissement d'hospitalité à Kolwezi, confort contemporain et présence urbaine.",
    description:
      "À Kolwezi, ce projet d'hospitalité allie confort contemporain et présence urbaine, dans la continuité des réalisations hôtelières de BEC.",
    features: ["Hébergement", "Espaces communs", "Image contemporaine"],
    materials: ["Béton", "Verre", "Finitions intérieures"],
  },
  {
    slug: "centre-medical-kinshasa",
    title: "Centre médical",
    subtitle: "Santé",
    category: "sante",
    city: "Kinshasa",
    country: "RDC",
    year: 2023,
    cover: "/images/logement/logement3.jpg",
    images: [
      "/images/logement/logement3.jpg",
      "/images/hospise.jpg",
      "/images/hospise2.jpg",
      "/images/publique/publique2.jpg",
    ],
    excerpt: "Centre médical à Kinshasa, parcours de soins clairs et hygiène constructive.",
    description:
      "Le centre médical de Kinshasa organise les parcours de soins, l'accueil des patients et les locaux techniques dans une architecture sereine, fonctionnelle et durable.",
    features: ["Accueil patients", "Consultations", "Locaux techniques"],
    materials: ["Revêtements hygiéniques", "Éclairage médical", "Ventilation contrôlée"],
    featured: true,
  },
  {
    slug: "academique-immeuble-a",
    title: "Immeuble A",
    subtitle: "Académique",
    category: "academique",
    city: "Lubumbashi",
    country: "RDC",
    year: 2024,
    cover: "/images/publique/publique2.jpg",
    images: [
      "/images/publique/publique2.jpg",
      "/images/publique/ok_9 - Photo.jpg",
      "/images/publique/OK_6 - Photo.jpg",
    ],
    excerpt: "Équipement académique à Lubumbashi, salles d'enseignement et espaces de rencontre.",
    description:
      "Cet équipement académique à Lubumbashi accueille l'enseignement et la vie étudiante dans des volumes lumineux, sobres et durables.",
    features: ["Salles de cours", "Espaces de rencontre", "Circulations généreuses"],
    materials: ["Béton", "Bois", "Grandes baies"],
  },
  {
    slug: "academique-immeuble-b",
    title: "Immeuble B",
    subtitle: "Académique",
    category: "academique",
    city: "Kinshasa",
    country: "RDC",
    year: 2023,
    cover: "/images/publique/publique7.jpg",
    images: ["/images/publique/publique7.jpg", "/images/publique/ok_5 - Photo (1).jpg", "/images/publique/publique8.jpg"],
    excerpt: "Bâtiment académique à Kinshasa, pensé pour l'apprentissage et la communauté.",
    description:
      "Immeuble B à Kinshasa propose un cadre d'apprentissage contemporain : salles, bibliothèque et espaces collectifs dans une enveloppe claire.",
    features: ["Salles d'étude", "Espaces collectifs", "Accessibilité"],
    materials: ["Béton", "Verre", "Revêtements acoustiques"],
  },
  {
    slug: "academique-immeuble-c",
    title: "Immeuble C",
    subtitle: "Académique",
    category: "academique",
    city: "Goma",
    country: "RDC",
    year: 2023,
    cover: "/images/publique/ok_4 - Photo (2).jpg",
    images: [
      "/images/publique/ok_4 - Photo (2).jpg",
      "/images/publique/OK_1 - Photo (1).jpg",
      "/images/pexels-tdcat-193003.jpg",
    ],
    excerpt: "Programme académique à Goma, lumière, sobriété et usages pédagogiques.",
    description:
      "À Goma, ce bâtiment académique met la lumière et la sobriété au service des usages pédagogiques, dans l'esprit des projets académiques de BEC.",
    features: ["Salles pédagogiques", "Cour et extérieurs", "Espaces enseignants"],
    materials: ["Maçonnerie", "Béton", "Menuiseries performantes"],
  },
  {
    slug: "academique-immeuble-d",
    title: "Immeuble D",
    subtitle: "Académique",
    category: "academique",
    city: "Kolwezi",
    country: "RDC",
    year: 2024,
    cover: "/images/publique/ok2.jpg",
    images: ["/images/publique/ok2.jpg", "/images/publique/publique5.jpg", "/images/img3.jpg"],
    excerpt: "Équipement académique à Kolwezi, une architecture au service de la formation.",
    description:
      "Immeuble D à Kolwezi inscrit la formation dans une architecture contemporaine, robuste et ouverte sur son environnement.",
    features: ["Amphithéâtre / salles", "Espaces de vie étudiante", "Durabilité"],
    materials: ["Béton", "Pierre", "Toiture performante"],
  },
];

export function getPublishedProjects() {
  return projects.filter((project) => project.published !== false);
}

export function getProject(slug: string) {
  return getPublishedProjects().find((project) => project.slug === slug);
}

export function getFeaturedProjects() {
  return getPublishedProjects().filter((project) => project.featured);
}

export function getRelatedProjects(slug: string, limit = 3) {
  const current = getProject(slug);
  const catalog = getPublishedProjects();
  if (!current) return catalog.slice(0, limit);
  return catalog
    .filter((project) => project.slug !== slug)
    .sort((a, b) => {
      const score = (project: Project) =>
        (project.category === current.category ? 2 : 0) +
        (project.city === current.city ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, limit);
}

export function filterProjects({
  query = "",
  category,
  sort = "recent",
}: {
  query?: string;
  category?: ProjectCategory | "all";
  sort?: ProjectSort;
}) {
  const normalized = query.trim().toLowerCase();
  let result = getPublishedProjects().filter((project) => {
    const matchesCategory = !category || category === "all" || project.category === category;
    const haystack = [
      project.title,
      project.subtitle,
      project.city,
      project.excerpt,
      project.description,
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !normalized || haystack.includes(normalized);
    return matchesCategory && matchesQuery;
  });

  result = [...result].sort((a, b) => {
    if (sort === "oldest") return a.year - b.year || a.title.localeCompare(b.title, "fr");
    if (sort === "az") return a.title.localeCompare(b.title, "fr");
    if (sort === "za") return b.title.localeCompare(a.title, "fr");
    return b.year - a.year || a.title.localeCompare(b.title, "fr");
  });

  return result;
}
