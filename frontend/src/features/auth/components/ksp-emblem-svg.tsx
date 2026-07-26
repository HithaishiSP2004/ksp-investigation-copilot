"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "@/lib/locales-provider";

interface KspEmblemSvgProps {
  showTitle?: boolean;
  className?: string;
}

export function KspEmblemSvg({ showTitle = true, className = "h-32 w-32 md:h-36 md:w-36" }: KspEmblemSvgProps) {
  const { locale } = useLocale();

  const isKannada = locale === "kn";
  const appName = isKannada ? "ತಳವಾರ" : "TALAARI";
  const appSubtitle = isKannada ? "AI ತನಿಖಾ ಕನ್ಸೋಲ್" : "AI INVESTIGATION CONSOLE";

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Official TALAARI Brand Shield Emblem */}
      <div className="relative flex items-center justify-center mb-1">
        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />
        <Image
          src="/talaari-logo.png"
          alt="TALAARI Official Logo"
          width={180}
          height={180}
          priority
          style={{ width: "auto", height: "auto" }}
          className={`${className} drop-shadow-[0_0_40px_rgba(245,158,11,0.55)] animate-[fade-in_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] object-contain relative z-10`}
        />
      </div>

      {/* TALAARI Gold Metallic Brand Typography */}
      {showTitle && (
        <div className="text-center space-y-2 z-10">
          {/* Main Gold Metallic Title: TALAARI / ತಳವಾರ */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.2em] bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 bg-clip-text text-transparent font-serif drop-shadow-[0_4px_16px_rgba(245,158,11,0.45)] uppercase">
            {appName}
          </h1>

          {/* Subtitle: AI INVESTIGATION CONSOLE / AI ತನಿಖಾ ಕನ್ಸೋಲ್ */}
          <div className="flex items-center justify-center gap-3 pt-0.5">
            <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent via-amber-400/80 to-amber-500" />
            <p className="text-xs sm:text-sm font-bold text-amber-200/90 tracking-[0.28em] font-mono uppercase drop-shadow-md">
              {appSubtitle}
            </p>
            <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent via-amber-400/80 to-amber-500" />
          </div>
        </div>
      )}
    </div>
  );
}
