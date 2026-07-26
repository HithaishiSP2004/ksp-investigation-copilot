"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "@/lib/locales-provider";

interface KspEmblemSvgProps {
  showTitle?: boolean;
  className?: string;
}

export function KspEmblemSvg({ showTitle = true, className = "h-24 w-24" }: KspEmblemSvgProps) {
  const { locale } = useLocale();

  const isKannada = locale === "kn";
  const appName = isKannada ? "ತಳವಾರ" : "TALAARI";
  const appSubtitle = isKannada ? "AI ತನಿಖಾ ಕನ್ಸೋಲ್" : "AI INVESTIGATION CONSOLE";

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {/* Official TALAARI Brand Shield Emblem — fixed size, no auto override */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-amber-500/15 blur-2xl animate-pulse" />
        <Image
          src="/talaari-logo.png"
          alt="TALAARI Official Logo"
          width={96}
          height={96}
          priority
          className={`${className} drop-shadow-[0_0_30px_rgba(245,158,11,0.5)] object-contain relative z-10`}
        />
      </div>

      {/* TALAARI Gold Metallic Brand Typography */}
      {showTitle && (
        <div className="text-center space-y-1 z-10">
          {/* Main Gold Metallic Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.2em] bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 bg-clip-text text-transparent font-serif drop-shadow-[0_4px_12px_rgba(245,158,11,0.4)] uppercase">
            {appName}
          </h1>

          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 pt-0.5">
            <span className="h-[1px] w-6 sm:w-8 bg-gradient-to-r from-transparent via-amber-400/80 to-amber-500" />
            <p className="text-[10px] sm:text-xs font-bold text-amber-200/90 tracking-[0.22em] font-mono uppercase drop-shadow-md">
              {appSubtitle}
            </p>
            <span className="h-[1px] w-6 sm:w-8 bg-gradient-to-l from-transparent via-amber-400/80 to-amber-500" />
          </div>
        </div>
      )}
    </div>
  );
}
