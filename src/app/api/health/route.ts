import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

  if (!hasDatabaseUrl) {
    return NextResponse.json(
      {
        ok: false,
        database: "missing",
        message: "DATABASE_URL is not configured. Add a Postgres database in Vercel Storage.",
      },
      { status: 503 }
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      database: "connected",
      message: "Database is ready.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        message,
      },
      { status: 503 }
    );
  }
}
