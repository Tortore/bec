import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prismaCms?: PrismaClient };

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function fieldNames(client: PrismaClient, model: string) {
  const models = (
    client as unknown as {
      _runtimeDataModel?: {
        models?: Record<string, { fields?: Array<{ name?: string }> | Record<string, unknown> }>;
      };
    }
  )._runtimeDataModel?.models;
  const fields = models?.[model]?.fields;
  if (Array.isArray(fields)) {
    return fields.map((field) => field.name).filter(Boolean) as string[];
  }
  if (fields && typeof fields === "object") {
    return Object.keys(fields);
  }
  return [];
}

function hasCurrentModels(client: PrismaClient) {
  const settingsFields = fieldNames(client, "SiteSettings");
  const projectFields = fieldNames(client, "Project");
  if (
    settingsFields.length > 0 &&
    (!settingsFields.includes("footer") || !settingsFields.includes("tiktok"))
  ) {
    return false;
  }
  if (projectFields.length > 0 && !projectFields.includes("video")) return false;
  return Boolean(
    client.adminUser &&
      client.category &&
      client.homePage &&
      client.companyProfile &&
      client.legalPages &&
      client.sitePages &&
      client.application &&
      client.siteVisit &&
      client.appLog,
  );
}

function getClient() {
  const existing = globalForPrisma.prismaCms;
  if (existing && hasCurrentModels(existing)) return existing;
  if (existing) {
    void existing.$disconnect();
  }
  const client = createClient();
  globalForPrisma.prismaCms = client;
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
