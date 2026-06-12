import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  const isVercel = process.env.VERCEL === "1";

  if (isVercel) {
    const url =
      process.env.POSTGRES_PRISMA_URL ??
      process.env.POSTGRES_URL ??
      (process.env.DATABASE_URL?.startsWith("postgres")
        ? process.env.DATABASE_URL
        : undefined);
    if (url) return url;
  } else {
    const url =
      process.env.DATABASE_URL ??
      process.env.POSTGRES_PRISMA_URL ??
      process.env.POSTGRES_URL;
    if (url) return url;
  }

  // Placeholder allows Next.js build to complete without a live database.
  // Runtime API routes check getDatabaseStatus() before querying.
  return "postgresql://build:build@127.0.0.1:5432/build?connect_timeout=1";
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
  isVercel: boolean;
} {
  const isVercel = process.env.VERCEL === "1";

  if (isVercel) {
    if (process.env.POSTGRES_PRISMA_URL)
      return { configured: true, source: "POSTGRES_PRISMA_URL", isVercel: true };
    if (process.env.POSTGRES_URL)
      return { configured: true, source: "POSTGRES_URL", isVercel: true };
    if (process.env.DATABASE_URL?.startsWith("postgres"))
      return { configured: true, source: "DATABASE_URL", isVercel: true };
    return { configured: false, source: null, isVercel: true };
  }

  if (process.env.DATABASE_URL)
    return { configured: true, source: "DATABASE_URL", isVercel: false };
  if (process.env.POSTGRES_PRISMA_URL)
    return { configured: true, source: "POSTGRES_PRISMA_URL", isVercel: false };
  if (process.env.POSTGRES_URL)
    return { configured: true, source: "POSTGRES_URL", isVercel: false };
  return { configured: false, source: null, isVercel: false };
}
