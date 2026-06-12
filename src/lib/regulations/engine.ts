import regulationsConfig from "@/../config/regulations.json";
import type {
  ChecklistStatus,
  DocumentType,
  RegulationCategory,
  RegulationsConfig,
} from "@/types";

const config = regulationsConfig as RegulationsConfig;

export function getRegulationsConfig(): RegulationsConfig {
  return config;
}

export function getAllCategories(): RegulationCategory[] {
  return config.categories;
}

export function getCategoryById(id: string): RegulationCategory | undefined {
  return config.categories.find((c) => c.id === id);
}

export function getRequiredDocumentTypes(): DocumentType[] {
  return Object.entries(config.documentTypes)
    .filter(([, meta]) => meta.required)
    .map(([type]) => type as DocumentType);
}

export function getDocumentTypeMeta(type: DocumentType) {
  return config.documentTypes[type];
}

export interface ChecklistEvaluation {
  regulationId: string;
  category: string;
  title: string;
  description: string;
  status: ChecklistStatus;
  priority: string;
  evidence: string | null;
  notes: string | null;
}

export function evaluateChecklist(
  uploadedDocTypes: DocumentType[],
  manualOverrides?: Record<string, ChecklistStatus>
): ChecklistEvaluation[] {
  const results: ChecklistEvaluation[] = [];

  for (const category of config.categories) {
    for (const item of category.items) {
      const override = manualOverrides?.[item.id];
      if (override) {
        results.push({
          regulationId: item.id,
          category: category.name,
          title: item.title,
          description: item.description,
          status: override,
          priority: item.priority,
          evidence: null,
          notes: "Manual override applied",
        });
        continue;
      }

      const hasRequiredDocs = item.documentTypes.every((dt) =>
        uploadedDocTypes.includes(dt)
      );
      const hasAnyDoc = item.documentTypes.some((dt) =>
        uploadedDocTypes.includes(dt)
      );

      let status: ChecklistStatus = "pending";
      let evidence: string | null = null;
      let notes: string | null = null;

      if (hasRequiredDocs) {
        status = "in_review";
        evidence = `Documents available: ${item.documentTypes.join(", ")}`;
        notes = "Automated check: all required document types uploaded. Awaiting manual verification.";
      } else if (hasAnyDoc) {
        status = "pending";
        const missing = item.documentTypes.filter(
          (dt) => !uploadedDocTypes.includes(dt)
        );
        notes = `Missing document types: ${missing.join(", ")}`;
      } else {
        status = "pending";
        notes = `Required documents not yet uploaded: ${item.documentTypes.join(", ")}`;
      }

      results.push({
        regulationId: item.id,
        category: category.name,
        title: item.title,
        description: item.description,
        status,
        priority: item.priority,
        evidence,
        notes,
      });
    }
  }

  return results;
}

export function getChecklistSummary(items: ChecklistEvaluation[]) {
  return {
    total: items.length,
    compliant: items.filter((i) => i.status === "compliant").length,
    nonCompliant: items.filter((i) => i.status === "non_compliant").length,
    pending: items.filter((i) => i.status === "pending").length,
    inReview: items.filter((i) => i.status === "in_review").length,
    notApplicable: items.filter((i) => i.status === "not_applicable").length,
  };
}
