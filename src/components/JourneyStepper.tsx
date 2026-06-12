"use client";

import { Check } from "lucide-react";
import { copy } from "@/lib/copy";
import {
  JOURNEY_ORDER,
  getProgressPercent,
  getStepIndex,
  type JourneyStep,
} from "@/lib/journey";
import { cn } from "@/lib/utils";

interface JourneyStepperProps {
  currentStep: JourneyStep;
  onStepClick?: (step: JourneyStep) => void;
}

export function JourneyStepper({ currentStep, onStepClick }: JourneyStepperProps) {
  const currentIndex = getStepIndex(currentStep);

  return (
    <nav aria-label={copy.a11y.progressLabel}>
      <p className="mb-3 hidden text-right text-xs font-medium text-brand-700 md:block">
        {copy.journey.progress(currentIndex + 1, JOURNEY_ORDER.length, getProgressPercent(currentStep))}
      </p>

      {/* Desktop: horizontal stepper */}
      <ol className="hidden items-center gap-0 md:flex">
        {JOURNEY_ORDER.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const label = copy.journey.steps[step].label;

          return (
            <li key={step} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => onStepClick?.(step)}
                disabled={!onStepClick}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group flex min-h-[44px] flex-1 items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors",
                  onStepClick && "hover:bg-slate-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                  !onStepClick && "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isComplete && "bg-brand-600 text-white",
                    isCurrent && "bg-brand-600 text-white ring-4 ring-brand-100",
                    !isComplete && !isCurrent && "bg-slate-200 text-slate-500"
                  )}
                  aria-hidden
                >
                  {isComplete ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium leading-tight",
                    isCurrent ? "text-slate-900" : isComplete ? "text-slate-600" : "text-slate-400"
                  )}
                >
                  {label}
                </span>
              </button>
              {index < JOURNEY_ORDER.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 w-6 shrink-0 rounded-full",
                    index < currentIndex ? "bg-brand-500" : "bg-slate-200"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: compact progress */}
      <div className="md:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-900">
            Step {currentIndex + 1} of {JOURNEY_ORDER.length}
          </span>
          <span className="text-slate-500">
            {copy.journey.steps[currentStep].short}
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={JOURNEY_ORDER.length}
          aria-label={copy.journey.steps[currentStep].label}
        >
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / JOURNEY_ORDER.length) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  );
}
