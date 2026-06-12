import Link from "next/link";
import { copy } from "@/lib/copy";

export function AppFooter() {
  const { footer, disclaimer } = copy.legal;

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm leading-relaxed text-slate-600">{disclaimer.short}</p>
        <nav
          className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600"
          aria-label="Legal"
        >
          <Link href="/privacy" className="hover:text-brand-700">
            {footer.privacy}
          </Link>
          <Link href="/terms" className="hover:text-brand-700">
            {footer.terms}
          </Link>
          <Link href="/disclaimer" className="hover:text-brand-700">
            {footer.disclaimer}
          </Link>
        </nav>
        <p className="mt-4 text-xs text-slate-400">{footer.copyright}</p>
      </div>
    </footer>
  );
}
