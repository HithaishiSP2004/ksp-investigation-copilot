"use client";

import React, { useState } from "react";
import { Victim } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { ChevronDown, ChevronUp, User } from "lucide-react";

interface VictimPanelProps {
  victims: Victim[];
}

export function VictimPanel({ victims }: VictimPanelProps) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Header Toggle bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/20 transition-colors text-left cursor-pointer"
      >
        <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          {t("panelVictims")} ({victims.length})
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {/* Panel details list */}
      {isOpen && (
        <div className="p-4 border-t border-border bg-card">
          {victims.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No victims or complainants recorded for this case file.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {victims.map((v) => (
                <div key={v.id} className="p-3 bg-muted/30 border border-border rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">{v.name}</span>
                    {v.injuryType && v.injuryType !== "None" && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase">
                        {v.injuryType}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-muted-foreground font-semibold">
                    <div className="flex justify-between">
                      <span>{t("personAge")}:</span>
                      <span className="text-foreground font-medium">{v.age || "N/A"}</span>
                    </div>
                    {v.contact && (
                      <div className="flex justify-between">
                        <span>{t("personContact")}:</span>
                        <span className="text-foreground font-medium">{v.contact}</span>
                      </div>
                    )}
                  </div>
                  {v.description && (
                    <p className="text-[11px] text-muted-foreground leading-normal border-t border-border/40 pt-1.5 font-medium">
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
