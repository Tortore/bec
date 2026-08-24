import type { Metadata } from "next";
import { ArrowRight, Clock, Mail, MapPin, Phone, PhoneCall } from "lucide-react";
import { getApprovedReviews, getSettings } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";
import { formatPublicAddress, whatsappLink } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { ContactFaq } from "@/components/contact-faq";
import { MapEmbed } from "@/components/consent/map-embed";
import { SiteImage } from "@/components/site-image";
import { ReviewsSection } from "@/components/sections/reviews-section";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const address = formatPublicAddress(settings.address);
  return createMetadata({
    title: "Contact",
    description: `Contactez Bureau d'Études et Construction à ${settings.address.city} : ${address.full}. Téléphone, e-mail, WhatsApp et devis.`,
    path: "/contact",
    image: "/images/contact.jpg",
  });
}

export default async function ContactPage() {
  const [settings, reviews] = await Promise.all([getSettings(), getApprovedReviews()]);
  const whatsapp = whatsappLink(settings.whatsapp, "Bonjour BEC, je souhaite un devis.");
  const address = formatPublicAddress(settings.address);

  return (
    <div>
      <section className="relative flex min-h-[22rem] items-end overflow-hidden md:min-h-[26rem]">
        <div className="absolute inset-0">
          <SiteImage
            src="/images/contact.jpg"
            alt="Contact Bureau d'Études et Construction"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
        <div className="container-site relative z-10 w-full pb-12 pt-10 md:pb-16">
          <Breadcrumbs
            className="text-white/70 [&_span]:text-[#00af84]"
            items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
          />
          <h1 className="mt-6 max-w-3xl text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Contactez Bureau d&apos;Études et Construction
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Pour un devis, un rendez-vous à Lubumbashi ou toute information sur
            nos services d&apos;architecture et de construction.
          </p>
        </div>
      </section>

      <section id="devis" className="scroll-mt-24 bg-white py-16 md:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Formulaire de devis
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Envoyez-nous un message
            </h2>
            <p className="mt-3 mb-8 text-muted-foreground">
              Indiquez votre nom, e-mail, le sujet et le message. Nous vous
              répondons aux horaires d&apos;ouverture.
            </p>
            <ContactForm defaultSubject="Demande de devis" />
          </div>

          <div>
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Nos coordonnées
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Informations pratiques
            </h2>
            <p className="mt-3 mb-8 text-muted-foreground">
              Retrouvez toutes les informations pour nous joindre directement.
            </p>
            <div className="space-y-4">
              <article className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#065b48] text-white">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-bold text-[#065b48]">Adresse</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {address.line1}
                      {address.line2 ? (
                        <>
                          <br />
                          {address.line2}
                        </>
                      ) : null}
                    </p>
                    <a
                      href={settings.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#00af84] hover:text-[#065b48]"
                    >
                      Voir sur la carte
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00af84] text-white">
                    <Phone className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-bold text-[#065b48]">Téléphones</h3>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {settings.phones.map((phone) => (
                        <li key={phone}>
                          <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-[#00af84]">
                            {phone}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#00af84] hover:text-[#065b48]"
                    >
                      Discuter sur WhatsApp
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#065b48] text-white">
                    <Mail className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-bold text-[#065b48]">E-mail</h3>
                    <a
                      href={`mailto:${settings.email}`}
                      className="mt-1 block text-sm text-muted-foreground hover:text-[#00af84]"
                    >
                      {settings.email}
                    </a>
                    <a
                      href={`mailto:${settings.email}`}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#00af84] hover:text-[#065b48]"
                    >
                      Envoyer un e-mail
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00af84] text-white">
                    <Clock className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-bold text-[#065b48]">Horaires</h3>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {settings.hours.map((item) => (
                        <li key={item.days}>
                          {item.days} : {item.time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>

              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5d]"
              >
                <PhoneCall className="h-5 w-5" />
                Contacter sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} />

      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container-site">
          <div className="mb-10 text-center">
            <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
              Localisation
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
              Où nous trouver
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {address.full}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <MapEmbed
              src={settings.mapsEmbed}
              mapsUrl={settings.mapsUrl}
              address={address.full}
            />
          </div>
        </div>
      </section>

      <ContactFaq email={settings.email} />
    </div>
  );
}
