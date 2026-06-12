import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { KatLogo } from "@/components/KatLogo";
import { SkipLink } from "@/components/ui/SkipLink";
import { Providers } from "@/components/Providers";
import { copy } from "@/lib/copy";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Kat Commercial DD — Australian Property Due Diligence",
  description:
    "Kat Commercial DD — a calm, guided workflow for commercial property due diligence. NCC, APRA, and FIRB compliance made clear.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f5f7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <Providers>
          <SkipLink />
          <div className="flex min-h-screen flex-col">
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
                <span className="badge shrink-0 bg-green-100 text-green-900">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-600" aria-hidden />
                  {copy.app.badge}
                </span>
              </div>
            </header>
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
