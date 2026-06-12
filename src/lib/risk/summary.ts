import { copy } from "@/lib/copy";
import type { RiskResult } from "@/types";

interface ChecklistCounts {
  total: number;
  compliant: number;
  inReview: number;
  pending: number;
  nonCompliant: number;
}

export interface RiskSummary {
  summary: string;
  drivers: string[];
}

export function getRiskSummary(
  score: number,
  level: string,
  risk: RiskResult | null,
  checklist?: ChecklistCounts
): RiskSummary {
  if (!risk || level === "pending" || score === 0) {
    return {
      summary: copy.dashboard.risk.summary.pending,
      drivers: [],
    };
  }

  const levelKey = level as keyof typeof copy.dashboard.risk.summary.levels;
  const summary =
    copy.dashboard.risk.summary.levels[levelKey] ??
    copy.dashboard.risk.summary.levels.medium;

  const drivers: string[] = [];

  if (checklist) {
    if (checklist.nonCompliant > 0) {
      drivers.push(
        copy.dashboard.risk.drivers.nonCompliant(checklist.nonCompliant)
      );
    }
    if (checklist.inReview > 0) {
      drivers.push(copy.dashboard.risk.drivers.inReview(checklist.inReview));
    }
    if (checklist.pending > 0 && drivers.length < 3) {
      drivers.push(copy.dashboard.risk.drivers.pending(checklist.pending));
    }
    if (checklist.compliant > 0 && checklist.compliant === checklist.total) {
      drivers.push(copy.dashboard.risk.drivers.allCompliant);
    }
  }

  const topCategories = [...risk.categories]
    .sort((a, b) => b.score - a.score)
    .filter((c) => c.score >= 30)
    .slice(0, 2);

  for (const cat of topCategories) {
    const name = cat.category.split("(")[0].trim();
    if (drivers.length < 3) {
      drivers.push(copy.dashboard.risk.drivers.category(name, cat.score));
    }
  }

  return { summary, drivers: drivers.slice(0, 3) };
}
