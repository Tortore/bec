import { Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { defaultLegalPages, legalMetaBySlug, type LegalDocument, type LegalKey, type LegalPagesContent } from "@/data/legal";
import { richTextToPlainText, sanitizeLegalHtml } from "@/lib/rich-text";

export class LegalFormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LegalFormError";
  }
}

function normalizeDocument(stored: Partial<LegalDocument> | undefined, fallback: LegalDocument): LegalDocument {
  return {
    title: stored?.title?.trim() || fallback.title,
    intro: stored?.intro?.trim() || fallback.intro,
    body: sanitizeLegalHtml(stored?.body || fallback.body),
    updatedAt: stored?.updatedAt || fallback.updatedAt,
  };
}

export function normalizeLegalPages(stored: Partial<LegalPagesContent> | undefined): LegalPagesContent {
  return {
    mentions: normalizeDocument(stored?.mentions, defaultLegalPages.mentions),
    privacy: normalizeDocument(stored?.privacy, defaultLegalPages.privacy),
    cookies: normalizeDocument(stored?.cookies, defaultLegalPages.cookies),
    terms: normalizeDocument(stored?.terms, defaultLegalPages.terms),
  };
}

async function ensureLegalPages() {
  const existing = await prisma.legalPages.findUnique({ where: { id: "default" } });
  if (!existing) {
    await prisma.legalPages.create({
      data: { id: "default", data: defaultLegalPages as Prisma.InputJsonValue },
    });
  }
}

export async function getLegalPages(): Promise<LegalPagesContent> {
  noStore();
  await ensureLegalPages();
  const row = await prisma.legalPages.findUnique({ where: { id: "default" } });
  return normalizeLegalPages(row?.data as Partial<LegalPagesContent> | undefined);
}

export async function getLegalPageBySlug(slug: string) {
  const meta = legalMetaBySlug(slug);
  if (!meta) return null;
  const pages = await getLegalPages();
  return { ...meta, document: pages[meta.key] };
}

export async function saveLegalPage(formData: FormData) {
  const key = String(formData.get("key") ?? "") as LegalKey;
  if (!["mentions", "privacy", "cookies", "terms"].includes(key)) {
    throw new LegalFormError("Page légale inconnue.");
  }
  const title = String(formData.get("title") ?? "").trim().slice(0, 160);
  const intro = String(formData.get("intro") ?? "").trim().slice(0, 500);
  const body = sanitizeLegalHtml(String(formData.get("body") ?? ""));
  if (title.length < 2) {
    throw new LegalFormError("Le titre doit contenir au moins 2 caractères.");
  }
  if (intro.length < 10) {
    throw new LegalFormError("L’introduction doit contenir au moins 10 caractères.");
  }
  if (richTextToPlainText(body).length < 30) {
    throw new LegalFormError("Le contenu de la page est trop court.");
  }

  const current = await getLegalPages();
  const next: LegalPagesContent = {
    ...current,
    [key]: {
      title,
      intro,
      body,
      updatedAt: new Date().toISOString(),
    },
  };

  await prisma.legalPages.upsert({
    where: { id: "default" },
    create: { id: "default", data: next as Prisma.InputJsonValue },
    update: { data: next as Prisma.InputJsonValue },
  });

  return next[key];
}
