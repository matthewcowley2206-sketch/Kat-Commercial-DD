import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDashboardData } from "@/lib/dashboard/aggregator";
import { ensureDatabaseReady } from "@/lib/ensure-db";
import { isDemoProject } from "@/lib/demo/constants";
import { copy } from "@/lib/copy";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dashboard = await getDashboardData(id);

  if (!dashboard) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(dashboard);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await ensureDatabaseReady();
    if (!db.ok) {
      return NextResponse.json({ error: db.message }, { status: 503 });
    }

    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (isDemoProject(project.name)) {
      return NextResponse.json(
        { error: copy.home.delete.demoProtected },
        { status: 403 }
      );
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: copy.home.delete.error },
      { status: 500 }
    );
  }
}
