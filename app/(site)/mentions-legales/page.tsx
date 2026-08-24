import type { Metadata } from "next";
import { LegalPublicPage, legalPageMetadata } from "@/components/legal/legal-public-page";

export async function generateMetadata(): Promise<Metadata> {
  return legalPageMetadata("mentions-legales");
}

export default function MentionsLegalesPage() {
  return <LegalPublicPage slug="mentions-legales" />;
}
