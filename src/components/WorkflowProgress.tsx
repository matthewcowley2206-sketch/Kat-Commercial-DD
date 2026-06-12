"use client";

import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { cn, getWorkflowLabel } from "@/lib/utils";

interface Stage {
  stage: string;
  status: string;
  completedAt: string | null;
}

export function WorkflowProgress({ stages }: { stages: Stage[] }) {
  return (
    <ol className="space-y-1" aria-label="Analysis progress">
      {stages.map((s) => {
        const Icon =
          s.status === "completed"
            ? CheckCircle2
            : s.status === "running"
              ? Loader2
              : s.status === "failed"
                ? XCircle
                : Circle;

        const label = getWorkflowLabel(s.stage);
        const statusText =
          s.status === "completed"
            ? "Complete"
            : s.status === "running"
              ? "In progress"
              : s.status === "failed"
                ? "Failed"
                : "Waiting";

        return (
          <li
            key={s.stage}
            className="flex min-h-[44px] items-center gap-3 rounded-xl px-2 py-2"
          >
            <Icon
              className={cn(
                "h-5 w-5 shrink-0",
                s.status === "completed" && "text-green-600",
                s.status === "running" && "animate-spin text-brand-600",
                s.status === "failed" && "text-red-600",
                s.status === "pending" && "text-slate-300"
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  s.status === "completed" ? "text-slate-900" : "text-slate-600"
                )}
              >
                {label}
              </p>
              <p className="text-xs text-slate-400">{statusText}</p>
            </div>
            <span className="sr-only">
              {label}: {statusText}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
