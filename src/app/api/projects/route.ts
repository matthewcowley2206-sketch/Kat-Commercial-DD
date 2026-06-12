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

export async function GET() {
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
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
