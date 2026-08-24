import { Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { articles as seedArticles } from "@/data/articles";
import { company as seedCompany } from "@/data/company";
import { projects as seedProjects } from "@/data/projects";
import { servicesCatalog as seedServices } from "@/data/services";
import { team as seedTeam } from "@/data/team";
import { defaultHome, seedCategories } from "@/lib/cms/defaults";
import { defaultLegalPages } from "@/data/legal";
import { ensureAdminUser } from "@/lib/cms/auth";
import { siteConfig } from "@/lib/site";
import { defaultFooter, normalizeFooter } from "@/lib/cms/footer-content";
import type { Article, CmsSettings, ContactMessage, Project, ProjectCategory, ServiceItem, TeamMember } from "@/types";

export type CompanyContent = typeof seedCompany;

export type CmsDatabase = {
  projects: Project[];
  articles: Article[];
  services: ServiceItem[];
  team: TeamMember[];
  settings: CmsSettings;
  company: CompanyContent;
};

export const defaultSettings: CmsSettings = {
  email: siteConfig.email,
  phones: [...siteConfig.phones],
  whatsapp: siteConfig.whatsapp,
  address: { ...siteConfig.address },
  hours: siteConfig.hours.map((item) => ({ ...item })),
  mapsEmbed: siteConfig.mapsEmbed,
  mapsUrl: siteConfig.mapsUrl,
  social: { ...siteConfig.social },
  tagline: siteConfig.tagline,
  footer: structuredClone(defaultFooter),
};

function seedDatabase(): CmsDatabase {
  return {
    projects: structuredClone(seedProjects),
    articles: structuredClone(seedArticles),
    services: structuredClone(seedServices) as unknown as ServiceItem[],
    team: structuredClone(seedTeam),
    settings: structuredClone(defaultSettings),
    company: structuredClone(seedCompany),
  };
}

function toProject(row: {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  city: string;
  country: string;
  year: number;
  cover: string;
  images: string[];
  excerpt: string;
  description: string;
  features: string[];
  materials: string[];
  area: string | null;
  client: string | null;
  duration: string | null;
  price: string | null;
  featured: boolean;
  published: boolean;
}): Project {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    category: row.category as ProjectCategory,
    city: row.city,
    country: row.country,
    year: row.year,
    cover: row.cover,
    images: row.images,
    excerpt: row.excerpt,
    description: row.description,
    features: row.features,
    materials: row.materials,
    area: row.area ?? undefined,
    client: row.client ?? undefined,
    duration: row.duration ?? undefined,
    price: row.price ?? undefined,
    featured: row.featured,
    published: row.published,
  };
}

function toArticle(row: {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  cover: string;
  category: string;
  date: string;
  readingMinutes: number;
  published: boolean;
}): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    cover: row.cover,
    category: row.category,
    date: row.date,
    readingMinutes: row.readingMinutes,
    published: row.published,
  };
}

function toService(row: {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  process: Prisma.JsonValue;
  image: string;
}): ServiceItem {
  const process = Array.isArray(row.process)
    ? row.process.map((item) => {
        const step = item && typeof item === "object" && "step" in item ? String(item.step) : "";
        const description =
          item && typeof item === "object" && "description" in item ? String(item.description) : "";
        return { step, description };
      })
    : [];
  return {
    id: row.id,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    features: row.features,
    process,
    image: row.image,
  };
}

function toSettings(row: {
  email: string;
  phones: string[];
  whatsapp: string;
  street: string;
  neighborhood: string;
  commune: string;
  city: string;
  country: string;
  fullAddress: string;
  hours: Prisma.JsonValue;
  mapsEmbed: string;
  mapsUrl: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  tagline: string;
  footer?: Prisma.JsonValue | null;
}): CmsSettings {
  const hours = Array.isArray(row.hours)
    ? row.hours.map((item) => {
        const days = item && typeof item === "object" && "days" in item ? String(item.days) : "";
        const time = item && typeof item === "object" && "time" in item ? String(item.time) : "";
        return { days, time };
      })
    : defaultSettings.hours;
  return {
    email: row.email,
    phones: row.phones,
    whatsapp: row.whatsapp,
    address: {
      street: row.street,
      neighborhood: row.neighborhood,
      commune: row.commune,
      city: row.city,
      country: row.country,
      full: row.fullAddress,
    },
    hours,
    mapsEmbed: row.mapsEmbed,
    mapsUrl: row.mapsUrl,
    social: {
      facebook: row.facebook,
      twitter: row.twitter,
      linkedin: row.linkedin,
      instagram: row.instagram,
    },
    tagline: row.tagline,
    footer: normalizeFooter(row.footer),
  };
}

