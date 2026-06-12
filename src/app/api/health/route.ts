import { NextResponse } from "next/server";
import { prisma, getDatabaseStatus } from "@/lib/db";

export async function GET() {
  const status = getDatabaseStatus();

  if (!status.configured) {
    return NextResponse.json(
      {
        ok: false,
        database: "missing",
        message:
          "No database connected. In Vercel, go to Storage → Create Database → Postgres, then redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      database: "connected",
      source: status.source,
      message: "Database is ready.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        source: status.source,
        message,
      },
      { status: 503 }
    );
  }
}
