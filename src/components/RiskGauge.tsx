"use client";

import { CompletionRing } from "@/components/CompletionRing";
import { getRiskBadgeClass, getRiskColor, humanize } from "@/lib/utils";

interface RiskGaugeProps {
  score: number;
  level: string;
}

export function RiskGauge({ score, level }: RiskGaugeProps) {
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
            : "#94a3b8";

  if (!hasScore) {
    return (
      <div className="flex flex-col items-center" aria-hidden>
        <CompletionRing value={0} displayValue="—" subLabel="pending" strokeColor="#94a3b8" />
        <span className={`mt-3 ${getRiskBadgeClass("pending")}`}>Pending</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center" role="img" aria-hidden>
      <CompletionRing
        value={score}
        displayValue={String(score)}
        subLabel="/ 100"
        strokeColor={strokeColor}
      />
      <span className={`mt-3 ${getRiskBadgeClass(level)}`}>{humanize(level)} risk</span>
    </div>
  );
}