async function persistDatabase(next: CmsDatabase) {
  await prisma.$transaction(async (tx) => {
    await tx.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        email: next.settings.email,
        phones: next.settings.phones,
        whatsapp: next.settings.whatsapp,
        street: next.settings.address.street,
        neighborhood: next.settings.address.neighborhood,
        commune: next.settings.address.commune,
        city: next.settings.address.city,
        country: next.settings.address.country,
        fullAddress: next.settings.address.full,
        hours: next.settings.hours,
        mapsEmbed: next.settings.mapsEmbed,
        mapsUrl: next.settings.mapsUrl,
        facebook: next.settings.social.facebook,
        twitter: next.settings.social.twitter,
        linkedin: next.settings.social.linkedin,
        instagram: next.settings.social.instagram,
        tagline: next.settings.tagline,
        footer: next.settings.footer as unknown as Prisma.InputJsonValue,
      },
      update: {
        email: next.settings.email,
        phones: next.settings.phones,
        whatsapp: next.settings.whatsapp,
        street: next.settings.address.street,
        neighborhood: next.settings.address.neighborhood,
        commune: next.settings.address.commune,
        city: next.settings.address.city,
        country: next.settings.address.country,
        fullAddress: next.settings.address.full,
        hours: next.settings.hours,
        mapsEmbed: next.settings.mapsEmbed,
        mapsUrl: next.settings.mapsUrl,
        facebook: next.settings.social.facebook,
        twitter: next.settings.social.twitter,
        linkedin: next.settings.social.linkedin,
        instagram: next.settings.social.instagram,
        tagline: next.settings.tagline,
        footer: next.settings.footer as unknown as Prisma.InputJsonValue,
      },
    });

    await tx.companyProfile.upsert({
      where: { id: "default" },
      create: { id: "default", data: next.company as Prisma.InputJsonValue },
      update: { data: next.company as Prisma.InputJsonValue },
    });

    const nextProjectSlugs = next.projects.map((item) => item.slug);
    await tx.project.deleteMany({ where: { slug: { notIn: nextProjectSlugs } } });
    for (const [index, project] of next.projects.entries()) {
      const data = {
        title: project.title,
        subtitle: project.subtitle,
        category: project.category,
        city: project.city,
        country: project.country,
        year: project.year,
        cover: project.cover,
        images: project.images,
        excerpt: project.excerpt,
        description: project.description,
        features: project.features,
        materials: project.materials,
        area: project.area ?? null,
        client: project.client ?? null,
        duration: project.duration ?? null,
        price: project.price ?? null,
        featured: Boolean(project.featured),
        published: project.published !== false,
        sortOrder: index,
      };
      await tx.project.upsert({
        where: { slug: project.slug },
        create: { slug: project.slug, ...data },
        update: data,
      });
    }

    const nextArticleSlugs = next.articles.map((item) => item.slug);
    await tx.article.deleteMany({ where: { slug: { notIn: nextArticleSlugs } } });
    for (const [index, article] of next.articles.entries()) {
      const data = {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        cover: article.cover,
        category: article.category,
        date: article.date,
        readingMinutes: article.readingMinutes,
        published: article.published !== false,
        sortOrder: index,
      };
      await tx.article.upsert({
        where: { slug: article.slug },
        create: { slug: article.slug, ...data },
        update: data,
      });
    }

    const nextServiceIds = next.services.map((item) => item.id);
    await tx.service.deleteMany({ where: { id: { notIn: nextServiceIds } } });
    for (const [index, service] of next.services.entries()) {
      const data = {
        title: service.title,
        shortDescription: service.shortDescription,
        description: service.description,
        features: service.features,
        process: service.process as Prisma.InputJsonValue,
        image: service.image,
        sortOrder: index,
      };
      await tx.service.upsert({
        where: { id: service.id },
        create: { id: service.id, ...data },
        update: data,
      });
    }

    const nextTeamIds = next.team.map((item) => item.id);
    await tx.teamMember.deleteMany({ where: { id: { notIn: nextTeamIds } } });
    for (const [index, member] of next.team.entries()) {
      const data = {
        name: member.name,
        role: member.role,
        specialty: member.specialty,
        image: member.image,
        department: member.department,
        sortOrder: index,
      };
      await tx.teamMember.upsert({
        where: { id: member.id },
        create: { id: member.id, ...data },
        update: data,
      });
    }
  });
}

