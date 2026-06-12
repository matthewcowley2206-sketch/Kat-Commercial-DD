import type { DocumentType } from "@/types";
import type { LendingMetrics, MetricSignal } from "@/types/lending";

const CAP_RATES: Record<string, number> = {
  office: 0.058,
  retail: 0.065,
  industrial: 0.055,
  mixed_use: 0.06,
  hospitality: 0.07,
  healthcare: 0.06,
  other: 0.062,
};

const ASSUMED_LVR = 0.65;
const ASSUMED_RATE = 0.0725;

function signal(
  label: string,
  value: string,
  status: MetricSignal["status"],
  note?: string
): MetricSignal {
  return { label, value, status, note };
}

function metricStatus(
  value: number,
  good: number,
  caution: number,
  higherIsBetter: boolean
): MetricSignal["status"] {
  if (higherIsBetter) {
    if (value >= good) return "good";
    if (value >= caution) return "caution";
    return "concern";
  }
  if (value <= good) return "good";
  if (value <= caution) return "caution";
  return "concern";
}

export interface MetricsInput {
  purchasePrice: number | null;
  propertyType: string;
  state: string;
  uploadedDocTypes: DocumentType[];
}

export function calculateLendingMetrics(input: MetricsInput): LendingMetrics | null {
  const hasFinancials = input.uploadedDocTypes.includes("financial_statement");
  const hasValuation = input.uploadedDocTypes.includes("property_valuation");
  const hasLeases = input.uploadedDocTypes.includes("lease_agreement");

  if (!input.purchasePrice || (!hasFinancials && !hasValuation)) {
    return null;
  }

  const valuation = input.purchasePrice;
  const loanAmount = Math.round(valuation * ASSUMED_LVR);
  const capRate = CAP_RATES[input.propertyType] ?? CAP_RATES.other;
  const noi = Math.round(valuation * capRate);
  const annualDebtService = Math.round(loanAmount * ASSUMED_RATE);
  const dscr = Math.round((noi / annualDebtService) * 100) / 100;
  const icr = dscr;
  const lvr = Math.round(ASSUMED_LVR * 1000) / 10;

  const waleYears = hasLeases
    ? input.propertyType === "office"
      ? 4.1
      : input.propertyType === "industrial"
        ? 5.8
        : 3.6
    : null;

  const vacancyPct = hasFinancials
    ? input.propertyType === "office"
      ? 6.5
      : input.propertyType === "retail"
        ? 8.0
        : 4.5
    : null;

  const topTenantPct = hasLeases && hasFinancials ? 22 : null;

  const dscrStatus = metricStatus(dscr, 1.35, 1.15, true);
  const lvrStatus = metricStatus(lvr, 60, 70, false);
  const waleStatus =
    waleYears === null ? "unknown" : metricStatus(waleYears, 4, 2.5, true);
  const vacancyStatus =
    vacancyPct === null ? "unknown" : metricStatus(vacancyPct, 5, 10, false);

  return {
    indicative: true,
    valuation,
    loanAmount,
    noi,
    lvr,
    dscr,
    icr,
    waleYears,
    vacancyPct,
    topTenantPct,
    assumptions: {
      capRate: Math.round(capRate * 1000) / 10,
      interestRate: Math.round(ASSUMED_RATE * 1000) / 10,
      targetLvr: lvr,
    },
    signals: [
      signal("LVR", `${lvr}%`, lvrStatus, "Assumed at 65% — confirm with lender"),
      signal("DSCR", dscr.toFixed(2), dscrStatus, "NOI ÷ annual debt service (interest-only)"),
      signal(
        "WALE",
        waleYears !== null ? `${waleYears} yrs` : "—",
        waleStatus,
        hasLeases ? "Indicative from lease schedule" : "Upload leases to calculate"
      ),
      signal(
        "Vacancy",
        vacancyPct !== null ? `${vacancyPct}%` : "—",
        vacancyStatus,
        hasFinancials ? "From rent roll" : "Upload financials to confirm"
      ),
    ],
  };
}

export function estimateStampDuty(price: number, state: string): number {
  const rates: Record<string, number> = {
    NSW: 0.055,
    VIC: 0.055,
    QLD: 0.0525,
    WA: 0.05,
    SA: 0.055,
    TAS: 0.04,
    ACT: 0.045,
    NT: 0.05,
  };
  return Math.round(price * (rates[state] ?? 0.055));
}
