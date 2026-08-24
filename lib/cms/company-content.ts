import { company as seedCompany } from "@/data/company";

export type CompanyContent = typeof seedCompany;

function namedList<T extends { name?: string; title?: string }>(stored: T[] | undefined, fallback: T[]) {
  return Array.isArray(stored) && stored.length ? stored : fallback;
}

export function normalizeCompany(stored: Partial<CompanyContent> | undefined): CompanyContent {
  const source = stored ?? {};
  return {
    ...seedCompany,
    ...source,
    history: { ...seedCompany.history, ...source.history },
    mission: {
      ...seedCompany.mission,
      ...source.mission,
      items: source.mission?.items?.length ? source.mission.items : seedCompany.mission.items,
    },
    values: namedList(source.values, seedCompany.values),
    teamIntro: {
      ...seedCompany.teamIntro,
      ...source.teamIntro,
      profiles: source.teamIntro?.profiles?.length ? source.teamIntro.profiles : seedCompany.teamIntro.profiles,
    },
    achievements: namedList(source.achievements, seedCompany.achievements),
    services: namedList(source.services, seedCompany.services),
    commitments: source.commitments?.length ? source.commitments : seedCompany.commitments,
    timeline: source.timeline?.length ? source.timeline : seedCompany.timeline,
    stats: source.stats?.length ? source.stats : seedCompany.stats,
    certifications: namedList(source.certifications, seedCompany.certifications),
    page: {
      ...seedCompany.page,
      ...source.page,
      cities: source.page?.cities?.length ? source.page.cities : seedCompany.page.cities,
    },
  };
}
