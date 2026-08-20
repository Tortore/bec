import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function hasCurrentModels(client: PrismaClient) {
  return Boolean(
    client.adminUser &&
      client.category &&
      client.homePage &&
      client.companyProfile &&
      client.application,
  );
}

function getClient() {
  const existing = globalForPrisma.prisma;
  if (existing && hasCurrentModels(existing)) return existing;
  if (existing) {
    void existing.$disconnect();
  }
  const client = createClient();
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = getClient();
