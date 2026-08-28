import { Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { careerPositions } from "@/lib/recruitment";

export type TextPair = { title: string; text: string };
export type FaqItem = { q: string; a: string };

export type ServicesPageContent = {
  heroTitle: string;
  heroIntro: string;
  catalogEyebrow: string;
  catalogTitle: string;
  catalogIntro: string;
  methodEyebrow: string;
  methodTitle: string;
  steps: TextPair[];
};

export type CareersPageContent = {
  heroImage: string;
  heroEyebrow: string;
  heroTitle: string;
  heroIntro: string;
  highlights: TextPair[];
  profilesEyebrow: string;
  profilesTitle: string;
  profilesIntro: string;
  positions: string[];
  formEyebrow: string;
  formTitle: string;
  formIntro: string;
  processEyebrow: string;
  steps: TextPair[];
  documentsTitle: string;
  documents: string[];
  contactTitle: string;
  contactText: string;
};

export type ProjectsPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type ContactPageContent = {
  heroImage: string;
  heroTitle: string;
  heroIntro: string;
  formEyebrow: string;
  formTitle: string;
  formIntro: string;
  infoEyebrow: string;
  infoTitle: string;
  infoIntro: string;
  mapEyebrow: string;
  mapTitle: string;
  reviewsEyebrow: string;
  reviewsTitle: string;
  reviewsIntro: string;
  reviewsEmpty: string;
  reviewsFormTitle: string;
  faqEyebrow: string;
  faqTitle: string;
  faqMoreTitle: string;
  faqMoreText: string;
  faqs: FaqItem[];
};

export type SitePagesContent = {
  services: ServicesPageContent;
  careers: CareersPageContent;
  projects: ProjectsPageContent;
  contact: ContactPageContent;
};

export const defaultServicesPage: ServicesPageContent = {
  heroTitle: "Nos services",
  heroIntro:
    "Architecture, études techniques et construction — de l’idée à la livraison, à Lubumbashi et en RDC.",
  catalogEyebrow: "Notre expertise",
  catalogTitle: "Des services complets",
  catalogIntro: "De la conception au chantier, BEC accompagne chaque étape du projet.",
  methodEyebrow: "Notre méthode",
  methodTitle: "Comment nous travaillons",
  steps: [
    { title: "Consultation", text: "Nous écoutons vos besoins et analysons votre projet." },
    { title: "Conception", text: "L'équipe propose des solutions adaptées au site et au programme." },
    { title: "Réalisation", text: "Nous suivons l'exécution avec rigueur, de l'étude au chantier." },
    { title: "Livraison", text: "Le projet est remis conformément aux engagements convenus." },
  ],
};

export const defaultCareersPage: CareersPageContent = {
  heroImage: "/images/chantier.jpg",
  heroEyebrow: "Recrutement",
  heroTitle: "Rejoindre Bureau d’Études et Construction",
  heroIntro:
    "Déposez votre identité, votre CV et votre lettre de motivation. Chaque dossier est reçu et géré par l’administration du cabinet.",
  highlights: [
    {
      title: "Cabinet pluridisciplinaire",
      text: "Architecture, ingénierie et construction réunies autour des projets du cabinet.",
    },
    {
      title: "Exigence professionnelle",
      text: "Rigueur technique, suivi de chantier et exigence de qualité sur chaque mission.",
    },
    {
      title: "Ancré à Lubumbashi",
      text: "Fondé en 2022, BEC recrute des profils qui veulent construire en RDC.",
    },
  ],
  profilesEyebrow: "Profils recherchés",
  profilesTitle: "Architectes, ingénieurs et talents du bâtiment",
  profilesIntro:
    "BEC reçoit les candidatures spontanées et les dossiers correspondant aux métiers du cabinet. Aucune offre fictive n’est publiée ici : chaque dépôt est étudié selon les besoins réels.",
  positions: [...careerPositions],
  formEyebrow: "Candidature en ligne",
  formTitle: "Déposer votre dossier",
  formIntro:
    "Identité, CV (PDF, Word, ODT ou RTF) et, si possible, une pièce d’identité. Les fichiers sont conservés hors du site public.",
  processEyebrow: "Comment ça se passe",
  steps: [
    { title: "Identité et parcours", text: "Renseignez vos coordonnées, le poste visé et votre formation." },
    {
      title: "CV et pièce d’identité",
      text: "Joignez votre CV (PDF ou Word) et, si vous le souhaitez, une pièce d’identité.",
    },
    {
      title: "Examen par BEC",
      text: "Le dossier arrive dans l’espace administration. Nous vous recontactons si le profil convient.",
    },
  ],
  documentsTitle: "Documents acceptés",
  documents: [
    "CV : PDF, DOC, DOCX, ODT, RTF (8 Mo max.)",
    "Identité : PDF, JPG ou PNG (8 Mo max.)",
    "Lettre de motivation dans le formulaire",
  ],
  contactTitle: "Contact recrutement",
  contactText: "Pour une question hors formulaire :",
};

export const defaultProjectsPage: ProjectsPageContent = {
  eyebrow: "Portfolio",
  title: "Nos réalisations",
  intro:
    "Résidences, logements sociaux, équipements publics, hospitalité, commerces, académique et santé — une même exigence de conception et d’exécution.",
};

export const defaultContactPage: ContactPageContent = {
  heroImage: "/images/contact.jpg",
  heroTitle: "Contactez Bureau d’Études et Construction",
  heroIntro:
    "Pour un devis, un rendez-vous à Lubumbashi ou toute information sur nos services d’architecture et de construction.",
  formEyebrow: "Formulaire de devis",
  formTitle: "Envoyez-nous un message",
  formIntro: "Indiquez votre nom, e-mail, le sujet et le message. Nous vous répondons aux horaires d’ouverture.",
  infoEyebrow: "Nos coordonnées",
  infoTitle: "Informations pratiques",
  infoIntro: "Retrouvez toutes les informations pour nous joindre directement.",
  mapEyebrow: "Localisation",
  mapTitle: "Où nous trouver",
  reviewsEyebrow: "Avis et opinions",
  reviewsTitle: "Partagez votre expérience avec BEC",
  reviewsIntro: "Votre opinion nous aide à améliorer nos services et à mieux accompagner chaque projet.",
  reviewsEmpty: "Soyez la première personne à partager votre avis.",
  reviewsFormTitle: "Donnez votre avis",
  faqEyebrow: "FAQ",
  faqTitle: "Questions fréquentes",
  faqMoreTitle: "Une autre question ?",
  faqMoreText: "Écrivez-nous, nous vous répondons aux horaires d’ouverture.",
  faqs: [
    {
      q: "Comment demander un devis ?",
      a: "Remplissez le formulaire en précisant le sujet de votre projet. Notre équipe vous recontacte aux horaires d'ouverture. Vous pouvez aussi nous joindre par téléphone ou WhatsApp.",
    },
    {
      q: "Dans quelles villes intervenez-vous ?",
      a: "BEC est basé à Lubumbashi et réalise des projets à Kinshasa, Kolwezi, Goma et Bukavu.",
    },
    {
      q: "Quels types de projets accompagnez-vous ?",
      a: "Résidences, villas, immeubles, hôpitaux, hôtels, centres commerciaux, bâtiments administratifs, écoles, logements sociaux et infrastructures publiques.",
    },
    {
      q: "Puis-je visiter vos bureaux ?",
      a: "Oui. Nous vous accueillons Avenue de la Moto, Quartier Gambela 2, Commune de Lubumbashi, du lundi au samedi selon nos horaires. Un rendez-vous est recommandé.",
    },
  ],
};

export const defaultSitePages: SitePagesContent = {
  services: defaultServicesPage,
  careers: defaultCareersPage,
  projects: defaultProjectsPage,
  contact: defaultContactPage,
};

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function lines(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const next = value.map((item) => String(item ?? "").trim()).filter(Boolean);
  return next.length ? next : fallback;
}

function pairs(value: unknown, fallback: TextPair[], count: number): TextPair[] {
  const rows = Array.isArray(value) ? value : [];
  return Array.from({ length: count }, (_, index) => {
    const row = rows[index] as Partial<TextPair> | undefined;
    return {
      title: text(row?.title, fallback[index]?.title ?? ""),
      text: text(row?.text, fallback[index]?.text ?? ""),
    };
  });
}

function faqs(value: unknown, fallback: FaqItem[]): FaqItem[] {
  const rows = Array.isArray(value) ? value : [];
  const count = Math.max(fallback.length, rows.length, 4);
  return Array.from({ length: count }, (_, index) => {
    const row = rows[index] as Partial<FaqItem> | undefined;
    return {
      q: text(row?.q, fallback[index]?.q ?? ""),
      a: text(row?.a, fallback[index]?.a ?? ""),
    };
  }).filter((item) => item.q || item.a);
}

export function normalizeSitePages(stored?: Partial<SitePagesContent>): SitePagesContent {
  const services = stored?.services ?? defaultServicesPage;
  const careers = stored?.careers ?? defaultCareersPage;
  const projects = stored?.projects ?? defaultProjectsPage;
  const contact = stored?.contact ?? defaultContactPage;
  return {
    services: {
      heroTitle: text(services.heroTitle, defaultServicesPage.heroTitle),
      heroIntro: text(services.heroIntro, defaultServicesPage.heroIntro),
      catalogEyebrow: text(services.catalogEyebrow, defaultServicesPage.catalogEyebrow),
      catalogTitle: text(services.catalogTitle, defaultServicesPage.catalogTitle),
      catalogIntro: text(services.catalogIntro, defaultServicesPage.catalogIntro),
      methodEyebrow: text(services.methodEyebrow, defaultServicesPage.methodEyebrow),
      methodTitle: text(services.methodTitle, defaultServicesPage.methodTitle),
      steps: pairs(services.steps, defaultServicesPage.steps, 4),
    },
    careers: {
      heroImage: text(careers.heroImage, defaultCareersPage.heroImage),
      heroEyebrow: text(careers.heroEyebrow, defaultCareersPage.heroEyebrow),
      heroTitle: text(careers.heroTitle, defaultCareersPage.heroTitle),
      heroIntro: text(careers.heroIntro, defaultCareersPage.heroIntro),
      highlights: pairs(careers.highlights, defaultCareersPage.highlights, 3),
      profilesEyebrow: text(careers.profilesEyebrow, defaultCareersPage.profilesEyebrow),
      profilesTitle: text(careers.profilesTitle, defaultCareersPage.profilesTitle),
      profilesIntro: text(careers.profilesIntro, defaultCareersPage.profilesIntro),
      positions: lines(careers.positions, defaultCareersPage.positions),
      formEyebrow: text(careers.formEyebrow, defaultCareersPage.formEyebrow),
      formTitle: text(careers.formTitle, defaultCareersPage.formTitle),
      formIntro: text(careers.formIntro, defaultCareersPage.formIntro),
      processEyebrow: text(careers.processEyebrow, defaultCareersPage.processEyebrow),
      steps: pairs(careers.steps, defaultCareersPage.steps, 3),
      documentsTitle: text(careers.documentsTitle, defaultCareersPage.documentsTitle),
      documents: lines(careers.documents, defaultCareersPage.documents),
      contactTitle: text(careers.contactTitle, defaultCareersPage.contactTitle),
      contactText: text(careers.contactText, defaultCareersPage.contactText),
    },
    projects: {
      eyebrow: text(projects.eyebrow, defaultProjectsPage.eyebrow),
      title: text(projects.title, defaultProjectsPage.title),
      intro: text(projects.intro, defaultProjectsPage.intro),
    },
    contact: {
      heroImage: text(contact.heroImage, defaultContactPage.heroImage),
      heroTitle: text(contact.heroTitle, defaultContactPage.heroTitle),
      heroIntro: text(contact.heroIntro, defaultContactPage.heroIntro),
      formEyebrow: text(contact.formEyebrow, defaultContactPage.formEyebrow),
      formTitle: text(contact.formTitle, defaultContactPage.formTitle),
      formIntro: text(contact.formIntro, defaultContactPage.formIntro),
      infoEyebrow: text(contact.infoEyebrow, defaultContactPage.infoEyebrow),
      infoTitle: text(contact.infoTitle, defaultContactPage.infoTitle),
      infoIntro: text(contact.infoIntro, defaultContactPage.infoIntro),
      mapEyebrow: text(contact.mapEyebrow, defaultContactPage.mapEyebrow),
      mapTitle: text(contact.mapTitle, defaultContactPage.mapTitle),
      reviewsEyebrow: text(contact.reviewsEyebrow, defaultContactPage.reviewsEyebrow),
      reviewsTitle: text(contact.reviewsTitle, defaultContactPage.reviewsTitle),
      reviewsIntro: text(contact.reviewsIntro, defaultContactPage.reviewsIntro),
      reviewsEmpty: text(contact.reviewsEmpty, defaultContactPage.reviewsEmpty),
      reviewsFormTitle: text(contact.reviewsFormTitle, defaultContactPage.reviewsFormTitle),
      faqEyebrow: text(contact.faqEyebrow, defaultContactPage.faqEyebrow),
      faqTitle: text(contact.faqTitle, defaultContactPage.faqTitle),
      faqMoreTitle: text(contact.faqMoreTitle, defaultContactPage.faqMoreTitle),
      faqMoreText: text(contact.faqMoreText, defaultContactPage.faqMoreText),
      faqs: faqs(contact.faqs, defaultContactPage.faqs),
    },
  };
}

async function ensureSitePages() {
  await prisma.sitePages.createMany({
    data: [{ id: "default", data: defaultSitePages as Prisma.InputJsonValue }],
    skipDuplicates: true,
  });
}

export async function getSitePages(): Promise<SitePagesContent> {
  noStore();
  await ensureSitePages();
  const row = await prisma.sitePages.findUnique({ where: { id: "default" } });
  return normalizeSitePages(row?.data as Partial<SitePagesContent> | undefined);
}

export async function saveSitePages(next: SitePagesContent) {
  await prisma.sitePages.upsert({
    where: { id: "default" },
    create: { id: "default", data: next as Prisma.InputJsonValue },
    update: { data: next as Prisma.InputJsonValue },
  });
}

export function pairsFromForm(formData: FormData, prefix: string, count: number): TextPair[] {
  return Array.from({ length: count }, (_, index) => ({
    title: String(formData.get(`${prefix}Title${index}`) ?? "").trim(),
    text: String(formData.get(`${prefix}Text${index}`) ?? "").trim(),
  }));
}

export function faqsFromForm(formData: FormData, count: number): FaqItem[] {
  return Array.from({ length: count }, (_, index) => ({
    q: String(formData.get(`faqQ${index}`) ?? "").trim(),
    a: String(formData.get(`faqA${index}`) ?? "").trim(),
  })).filter((item) => item.q || item.a);
}

export function linesFromForm(formData: FormData, name: string) {
  return String(formData.get(name) ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
