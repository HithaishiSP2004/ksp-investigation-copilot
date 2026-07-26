import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Kannada } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/locales-provider";
import { AuthProvider } from "@/features/auth/auth-context";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { StartupCheck } from "@/components/startup-check";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Kannada script font — required for correct rendering of ತಳವಾರ and all KN locale text
const notoSansKannada = Noto_Sans_Kannada({
  variable: "--font-noto-kannada",
  subsets: ["kannada"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TALAARI (ತಳವಾರ) — AI Investigation Console | Karnataka State Police",
  description: "TALAARI (ತಳವಾರ) — Intelligent AI Crime Analytics & Investigation Platform for Karnataka State Police.",
  keywords: ["Karnataka State Police", "TALAARI", "AI Investigation", "Crime Analytics", "FIR Management"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansKannada.variable} h-full antialiased`}>
        <LocaleProvider>
          <AuthProvider>
            <ErrorBoundary>
              <StartupCheck />
              {children}
            </ErrorBoundary>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
