"use client";

import { useState } from "react";
import {
  Landmark,
  TrendingUp,
  FileKey,
  ShieldCheck,
  Receipt,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";
import { BankabilityGauge } from "@/components/BankabilityGauge";
import { ReadinessDetailModal } from "@/components/ReadinessDetailModal";
import { copy } from "@/lib/copy";
import { getReadinessStatusColor } from "@/lib/utils";
import type { LenderReadiness, ReadinessSection, ReadinessSectionId } from "@/types/lending";

const SECTION_ICONS: Record<ReadinessSectionId, typeof Landmark> = {
  lending_metrics: Landmark,
  income_quality: TrendingUp,
  title_security: FileKey,
  insurance: ShieldCheck,
  transaction: Receipt,
  capex: Wrench,
};

function StatusIcon({ status }: { status: string }) {
  if (status === "complete") {
    return <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden />;
  }
  if (status === "in_progress") {
    return <Loader2 className="h-4 w-4 text-brand-600" aria-hidden />;
  }
  return <Circle className="h-4 w-4 text-slate-300" aria-hidden />;
}

interface LenderReadinessPanelProps {
  readiness: LenderReadiness;
}

export function LenderReadinessPanel({ readiness }: LenderReadinessPanelProps) {
  const [selectedSection, setSelectedSection] = useState<ReadinessSection | null>(null);
  const lr = copy.dashboard.lenderReadiness;

  return (
    <>
      <section
        className="card mb-4 border-brand-100 bg-gradient-to-br from-brand-50/40 to-white sm:mb-6"
        aria-labelledby="lender-readiness-heading"
      >
        <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <BankabilityGauge
              score={readiness.bankabilityScore}
              level={readiness.bankabilityLevel}
            />
            <div>
              <h2
                id="lender-readiness-heading"
                className="text-lg font-bold text-slate-900 sm:text-xl"
              >
                {lr.title}
              </h2>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600">
                {lr.subtitle}
              </p>
              <p className="mt-3 text-sm font-medium text-brand-700">
                {lr.progress(readiness.sectionsComplete, readiness.sectionsTotal)}
              </p>
              <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (readiness.sectionsComplete / readiness.sectionsTotal) * 100
                    )}%`,
                  }}
                  role="progressbar"
                  aria-valuenow={readiness.sectionsComplete}
                  aria-valuemin={0}
                  aria-valuemax={readiness.sectionsTotal}
                  aria-label={lr.progress(readiness.sectionsComplete, readiness.sectionsTotal)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {readiness.sections.map((section) => {
            const Icon = SECTION_ICONS[section.id];
            const statusLabel =
              lr.status[section.status as keyof typeof lr.status] ?? section.status;

            return (
              <button
                key={section.id}
                type="button"
                className="group rounded-2xl border border-slate-200/80 bg-white p-4 text-left transition-all duration-200 hover:border-brand-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                onClick={() => setSelectedSection(section)}
                aria-label={`${section.label}: ${section.headline}. ${statusLabel}. ${lr.viewDetails}`}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                        {section.label}
                      </p>
                      <p className={`text-xs ${getReadinessStatusColor(section.status)}`}>
                        {statusLabel}
                      </p>
                    </div>
                  </div>
                  <StatusIcon status={section.status} />
                </div>

                <p className="text-lg font-bold tabular-nums text-slate-900">{section.headline}</p>

                <div className="mt-2 flex items-center justify-between">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        section.status === "complete"
                          ? "bg-green-500"
                          : section.status === "in_progress"
                            ? "bg-brand-500"
                            : "bg-slate-300"
                      }`}
                      style={{ width: `${section.completionPercent}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs tabular-nums text-slate-400">
                    {section.completionPercent}%
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-600 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                  {lr.viewDetails}
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {selectedSection && (
        <ReadinessDetailModal
          section={selectedSection}
          onClose={() => setSelectedSection(null)}
        />
      )}
    </>
  );
}
