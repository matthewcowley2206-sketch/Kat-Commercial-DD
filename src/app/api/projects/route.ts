import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit/logger";

const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  propertyAddress: z.string().min(1).max(500),
  propertyType: z.enum([
    "office",
    "retail",
    "industrial",
    "mixed_use",
    "hospitality",
    "healthcare",
    "other",
  ]),
  state: z.enum(["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]),
  purchasePrice: z.number().positive().optional(),
});

function databaseErrorMessage(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);

  if (!process.env.DATABASE_URL) {
    return "Database not configured. Please add DATABASE_URL in your environment settings.";
  }
  if (msg.includes("Can't reach database") || msg.includes("ECONNREFUSED")) {
    return "Cannot reach the database. Check your DATABASE_URL connection string.";
  }
  if (msg.includes("does not exist") || msg.includes("P2021")) {
    return "Database tables not set up. Redeploy the app after connecting a Postgres database.";
  }
  if (msg.includes("file:") && msg.includes("postgresql")) {
    return "Database configuration mismatch. Use Postgres on Vercel or SQLite locally.";
  }

  return "Database error. Please check your connection settings and try again.";
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        propertyAddress: true,
        propertyType: true,
        state: true,
        status: true,
        riskScore: true,
        riskLevel: true,
        purchasePrice: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { documents: true, checklistItems: true } },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: databaseErrorMessage(error) },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createProjectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        name: data.name,
        propertyAddress: data.propertyAddress,
        propertyType: data.propertyType,
        state: data.state,
        purchasePrice: data.purchasePrice,
        status: "draft",
      },
    });

    await createAuditLog({
      projectId: project.id,
      action: "project_created",
      actor: "user",
      details: { name: data.name, state: data.state },
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: databaseErrorMessage(error) },
      { status: 503 }
    );
  }
}
