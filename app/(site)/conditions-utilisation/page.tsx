import type { Metadata } from "next";
import { LegalPublicPage, legalPageMetadata } from "@/components/legal/legal-public-page";

export async function generateMetadata(): Promise<Metadata> {
  return legalPageMetadata("conditions-utilisation");
}

export default function TermsPage() {
  return <LegalPublicPage slug="conditions-utilisation" />;
}
