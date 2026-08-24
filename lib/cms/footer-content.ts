import { siteConfig } from "@/lib/site";
import type { FooterContent } from "@/types";

export const defaultFooter: FooterContent = {
  logo: "/images/logo/LOGOBLANC.png.jpg",
  brandName: siteConfig.shortName,
  brandSubtitle: siteConfig.name,
  watermark: siteConfig.shortName,
  navigationTitle: "Navigation",
  legalTitle: "Informations",
  contactTitle: "Contact",
  contactIntro: "Parlons de votre projet",
  ctaLabel: "Demander un devis",
  legalName: siteConfig.legalName,
  copyrightSuffix: "Tous droits réservés.",
  adminLabel: "Administration",
  cookiesLabel: "Gérer les cookies",
  nav: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    projects: "Projets",
    careers: "Recrutement",
    contact: "Contact",
  },
  legal: {
    mentions: "Mentions légales",
    privacy: "Confidentialité",
    cookies: "Cookies",
    terms: "Conditions d’utilisation",
  },
};

function pick(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function normalizeFooter(stored: unknown): FooterContent {
  const source = stored && typeof stored === "object" ? (stored as Record<string, unknown>) : {};
  const nav = source.nav && typeof source.nav === "object" ? (source.nav as Record<string, unknown>) : {};
  const legal = source.legal && typeof source.legal === "object" ? (source.legal as Record<string, unknown>) : {};
  return {
    logo: pick(source.logo, defaultFooter.logo),
    brandName: pick(source.brandName, defaultFooter.brandName),
    brandSubtitle: pick(source.brandSubtitle, defaultFooter.brandSubtitle),
    watermark: pick(source.watermark, defaultFooter.watermark),
    navigationTitle: pick(source.navigationTitle, defaultFooter.navigationTitle),
    legalTitle: pick(source.legalTitle, defaultFooter.legalTitle),
    contactTitle: pick(source.contactTitle, defaultFooter.contactTitle),
    contactIntro: pick(source.contactIntro, defaultFooter.contactIntro),
    ctaLabel: pick(source.ctaLabel, defaultFooter.ctaLabel),
    legalName: pick(source.legalName, defaultFooter.legalName),
    copyrightSuffix: pick(source.copyrightSuffix, defaultFooter.copyrightSuffix),
    adminLabel: pick(source.adminLabel, defaultFooter.adminLabel),
    cookiesLabel: pick(source.cookiesLabel, defaultFooter.cookiesLabel),
    nav: {
      home: pick(nav.home, defaultFooter.nav.home),
      about: pick(nav.about, defaultFooter.nav.about),
      services: pick(nav.services, defaultFooter.nav.services),
      projects: pick(nav.projects, defaultFooter.nav.projects),
      careers: pick(nav.careers, defaultFooter.nav.careers),
      contact: pick(nav.contact, defaultFooter.nav.contact),
    },
    legal: {
      mentions: pick(legal.mentions, defaultFooter.legal.mentions),
      privacy: pick(legal.privacy, defaultFooter.legal.privacy),
      cookies: pick(legal.cookies, defaultFooter.legal.cookies),
      terms: pick(legal.terms, defaultFooter.legal.terms),
    },
  };
}

export function footerFromFormData(formData: FormData): FooterContent {
  return normalizeFooter({
    logo: formData.get("footerLogo"),
    brandName: formData.get("footerBrandName"),
    brandSubtitle: formData.get("footerBrandSubtitle"),
    watermark: formData.get("footerWatermark"),
    navigationTitle: formData.get("footerNavTitle"),
    legalTitle: formData.get("footerLegalTitle"),
    contactTitle: formData.get("footerContactTitle"),
    contactIntro: formData.get("footerContactIntro"),
    ctaLabel: formData.get("footerCtaLabel"),
    legalName: formData.get("footerLegalName"),
    copyrightSuffix: formData.get("footerCopyrightSuffix"),
    adminLabel: formData.get("footerAdminLabel"),
    cookiesLabel: formData.get("footerCookiesLabel"),
    nav: {
      home: formData.get("footerNavHome"),
      about: formData.get("footerNavAbout"),
      services: formData.get("footerNavServices"),
      projects: formData.get("footerNavProjects"),
      careers: formData.get("footerNavCareers"),
      contact: formData.get("footerNavContact"),
    },
    legal: {
      mentions: formData.get("footerLegalMentions"),
      privacy: formData.get("footerLegalPrivacy"),
      cookies: formData.get("footerLegalCookies"),
      terms: formData.get("footerLegalTerms"),
    },
  });
}
