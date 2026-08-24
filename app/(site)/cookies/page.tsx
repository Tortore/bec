import type { Metadata } from "next";
import { LegalPublicPage, legalPageMetadata } from "@/components/legal/legal-public-page";

export async function generateMetadata(): Promise<Metadata> {
  return legalPageMetadata("cookies");
}

export default function CookiesPage() {
  return <LegalPublicPage slug="cookies" />;
}
