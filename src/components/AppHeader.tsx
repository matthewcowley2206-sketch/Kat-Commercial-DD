"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { KatLogo } from "@/components/KatLogo";
import { HowItWorksPanel } from "@/components/HowItWorksPanel";
import { copy } from "@/lib/copy";

export function AppHeader() {
  const { session, logout } = useAuth();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label={`${copy.app.name} home`}
            className="flex min-h-[44px] min-w-0 items-center gap-3 rounded-xl px-1 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <KatLogo size="sm" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">
                {copy.app.name}
              </p>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                {copy.app.tagline}
              </p>
            </div>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(true)}
              className="min-h-[44px] rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {copy.app.howItWorks}
            </button>
            <span className="hidden text-sm text-slate-500 md:inline">{session?.name}</span>
            <button
              type="button"
              onClick={logout}
              className="btn-ghost !min-h-[40px] !px-2 text-sm"
              aria-label={copy.auth.signOut}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{copy.auth.signOut}</span>
            </button>
          </div>
        </div>
      </header>

      {showHowItWorks && <HowItWorksPanel onClose={() => setShowHowItWorks(false)} />}
    </>
  );
}
