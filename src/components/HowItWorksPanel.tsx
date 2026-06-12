"use client";

import { useEffect, useRef } from "react";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { copy } from "@/lib/copy";

interface HowItWorksPanelProps {
  onClose: () => void;
}

export function HowItWorksPanel({ onClose }: HowItWorksPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();

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

  const { title, intro, steps, footer } = copy.howItWorks;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        aria-label={copy.a11y.closeDialog}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-it-works-title"
        aria-describedby="how-it-works-desc"
        tabIndex={-1}
        className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl animate-slide-in-right sm:max-w-lg"
      >
        <div className="shrink-0 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                {copy.app.howItWorks}
              </p>
              <h2 id="how-it-works-title" className="mt-1 text-xl font-bold text-slate-900">
                {title}
              </h2>
              <p id="how-it-works-desc" className="mt-2 text-sm leading-relaxed text-slate-600">
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
          <ol className="space-y-4" role="list">
            {steps.map((step, index) => (
              <li
                key={step.label}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{step.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-sm leading-relaxed text-slate-600">
            {footer}
          </p>
        </div>

        <div className="shrink-0 border-t border-slate-100 px-6 py-4">
          <Link
            href="/#getting-started"
            className="btn-primary w-full"
            onClick={onClose}
          >
            {copy.howItWorks.getStarted}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
