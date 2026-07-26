"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SpatialIntelligenceCanvas } from "./spatial-intelligence-canvas";
import { IntegratedAuthModule } from "./integrated-auth-module";
import { BootTelemetry } from "./boot-telemetry";
import { useLocale } from "@/lib/locales-provider";
import { ChevronRight } from "lucide-react";

export type SpatialStage = "ENV" | "AUTH" | "TRANSITION" | "COMMAND";

interface CinematicEntryProps {
  onAuthSuccess?: () => void;
}

export function CinematicEntry({ onAuthSuccess }: CinematicEntryProps) {
  const [stage, setStage] = useState<SpatialStage>("ENV");
  const { t } = useLocale();

  // ── Skip directly to AUTH module ───────────────────────────
  const skipToAuth = useCallback(() => setStage("AUTH"), []);

  // ── ESC key listener ───────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") skipToAuth(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skipToAuth]);

  // ── Reduced motion & dev flags check ──────────────────────
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const devOff = process.env.NEXT_PUBLIC_DISABLE_CINEMATIC_INTRO === "true";
    if (reduced || devOff) setStage("AUTH");
  }, []);

  // ── Automatic camera evolution (ENV -> AUTH after deliberate telemetry boot) ──────
  useEffect(() => {
    if (stage === "ENV") {
      // 3200ms duration for a calm, authoritative boot sequence
      const timer = setTimeout(() => setStage("AUTH"), 3200);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleAuthStart = () => {
    setStage("TRANSITION");
  };

  return (
    <div className="min-h-screen w-screen bg-[#04070D] text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden select-none">

      {/* ── Layer 1: Living Spatial Intelligence Background Canvas ─────────── */}
      <SpatialIntelligenceCanvas stage={stage} />

      {/* ── Layer 2: Top Telemetry Header ───────────────────────────────────── */}
      <header className="flex items-center justify-between w-full z-20">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase">
            {t("headerNodeTitle")}
          </span>
        </div>

        {stage === "ENV" && (
          <button
            onClick={skipToAuth}
            className="flex items-center gap-1.5 px-3 py-1 rounded border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-mono font-semibold transition-colors cursor-pointer shadow-lg z-30"
          >
            <span>[ESC] Skip Intro</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </header>

      {/* ── Layer 3: Main Spatial Stage Content ──────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-20 my-auto py-8 w-full max-w-xl mx-auto">
        {stage === "ENV" && (
          <div className="space-y-6 text-center animate-fade-in">
            <BootTelemetry />
          </div>
        )}

        {(stage === "AUTH" || stage === "TRANSITION") && (
          <IntegratedAuthModule
            onAuthStart={handleAuthStart}
            onAuthSuccess={onAuthSuccess}
          />
        )}
      </main>

      {/* ── Layer 4: Footer Statutory Notice ─────────────────────────────────── */}
      <footer className="w-full text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest z-20">
        FOR OFFICIAL USE ONLY • LAW ENFORCEMENT RESTRICTED CONSOLE • TALAARI OS v2.4 (ತಳವಾರ)
      </footer>
    </div>
  );
}
