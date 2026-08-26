import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import type { CmsSettings } from "@/types";

export function createMetadata({
  title,
  description,
  path = "/",
  image = siteConfig.ogImage,
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const imageUrl = image.startsWith("http")
    ? image
    : new URL(image, siteConfig.url).toString();
  const fullTitle =
    title === siteConfig.shortName
      ? `${siteConfig.name} | ${siteConfig.tagline}`
      : `${title} | ${siteConfig.shortName}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function organizationJsonLd({
  logo,
  name = siteConfig.name,
  shortName = siteConfig.shortName,
  legalName = siteConfig.legalName,
  contact,
}: {
  logo?: string;
  name?: string;
  shortName?: string;
  legalName?: string;
  contact?: CmsSettings;
} = {}) {
  const logoPath = logo?.trim() || "/images/logo/LOGO VERT.png.jpg";
  const logoUrl = logoPath.startsWith("http")
    ? logoPath
    : new URL(logoPath, siteConfig.url).toString();
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${siteConfig.url}/#organization`,
    name,
    alternateName: shortName,
    legalName,
    url: siteConfig.url,
    logo: logoUrl,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    email: contact?.email || siteConfig.email,
    telephone: contact?.phones?.length ? contact.phones : siteConfig.phones,
    foundingDate: String(siteConfig.founded),
    founder: siteConfig.founders.map((name) => ({
      "@type": "Person",
      name,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact
        ? [contact.address.street, contact.address.neighborhood, contact.address.commune].filter(Boolean).join(", ")
        : `${siteConfig.address.street}, ${siteConfig.address.neighborhood}`,
      addressLocality: contact?.address.city || siteConfig.address.city,
      addressCountry: siteConfig.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -11.668677,
      longitude: 27.468881,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "17:00",
      },
    ],
    areaServed: ["Lubumbashi", "Kinshasa", "Kolwezi", "Goma", "Bukavu", "RDC"],
    hasMap: contact?.mapsUrl || siteConfig.mapsUrl,
    knowsAbout: [
      "Architecture",
      "Construction",
      "Études techniques",
      "Génie civil",
      "Suivi de chantier",
      "Urbanisme",
    ],
    sameAs: Object.values(contact?.social || siteConfig.social).filter((url) => /^https?:\/\//.test(url)),
  };
}

export function websiteJsonLd({
  name = siteConfig.name,
  shortName = siteConfig.shortName,
}: {
  name?: string;
  shortName?: string;
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name,
    alternateName: [shortName, "BEC RDC", "BEC Lubumbashi"],
    inLanguage: "fr-CD",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}
