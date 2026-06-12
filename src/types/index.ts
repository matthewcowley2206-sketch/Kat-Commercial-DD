export type DocumentType =
  | "financial_statement"
  | "lease_agreement"
  | "property_valuation"
  | "environmental"
  | "legal_compliance";

export type ChecklistStatus = "pending" | "in_review" | "compliant" | "non_compliant" | "not_applicable";
export type RiskLevel = "low" | "medium" | "high" | "critical" | "pending";
export type ProjectStatus = "draft" | "collecting" | "analyzing" | "review" | "complete";
export type WorkflowStage = "intake" | "validation" | "regulatory_check" | "risk_scoring" | "reporting";
export type WorkflowStatus = "pending" | "running" | "completed" | "failed";

export interface RegulationItem {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  documentTypes: DocumentType[];
  weight: number;
}

export interface RegulationCategory {
  id: string;
  name: string;
  authority: string;
  description: string;
  items: RegulationItem[];
}

export interface RegulationsConfig {
  version: string;
  lastUpdated: string;
  jurisdiction: string;
  categories: RegulationCategory[];
  documentTypes: Record<
    DocumentType,
    {
      label: string;
      description: string;
      required: boolean;
      extensions: string[];
    }
  >;
}

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface RiskResult {
  overallScore: number;
  level: RiskLevel;
  categories: {
    category: string;
    score: number;
    weight: number;
    factors: RiskFactor[];
  }[];
}

export interface DashboardData {
  project: {
    id: string;
    name: string;
    propertyAddress: string;
    propertyType: string;
    state: string;
    status: ProjectStatus;
    riskScore: number;
    riskLevel: RiskLevel;
    purchasePrice: number | null;
    updatedAt: string;
  };
  checklist: {
    total: number;
    compliant: number;
    nonCompliant: number;
    pending: number;
    inReview: number;
    byCategory: { category: string; total: number; compliant: number }[];
  };
  documents: {
    total: number;
    byType: { type: DocumentType; count: number; status: string }[];
    missing: DocumentType[];
  };
  workflow: {
    currentStage: WorkflowStage | null;
    status: WorkflowStatus | null;
    stages: { stage: WorkflowStage; status: WorkflowStatus; completedAt: string | null }[];
  };
  risk: RiskResult | null;
  recentActivity: {
    id: string;
    action: string;
    actor: string;
    details: string;
    createdAt: string;
  }[];
}

export interface SSEEvent {
  type: "workflow_update" | "checklist_update" | "risk_update" | "document_upload" | "audit_log";
  projectId: string;
  data: Record<string, unknown>;
  timestamp: string;
}
