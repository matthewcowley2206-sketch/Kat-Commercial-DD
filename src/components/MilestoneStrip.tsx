"use client";

import { Check, Lock } from "lucide-react";
import { copy } from "@/lib/copy";
import {
  getProjectMilestones,
  getUnlockedCount,
  type Milestone,
} from "@/lib/gamification/milestones";
import type { DashboardData } from "@/types";

interface MilestoneStripProps {
  data: DashboardData;
}

export function MilestoneStrip({ data }: MilestoneStripProps) {
  const milestones = getProjectMilestones(data);
  const unlocked = getUnlockedCount(milestones);
  const g = copy.gamification;

  return (
    <section
      className="card mb-4 !p-4 sm:mb-6"
      aria-labelledby="milestones-heading"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 id="milestones-heading" className="text-sm font-semibold text-slate-900">
            {g.milestonesTitle}
          </h2>
          <p className="text-xs text-slate-500">
            {g.milestonesSubtitle(unlocked, milestones.length)}
          </p>
        </div>
        <div className="flex h-9 min-w-[3rem] items-center justify-center rounded-full bg-brand-50 px-3 text-sm font-bold tabular-nums text-brand-700">
          {unlocked}/{milestones.length}
        </div>
      </div>

      <ul className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="list">
        {milestones.map((milestone) => (
          <MilestonePill key={milestone.id} milestone={milestone} />
        ))}
      </ul>
    </section>
  );
}

function MilestonePill({ milestone }: { milestone: Milestone }) {
  return (
    <li
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
        milestone.unlocked
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
      title={milestone.unlocked ? copy.gamification.unlocked : copy.gamification.locked}
    >
      {milestone.unlocked ? (
        <Check className="h-3 w-3 shrink-0" aria-hidden />
      ) : (
        <Lock className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
      )}
      {milestone.label}
    </li>
  );
}
