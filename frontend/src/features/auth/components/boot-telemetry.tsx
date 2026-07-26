"use client";

import React, { useEffect, useState } from "react";
import { Cpu, ShieldAlert } from "lucide-react";

const TITLE = "KARNATAKA STATE POLICE // TALAARI INVESTIGATION CONSOLE";
const SUBTITLE = "INITIALIZING TALAARI OS v2.4 INTELLIGENCE ENGINE...";

interface BootTelemetryProps {
  onComplete?: () => void;
}

export function BootTelemetry({ onComplete }: BootTelemetryProps) {
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedSub, setDisplayedSub] = useState("");
  const [phase, setPhase] = useState<"title" | "sub" | "done">("title");

  useEffect(() => {
    let active = true;
    let idx = 0;

    if (phase === "title") {
      const t = setInterval(() => {
        if (!active) return;
        setDisplayedTitle(TITLE.slice(0, idx));
        idx++;
        if (idx > TITLE.length) {
          clearInterval(t);
          setPhase("sub");
        }
      }, 18);
      return () => { active = false; clearInterval(t); };
    }

    if (phase === "sub") {
      let j = 0;
      const t = setInterval(() => {
        if (!active) return;
        setDisplayedSub(SUBTITLE.slice(0, j));
        j++;
        if (j > SUBTITLE.length) {
          clearInterval(t);
          setPhase("done");
          onComplete?.();
        }
      }, 14);
      return () => { active = false; clearInterval(t); };
    }
  }, [phase, onComplete]);

  return (
    <div className="flex flex-col items-center gap-3 font-mono text-center">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest">
        <Cpu className="h-3.5 w-3.5 shrink-0" />
        <span>{displayedTitle || "SYSTEM BOOT"}</span>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-slate-400 tracking-wider min-h-[16px]">
        <ShieldAlert className="h-3 w-3 text-amber-500/60 shrink-0" />
        <span>{displayedSub}</span>
      </div>
    </div>
  );
}
