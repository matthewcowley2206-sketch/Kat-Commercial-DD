import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuditChain } from "@/lib/audit/logger";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  const [logs, chainVerification] = await Promise.all([
    prisma.auditLog.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    verifyAuditChain(projectId),
  ]);

  return NextResponse.json({
    logs,
    chainVerification,
  });
}
