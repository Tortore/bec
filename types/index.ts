export const projectCategories = [
  "residentiel",
  "commercial",
  "hospitalite",
  "public",
  "academique",
  "sante",
  "logement-social",
] as const;

export type ProjectCategory = string;

export type Category = {
  id: string;
  label: string;
  sortOrder: number;
};

export type ProjectSort = "recent" | "oldest" | "az" | "za";

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  city: string;
  country: string;
  year: number;
  cover: string;
  images: string[];
  excerpt: string;
  description: string;
  features: string[];
  materials: string[];
  area?: string;
  client?: string;
  duration?: string;
  price?: string;
  featured?: boolean;
  /** Mettre à `false` pour masquer un projet en attente de publication. */
  published?: boolean;
}

export const teamDepartments = [
  "direction",
  "architecture",
  "ingenierie",
  "support",
] as const;

export type TeamDepartment = (typeof teamDepartments)[number];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  department: TeamDepartment;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  process: { step: string; description: string }[];
  image: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface FooterContent {
  logo: string;
  brandName: string;
  brandSubtitle: string;
  watermark: string;
  navigationTitle: string;
  legalTitle: string;
  contactTitle: string;
  contactIntro: string;
  ctaLabel: string;
  legalName: string;
  copyrightSuffix: string;
  adminLabel: string;
  cookiesLabel: string;
  nav: {
    home: string;
    about: string;
    services: string;
    projects: string;
    careers: string;
    contact: string;
  };
  legal: {
    mentions: string;
    privacy: string;
    cookies: string;
    terms: string;
  };
}

export interface CmsSettings {
  email: string;
  phones: string[];
  whatsapp: string;
  address: {
    street: string;
    neighborhood: string;
    commune: string;
    city: string;
    country: string;
    full: string;
  };
  hours: { days: string; time: string }[];
  mapsEmbed: string;
  mapsUrl: string;
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  tagline: string;
  footer: FooterContent;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  cover: string;
  category: string;
  date: string;
  readingMinutes: number;
  published?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export type HomeStat = {
  value: number;
  suffix: string;
  label: string;
  description: string;
};

export type HomeContent = {
  heroBadge: string;
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  heroLocation: string;
  heroImage: string;
  heroVideo: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesIntro: string;
  projectsEyebrow: string;
  projectsTitle: string;
  projectsIntro: string;
  teamEyebrow: string;
  teamTitle: string;
  teamIntro: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  ctaBenefits: string[];
  stats: HomeStat[];
};

export type AdminAccount = {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: "admin" | "editor";
  active: boolean;
  createdAt: string;
};
