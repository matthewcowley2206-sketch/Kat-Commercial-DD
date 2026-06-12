import { prisma } from "@/lib/db";
import { getRequiredDocumentTypes } from "@/lib/regulations/engine";
import { calculateRiskScore } from "@/lib/risk/scoring";
import type { DashboardData, DocumentType, WorkflowStage } from "@/types";
import { getWorkflowStages } from "@/lib/workflow/pipeline";

export async function getDashboardData(projectId: string): Promise<DashboardData | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      documents: true,
      checklistItems: true,
      workflowRuns: { orderBy: { startedAt: "desc" } },
      riskAssessments: true,
      auditLogs: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!project) return null;

  const docTypes = project.documents.map((d) => d.type as DocumentType);
  const requiredTypes = getRequiredDocumentTypes();
  const missing = requiredTypes.filter((t) => !docTypes.includes(t));

  const checklistSummary = {
    total: project.checklistItems.length,
    compliant: project.checklistItems.filter((i) => i.status === "compliant").length,
    nonCompliant: project.checklistItems.filter((i) => i.status === "non_compliant").length,
    pending: project.checklistItems.filter((i) => i.status === "pending").length,
    inReview: project.checklistItems.filter((i) => i.status === "in_review").length,
    byCategory: [] as { category: string; total: number; compliant: number }[],
  };

  const categoryMap = new Map<string, { total: number; compliant: number }>();
  for (const item of project.checklistItems) {
    const existing = categoryMap.get(item.category) ?? { total: 0, compliant: 0 };
    existing.total++;
    if (item.status === "compliant") existing.compliant++;
    categoryMap.set(item.category, existing);
  }
  checklistSummary.byCategory = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({ category, ...data })
  );

  const stages = getWorkflowStages();
  const latestRuns = new Map<string, (typeof project.workflowRuns)[0]>();
  for (const run of project.workflowRuns) {
    if (!latestRuns.has(run.stage)) {
      latestRuns.set(run.stage, run);
    }
  }

  const workflowStages = stages.map((stage) => {
    const run = latestRuns.get(stage);
    return {
      stage: stage as WorkflowStage,
      status: (run?.status ?? "pending") as "pending" | "running" | "completed" | "failed",
      completedAt: run?.completedAt?.toISOString() ?? null,
    };
  });

  const currentRun = project.workflowRuns[0];
  const risk =
    project.checklistItems.length > 0
      ? calculateRiskScore({
          uploadedDocTypes: docTypes,
          checklistStatuses: project.checklistItems.map((i) => ({
            regulationId: i.regulationId,
            status: i.status as "pending" | "in_review" | "compliant" | "non_compliant" | "not_applicable",
          })),
          purchasePrice: project.purchasePrice,
          state: project.state,
        })
      : null;

  return {
    project: {
      id: project.id,
      name: project.name,
      propertyAddress: project.propertyAddress,
      propertyType: project.propertyType,
      state: project.state,
      status: project.status as DashboardData["project"]["status"],
      riskScore: project.riskScore,
      riskLevel: project.riskLevel as DashboardData["project"]["riskLevel"],
      purchasePrice: project.purchasePrice,
      updatedAt: project.updatedAt.toISOString(),
    },
    checklist: checklistSummary,
    documents: {
      total: project.documents.length,
      byType: Object.entries(
        project.documents.reduce(
          (acc, d) => {
            acc[d.type] = (acc[d.type] ?? 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        )
      ).map(([type, count]) => ({
        type: type as DocumentType,
        count,
        status: "uploaded",
      })),
      missing,
      files: project.documents.map((d) => ({
        id: d.id,
        type: d.type as DocumentType,
        fileName: d.fileName,
        fileSize: d.fileSize,
        mimeType: d.mimeType,
        status: d.status,
        uploadedAt: d.uploadedAt.toISOString(),
      })),
    },
    workflow: {
      currentStage: (currentRun?.stage as WorkflowStage) ?? null,
      status: (currentRun?.status as "pending" | "running" | "completed" | "failed") ?? null,
      stages: workflowStages,
    },
    risk,
    recentActivity: project.auditLogs.map((log) => ({
      id: log.id,
      action: log.action,
      actor: log.actor,
      details: log.details,
      createdAt: log.createdAt.toISOString(),
    })),
  };
}
