import { clsx, type ClassValue } from "clsx";
import { copy } from "@/lib/copy";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function humanize(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "low":
      return "text-risk-low";
    case "medium":
      return "text-risk-medium";
    case "high":
      return "text-risk-high";
    case "critical":
      return "text-risk-critical";
    default:
      return "text-slate-500";
  }
}

export function getRiskBadgeClass(level: string): string {
  return `badge risk-${level}`;
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "compliant":
      return "badge bg-green-100 text-green-900";
    case "non_compliant":
      return "badge bg-red-100 text-red-900";
    case "in_review":
      return "badge bg-blue-100 text-blue-900";
    case "not_applicable":
      return "badge bg-slate-100 text-slate-700";
    default:
      return "badge bg-amber-100 text-amber-900";
  }
}

export function getStatusLabel(status: string): string {
  const labels = copy.checklist.status as Record<string, string>;
  return labels[status] ?? humanize(status);
}

export function getWorkflowLabel(stage: string): string {
  const labels = copy.dashboard.workflow as Record<string, string>;
  return labels[stage] ?? humanize(stage);
}

export function getAuditActionLabel(action: string): string {
  return humanize(action);
}
