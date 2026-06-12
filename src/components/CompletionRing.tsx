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
    <div className="flex flex-col items-center" aria-hidden>
      <div className="relative" style={{ width: size, height: size }}>
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
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <span className="text-center text-3xl font-bold tabular-nums leading-none text-slate-900">
            {displayValue}
          </span>
        </div>
      </div>
      {subLabel && (
        <span className="mt-1.5 max-w-[120px] text-center text-xs leading-snug text-slate-500">
          {subLabel}
        </span>
      )}
    </div>
  );
}
