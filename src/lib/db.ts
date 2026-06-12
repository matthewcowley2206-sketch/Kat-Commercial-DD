import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: { url: getDatabaseUrl() },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function getDatabaseStatus(): {
  configured: boolean;
  source: string | null;
} {
  if (process.env.DATABASE_URL) return { configured: true, source: "DATABASE_URL" };
  if (process.env.POSTGRES_PRISMA_URL)
    return { configured: true, source: "POSTGRES_PRISMA_URL" };
  if (process.env.POSTGRES_URL) return { configured: true, source: "POSTGRES_URL" };
  return { configured: false, source: null };
}