export async function ensureSeeded() {
  const [settings, company, projectCount, articleCount, serviceCount, teamCount] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.companyProfile.findUnique({ where: { id: "default" } }),
    prisma.project.count(),
    prisma.article.count(),
    prisma.service.count(),
    prisma.teamMember.count(),
  ]);
  const freshDatabase =
    !settings && !company && projectCount === 0 && articleCount === 0 && serviceCount === 0 && teamCount === 0;

  if (freshDatabase) {
    await persistDatabase(seedDatabase());
  } else {
    if (!settings) {
      await prisma.siteSettings.upsert({
        where: { id: "default" },
        create: {
          id: "default",
          email: defaultSettings.email,
          phones: defaultSettings.phones,
          whatsapp: defaultSettings.whatsapp,
          street: defaultSettings.address.street,
          neighborhood: defaultSettings.address.neighborhood,
          commune: defaultSettings.address.commune,
          city: defaultSettings.address.city,
          country: defaultSettings.address.country,
          fullAddress: defaultSettings.address.full,
          hours: defaultSettings.hours,
          mapsEmbed: defaultSettings.mapsEmbed,
          mapsUrl: defaultSettings.mapsUrl,
          facebook: defaultSettings.social.facebook,
          twitter: defaultSettings.social.twitter,
          linkedin: defaultSettings.social.linkedin,
          instagram: defaultSettings.social.instagram,
          tagline: defaultSettings.tagline,
          footer: defaultSettings.footer as unknown as Prisma.InputJsonValue,
        },
        update: {},
      });
    }
    if (!company) {
      await prisma.companyProfile.upsert({
        where: { id: "default" },
        create: { id: "default", data: seedDatabase().company as Prisma.InputJsonValue },
        update: {},
      });
    }
  }

  await ensureAdminUser();

  if ((await prisma.category.count()) === 0) {
    await prisma.category.createMany({
      data: seedCategories,
      skipDuplicates: true,
    });
  }

  await prisma.homePage.createMany({
    data: [{ id: "default", data: defaultHome as Prisma.InputJsonValue }],
    skipDuplicates: true,
  });

  await prisma.legalPages.createMany({
    data: [{ id: "default", data: defaultLegalPages as Prisma.InputJsonValue }],
    skipDuplicates: true,
  });
}

export async function getDatabase(): Promise<CmsDatabase> {
  await ensureSeeded();
  const [projects, articles, services, team, settings, company] = await Promise.all([
    prisma.project.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.article.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.service.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.companyProfile.findUnique({ where: { id: "default" } }),
  ]);

  return {
    projects: projects.map(toProject),
    articles: articles.map(toArticle),
    services: services.map(toService),
    team: team.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      specialty: member.specialty,
      image: member.image,
      department: member.department as TeamMember["department"],
    })),
    settings: settings ? toSettings(settings) : defaultSettings,
    company: (company?.data as CompanyContent | undefined) ?? seedDatabase().company,
  };
}

export async function updateDatabase(mutator: (db: CmsDatabase) => CmsDatabase | Promise<CmsDatabase>) {
  const current = await getDatabase();
  const next = await mutator(current);
  await persistDatabase(next);
  return next;
}

export async function getMessages(): Promise<ContactMessage[]> {
  noStore();
  await ensureSeeded();
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return messages.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone ?? undefined,
    subject: item.subject,
    message: item.message,
    createdAt: item.createdAt.toISOString(),
    read: item.read,
  }));
}

export async function updateMessages(
  mutator: (messages: ContactMessage[]) => ContactMessage[] | Promise<ContactMessage[]>,
) {
  const current = await getMessages();
  const next = await mutator(current);
  await prisma.$transaction(async (tx) => {
    const nextIds = next.map((item) => item.id);
    await tx.contactMessage.deleteMany({ where: { id: { notIn: nextIds } } });
    for (const message of next) {
      await tx.contactMessage.upsert({
        where: { id: message.id },
        create: {
          id: message.id,
          name: message.name,
          email: message.email,
          phone: message.phone,
          subject: message.subject,
          message: message.message,
          read: message.read,
          createdAt: new Date(message.createdAt),
        },
        update: {
          name: message.name,
          email: message.email,
          phone: message.phone,
          subject: message.subject,
          message: message.message,
          read: message.read,
        },
      });
    }
  });
  return next;
}
