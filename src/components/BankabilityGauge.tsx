"use client";

import { copy } from "@/lib/copy";
import { getBankabilityBadgeClass, getBankabilityColor, humanize } from "@/lib/utils";

interface BankabilityGaugeProps {
  score: number;
  level: string;
}

export function BankabilityGauge({ score, level }: BankabilityGaugeProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    level === "strong"
      ? "#16a34a"
      : level === "adequate"
        ? "#4f46e5"
        : level === "marginal"
          ? "#d97706"
          : level === "weak"
            ? "#dc2626"
            : "#94a3b8";

  const levelLabel =
    copy.dashboard.lenderReadiness.levels[
      level as keyof typeof copy.dashboard.lenderReadiness.levels
    ] ?? humanize(level);

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label={`Bankability score ${score} out of 100. Level: ${levelLabel}`}
    >
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
          <span className={`text-3xl font-bold tabular-nums ${getBankabilityColor(level)}`}>
            {score}
          </span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
      </div>
      <span className={`mt-4 ${getBankabilityBadgeClass(level)}`}>{levelLabel}</span>
    </div>
  );
}
