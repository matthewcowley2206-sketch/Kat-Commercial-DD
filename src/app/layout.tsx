import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { SkipLink } from "@/components/ui/SkipLink";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
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
            <AppHeader />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
