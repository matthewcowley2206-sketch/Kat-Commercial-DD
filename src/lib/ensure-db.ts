import { execSync } from "child_process";
import { prisma, getDatabaseStatus } from "@/lib/db";

let schemaReady = false;
let schemaCheckPromise: Promise<{ ok: boolean; message: string }> | null = null;

export async function ensureDatabaseReady(): Promise<{ ok: boolean; message: string }> {
  if (schemaReady) return { ok: true, message: "Ready" };

  if (!schemaCheckPromise) {
    schemaCheckPromise = checkAndInitialize();
  }

  return schemaCheckPromise;
}

async function checkAndInitialize(): Promise<{ ok: boolean; message: string }> {
  const status = getDatabaseStatus();

  if (!status.configured) {
    return {
      ok: false,
      message:
        "Database not connected. In Vercel: Storage → Create Database → Postgres → Connect → Redeploy.",
    };
  }

  try {
    await prisma.project.findFirst({ take: 1 });
    schemaReady = true;
    return { ok: true, message: "Ready" };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const needsSetup =
      msg.includes("does not exist") ||
      msg.includes("P2021") ||
      msg.includes("P1001") ||
      msg.includes("relation") ||
      msg.includes("no such table");

    if (!needsSetup) {
      return {
        ok: false,
        message: `Database error: ${msg}`,
      };
    }
  }

  try {
    execSync("npx prisma db push --skip-generate --accept-data-loss", {
      env: process.env,
      stdio: "pipe",
      timeout: 60_000,
    });
    schemaReady = true;
    schemaCheckPromise = null;
    return { ok: true, message: "Database initialized" };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      message: `Could not set up database tables. ${msg}`,
    };
  }
}
