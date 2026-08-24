import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getDatabase } from "@/lib/cms/store";
import { normalizeCompany } from "@/lib/cms/company-content";
import { company as seedCompany } from "@/data/company";
import { richTextToPlainText, sanitizeRichText } from "@/lib/rich-text";

export class CompanyFormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompanyFormError";
  }
}

function parseLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function text(formData: FormData, name: string, max: number, fallback: string) {
  const value = String(formData.get(name) ?? "").trim().slice(0, max);
  return value || fallback;
}

function mediaSrc(formData: FormData, name: string, fallback: string) {
  const raw = String(formData.get(name) ?? "").trim();
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("..")) return raw;
  return fallback;
}

function parseNamed(value: FormDataEntryValue | null) {
  return parseLines(value)
    .map((line) => {
      const [name, ...rest] = line.split("|");
      return { name: name.trim().slice(0, 80), description: rest.join("|").trim().slice(0, 500) };
    })
    .filter((item) => item.name && item.description);
}

function parseTitled(value: FormDataEntryValue | null) {
  return parseLines(value)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return { title: title.trim().slice(0, 120), description: rest.join("|").trim().slice(0, 500) };
    })
    .filter((item) => item.title && item.description);
}

function parseTimeline(value: FormDataEntryValue | null) {
  return parseLines(value)
    .map((line) => {
      const [year, title, ...rest] = line.split("|");
      return {
        year: year.trim().slice(0, 40),
        title: (title ?? "").trim().slice(0, 120),
        description: rest.join("|").trim().slice(0, 500),
      };
    })
    .filter((item) => item.year && item.title && item.description);
}

