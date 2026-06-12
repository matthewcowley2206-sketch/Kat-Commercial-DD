import { prisma } from "@/lib/db";
import { emitEvent } from "@/lib/events/bus";
import { calculateRiskScore } from "@/lib/risk/scoring";
import type { ChecklistStatus, DocumentType } from "@/types";

export async function persistProjectRisk(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { documents: true, checklistItems: true },
  });

  if (!project) return null;

  const docTypes = project.documents.map((d) => d.type as DocumentType);
  const riskResult =
    project.checklistItems.length > 0
      ? calculateRiskScore({
          uploadedDocTypes: docTypes,
          checklistStatuses: project.checklistItems.map((i) => ({
            regulationId: i.regulationId,
            status: i.status as ChecklistStatus,
          })),
          purchasePrice: project.purchasePrice,
          state: project.state,
          propertyType: project.propertyType,
        })
      : null;

  if (!riskResult) return null;

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
    },
  });

  emitEvent("risk_update", projectId, {
    score: riskResult.overallScore,
    level: riskResult.level,
  });

  return riskResult;
}
