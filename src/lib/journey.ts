import type { DashboardData } from "@/types";

export type JourneyStep = "setup" | "upload" | "analyse" | "review" | "complete";

export const JOURNEY_ORDER: JourneyStep[] = [
  "setup",
  "upload",
  "analyse",
  "review",
  "complete",
];

export function getCurrentStep(data: DashboardData): JourneyStep {
  const { documents, checklist, project } = data;
  const hasChecklist = checklist.total > 0;
  const allDocsUploaded = documents.missing.length === 0;
  const hasAnalysis = project.status !== "draft" && hasChecklist;
  const reviewedCount = checklist.compliant + checklist.nonCompliant;
  const allReviewed = hasChecklist && reviewedCount === checklist.total;
  const isComplete = project.status === "complete" && allReviewed;

  if (isComplete) return "complete";
  if (hasAnalysis && !allReviewed) return "review";
  if (allDocsUploaded && !hasAnalysis) return "analyse";
  if (documents.total === 0) return "setup";
  return "upload";
}

export function getStepIndex(step: JourneyStep): number {
  return JOURNEY_ORDER.indexOf(step);
}

export function getProgressPercent(step: JourneyStep): number {
  const index = getStepIndex(step);
  return Math.round(((index + 1) / JOURNEY_ORDER.length) * 100);
}

export function getCompletedSteps(step: JourneyStep): JourneyStep[] {
  const index = getStepIndex(step);
  return JOURNEY_ORDER.slice(0, index);
}

export interface JourneyContext {
  step: JourneyStep;
  progress: number;
  missingDocCount: number;
  reviewedCount: number;
  checklistTotal: number;
}

export function getJourneyContext(data: DashboardData): JourneyContext {
  const step = getCurrentStep(data);
  return {
    step,
    progress: getProgressPercent(step),
    missingDocCount: data.documents.missing.length,
    reviewedCount: data.checklist.compliant + data.checklist.nonCompliant,
    checklistTotal: data.checklist.total,
  };
}
