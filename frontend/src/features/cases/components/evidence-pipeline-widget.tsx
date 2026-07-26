"use client";

import React from "react";
import { useLocale } from "@/lib/locales-provider";
import { ShieldCheck, FileCheck, Cpu, CheckCircle2, Clock, ChevronRight } from "lucide-react";

export function EvidencePipelineWidget() {
  const { t } = useLocale();

  const stages = [
    { id: 1, label: "Uploaded", count: 12, icon: FileCheck, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { id: 2, label: "OCR Extracted", count: 9, icon: Cpu, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { id: 3, label: "AI Analysis", count: 7, icon: Clock, color: "text-accent bg-accent/10 border-accent/20" },
    { id: 4, label: "Officer Review", count: 4, icon: ShieldCheck, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { id: 5, label: "Court Ready", count: 2, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">
              {t("cmdZoneCustody")}
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              Chain of Custody Verifiable Pipeline • SHA-256 Checksum Verified
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 shrink-0">
          12 Assets Active
        </span>
      </div>

      {/* Horizontal Verifiable Pipeline Stepper Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={st.id}
              className="p-3 bg-card border border-border rounded-lg relative flex flex-col justify-between space-y-2 hover:border-primary/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-1.5 rounded-md border ${st.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-foreground bg-muted/80 px-2 py-0.5 rounded border border-border">
                  {st.count}
                </span>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  Stage 0{st.id}
                </p>
                <p className="text-xs font-bold text-foreground whitespace-nowrap overflow-hidden text-ellipsis mt-0.5">
                  {st.label}
                </p>
              </div>

              {/* Connecting Step Arrow */}
              {idx < stages.length - 1 && (
                <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50">
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
