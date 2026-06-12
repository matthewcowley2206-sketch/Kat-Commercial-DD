import { getDocumentTypeMeta, getRequiredDocumentTypes } from "@/lib/regulations/engine";
import { copy } from "@/lib/copy";
import type { DocumentType } from "@/types";
import type { MetricSummary } from "@/lib/compliance/summary";

interface DocumentsInput {
  total: number;
  missing: DocumentType[];
  byType: { type: DocumentType; count: number }[];
}

export function getDocumentsSummary(documents: DocumentsInput): MetricSummary {
  const required = getRequiredDocumentTypes();
  const uploaded = required.length - documents.missing.length;
  const percent = Math.round((uploaded / required.length) * 100);
  const c = copy.dashboard.documents;

  if (documents.total === 0) {
    return {
      summary: c.summary.empty,
      drivers: required.slice(0, 3).map((type) => c.drivers.required(getDocumentTypeMeta(type).label)),
      badge: { label: c.badges.notStarted, className: "badge bg-slate-100 text-slate-600" },
      completionPercent: 0,
      ringColor: "#94a3b8",
    };
  }

  let summary: string;
  let badgeLabel: string;
  let badgeClass: string;
  let ringColor: string;

  if (documents.missing.length === 0) {
    summary = c.summary.complete;
    badgeLabel = c.badges.complete;
    badgeClass = "badge bg-green-100 text-green-900";
    ringColor = "#16a34a";
  } else if (uploaded >= 3) {
    summary = c.summary.partial;
    badgeLabel = c.badges.partial;
    badgeClass = "badge bg-amber-100 text-amber-900";
    ringColor = "#d97706";
  } else {
    summary = c.summary.starting;
    badgeLabel = c.badges.starting;
    badgeClass = "badge bg-blue-100 text-blue-900";
    ringColor = "#4f46e5";
  }

  const drivers: string[] = [];

  for (const doc of documents.byType.slice(0, 2)) {
    drivers.push(
      c.drivers.onFile(getDocumentTypeMeta(doc.type).label, doc.count)
    );
  }

  for (const type of documents.missing.slice(0, 3 - drivers.length)) {
    drivers.push(c.drivers.missing(getDocumentTypeMeta(type).label));
  }

  return {
    summary,
    drivers: drivers.slice(0, 3),
    badge: { label: badgeLabel, className: badgeClass },
    completionPercent: percent,
    ringColor,
  };
}
