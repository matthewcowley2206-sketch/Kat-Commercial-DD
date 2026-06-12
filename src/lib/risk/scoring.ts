import regulationsConfig from "@/../config/regulations.json";
import type {
  ChecklistStatus,
  DocumentType,
  RegulationsConfig,
  RiskFactor,
  RiskLevel,
  RiskResult,
} from "@/types";

const config = regulationsConfig as RegulationsConfig;

function scoreToLevel(score: number): RiskLevel {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

function statusRiskScore(status: ChecklistStatus): number {
  switch (status) {
    case "compliant":
      return 10;
    case "in_review":
      return 35;
    case "pending":
      return 60;
    case "non_compliant":
      return 90;
    case "not_applicable":
      return 0;
    default:
      return 50;
  }
}

function documentCompletenessRisk(
  uploadedTypes: DocumentType[],
  requiredTypes: DocumentType[]
): RiskFactor {
  const missing = requiredTypes.filter((t) => !uploadedTypes.includes(t));
  const completeness = 1 - missing.length / requiredTypes.length;
  const score = Math.round((1 - completeness) * 100);

  return {
    name: "Document Completeness",
    score,
    weight: 2.0,
    description:
      missing.length > 0
        ? `Missing ${missing.length} required document type(s): ${missing.join(", ")}`
        : "All required document types uploaded",
  };
}

function financialRisk(purchasePrice: number | null, hasFinancials: boolean): RiskFactor {
  let score = 50;
  if (!hasFinancials) score = 80;
  else if (purchasePrice && purchasePrice > 50_000_000) score = 40;
  else if (purchasePrice && purchasePrice > 10_000_000) score = 25;
  else score = 15;

  return {
    name: "Financial Exposure",
    score,
    weight: 1.5,
    description: hasFinancials
      ? `Purchase price: ${purchasePrice ? `$${purchasePrice.toLocaleString()}` : "Not specified"}`
      : "Financial statements not provided",
  };
}

function firbRisk(hasLegal: boolean, state: string): RiskFactor {
  const sensitiveStates = ["NSW", "VIC", "ACT"];
  let score = hasLegal ? 30 : 70;
  if (sensitiveStates.includes(state)) score += 15;

  return {
    name: "FIRB & Foreign Investment",
    score: Math.min(score, 100),
    weight: 2.0,
    description: `FIRB assessment required for ${state}. ${hasLegal ? "Legal docs available." : "Legal docs missing."}`,
  };
}

function environmentalRisk(hasEnvironmental: boolean): RiskFactor {
  return {
    name: "Environmental Liability",
    score: hasEnvironmental ? 20 : 85,
    weight: 1.8,
    description: hasEnvironmental
      ? "Environmental reports uploaded for review"
      : "No environmental assessment — significant contamination risk unknown",
  };
}

function leaseRisk(hasLeases: boolean, hasFinancials: boolean): RiskFactor {
  let score = 60;
  if (hasLeases && hasFinancials) score = 20;
  else if (hasLeases) score = 40;
  else score = 75;

  return {
    name: "Tenancy & Income Risk",
    score,
    weight: 1.4,
    description: hasLeases
      ? "Lease agreements available for WALE analysis"
      : "Lease agreements not provided — income risk unassessed",
  };
}

export interface RiskInput {
  uploadedDocTypes: DocumentType[];
  checklistStatuses: { regulationId: string; status: ChecklistStatus }[];
  purchasePrice: number | null;
  state: string;
}

export function calculateRiskScore(input: RiskInput): RiskResult {
  const requiredTypes = Object.entries(config.documentTypes)
    .filter(([, m]) => m.required)
    .map(([t]) => t as DocumentType);

  const factors: RiskFactor[] = [
    documentCompletenessRisk(input.uploadedDocTypes, requiredTypes),
    financialRisk(
      input.purchasePrice,
      input.uploadedDocTypes.includes("financial_statement")
    ),
    firbRisk(input.uploadedDocTypes.includes("legal_compliance"), input.state),
    environmentalRisk(input.uploadedDocTypes.includes("environmental")),
    leaseRisk(
      input.uploadedDocTypes.includes("lease_agreement"),
      input.uploadedDocTypes.includes("financial_statement")
    ),
  ];

  const categoryScores = config.categories.map((category) => {
    const categoryItems = input.checklistStatuses.filter((cs) =>
      category.items.some((item) => item.id === cs.regulationId)
    );

    const catFactors: RiskFactor[] = category.items.map((item) => {
      const status = categoryItems.find((cs) => cs.regulationId === item.id)?.status ?? "pending";
      return {
        name: item.title,
        score: statusRiskScore(status),
        weight: item.weight,
        description: item.description,
      };
    });

    const totalWeight = catFactors.reduce((sum, f) => sum + f.weight, 0);
    const weightedScore =
      catFactors.reduce((sum, f) => sum + f.score * f.weight, 0) / totalWeight;

    return {
      category: category.name,
      score: Math.round(weightedScore),
      weight: category.items.reduce((sum, i) => sum + i.weight, 0) / category.items.length,
      factors: catFactors,
    };
  });

  const allFactors = [...factors, ...categoryScores.flatMap((c) => c.factors)];
  const totalWeight = allFactors.reduce((sum, f) => sum + f.weight, 0);
  const overallScore = Math.round(
    allFactors.reduce((sum, f) => sum + f.score * f.weight, 0) / totalWeight
  );

  return {
    overallScore,
    level: scoreToLevel(overallScore),
    categories: categoryScores,
  };
}
