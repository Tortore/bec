"use client";

import { Building, Calendar, FileText, HelpCircle, Mail, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/site";

const faqs = [
  {
    q: "Comment demander un devis ?",
    a: "Remplissez le formulaire en précisant le sujet de votre projet. Notre équipe vous recontacte aux horaires d'ouverture. Vous pouvez aussi nous joindre par téléphone ou WhatsApp.",
    icon: FileText,
  },
  {
    q: "Dans quelles villes intervenez-vous ?",
    a: "BEC est basé à Lubumbashi et réalise des projets à Kinshasa, Kolwezi, Goma et Bukavu.",
    icon: MapPin,
  },
  {
    q: "Quels types de projets accompagnez-vous ?",
    a: "Résidences, villas, immeubles, hôpitaux, hôtels, centres commerciaux, bâtiments administratifs, écoles, logements sociaux et infrastructures publiques.",
    icon: Building,
  },
  {
    q: "Puis-je visiter vos bureaux ?",
    a: "Oui. Nous vous accueillons Avenue de la Moto, Quartier Gambela 2, Commune de Lubumbashi, du lundi au samedi selon nos horaires. Un rendez-vous est recommandé.",
    icon: Calendar,
  },
];

export function ContactFaq() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-site max-w-3xl">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
            Questions fréquentes
          </h2>
        </div>
        <Accordion type="single" collapsible defaultValue={faqs[0].q} className="space-y-3">
          {faqs.map((item) => (
            <AccordionItem
              key={item.q}
              value={item.q}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 data-[state=open]:border-[#00af84]/30 data-[state=open]:bg-[#00af84]/5"
            >
              <AccordionTrigger className="py-4 hover:no-underline">
                <span className="flex items-center gap-3 text-left">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#065b48] text-white">
                    <item.icon className="h-4 w-4" aria-hidden />
                  </span>
                  {item.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-12">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10 rounded-2xl bg-[#00af84]/8 p-8 text-center">
          <HelpCircle className="mx-auto h-10 w-10 text-[#00af84]" aria-hidden />
          <h3 className="mt-3 font-bold text-[#065b48]">Une autre question ?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Écrivez-nous, nous vous répondons aux horaires d&apos;ouverture.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#065b48] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00af84]"
          >
            <Mail className="h-4 w-4" />
            {siteConfig.email}
          </a>
        </div>
      </div>
    </section>
  );
}
