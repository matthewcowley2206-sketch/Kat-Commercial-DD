"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { copy } from "@/lib/copy";

const DISMISS_KEY = "kat-disclaimer-dismissed";

export function DisclaimerBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(DISMISS_KEY) !== "true";
  });

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  };

  return (
    <div
      className="border-b border-amber-200 bg-amber-50/90"
      role="note"
      aria-label="Important disclaimer"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
        <p className="flex-1 text-xs leading-relaxed text-amber-900 sm:text-sm">
          {copy.legal.disclaimer.banner}{" "}
          <Link href="/disclaimer" className="font-semibold underline hover:text-amber-950">
            {copy.legal.footer.disclaimer}
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-lg p-1 text-amber-700 hover:bg-amber-100"
          aria-label="Dismiss disclaimer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
