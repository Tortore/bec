"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Plus,
  Twitter,
} from "lucide-react";
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";
import { SiteImage } from "@/components/site-image";
import { siteConfig } from "@/lib/site";
import type { CmsSettings } from "@/types";

const footerLink =
  "group flex w-fit items-center gap-1 rounded-sm py-1 text-sm leading-6 text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]";

const quickLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Services", href: "/services" },
  { label: "Projets", href: "/projets" },
  { label: "Actualités", href: "/actualites" },
  { label: "Recrutement", href: "/carrieres" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "Cookies", href: "/cookies" },
  { label: "Conditions d’utilisation", href: "/conditions-utilisation" },
];

type FooterSectionProps = {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function FooterSection({ id, title, isOpen, onToggle, children }: FooterSectionProps) {
  return (
    <section className="border-b border-white/10 md:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left md:hidden"
        aria-expanded={isOpen}
        aria-controls={id}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white">{title}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[#5de0bf]">
          <Plus
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
            aria-hidden
          />
        </span>
      </button>
      <h3 className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-white md:block">
        {title}
      </h3>
      <div
        id={id}
        className={`overflow-hidden transition-[max-height] duration-300 md:mt-5 md:max-h-none ${
          isOpen ? "max-h-96 pb-5" : "max-h-0 md:pb-0"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export function Footer({ settings }: { settings?: CmsSettings }) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const contact = settings ?? {
    email: siteConfig.email,
    phones: [...siteConfig.phones],
    address: siteConfig.address,
    social: siteConfig.social,
  };
  const socialLinks = [
    { icon: Facebook, href: contact.social.facebook, label: "Facebook" },
    { icon: Linkedin, href: contact.social.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: contact.social.twitter, label: "X (Twitter)" },
    { icon: Instagram, href: contact.social.instagram, label: "Instagram" },
  ].filter(({ href }) => /^https?:\/\//.test(href));

  return (
    <footer className="bg-[#063d33] text-white">
      <div className="container-site py-12 sm:py-14 lg:py-16">
        <div className="grid gap-8 md:grid-cols-12 md:gap-x-8 md:gap-y-12 xl:gap-x-12">
          <div className="md:col-span-5 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]"
              aria-label="Retour à l’accueil BEC"
            >
              <span className="flex items-center gap-3">
                <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
                  <SiteImage
                    src="/images/logo/LOGOBLANC.png.jpg"
                    alt=""
                    fill
                    className="scale-125 object-contain mix-blend-screen"
                    sizes="48px"
                  />
                </span>
                <span>
                  <span className="block text-xl font-bold tracking-tight">BEC</span>
                  <span className="block text-xs text-white/60">Bureau d&apos;Études et Constructions</span>
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
              Architecture, ingénierie et construction : des projets conçus avec précision à
              Lubumbashi et en RDC.
            </p>
            {socialLinks.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2" aria-label="Réseaux sociaux">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-[#00af84] hover:bg-[#00af84] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="border-y border-white/10 md:col-span-7 md:grid md:grid-cols-3 md:gap-x-8 md:border-y-0 lg:col-span-8 xl:gap-x-12">
            <FooterSection
              id="footer-navigation"
              title="Navigation"
              isOpen={navigationOpen}
              onToggle={() => setNavigationOpen((value) => !value)}
            >
              <nav aria-label="Navigation secondaire">
                <ul className="space-y-1">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={footerLink}>
                        {link.label}
                        <ArrowUpRight
                          className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </FooterSection>

            <FooterSection
              id="footer-legal"
              title="Informations"
              isOpen={legalOpen}
              onToggle={() => setLegalOpen((value) => !value)}
            >
              <nav aria-label="Informations légales">
                <ul className="space-y-1">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={footerLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <CookieSettingsButton className={footerLink} />
                  </li>
                </ul>
              </nav>
            </FooterSection>

            <section className="py-6 md:py-0">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Contact</h3>
              <p className="mt-1 text-xs text-white/50">Parlons de votre projet</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-white/65">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#5de0bf]" aria-hidden />
                  <address className="not-italic">
                    {contact.address.street}, {contact.address.neighborhood}
                    <br />
                    {contact.address.city}, RDC
                  </address>
                </li>
                {contact.phones.slice(0, 2).map((phone) => (
                  <li key={phone} className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-[#5de0bf]" aria-hidden />
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="rounded-sm font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]"
                    >
                      {phone}
                    </a>
                  </li>
                ))}
                <li className="flex min-w-0 items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-[#5de0bf]" aria-hidden />
                  <a
                    href={`mailto:${contact.email}`}
                    className="min-w-0 break-all rounded-sm font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]"
                  >
                    {contact.email}
                  </a>
                </li>
              </ul>
              <Link
                href="/contact#devis"
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#5de0bf]/50 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#00af84] hover:bg-[#00af84] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf] sm:w-auto"
              >
                Demander un devis <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </section>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-center text-xs leading-5 text-white/50 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. Tous droits réservés.</p>
          <p>
            Lubumbashi, RDC ·{" "}
            <Link
              href="/admin"
              className="rounded-sm transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]"
            >
              Administration
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
