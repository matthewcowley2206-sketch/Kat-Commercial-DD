"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface OverviewMetricCardProps {
  title: string;
  icon: LucideIcon;
  badge?: React.ReactNode;
  summary?: string;
  drivers?: string[];
  onClick?: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function OverviewMetricCard({
  title,
  icon: Icon,
  badge,
  summary,
  drivers = [],
  onClick,
  ariaLabel,
  children,
  className,
}: OverviewMetricCardProps) {
  const Wrapper = onClick ? "button" : "section";
  const interactive = Boolean(onClick);

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      className={cn(
        "card flex h-full w-full flex-col text-left",
        interactive &&
          "group transition-all duration-200 hover:border-brand-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-labelledby={interactive ? undefined : "overview-metric-heading"}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2
          id={interactive ? undefined : "overview-metric-heading"}
          className="flex items-center gap-2 text-sm font-semibold text-slate-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          {title}
        </h2>
        {interactive && (
          <ArrowRight
            className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-brand-600"
            aria-hidden
          />
        )}
      </div>

      <div className="flex flex-1 flex-col items-center">{children}</div>

      {badge && <div className="mt-3 flex justify-center">{badge}</div>}

      {summary && (
        <p className="mt-4 text-center text-sm leading-relaxed text-slate-600">{summary}</p>
      )}

      {drivers.length > 0 && (
        <ul className="mt-3 space-y-1.5" role="list">
          {drivers.map((driver) => (
            <li
              key={driver}
              className="flex items-start gap-2 text-xs leading-relaxed text-slate-500"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden />
              {driver}
            </li>
          ))}
        </ul>
      )}

      {interactive && (
        <p className="mt-auto pt-3 text-center text-xs font-medium text-brand-600 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
          {copy.dashboard.detail.learnMore}
        </p>
      )}
    </Wrapper>
  );
}
