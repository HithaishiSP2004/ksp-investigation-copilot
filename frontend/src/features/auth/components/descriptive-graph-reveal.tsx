"use client";

import React from "react";
import { Sparkles, Network, ArrowRight } from "lucide-react";

export function DescriptiveGraphReveal() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-3 animate-[fade-in_0.5s_ease-out]">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 text-xs font-bold font-mono uppercase tracking-widest">
        <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        <span>HIDDEN RELATIONSHIP DETECTED ACROSS CASES</span>
      </div>

      {/* Visual Relationship Chain */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-xl max-w-lg w-full">
        {/* Node 1: Cyber Phishing */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-950/80 border border-blue-800/60 text-slate-200">
          <Network className="h-4 w-4 text-blue-400 shrink-0" />
          <div className="text-left">
            <p className="text-xs font-bold tracking-wide">Cyber Phishing</p>
            <p className="text-[10px] text-slate-400 font-mono">Case File A</p>
          </div>
        </div>

        {/* Link Vector: Shared Mobile */}
        <div className="flex flex-col items-center justify-center text-amber-400 space-y-0.5">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
            Shared Mobile
          </span>
          <ArrowRight className="h-4 w-4 hidden sm:block animate-pulse" />
        </div>

        {/* Node 2: Narcotics Investigation */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-purple-950/80 border border-purple-800/60 text-slate-200">
          <Network className="h-4 w-4 text-purple-400 shrink-0" />
          <div className="text-left">
            <p className="text-xs font-bold tracking-wide">Narcotics Raid</p>
            <p className="text-[10px] text-slate-400 font-mono">Case File B</p>
          </div>
        </div>
      </div>
    </div>
  );
}
