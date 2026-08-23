export const siteConfig = {
  name: "Bureau d'Études et Construction",
  shortName: "BEC",
  legalName: "Bureau Études et Construction",
  tagline: "Architecture contemporaine, études et construction en RDC",
  description:
    "Bureau d'Études et Construction (BEC) est un cabinet d'architecture, d'ingénierie et de construction fondé à Lubumbashi en 2022. Conception, études techniques, suivi de chantier et urbanisme.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bec-rdc.com",
  locale: "fr_CD",
  founded: 2022,
  founders: ["Caleb Tshileu", "Fidèle Djese"],
  email: "bec@gmail.com",
  phones: ["+243 97346 0373", "+243 97840 0373"],
  whatsapp: "243973460373",
  address: {
    street: "Avenue de la Moto",
    neighborhood: "Quartier Gambela 2",
    commune: "Commune de Lubumbashi",
    city: "Lubumbashi",
    country: "République Démocratique du Congo",
    countryCode: "CD",
    full: "Avenue de la Moto, RDC, Lubumbashi, Quartier Gambela 2, Commune de Lubumbashi",
  },
  hours: [
    { days: "Lundi — Vendredi", time: "8h00 — 17h00" },
    { days: "Samedi", time: "10h00 — 17h00" },
    { days: "Dimanche", time: "Fermé" },
  ],
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1646.3417687826453!2d27.468881!3d-11.668677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19462e5a6d8d0e97%3A0x305a334d0b3e0c72!2sLubumbashi!5e0!3m2!1sfr!2scd!4v1618366831827!5m2!1sfr!2scd",
  mapsUrl: "https://maps.google.com/?q=Lubumbashi",
  social: {
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    instagram: "#",
  },
  ogImage: "/images/og-image.jpg",
} as const;

export const categoryLabels: Record<string, string> = {
  residentiel: "Résidentiel",
  commercial: "Commercial",
  hospitalite: "Hospitalité",
  public: "Public",
  academique: "Académique",
  sante: "Santé",
  "logement-social": "Logement social",
};

export const articleCategories = [
  "Technologie",
  "Architecture",
  "Construction",
  "Durabilité",
] as const;
