import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/layout/back-to-top";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { AnalyticsGate } from "@/components/consent/analytics-gate";
import { getCategories, getSettings } from "@/lib/cms/queries";

// Le contenu est administrable depuis le CMS : il doit être lu au moment de la
// requête. Cela évite également de nécessiter PostgreSQL pendant `next build`.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  return (
    <ConsentProvider>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Aller au contenu
      </a>
      <Header categories={categories} />
      <main id="contenu">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton whatsapp={settings.whatsapp} />
      <BackToTop />
      <AnalyticsGate />
    </ConsentProvider>
  );
}
