"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Compass, X } from "lucide-react";
import { copy } from "@/lib/copy";
import {
  getOnboardingProgress,
  setOnboardingFlag,
} from "@/lib/onboarding/storage";

interface GettingStartedPanelProps {
  demoProjectId: string | null;
  hasOwnProject: boolean;
  onExploreFrameworks: () => void;
  onCreateProject: () => void;
}

export function GettingStartedPanel({
  demoProjectId,
  hasOwnProject,
  onExploreFrameworks,
  onCreateProject,
}: GettingStartedPanelProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState({
    viewedDemo: false,
    exploredFrameworks: false,
    createdProject: false,
    dismissed: false,
  });

  useEffect(() => {
    const state = getOnboardingProgress();
    setProgress({
      ...state,
      createdProject: state.createdProject || hasOwnProject,
    });
    setVisible(!state.dismissed);
  }, [hasOwnProject]);

  if (!visible) return null;

  const steps = copy.home.gettingStarted.steps;
  const doneFlags = [
    progress.viewedDemo,
    progress.exploredFrameworks,
    progress.createdProject || hasOwnProject,
  ];
  const doneCount = doneFlags.filter(Boolean).length;

  const handleDismiss = () => {
    setOnboardingFlag("dismissed");
    setVisible(false);
  };

  return (
    <section
      id="getting-started"
      className="guide-card mb-8 scroll-mt-24"
      aria-labelledby="getting-started-heading"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <Compass className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 id="getting-started-heading" className="text-lg font-bold text-slate-900">
              {copy.home.gettingStarted.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{copy.home.gettingStarted.subtitle}</p>
            <p className="mt-2 text-xs font-medium text-brand-700">
              {copy.home.gettingStarted.progress(doneCount, steps.length)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="btn-ghost !min-h-[40px] !min-w-[40px] !p-2"
          aria-label={copy.home.gettingStarted.dismiss}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-brand-100">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-500"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={steps.length}
        />
      </div>

      <ol className="mt-5 space-y-3" role="list">
        {steps.map((step, index) => {
          const done = doneFlags[index];
          return (
            <li
              key={step.id}
              className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                done
                  ? "border-green-200 bg-green-50/40"
                  : "border-slate-100 bg-white/60"
              }`}
            >
              <div className="flex gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    done
                      ? "bg-green-600 text-white"
                      : "bg-brand-100 text-brand-700"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{step.label}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{step.body}</p>
                </div>
              </div>

              {!done && step.id === "demo" && demoProjectId && (
                <Link
                  href={`/projects/${demoProjectId}`}
                  className="btn-secondary w-full shrink-0 sm:w-auto"
                  onClick={() => setOnboardingFlag("viewed-demo")}
                >
                  {step.cta}
                </Link>
              )}
              {!done && step.id === "frameworks" && (
                <button
                  type="button"
                  className="btn-secondary w-full shrink-0 sm:w-auto"
                  onClick={() => {
                    setOnboardingFlag("explored-frameworks");
                    setProgress((p) => ({ ...p, exploredFrameworks: true }));
                    onExploreFrameworks();
                  }}
                >
                  {step.cta}
                </button>
              )}
              {!done && step.id === "create" && (
                <button
                  type="button"
                  className="btn-primary w-full shrink-0 sm:w-auto"
                  onClick={onCreateProject}
                >
                  {step.cta}
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {doneCount === steps.length && (
        <button
          type="button"
          className="btn-secondary mt-4 w-full sm:ml-auto sm:w-auto"
          onClick={handleDismiss}
        >
          {copy.home.gettingStarted.dismiss}
        </button>
      )}
    </section>
  );
}
