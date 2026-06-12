"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { copy } from "@/lib/copy";
import {
  formatCurrency,
  getSignalStatusClass,
  getStatusBadgeClass,
  getStatusLabel,
  humanize,
} from "@/lib/utils";
import type { ReadinessSection } from "@/types/lending";

interface ReadinessDetailModalProps {
  section: ReadinessSection;
  onClose: () => void;
}

export function ReadinessDetailModal({ section, onClose }: ReadinessDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lr = copy.dashboard.lenderReadiness;

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

  const statusLabel =
    lr.status[section.status as keyof typeof lr.status] ?? humanize(section.status);

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
        aria-labelledby="readiness-detail-title"
        tabIndex={-1}
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="shrink-0 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                {lr.title}
              </p>
              <h2 id="readiness-detail-title" className="mt-1 text-xl font-bold text-slate-900">
                {section.label}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.summary}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="badge bg-brand-50 text-brand-700">{statusLabel}</span>
                <span className="text-xs text-slate-500">{section.completionPercent}% complete</span>
              </div>
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
          {section.metrics && (
            <div className="mb-5 space-y-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {lr.indicative}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="stat-tile bg-slate-50">
                  <p className="text-lg font-bold tabular-nums text-slate-900">
                    {formatCurrency(section.metrics.valuation)}
                  </p>
                  <p className="text-xs text-slate-500">{lr.metrics.valuation}</p>
                </div>
                <div className="stat-tile bg-brand-50">
                  <p className="text-lg font-bold tabular-nums text-brand-800">
                    {formatCurrency(section.metrics.loanAmount)}
                  </p>
                  <p className="text-xs text-brand-700">{lr.metrics.loanAmount}</p>
                </div>
                <div className="stat-tile bg-green-50">
                  <p className="text-lg font-bold tabular-nums text-green-800">
                    {formatCurrency(section.metrics.noi)}
                  </p>
                  <p className="text-xs text-green-700">{lr.metrics.noi}</p>
                </div>
                <div className="stat-tile bg-slate-50">
                  <p className="text-sm font-semibold text-slate-800">
                    {section.metrics.assumptions.capRate}% cap · {section.metrics.assumptions.interestRate}% rate
                  </p>
                  <p className="text-xs text-slate-500">{lr.metrics.assumptions}</p>
                </div>
              </div>
            </div>
          )}

          {section.signals.length > 0 && (
            <ul className="mb-5 space-y-2" role="list">
              {section.signals.map((signal) => (
                <li
                  key={signal.label}
                  className={`rounded-xl border px-4 py-3 ${getSignalStatusClass(signal.status)}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{signal.label}</p>
                    <p className="text-sm font-bold tabular-nums">{signal.value}</p>
                  </div>
                  {signal.note && (
                    <p className="mt-1 text-xs opacity-80">{signal.note}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {section.items.length > 0 && (
            <ul className="space-y-2" role="list">
              {section.items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-slate-100 bg-white px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <span className={getStatusBadgeClass(item.status)}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.description}</p>
                  {item.note && (
                    <p className="mt-1.5 text-xs text-slate-400">{item.note}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
