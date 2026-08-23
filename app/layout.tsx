import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#065b48",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "BEC - Bureau d'Études et Construction",
    template: "%s | BEC",
  },
  description:
    "Bureau d'études et de constructions basé à Lubumbashi, RDC. Architecture, ingénierie et suivi de chantier.",
  keywords: [
    "architecture",
    "construction",
    "bureau d'études",
    "Lubumbashi",
    "RDC",
    "BEC",
    "génie civil",
    "urbanisme",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    siteName: "BEC",
    title: "BEC - Bureau d'Études et Construction",
    description: "Bureau d'études et de constructions basé à Lubumbashi, RDC",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BEC - Bureau d'Études et Construction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BEC - Bureau d'Études et Construction",
    description: "Expertise en ingénierie et construction en RDC",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  category: "architecture",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={GeistSans.variable}>
      <body className={`${GeistSans.className} min-h-screen bg-background antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
