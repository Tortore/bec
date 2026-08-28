"use client";

import { Building, Calendar, FileText, HelpCircle, Mail, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/site";
import type { FaqItem } from "@/lib/cms/site-pages";

const faqIcons = [FileText, MapPin, Building, Calendar, HelpCircle, Mail];

export function ContactFaq({
  email = siteConfig.email,
  eyebrow,
  title,
  faqs,
  moreTitle,
  moreText,
}: {
  email?: string;
  eyebrow: string;
  title: string;
  faqs: FaqItem[];
  moreTitle: string;
  moreText: string;
}) {
  const items = faqs.filter((item) => item.q || item.a);
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-site max-w-3xl">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
            {eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">{title}</h2>
        </div>
        <Accordion type="single" collapsible defaultValue={items[0].q} className="space-y-3">
          {items.map((item, index) => {
            const Icon = faqIcons[index] ?? HelpCircle;
            return (
              <AccordionItem
                key={`${item.q}-${index}`}
                value={item.q || `faq-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 data-[state=open]:border-[#00af84]/30 data-[state=open]:bg-[#00af84]/5"
              >
                <AccordionTrigger className="py-4 hover:no-underline">
                  <span className="flex items-center gap-3 text-left">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#065b48] text-white">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-12">{item.a}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <div className="mt-10 rounded-2xl bg-[#00af84]/8 p-8 text-center">
          <HelpCircle className="mx-auto h-10 w-10 text-[#00af84]" aria-hidden />
          <h3 className="mt-3 font-bold text-[#065b48]">{moreTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{moreText}</p>
          <a
            href={`mailto:${email}`}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#065b48] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00af84]"
          >
            <Mail className="h-4 w-4" />
            {email}
          </a>
        </div>
      </div>
    </section>
  );
}
