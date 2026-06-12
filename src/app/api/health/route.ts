import { NextResponse } from "next/server";
import { prisma, getDatabaseStatus } from "@/lib/db";

export async function GET() {
  const status = getDatabaseStatus();

  if (!status.configured) {
    return NextResponse.json(
      {
        ok: false,
        database: "missing",
        isVercel: status.isVercel,
        message: status.isVercel
          ? "Add Vercel Postgres: Dashboard → Storage → Create Database → Postgres → Connect to this project → Redeploy. Do not use file:./dev.db on Vercel."
          : "Set DATABASE_URL in your .env file (file:./dev.db for local dev).",
        version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      },
      { status: 503 }
    );
  }

  try {
    await prisma.project.findFirst({ take: 1 });
    return NextResponse.json({
      ok: true,
      database: "connected",
      source: status.source,
      isVercel: status.isVercel,
      message: "Database is ready.",
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        source: status.source,
        isVercel: status.isVercel,
        message,
        version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      },
      { status: 503 }
    );
  }
}
