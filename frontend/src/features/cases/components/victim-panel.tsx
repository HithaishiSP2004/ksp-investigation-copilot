"use client";

import React, { useState } from "react";
import { Victim } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { ChevronDown, ChevronUp, User } from "lucide-react";

interface VictimPanelProps {
  victims: Victim[];
}

export function VictimPanel({ victims = [] }: VictimPanelProps) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
      {/* Header Toggle bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/20 transition-colors text-left cursor-pointer"
      >
        <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <User className="h-4 w-4 text-primary shrink-0" />
          <span>{t("panelVictims")} ({victims.length})</span>
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      {/* Panel details list */}
      {isOpen && (
        <div className="p-4 border-t border-border bg-card">
          {victims.length === 0 ? (
            <p className="text-xs text-muted-foreground italic p-2">
              No victims or complainants recorded for this case file.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {victims.map((v) => (
                <div key={v.id} className="p-4 bg-muted/20 border border-border/80 rounded-xl space-y-3 text-xs shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
                    <span className="font-bold text-foreground truncate text-xs">{v.name}</span>
                    {v.injuryType && v.injuryType !== "None" && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase border border-amber-500/20 shrink-0">
                        {v.injuryType}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 text-muted-foreground font-semibold">
                    <div className="flex justify-between items-center">
                      <span>{t("personAge")}:</span>
                      <span className="text-foreground font-medium">{v.age ? `${v.age} Yrs` : "N/A"}</span>
                    </div>
                    {v.contact && (
                      <div className="flex justify-between items-center">
                        <span>{t("personContact")}:</span>
                        <span className="text-foreground font-mono font-medium">{v.contact}</span>
                      </div>
                    )}
                  </div>
                  {v.description && (
                    <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/40 pt-2 font-medium">
                      {v.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