export async function saveCompanyForm(formData: FormData) {
  const current = normalizeCompany((await getDatabase()).company);
  const defaults = seedCompany;
  const historyTitle = String(formData.get("historyTitle") ?? "").trim().slice(0, 160);
  const historyFounding = sanitizeRichText(String(formData.get("historyFounding") ?? ""));
  const historyLead = sanitizeRichText(String(formData.get("historyLead") ?? ""));
  const historyBody = sanitizeRichText(String(formData.get("historyBody") ?? ""));
  const vision = sanitizeRichText(String(formData.get("vision") ?? ""));
  const missionLead = sanitizeRichText(String(formData.get("missionLead") ?? ""));
  const missionItems = parseLines(formData.get("missionItems")).map((item) => item.slice(0, 500));
  const values = parseNamed(formData.get("values"));
  const commitments = parseLines(formData.get("commitments")).map((item) => item.slice(0, 500));
  const timeline = parseTimeline(formData.get("timeline"));
  const certifications = parseTitled(formData.get("certifications"));
  const achievements = parseTitled(formData.get("achievements"));
  const cities = parseLines(formData.get("cities")).map((item) => item.slice(0, 80));
  const teamProfiles = parseLines(formData.get("teamProfiles")).map((item) => item.slice(0, 120));

  if (historyTitle.length < 2) {
    throw new CompanyFormError("Le titre de la page À propos doit contenir au moins 2 caractères.");
  }
  if (richTextToPlainText(historyFounding).length < 10) {
    throw new CompanyFormError("Le texte de fondation doit contenir au moins 10 caractères.");
  }
  if (richTextToPlainText(historyLead).length < 10) {
    throw new CompanyFormError("L’introduction doit contenir au moins 10 caractères.");
  }
  if (richTextToPlainText(historyBody).length < 10) {
    throw new CompanyFormError("Le texte de présentation doit contenir au moins 10 caractères.");
  }
  if (richTextToPlainText(vision).length < 10) {
    throw new CompanyFormError("La vision doit contenir au moins 10 caractères.");
  }
  if (richTextToPlainText(missionLead).length < 10) {
    throw new CompanyFormError("L’introduction de la mission doit contenir au moins 10 caractères.");
  }
  if (missionItems.length === 0) {
    throw new CompanyFormError("Ajoutez au moins un point de mission (un par ligne).");
  }
  if (values.length === 0) {
    throw new CompanyFormError("Ajoutez au moins une valeur au format Nom | Description.");
  }
  if (commitments.length === 0) {
    throw new CompanyFormError("Ajoutez au moins un engagement (un par ligne).");
  }
  if (timeline.length === 0) {
    throw new CompanyFormError("Ajoutez au moins une étape de chronologie (Année | Titre | Description).");
  }
  if (certifications.length === 0) {
    throw new CompanyFormError("Ajoutez au moins un atout au format Titre | Description.");
  }
  if (achievements.length === 0) {
    throw new CompanyFormError("Ajoutez au moins un type de projet au format Titre | Description.");
  }

  const company = {
    ...current,
    history: { title: historyTitle, founding: historyFounding, lead: historyLead, body: historyBody },
    vision,
    mission: { lead: missionLead, items: missionItems },
    values,
    commitments,
    timeline,
    certifications,
    achievements,
    teamIntro: {
      lead: text(formData, "teamLead", 500, defaults.teamIntro.lead),
      profiles: teamProfiles.length ? teamProfiles : defaults.teamIntro.profiles,
      philosophy: text(formData, "teamPhilosophy", 500, defaults.teamIntro.philosophy),
    },
    page: {
      ...current.page,
      heroSubtitle: text(formData, "heroSubtitle", 300, defaults.page.heroSubtitle),
      heroImage: mediaSrc(formData, "heroImage", defaults.page.heroImage),
      historyEyebrow: text(formData, "historyEyebrow", 80, defaults.page.historyEyebrow),
      historyHeading: text(formData, "historyHeading", 160, defaults.page.historyHeading),
      historyImage: mediaSrc(formData, "historyImage", defaults.page.historyImage),
      historyBadge: text(formData, "historyBadge", 80, defaults.page.historyBadge),
      historyLocation: text(formData, "historyLocation", 80, defaults.page.historyLocation),
      hqTitle: text(formData, "hqTitle", 80, defaults.page.hqTitle),
      cities: cities.length ? cities : defaults.page.cities,
      visionEyebrow: text(formData, "visionEyebrow", 80, defaults.page.visionEyebrow),
      visionHeading: text(formData, "visionHeading", 160, defaults.page.visionHeading),
      visionTitle: text(formData, "visionTitle", 80, defaults.page.visionTitle),
      missionTitle: text(formData, "missionTitle", 80, defaults.page.missionTitle),
      valuesEyebrow: text(formData, "valuesEyebrow", 80, defaults.page.valuesEyebrow),
      valuesHeading: text(formData, "valuesHeading", 160, defaults.page.valuesHeading),
      valuesIntro: text(formData, "valuesIntro", 300, defaults.page.valuesIntro),
      timelineEyebrow: text(formData, "timelineEyebrow", 80, defaults.page.timelineEyebrow),
      timelineHeading: text(formData, "timelineHeading", 160, defaults.page.timelineHeading),
      strengthsEyebrow: text(formData, "strengthsEyebrow", 80, defaults.page.strengthsEyebrow),
      strengthsHeading: text(formData, "strengthsHeading", 160, defaults.page.strengthsHeading),
      teamEyebrow: text(formData, "teamEyebrow", 80, defaults.page.teamEyebrow),
      teamHeading: text(formData, "teamHeading", 160, defaults.page.teamHeading),
      domainsEyebrow: text(formData, "domainsEyebrow", 80, defaults.page.domainsEyebrow),
      domainsHeading: text(formData, "domainsHeading", 160, defaults.page.domainsHeading),
      commitmentsHeading: text(formData, "commitmentsHeading", 160, defaults.page.commitmentsHeading),
      commitmentsIntro: text(formData, "commitmentsIntro", 300, defaults.page.commitmentsIntro),
    },
  };

  await prisma.companyProfile.upsert({
    where: { id: "default" },
    create: { id: "default", data: company as Prisma.InputJsonValue },
    update: { data: company as Prisma.InputJsonValue },
  });

  return company;
}
