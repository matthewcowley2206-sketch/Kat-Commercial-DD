"use client";

interface CompletionRingProps {
  value: number;
  displayValue: string;
  subLabel?: string;
  strokeColor: string;
  size?: number;
}

export function CompletionRing({
  value,
  displayValue,
  subLabel,
  strokeColor,
  size = 140,
}: CompletionRingProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums text-slate-900">{displayValue}</span>
        {subLabel && <span className="text-xs text-slate-500">{subLabel}</span>}
      </div>
    </div>
  );
}
