"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RiskCategory {
  category: string;
  score: number;
}

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#991b1b"];

function getBarColor(score: number): string {
  if (score >= 75) return COLORS[3];
  if (score >= 50) return COLORS[2];
  if (score >= 25) return COLORS[1];
  return COLORS[0];
}

export function RiskBreakdown({ categories }: { categories: RiskCategory[] }) {
  const data = categories.map((c) => ({
    name: c.category.split("(")[0].trim(),
    score: c.score,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}/100`, "Risk Score"]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
