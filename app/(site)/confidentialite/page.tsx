import type { Metadata } from "next";
import { LegalPublicPage, legalPageMetadata } from "@/components/legal/legal-public-page";

export async function generateMetadata(): Promise<Metadata> {
  return legalPageMetadata("confidentialite");
}

export default function PrivacyPage() {
  return <LegalPublicPage slug="confidentialite" />;
}
