import { copy } from "@/lib/copy";

interface ChecklistCounts {
  total: number;
  compliant: number;
  inReview: number;
  pending: number;
  nonCompliant: number;
  byCategory: { category: string; total: number; compliant: number }[];
}

export interface MetricSummary {
  summary: string;
  drivers: string[];
  badge: { label: string; className: string };
  completionPercent: number;
  ringColor: string;
}

function completionPercent(checklist: ChecklistCounts): number {
  if (checklist.total === 0) return 0;
  const weights = { compliant: 100, in_review: 55, pending: 15, non_compliant: 0 };
  const weighted =
    checklist.compliant * weights.compliant +
    checklist.inReview * weights.in_review +
    checklist.pending * weights.pending +
    checklist.nonCompliant * weights.non_compliant;
  return Math.round(weighted / checklist.total);
}

export function getComplianceSummary(checklist: ChecklistCounts): MetricSummary {
  const percent = completionPercent(checklist);
  const c = copy.dashboard.compliance;

  if (checklist.total === 0) {
    return {
      summary: c.summary.notStarted,
      drivers: [],
      badge: { label: c.badges.notStarted, className: "badge bg-slate-100 text-slate-600" },
      completionPercent: 0,
      ringColor: "#94a3b8",
    };
  }

  let summary: string;
  let badgeLabel: string;
  let badgeClass: string;
  let ringColor: string;

  if (checklist.nonCompliant > 0) {
    summary = c.summary.issues;
    badgeLabel = c.badges.needsAttention;
    badgeClass = "badge bg-red-100 text-red-900";
    ringColor = "#dc2626";
  } else if (checklist.compliant === checklist.total) {
    summary = c.summary.complete;
    badgeLabel = c.badges.complete;
    badgeClass = "badge bg-green-100 text-green-900";
    ringColor = "#16a34a";
  } else if (percent >= 70) {
    summary = c.summary.strong;
    badgeLabel = c.badges.onTrack;
    badgeClass = "badge bg-green-100 text-green-900";
    ringColor = "#16a34a";
  } else if (checklist.inReview > 0) {
    summary = c.summary.inReview;
    badgeLabel = c.badges.inProgress;
    badgeClass = "badge bg-blue-100 text-blue-900";
    ringColor = "#4f46e5";
  } else {
    summary = c.summary.pending;
    badgeLabel = c.badges.inProgress;
    badgeClass = "badge bg-amber-100 text-amber-900";
    ringColor = "#d97706";
  }

  const drivers: string[] = [];

  if (checklist.compliant > 0) {
    drivers.push(c.drivers.compliant(checklist.compliant, checklist.total));
  }
  if (checklist.inReview > 0) {
    drivers.push(c.drivers.inReview(checklist.inReview));
  }
  if (checklist.nonCompliant > 0) {
    drivers.push(c.drivers.issues(checklist.nonCompliant));
  }

  const needsWork = [...checklist.byCategory]
    .map((cat) => ({
      name: cat.category.split("(")[0].trim(),
      remaining: cat.total - cat.compliant,
    }))
    .filter((cat) => cat.remaining > 0)
    .sort((a, b) => b.remaining - a.remaining)
    .slice(0, 2);

  for (const cat of needsWork) {
    if (drivers.length < 3) {
      drivers.push(c.drivers.categoryRemaining(cat.name, cat.remaining));
    }
  }

  return {
    summary,
    drivers: drivers.slice(0, 3),
    badge: { label: badgeLabel, className: badgeClass },
    completionPercent: percent,
    ringColor,
  };
}
