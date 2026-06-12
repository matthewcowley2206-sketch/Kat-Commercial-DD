"use client";

import { useEffect, useRef } from "react";
import { X, ChevronRight, AlertCircle } from "lucide-react";
import { copy } from "@/lib/copy";
import { humanize } from "@/lib/utils";
import type { DashboardData } from "@/types";

interface ChecklistItem {
  id: string;
  regulationId: string;
  category: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  notes: string | null;
}

interface ComplianceDetailModalProps {
  summary: DashboardData["checklist"];
  checklistItems: ChecklistItem[];
  onClose: () => void;
  onViewChecklist: () => void;
}

export function ComplianceDetailModal({
  summary,
  checklistItems,
  onClose,
  onViewChecklist,
}: ComplianceDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const detail = copy.dashboard.detail.compliance;

  useEffect(() => {
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const attentionItems = checklistItems.filter(
    (item) =>
      item.status === "non_compliant" ||
      item.status === "pending" ||
      item.status === "in_review"
  );

  const hasData = summary.total > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compliance-detail-title"
        aria-describedby="compliance-detail-desc"
        tabIndex={-1}
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="shrink-0 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                {copy.dashboard.sections.compliance}
              </p>
              <h2 id="compliance-detail-title" className="mt-1 text-xl font-bold text-slate-900">
                {detail.title}
              </h2>
              <p id="compliance-detail-desc" className="mt-2 text-sm leading-relaxed text-slate-600">
                {hasData ? detail.intro : detail.empty}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost !min-h-[44px] !min-w-[44px] !p-2"
              aria-label={copy.a11y.closeDialog}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {hasData ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="stat-tile bg-slate-50">
                  <p className="text-2xl font-bold tabular-nums text-slate-900">{summary.total}</p>
                  <p className="text-xs text-slate-500">{detail.total}</p>
                </div>
                <div className="stat-tile bg-green-50">
                  <p className="text-2xl font-bold tabular-nums text-green-800">{summary.compliant}</p>
                  <p className="text-xs text-green-700">{detail.compliant}</p>
                </div>
                <div className="stat-tile bg-blue-50">
                  <p className="text-2xl font-bold tabular-nums text-blue-800">{summary.inReview}</p>
                  <p className="text-xs text-blue-700">{detail.inReview}</p>
                </div>
                <div className="stat-tile bg-amber-50">
                  <p className="text-2xl font-bold tabular-nums text-amber-800">{summary.pending}</p>
                  <p className="text-xs text-amber-700">{detail.pending}</p>
                </div>
                <div className="stat-tile bg-red-50">
                  <p className="text-2xl font-bold tabular-nums text-red-800">{summary.nonCompliant}</p>
                  <p className="text-xs text-red-700">{detail.issues}</p>
                </div>
              </div>

              {summary.byCategory.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">{detail.byCategory}</h3>
                  <ul className="space-y-2" role="list">
                    {summary.byCategory.map((cat) => {
                      const pct = cat.total > 0 ? Math.round((cat.compliant / cat.total) * 100) : 0;
                      return (
                        <li
                          key={cat.category}
                          className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-slate-800">{cat.category}</p>
                            <p className="text-xs text-slate-500">
                              {cat.compliant}/{cat.total} compliant
                            </p>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-green-500 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">{detail.needsAttention}</h3>
                {attentionItems.length > 0 ? (
                  <ul className="space-y-2" role="list">
                    {attentionItems.slice(0, 8).map((item) => (
                      <li
                        key={item.id}
                        className="flex gap-3 rounded-xl border border-slate-100 px-3 py-2.5"
                      >
                        <AlertCircle
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            item.status === "non_compliant"
                              ? "text-red-500"
                              : item.status === "in_review"
                                ? "text-blue-500"
                                : "text-amber-500"
                          }`}
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800">{item.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {humanize(item.status)} · {item.category}
                          </p>
                        </div>
                      </li>
                    ))}
                    {attentionItems.length > 8 && (
                      <p className="text-center text-xs text-slate-500">
                        +{attentionItems.length - 8} more in the full checklist
                      </p>
                    )}
                  </ul>
                ) : (
                  <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
                    {detail.noIssues}
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {hasData && (
          <div className="shrink-0 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => {
                onClose();
                onViewChecklist();
              }}
            >
              {detail.viewChecklist}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
