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
  "group inline-flex min-h-10 w-fit max-w-full items-center gap-1.5 rounded-sm py-1 text-sm leading-6 text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]";

const quickLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Services", href: "/services" },
  { label: "Projets", href: "/projets" },
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
  children: React.ReactNode;
};

function FooterSection({ id, title, children }: FooterSectionProps) {
  return (
    <>
      <details className="group border-b border-white/10 sm:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5de0bf] [&::-webkit-details-marker]:hidden">
          <span className="h-3 w-px bg-[#5de0bf]" aria-hidden />
          <span className="flex-1">{title}</span>
          <Plus
            className="h-4 w-4 text-[#5de0bf] transition-transform duration-200 group-open:rotate-45"
            aria-hidden
          />
        </summary>
        <div id={`${id}-mobile`} className="pb-5 pt-1">
          {children}
        </div>
      </details>

      <section className="hidden sm:block">
        <h3 className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
          <span className="h-3 w-px bg-[#5de0bf]" aria-hidden />
          {title}
        </h3>
        <div id={id} className="mt-5">
          {children}
        </div>
      </section>
    </>
  );
}

export function Footer({ settings }: { settings?: CmsSettings }) {
  const contact = settings ?? {
    email: siteConfig.email,
    phones: [...siteConfig.phones],
    address: siteConfig.address,
    social: siteConfig.social,
    mapsUrl: siteConfig.mapsUrl,
  };
  const socialLinks = [
    { icon: Facebook, href: contact.social.facebook, label: "Facebook" },
    { icon: Linkedin, href: contact.social.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: contact.social.twitter, label: "X (Twitter)" },
    { icon: Instagram, href: contact.social.instagram, label: "Instagram" },
  ].filter(({ href }) => /^https?:\/\//.test(href));
  const mapsUrl = "mapsUrl" in contact ? contact.mapsUrl : siteConfig.mapsUrl;

  return (
    <footer className="relative overflow-hidden bg-[#063d33] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5de0bf]/70 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#00af84]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#5de0bf]/10 blur-3xl" />
      <p
        className="pointer-events-none absolute -bottom-8 right-0 select-none text-[5.5rem] font-bold leading-none text-white/[0.04] sm:right-4 sm:text-[9rem] md:text-[11rem] lg:text-[13rem]"
        aria-hidden
      >
        BEC
      </p>

      <div className="container-site relative py-12 sm:py-14 lg:py-16 xl:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]"
              aria-label="Retour à l’accueil BEC"
            >
              <span className="flex items-center gap-3.5">
                <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 sm:h-14 sm:w-14">
                  <SiteImage
                    src="/images/logo/LOGOBLANC.png.jpg"
                    alt=""
                    fill
                    className="scale-125 object-contain mix-blend-screen"
                    sizes="56px"
                  />
                </span>
                <span>
                  <span className="block text-xl font-bold tracking-tight sm:text-2xl">BEC</span>
                  <span className="mt-0.5 block max-w-[16rem] text-xs leading-4 text-white/60">
                    Bureau d&apos;Études et Constructions
                  </span>
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
              Architecture, ingénierie et construction : des projets conçus avec précision à
              Lubumbashi et en RDC.
            </p>
            {socialLinks.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-2.5" aria-label="Réseaux sociaux">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:-translate-y-0.5 hover:border-[#00af84] hover:bg-[#00af84] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <FooterSection
              id="footer-navigation"
              title="Navigation"
            >
              <nav aria-label="Navigation secondaire">
                <ul className="space-y-0.5">
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
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <FooterSection
              id="footer-legal"
              title="Informations"
            >
              <nav aria-label="Informations légales">
                <ul className="space-y-0.5">
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
          </div>

          <section className="sm:col-span-2 lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <h3 className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                <span className="h-3 w-px bg-[#5de0bf]" aria-hidden />
                Contact
              </h3>
              <p className="mt-2 text-xs text-white/50">Parlons de votre projet</p>
              <ul className="mt-5 space-y-3.5 text-sm leading-6 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#5de0bf]">
                    <MapPin className="h-4 w-4" aria-hidden />
                  </span>
                  <address className="not-italic">
                    {mapsUrl ? (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-sm transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]"
                      >
                        {contact.address.street}, {contact.address.neighborhood}
                        <br />
                        {contact.address.city}, RDC
                      </a>
                    ) : (
                      <>
                        {contact.address.street}, {contact.address.neighborhood}
                        <br />
                        {contact.address.city}, RDC
                      </>
                    )}
                  </address>
                </li>
                {contact.phones.slice(0, 2).map((phone) => (
                  <li key={phone} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#5de0bf]">
                      <Phone className="h-4 w-4" aria-hidden />
                    </span>
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="rounded-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]"
                    >
                      {phone}
                    </a>
                  </li>
                ))}
                <li className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#5de0bf]">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="min-w-0 break-all rounded-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf]"
                  >
                    {contact.email}
                  </a>
                </li>
              </ul>
              <Link
                href="/contact#devis"
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#00af84] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(0,175,132,0.9)] transition-colors hover:bg-[#5de0bf] hover:text-[#063d33] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5de0bf] sm:w-auto"
              >
                Demander un devis <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/10">
        <div className="container-site flex flex-col items-center gap-2 pt-5 text-center text-xs leading-5 text-white/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6 sm:text-left pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. Tous droits réservés.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-end">
            <span>Lubumbashi, RDC</span>
            <span className="hidden text-white/25 sm:inline" aria-hidden>
              ·
            </span>
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
