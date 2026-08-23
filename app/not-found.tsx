import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConsentProvider } from "@/components/consent/consent-provider";

export default function NotFound() {
  return (
    <ConsentProvider>
      <Header />
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#065b48] md:text-8xl">404</h1>
          <p className="mt-4 text-xl text-muted-foreground">Page non trouvée</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Cette adresse n&apos;existe pas sur le site de Bureau d&apos;Études et Construction.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-[#00af84] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#065b48]"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
      <Footer />
    </ConsentProvider>
  );
}
