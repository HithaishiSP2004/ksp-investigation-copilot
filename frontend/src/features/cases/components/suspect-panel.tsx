"use client";

import React, { useState } from "react";
import { Suspect } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface SuspectPanelProps {
  suspects: Suspect[];
}

export function SuspectPanel({ suspects }: SuspectPanelProps) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(true);

  const getStatusBadge = (status: Suspect["status"]) => {
    const styles: Record<Suspect["status"], string> = {
      ABSCONDING: "bg-destructive/10 text-destructive border-destructive/20",
      UNDER_CUSTODY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      SUSPECTED: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      INTERROGATED: "bg-primary/10 text-primary border-primary/20",
    };
    return (
      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${styles[status]}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Header Toggle bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/20 transition-colors text-left cursor-pointer"
      >
        <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-primary" />
          {t("panelSuspects")} ({suspects.length})
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {/* Panel details list */}
      {isOpen && (
        <div className="p-4 border-t border-border bg-card">
          {suspects.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No suspect details linked to this case file.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suspects.map((s) => (
                <div key={s.id} className="p-3 bg-muted/30 border border-border rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-foreground truncate">{s.name}</span>
                    <span className="shrink-0">{getStatusBadge(s.status)}</span>
                  </div>
                  <div className="space-y-1 text-muted-foreground font-semibold">
                    <div className="flex justify-between">
                      <span>{t("personAge")}:</span>
                      <span className="text-foreground font-medium">{s.age || "Unknown"}</span>
                    </div>
                    {s.contact && s.contact !== "Unknown" && (
                      <div className="flex justify-between">
                        <span>{t("personContact")}:</span>
                        <span className="text-foreground font-medium">{s.contact}</span>
                      </div>
                    )}
                  </div>
                  {s.description && (
                    <p className="text-[11px] text-muted-foreground leading-normal border-t border-border/40 pt-1.5 font-medium">
                      {s.description}
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
