import { getDocumentTypeMeta, getRegulationTitle } from "@/lib/regulations/engine";
import { getStatusLabel, humanize } from "@/lib/utils";
import type { DocumentType } from "@/types";

export interface AuditSummary {
  summary: string;
  detail?: string;
}

function parseDetails(detailsRaw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(detailsRaw);
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function notesSuffix(notes: unknown): string {
  if (typeof notes !== "string" || !notes.trim()) return "";
  return ` — Note: "${notes.trim()}"`;
}

export function formatAuditSummary(action: string, detailsRaw: string): AuditSummary {
  const details = parseDetails(detailsRaw);

  switch (action) {
    case "project_created": {
      const name = typeof details.name === "string" ? details.name : "New project";
      const state = typeof details.state === "string" ? details.state : null;
      const isDemo = details.demo === true;
      return {
        summary: isDemo ? `Example project created: ${name}` : `Project created: ${name}`,
        detail: state ? `Jurisdiction: ${state}` : undefined,
      };
    }

    case "document_uploaded": {
      const fileName = typeof details.fileName === "string" ? details.fileName : "Document";
      const type = typeof details.type === "string" ? details.type : null;
      const label = type
        ? getDocumentTypeMeta(type as DocumentType)?.label ?? humanize(type)
        : null;
      const size =
        typeof details.fileSize === "number"
          ? ` (${Math.round(details.fileSize / 1024)} KB)`
          : "";
      return {
        summary: `Uploaded ${fileName}${size}`,
        detail: label ? `Document type: ${label}` : undefined,
      };
    }

    case "checklist_updated": {
      const title =
        (typeof details.title === "string" && details.title) ||
        (typeof details.regulationId === "string" && getRegulationTitle(details.regulationId)) ||
        "Checklist item";
      const status =
        typeof details.status === "string" ? getStatusLabel(details.status) : "updated";
      const previousStatus =
        typeof details.previousStatus === "string" ? getStatusLabel(details.previousStatus) : null;

      if (previousStatus && previousStatus !== status) {
        return {
          summary: title,
          detail: `Status changed from ${previousStatus} to ${status}${notesSuffix(details.notes)}`,
        };
      }

      return {
        summary: title,
        detail: `Marked as ${status}${notesSuffix(details.notes)}`,
      };
    }

    case "workflow_started":
      return {
        summary: "Automated analysis started",
        detail: "Reviewing uploaded documents against regulatory requirements",
      };

    case "workflow_completed": {
      const score = typeof details.riskScore === "number" ? Math.round(details.riskScore) : null;
      const level = typeof details.riskLevel === "string" ? humanize(details.riskLevel) : null;
      const items =
        typeof details.checklistItems === "number" ? details.checklistItems : null;
      const parts: string[] = [];
      if (score !== null && level) parts.push(`Risk score ${score} (${level} risk)`);
      if (items !== null) parts.push(`${items} checklist items evaluated`);
      return {
        summary: "Automated analysis complete",
        detail: parts.length > 0 ? parts.join(" · ") : undefined,
      };
    }

    case "workflow_failed": {
      const error = typeof details.error === "string" ? details.error : "Unknown error";
      return {
        summary: "Automated analysis failed",
        detail: error,
      };
    }

    default:
      return {
        summary: humanize(action),
        detail: Object.keys(details).length > 0 ? JSON.stringify(details) : undefined,
      };
  }
}
