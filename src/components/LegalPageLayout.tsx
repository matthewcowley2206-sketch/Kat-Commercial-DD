import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { copy } from "@/lib/copy";

interface LegalPageLayoutProps {
  title: string;
  updated: string;
  intro: string;
  sections: ReadonlyArray<{ readonly title: string; readonly body: string }>;
}

export function LegalPageLayout({ title, updated, intro, sections }: LegalPageLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link href="/" className="btn-ghost -ml-2 mb-6 !min-h-[40px] !px-2 text-sm text-slate-500">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {copy.dashboard.back}
      </Link>

      <article>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {copy.legal.draftNotice}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{copy.legal.lastUpdated(updated)}</p>
        <p className="mt-6 text-base leading-relaxed text-slate-600">{intro}</p>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
