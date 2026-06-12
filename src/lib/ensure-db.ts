import { prisma, getDatabaseStatus } from "@/lib/db";

let schemaReady = false;
let schemaCheckPromise: Promise<{ ok: boolean; message: string }> | null = null;

export async function ensureDatabaseReady(): Promise<{ ok: boolean; message: string }> {
  if (schemaReady) return { ok: true, message: "Ready" };

  if (!schemaCheckPromise) {
    schemaCheckPromise = checkDatabase();
  }

  return schemaCheckPromise;
}

async function checkDatabase(): Promise<{ ok: boolean; message: string }> {
  const status = getDatabaseStatus();

  if (!status.configured) {
    return {
      ok: false,
      message: status.isVercel
        ? "Database not connected. In Vercel: Storage → Create Database → Postgres → Connect → Redeploy."
        : "Database not configured. Set DATABASE_URL in your .env file.",
    };
  }

  try {
    await prisma.project.findFirst({ take: 1 });
    schemaReady = true;
    return { ok: true, message: "Ready" };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);

    if (
      msg.includes("does not exist") ||
      msg.includes("P2021") ||
      msg.includes("relation") ||
      msg.includes("no such table")
    ) {
      return {
        ok: false,
        message:
          "Database tables not created yet. Redeploy after connecting Vercel Postgres so the build can set up tables.",
      };
    }

    return { ok: false, message: `Database error: ${msg}` };
  }
}
