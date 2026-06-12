"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { copy } from "@/lib/copy";
import { getStepIndex, type JourneyContext, type JourneyStep } from "@/lib/journey";

function getStepNumber(step: JourneyStep): number {
  return getStepIndex(step) + 1;
}

interface TourGuideProps {
  context: JourneyContext;
  onAction: (step: JourneyStep) => void;
  actionLoading?: boolean;
}

export function TourGuide({ context, onAction, actionLoading }: TourGuideProps) {
  const { step, missingDocCount, reviewedCount, checklistTotal } = context;

  const hint = copy.journey.hints[step];
  let encouragement: string;

  switch (step) {
    case "upload":
      encouragement = copy.journey.encouragement.upload(missingDocCount);
      break;
    case "review":
      encouragement = copy.journey.encouragement.review(reviewedCount, checklistTotal);
      break;
    default:
      encouragement = copy.journey.encouragement[step];
  }

  const cta = copy.journey.cta[step];

  return (
    <aside
      className="guide-card"
      aria-label="Guided next step"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600"
            aria-hidden
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
              {copy.journey.progress(
                getStepNumber(step),
                5,
                context.progress
              )}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-700">
              {copy.journey.steps[step].label}
            </p>
            <p className="mt-1 text-base font-medium leading-snug text-slate-900">
              {hint}
            </p>
            <p className="mt-1 text-sm text-slate-500">{encouragement}</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary w-full shrink-0 sm:w-auto"
          onClick={() => onAction(step)}
          disabled={actionLoading}
          aria-busy={actionLoading}
        >
          {actionLoading ? copy.dashboard.running : cta}
          {!actionLoading && <ArrowRight className="h-4 w-4" aria-hidden />}
        </button>
      </div>
    </aside>
  );
}
