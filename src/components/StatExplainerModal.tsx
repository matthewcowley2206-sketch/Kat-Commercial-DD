"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { copy } from "@/lib/copy";
import type { RegulationCategory } from "@/types";

export type StatTopic = "projects" | "frameworks" | "checks";

interface StatExplainerModalProps {
  topic: StatTopic;
  projectCount: number;
  frameworkCount: number;
  checkCount: number;
  categories: RegulationCategory[];
  demoProjectId: string | null;
  onClose: () => void;
  onStartProject: () => void;
}

const FRAMEWORK_ACCENTS: Record<string, string> = {
  ncc: "border-blue-200 bg-blue-50/50",
  apra: "border-green-200 bg-green-50/50",
  firb: "border-violet-200 bg-violet-50/50",
  environmental: "border-emerald-200 bg-emerald-50/50",
  lease: "border-amber-200 bg-amber-50/50",
};

export function StatExplainerModal({
  topic,
  projectCount,
  frameworkCount,
  checkCount,
  categories,
  demoProjectId,
  onClose,
  onStartProject,
}: StatExplainerModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const edu = copy.home.statsEducation;

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

  const title =
    topic === "projects"
      ? edu.projects.title(projectCount)
      : topic === "frameworks"
        ? edu.frameworks.title(frameworkCount)
        : edu.checks.title(checkCount);

  const intro =
    topic === "projects"
      ? edu.projects.intro
      : topic === "frameworks"
        ? edu.frameworks.intro
        : edu.checks.intro;

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
        aria-labelledby="stat-explainer-title"
        aria-describedby="stat-explainer-desc"
        tabIndex={-1}
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl"
      >
        <div className="shrink-0 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                {copy.home.stats.learnMore}
              </p>
              <h2 id="stat-explainer-title" className="mt-1 text-xl font-bold text-slate-900">
                {title}
              </h2>
              <p id="stat-explainer-desc" className="mt-2 text-sm leading-relaxed text-slate-600">
                {intro}
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
          {topic === "projects" && (
            <ol className="space-y-3" role="list">
              {edu.projects.steps.map((step, index) => (
                <li
                  key={step.label}
                  className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{step.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {topic === "frameworks" && (
            <ul className="space-y-4" role="list">
              {categories.map((category) => {
                const content =
                  edu.frameworks.items[
                    category.id as keyof typeof edu.frameworks.items
                  ];
                if (!content) return null;

                return (
                  <li
                    key={category.id}
                    className={`rounded-2xl border p-4 ${FRAMEWORK_ACCENTS[category.id] ?? "border-slate-200 bg-slate-50/50"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-900">{content.name}</p>
                      <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {category.items.length} check{category.items.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{content.authority}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {content.summary}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      <span className="font-medium text-slate-800">Why it matters: </span>
                      {content.whyItMatters}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          {topic === "checks" && (
            <div className="space-y-5">
              <ol className="space-y-2" role="list">
                {edu.checks.howItWorks.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                {edu.checks.priorityNote}
              </p>

              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id}>
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                      {category.name}
                      <span className="ml-2 font-normal text-slate-500">
                        ({category.items.length})
                      </span>
                    </h3>
                    <ul className="space-y-2" role="list">
                      {category.items.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-xl border border-slate-100 bg-white px-3 py-2.5"
                        >
                          <p className="text-sm font-medium text-slate-800">{item.title}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                            {item.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {topic === "projects" && (
          <div className="shrink-0 border-t border-slate-100 px-6 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              {demoProjectId && (
                <Link
                  href={`/projects/${demoProjectId}`}
                  className="btn-secondary w-full sm:w-auto"
                  onClick={onClose}
                >
                  {edu.projects.viewDemo}
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
              <button
                type="button"
                className="btn-primary w-full sm:w-auto"
                onClick={() => {
                  onClose();
                  onStartProject();
                }}
              >
                {edu.projects.cta}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
