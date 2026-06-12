import lendingConfig from "@/../config/lending-readiness.json";
import { calculateLendingMetrics, estimateStampDuty } from "@/lib/lending/metrics";
import type { DocumentType } from "@/types";
import type {
  BankabilityLevel,
  LendingMetrics,
  LenderReadiness,
  ReadinessItem,
  ReadinessSection,
  ReadinessSectionId,
  ReadinessStatus,
} from "@/types/lending";

interface LendingCategory {
  id: string;
  name: string;
  description: string;
  items: {
    id: string;
    title: string;
    description: string;
    documentTypes: DocumentType[];
    priority: string;
  }[];
}

const config = lendingConfig as { categories: LendingCategory[] };

function evaluateItem(
  item: LendingCategory["items"][0],
  uploadedDocTypes: DocumentType[]
): ReadinessItem {
  const hasAll = item.documentTypes.every((dt) => uploadedDocTypes.includes(dt));
  const hasAny = item.documentTypes.some((dt) => uploadedDocTypes.includes(dt));

  let status: ReadinessItem["status"] = "pending";
  let note = `Requires: ${item.documentTypes.join(", ")}`;

  if (hasAll) {
    status = "in_review";
    note = "Documents on file — awaiting broker verification";
  } else if (hasAny) {
    status = "pending";
    const missing = item.documentTypes.filter((dt) => !uploadedDocTypes.includes(dt));
    note = `Still need: ${missing.join(", ")}`;
  }

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    status,
    priority: item.priority,
    note,
  };
}

function sectionStatus(items: ReadinessItem[]): ReadinessStatus {
  if (items.every((i) => i.status === "pending")) return "not_started";
  if (items.every((i) => i.status === "compliant" || i.status === "in_review")) {
    return items.some((i) => i.status === "in_review") ? "in_progress" : "complete";
  }
  return "in_progress";
}

function completionPercent(items: ReadinessItem[]): number {
  if (items.length === 0) return 0;
  const weights = { compliant: 100, in_review: 60, pending: 10, non_compliant: 0 };
  const total = items.reduce((sum, i) => sum + (weights[i.status] ?? 0), 0);
  return Math.round(total / items.length);
}

function bankabilityLevel(score: number): BankabilityLevel {
  if (score >= 75) return "strong";
  if (score >= 55) return "adequate";
  if (score >= 35) return "marginal";
  if (score > 0) return "weak";
  return "pending";
}

function metricsSection(metrics: LendingMetrics | null): ReadinessSection {
  if (!metrics) {
    return {
      id: "lending_metrics",
      label: "Lending metrics",
      description: "LVR, DSCR, and debt serviceability",
      status: "not_started",
      completionPercent: 0,
      headline: "Awaiting data",
      summary: "Add a purchase price and upload financials or a valuation to calculate.",
      signals: [],
      items: [],
    };
  }

  const goodSignals = metrics.signals.filter((s) => s.status === "good").length;
  const completion = Math.round(
    (goodSignals / metrics.signals.length) * 60 +
      (metrics.indicative ? 40 : 0)
  );

  return {
    id: "lending_metrics",
    label: "Lending metrics",
    description: "LVR, DSCR, and debt serviceability",
    status: completion >= 80 ? "complete" : "in_progress",
    completionPercent: completion,
    headline: `DSCR ${metrics.dscr}`,
    summary: `Indicative LVR ${metrics.lvr}% with ${metrics.waleYears ?? "—"}yr WALE. Confirm with lender BDM.`,
    signals: metrics.signals,
    items: [],
    metrics,
  };
}

function categorySection(
  id: ReadinessSectionId,
  metrics: LendingMetrics | null,
  uploadedDocTypes: DocumentType[],
  purchasePrice: number | null,
  state: string
): ReadinessSection {
  if (id === "lending_metrics") return metricsSection(metrics);

  const category = config.categories.find((c) => c.id === id);
  if (!category) {
    throw new Error(`Unknown readiness category: ${id}`);
  }

  const items = category.items.map((item) => evaluateItem(item, uploadedDocTypes));
  const status = sectionStatus(items);
  const percent = completionPercent(items);

  let headline = `${items.filter((i) => i.status !== "pending").length} of ${items.length} reviewed`;
  let summary = category.description;
  const signals = items.slice(0, 3).map((item) => ({
    label: item.title,
    value: item.status === "in_review" ? "On file" : "Pending",
    status:
      item.status === "in_review"
        ? ("caution" as const)
        : item.status === "compliant"
          ? ("good" as const)
          : ("unknown" as const),
    note: item.note,
  }));

  if (id === "income_quality" && metrics) {
    headline =
      metrics.waleYears !== null
        ? `WALE ${metrics.waleYears} yrs · ${metrics.vacancyPct}% vacant`
        : headline;
    summary = "Lease expiry profile and rental income durability for lender serviceability.";
  }

  if (id === "transaction" && purchasePrice) {
    const duty = estimateStampDuty(purchasePrice, state);
    headline = `Est. duty ${formatCompact(duty)}`;
    summary = "GST, stamp duty, and borrower entity — confirm with solicitor and accountant.";
    signals.unshift({
      label: "Stamp duty (est.)",
      value: formatCompact(duty),
      status: "caution",
      note: `Indicative ${state} commercial transfer duty`,
    });
  }

  return {
    id,
    label: category.name,
    description: category.description,
    status,
    completionPercent: percent,
    headline,
    summary,
    signals,
    items,
  };
}

function formatCompact(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  return `$${Math.round(amount / 1000)}k`;
}

function calculateBankabilityScore(sections: ReadinessSection[]): number {
  const weights: Record<ReadinessSectionId, number> = {
    lending_metrics: 30,
    income_quality: 25,
    title_security: 15,
    insurance: 10,
    transaction: 10,
    capex: 10,
  };

  let total = 0;
  let weightSum = 0;

  for (const section of sections) {
    const w = weights[section.id];
    total += section.completionPercent * w;
    weightSum += w;
  }

  return Math.round(total / weightSum);
}

export interface ReadinessInput {
  purchasePrice: number | null;
  propertyType: string;
  state: string;
  uploadedDocTypes: DocumentType[];
}

export function calculateLenderReadiness(input: ReadinessInput): LenderReadiness {
  const metrics = calculateLendingMetrics(input);

  const sectionIds: ReadinessSectionId[] = [
    "lending_metrics",
    "income_quality",
    "title_security",
    "insurance",
    "transaction",
    "capex",
  ];

  const sections = sectionIds.map((id) =>
    categorySection(id, metrics, input.uploadedDocTypes, input.purchasePrice, input.state)
  );

  const bankabilityScore = calculateBankabilityScore(sections);
  const sectionsComplete = sections.filter((s) => s.status === "complete").length;

  return {
    bankabilityScore,
    bankabilityLevel: bankabilityLevel(bankabilityScore),
    sectionsComplete,
    sectionsTotal: sections.length,
    sections,
    metrics,
  };
}
