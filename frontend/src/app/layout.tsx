import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

export const metadata: Metadata = {
  title: "KSP AI Investigation Copilot",
  description: "Intelligent Conversational AI and Crime Analytics Platform for the Karnataka State Police.",
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
      <head>
        {/* Load the Zoho Catalyst Web Client SDK asynchronously */}
        <Script 
          src="https://static.zoho-cdn.com/catalyst/sdk/js/3.0.0/catalystWebSDK.js" 
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
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
