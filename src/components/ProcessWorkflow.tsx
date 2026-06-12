"use client";

import {
  Building2,
  FileUp,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { copy } from "@/lib/copy";

const STEP_ICONS = [Building2, FileUp, Sparkles, ClipboardCheck, ShieldCheck] as const;

export function ProcessWorkflow() {
  const { title, subtitle, steps } = copy.home.processWorkflow;

  return (
    <section className="card mb-8" aria-labelledby="process-workflow-heading">
      <div className="mb-6">
        <h2 id="process-workflow-heading" className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>

      {/* Desktop: horizontal flow */}
      <ol className="hidden lg:flex lg:items-start lg:justify-between lg:gap-2" role="list">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index];
          const isLast = index === steps.length - 1;

          return (
            <li key={step.label} className="flex min-w-0 flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-4 ring-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {copy.home.gettingStarted.stepLabel(index + 1)}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{step.label}</p>
                <p className="mt-1 max-w-[9rem] text-xs leading-relaxed text-slate-500">
                  {step.body}
                </p>
              </div>
              {!isLast && (
                <ChevronRight
                  className="mx-1 mt-3 h-5 w-5 shrink-0 text-slate-300"
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile / tablet: compact vertical list */}
      <ol className="space-y-3 lg:hidden" role="list">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index];

          return (
            <li
              key={step.label}
              className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {copy.home.gettingStarted.stepLabel(index + 1)}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">{step.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
