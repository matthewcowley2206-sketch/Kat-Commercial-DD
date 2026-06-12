export type BankabilityLevel = "strong" | "adequate" | "marginal" | "weak" | "pending";
export type ReadinessStatus = "not_started" | "in_progress" | "complete";
export type ReadinessSectionId =
  | "lending_metrics"
  | "income_quality"
  | "title_security"
  | "insurance"
  | "transaction"
  | "capex";

export interface MetricSignal {
  label: string;
  value: string;
  status: "good" | "caution" | "concern" | "unknown";
  note?: string;
}

export interface LendingMetrics {
  indicative: boolean;
  valuation: number;
  loanAmount: number;
  noi: number;
  lvr: number;
  dscr: number;
  icr: number;
  waleYears: number | null;
  vacancyPct: number | null;
  topTenantPct: number | null;
  stampDuty?: number;
  stampDutyPct?: number;
  assumptions: {
    capRate: number;
    interestRate: number;
    targetLvr: number;
  };
  signals: MetricSignal[];
}

export interface ReadinessItem {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_review" | "compliant" | "non_compliant";
  priority: string;
  note?: string;
}

export interface ReadinessSection {
  id: ReadinessSectionId;
  label: string;
  description: string;
  status: ReadinessStatus;
  completionPercent: number;
  headline: string;
  summary: string;
  signals: MetricSignal[];
  items: ReadinessItem[];
  metrics?: LendingMetrics;
}

export interface LenderReadiness {
  bankabilityScore: number;
  bankabilityLevel: BankabilityLevel;
  sectionsComplete: number;
  sectionsTotal: number;
  sections: ReadinessSection[];
  metrics: LendingMetrics | null;
}
