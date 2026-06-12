/** FIRB indicative risk factors — not legal advice. Thresholds per FIRB guidance (simplified). */

export const FIRB_COMMERCIAL_THRESHOLD = 275_000_000;
export const FIRB_VACANT_LAND_THRESHOLD = 15_000_000;

export interface FirbAssessmentInput {
  purchasePrice: number | null;
  state: string;
  propertyType: string;
  hasLegalDocs: boolean;
}

export interface FirbAssessment {
  score: number;
  approvalLikelyRequired: boolean;
  factors: string[];
  note: string;
}

const SENSITIVE_STATES = new Set(["NSW", "VIC", "ACT", "QLD"]);
const VACANT_LAND_TYPES = new Set(["vacant_land", "land", "development"]);

export function assessFirbRisk(input: FirbAssessmentInput): FirbAssessment {
  const factors: string[] = [];
  let score = input.hasLegalDocs ? 25 : 55;

  const price = input.purchasePrice ?? 0;

  if (price >= FIRB_COMMERCIAL_THRESHOLD) {
    score += 25;
    factors.push(
      `Purchase price exceeds $${(FIRB_COMMERCIAL_THRESHOLD / 1_000_000).toFixed(0)}M commercial notification threshold`
    );
  } else if (price >= 50_000_000) {
    score += 15;
    factors.push("High-value commercial asset — enhanced FIRB scrutiny likely");
  } else if (price >= 10_000_000) {
    score += 8;
    factors.push("Mid-market commercial — standard FIRB documentation expected");
  }

  if (SENSITIVE_STATES.has(input.state)) {
    score += 10;
    factors.push(`${input.state} — higher foreign investment activity and scrutiny`);
  }

  if (VACANT_LAND_TYPES.has(input.propertyType) && price >= FIRB_VACANT_LAND_THRESHOLD) {
    score += 20;
    factors.push("Vacant commercial land above FIRB monetary threshold");
  }

  if (input.propertyType === "hospitality") {
    score += 8;
    factors.push("Hospitality assets may attract additional national interest review");
  }

  if (!input.hasLegalDocs) {
    factors.push("Legal & compliance documents not uploaded — FIRB clearance status unknown");
  } else {
    factors.push("Legal documents on file — verify FIRB approval or exemption certificate");
  }

  const approvalLikelyRequired = score >= 50 || price >= FIRB_VACANT_LAND_THRESHOLD;

  return {
    score: Math.min(score, 100),
    approvalLikelyRequired,
    factors,
    note: "Indicative only. Foreign persons must verify FIRB requirements with their legal adviser before exchange.",
  };
}
