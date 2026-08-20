import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { siteConfig } from "@/lib/site";
import { SiteImage } from "@/components/site-image";
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";
import type { CmsSettings } from "@/types";

const footerLink =
  "block text-sm text-white/70 transition-colors duration-200 hover:text-[#00af84]";

export function Footer({ settings }: { settings?: CmsSettings }) {
  const contact = settings ?? {
    email: siteConfig.email,
    phones: [...siteConfig.phones],
    address: siteConfig.address,
    social: siteConfig.social,
  };
  const quickLinks = [
    { label: "Accueil", href: "/" },
    { label: "Actualités", href: "/actualites" },
    { label: "Projets", href: "/projets" },
    { label: "Services", href: "/services" },
    { label: "Carrières", href: "/carrieres" },
    { label: "Contact", href: "/contact" },
    { label: "À propos", href: "/a-propos" },
  ];
  const legalLinks = [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Confidentialité", href: "/confidentialite" },
    { label: "Cookies", href: "/cookies" },
    { label: "Conditions d’utilisation", href: "/conditions-utilisation" },
  ];
  const socialLinks = [
    { icon: Facebook, href: contact.social.facebook, label: "Facebook" },
    { icon: Linkedin, href: contact.social.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: contact.social.twitter, label: "Twitter" },
    { icon: Instagram, href: contact.social.instagram, label: "Instagram" },
  ];

  return (
    <footer className="bg-[#084338] text-white/80">
      <div className="container-site py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Accueil BEC">
              <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
                <SiteImage
                  src="/images/logo/LOGOBLANC.png.jpg"
                  alt=""
                  fill
                  className="object-contain mix-blend-screen scale-125"
                  sizes="48px"
                />
              </span>
              <span>
                <span className="block text-xl font-bold text-white">BEC</span>
                <span className="block text-xs text-white/70">
                  Bureau d&apos;Études et Constructions
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              Cabinet d&apos;architecture, d&apos;ingénierie et de construction à Lubumbashi,
              fondé en 2022.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-[#00af84] hover:text-white"
                >
                  <social.icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Navigation</h3>
            <nav aria-label="Navigation" className="mt-5">
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Informations légales
            </h3>
            <nav aria-label="Informations légales" className="mt-5">
              <ul className="space-y-2.5">
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
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00af84]" aria-hidden />
                <address className="not-italic leading-relaxed">
                  {contact.address.street}
                  <br />
                  {contact.address.neighborhood}
                  <br />
                  {contact.address.city}, RDC
                </address>
              </li>
              {contact.phones.map((phone) => (
                <li key={phone} className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-[#00af84]" aria-hidden />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-[#00af84]">
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#00af84]" aria-hidden />
                <a href={`mailto:${contact.email}`} className="hover:text-[#00af84]">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. Tous droits réservés.
          </p>
          <p>
            Lubumbashi, RDC ·{" "}
            <Link href="/admin" className="hover:text-[#00af84]">
              Administration
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
