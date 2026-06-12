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

export function getBankabilityColor(level: string): string {
  switch (level) {
    case "strong":
      return "text-green-700";
    case "adequate":
      return "text-brand-700";
    case "marginal":
      return "text-amber-700";
    case "weak":
      return "text-red-700";
    default:
      return "text-slate-500";
  }
}

export function getBankabilityBadgeClass(level: string): string {
  switch (level) {
    case "strong":
      return "badge bg-green-100 text-green-900";
    case "adequate":
      return "badge bg-brand-100 text-brand-900";
    case "marginal":
      return "badge bg-amber-100 text-amber-900";
    case "weak":
      return "badge bg-red-100 text-red-900";
    default:
      return "badge bg-slate-100 text-slate-600";
  }
}

export function getReadinessStatusColor(status: string): string {
  switch (status) {
    case "complete":
      return "text-green-600";
    case "in_progress":
      return "text-brand-600";
    default:
      return "text-slate-400";
  }
}

export function getSignalStatusClass(status: string): string {
  switch (status) {
    case "good":
      return "bg-green-50 text-green-800 border-green-100";
    case "caution":
      return "bg-amber-50 text-amber-800 border-amber-100";
    case "concern":
      return "bg-red-50 text-red-800 border-red-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
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
