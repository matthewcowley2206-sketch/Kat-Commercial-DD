"use client";

import { getRiskBadgeClass, getRiskColor, humanize } from "@/lib/utils";

interface RiskGaugeProps {
  score: number;
  level: string;
  summary?: string;
  drivers?: string[];
}

export function RiskGauge({ score, level, summary, drivers = [] }: RiskGaugeProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const hasScore = level !== "pending" && score > 0;

  const strokeColor =
    level === "low"
      ? "#16a34a"
      : level === "medium"
        ? "#d97706"
        : level === "high"
          ? "#dc2626"
          : level === "critical"
            ? "#7f1d1d"
            : "#64748b";

  if (!hasScore && summary) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm leading-relaxed text-slate-500">{summary}</p>
      </div>
    );
  }

  return (
    <div role="img" aria-label={`Risk score ${score} out of 100. Level: ${humanize(level)}`}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="140" height="140" className="-rotate-90" aria-hidden>
            <circle cx="70" cy="70" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <circle
              cx="70"
              cy="70"
              r="45"
              fill="none"
              stroke={strokeColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
            <span className={`text-3xl font-bold tabular-nums ${getRiskColor(level)}`}>
              {score}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>
        <span className={`mt-3 ${getRiskBadgeClass(level)}`}>{humanize(level)} risk</span>
      </div>

      {summary && (
        <p className="mt-4 text-center text-sm leading-relaxed text-slate-600">{summary}</p>
      )}

      {drivers.length > 0 && (
        <ul className="mt-3 space-y-1.5" role="list" aria-label="Key risk drivers">
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
    </div>
  );
}
