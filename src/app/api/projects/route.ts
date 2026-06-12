import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma, getDatabaseStatus } from "@/lib/db";
import { createAuditLog } from "@/lib/audit/logger";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(200),
  propertyAddress: z.string().min(1, "Property address is required").max(500),
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
  purchasePrice: z
    .preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = typeof val === "string" ? parseFloat(val) : Number(val);
        return Number.isFinite(num) ? num : undefined;
      },
      z.number().positive().optional()
    ),
});

function databaseErrorMessage(error: unknown): string {
  const status = getDatabaseStatus();
  const msg = error instanceof Error ? error.message : String(error);

  if (!status.configured) {
    return "Database not connected. In Vercel, add Postgres under Storage, then redeploy.";
  }
  if (msg.includes("Can't reach database") || msg.includes("ECONNREFUSED")) {
    return "Cannot reach the database. Check your connection string in Vercel settings.";
  }
  if (msg.includes("does not exist") || msg.includes("P2021") || msg.includes("P1001")) {
    return "Database tables missing. Redeploy after connecting Postgres so tables can be created.";
  }
  if (msg.includes("Authentication failed") || msg.includes("password")) {
    return "Database authentication failed. Check your DATABASE_URL credentials.";
  }

  return `Database error: ${msg}`;
}

function formatZodError(error: z.ZodError): string {
  const first = error.errors[0];
  return first?.message ?? "Please check your form inputs.";
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

    try {
      await createAuditLog({
        projectId: project.id,
        action: "project_created",
        actor: "user",
        details: { name: data.name, state: data.state },
        ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
      });
    } catch (auditError) {
      console.error("Audit log failed (project still created):", auditError);
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: formatZodError(error) }, { status: 400 });
    }
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: databaseErrorMessage(error) },
      { status: 503 }
    );
  }
}
