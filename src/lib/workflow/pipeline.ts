import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit/logger";
import { emitEvent } from "@/lib/events/bus";
import { evaluateChecklist } from "@/lib/regulations/engine";
import { calculateRiskScore } from "@/lib/risk/scoring";
import type { DocumentType, WorkflowStage, WorkflowStatus } from "@/types";

const STAGES: WorkflowStage[] = [
  "intake",
  "validation",
  "regulatory_check",
  "risk_scoring",
  "reporting",
];

async function updateWorkflowStage(
  projectId: string,
  stage: WorkflowStage,
  status: WorkflowStatus,
  result?: Record<string, unknown>,
  error?: string
) {
  const run = await prisma.workflowRun.create({
    data: {
      projectId,
      stage,
      status,
      result: result ? JSON.stringify(result) : null,
      error,
      completedAt: status === "completed" || status === "failed" ? new Date() : null,
    },
  });

  emitEvent("workflow_update", projectId, {
    stage,
    status,
    runId: run.id,
  });

  return run;
}

export async function runWorkflow(projectId: string, actor = "system") {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { documents: true, checklistItems: true },
  });

  if (!project) throw new Error("Project not found");

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "collecting" },
  });

  await createAuditLog({
    projectId,
    action: "workflow_started",
    actor,
    details: { stages: STAGES },
  });

  try {
    // Stage 1: Intake
    await updateWorkflowStage(projectId, "intake", "running");
    const docTypes = project.documents.map((d) => d.type as DocumentType);
    await updateWorkflowStage(projectId, "intake", "completed", {
      documentCount: project.documents.length,
      types: docTypes,
    });

    // Stage 2: Validation
    await updateWorkflowStage(projectId, "validation", "running");
    const validDocs = project.documents.filter((d) => d.status !== "rejected");
    const invalidCount = project.documents.length - validDocs.length;
    await updateWorkflowStage(projectId, "validation", "completed", {
      valid: validDocs.length,
      invalid: invalidCount,
    });

    // Stage 3: Regulatory Check
    await updateWorkflowStage(projectId, "regulatory_check", "running");
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "analyzing" },
    });

    const evaluations = evaluateChecklist(docTypes);
    await prisma.checklistItem.deleteMany({ where: { projectId } });

    for (const item of evaluations) {
      await prisma.checklistItem.create({
        data: {
          projectId,
          regulationId: item.regulationId,
          category: item.category,
          title: item.title,
          description: item.description,
          status: item.status,
          priority: item.priority,
          evidence: item.evidence,
          notes: item.notes,
        },
      });
    }

    emitEvent("checklist_update", projectId, {
      itemCount: evaluations.length,
    });

    await updateWorkflowStage(projectId, "regulatory_check", "completed", {
      checklistItems: evaluations.length,
    });

    // Stage 4: Risk Scoring
    await updateWorkflowStage(projectId, "risk_scoring", "running");
    const riskResult = calculateRiskScore({
      uploadedDocTypes: docTypes,
      checklistStatuses: evaluations.map((e) => ({
        regulationId: e.regulationId,
        status: e.status,
      })),
      purchasePrice: project.purchasePrice,
      state: project.state,
    });

    await prisma.riskAssessment.deleteMany({ where: { projectId } });
    for (const cat of riskResult.categories) {
      await prisma.riskAssessment.create({
        data: {
          projectId,
          category: cat.category,
          score: cat.score,
          weight: cat.weight,
          factors: JSON.stringify(cat.factors),
        },
      });
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        riskScore: riskResult.overallScore,
        riskLevel: riskResult.level,
        status: "review",
      },
    });

    emitEvent("risk_update", projectId, {
      score: riskResult.overallScore,
      level: riskResult.level,
    });

    await updateWorkflowStage(projectId, "risk_scoring", "completed", {
      score: riskResult.overallScore,
      level: riskResult.level,
    });

    // Stage 5: Reporting
    await updateWorkflowStage(projectId, "reporting", "running");
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "complete" },
    });
    await updateWorkflowStage(projectId, "reporting", "completed", {
      reportGenerated: true,
      timestamp: new Date().toISOString(),
    });

    await createAuditLog({
      projectId,
      action: "workflow_completed",
      actor,
      details: {
        riskScore: riskResult.overallScore,
        riskLevel: riskResult.level,
        checklistItems: evaluations.length,
      },
    });

    return { success: true, riskResult };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await updateWorkflowStage(projectId, "risk_scoring", "failed", undefined, message);
    await createAuditLog({
      projectId,
      action: "workflow_failed",
      actor,
      details: { error: message },
    });
    throw error;
  }
}

export function getWorkflowStages() {
  return STAGES;
}
