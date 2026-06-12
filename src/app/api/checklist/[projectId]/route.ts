import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit/logger";
import { emitEvent } from "@/lib/events/bus";

const updateSchema = z.object({
  itemId: z.string(),
  status: z.enum(["pending", "in_review", "compliant", "non_compliant", "not_applicable"]),
  notes: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const items = await prisma.checklistItem.findMany({
    where: { projectId },
    orderBy: [{ priority: "desc" }, { category: "asc" }],
  });

  return NextResponse.json(items);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  try {
    const body = await request.json();
    const { itemId, status, notes } = updateSchema.parse(body);

    const item = await prisma.checklistItem.update({
      where: { id: itemId },
      data: {
        status,
        notes: notes ?? undefined,
        completedAt: status === "compliant" || status === "non_compliant" ? new Date() : null,
      },
    });

    await createAuditLog({
      projectId,
      action: "checklist_updated",
      actor: "user",
      details: { itemId, regulationId: item.regulationId, status, notes },
    });

    emitEvent("checklist_update", projectId, { itemId, status });

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
