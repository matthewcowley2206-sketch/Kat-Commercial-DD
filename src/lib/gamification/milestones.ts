import type { DashboardData } from "@/types";

export interface Milestone {
  id: string;
  label: string;
  unlocked: boolean;
}

export function getProjectMilestones(data: DashboardData): Milestone[] {
  const { project, documents, checklist, lenderReadiness } = data;

  return [
    {
      id: "setup",
      label: "Project set up",
      unlocked: true,
    },
    {
      id: "upload",
      label: "Documents uploaded",
      unlocked: documents.total > 0,
    },
    {
      id: "pack",
      label: "Full document pack",
      unlocked: documents.missing.length === 0 && documents.total > 0,
    },
    {
      id: "analysis",
      label: "Analysis complete",
      unlocked: checklist.total > 0,
    },
    {
      id: "verified",
      label: "First check verified",
      unlocked: checklist.compliant > 0,
    },
    {
      id: "lender",
      label: "Lender-ready",
      unlocked: lenderReadiness.bankabilityScore >= 55,
    },
    {
      id: "complete",
      label: "Assessment complete",
      unlocked: project.status === "complete",
    },
  ];
}

export function getUnlockedCount(milestones: Milestone[]): number {
  return milestones.filter((m) => m.unlocked).length;
}
