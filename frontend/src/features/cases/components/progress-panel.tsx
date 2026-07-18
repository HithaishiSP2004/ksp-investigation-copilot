"use client";

import React from "react";
import { CaseStatus } from "../types";
import { CaseService } from "../services/case-service";
import { useLocale } from "@/lib/locales-provider";
import { TrendingUp } from "lucide-react";

interface ProgressPanelProps {
  status: CaseStatus;
}

export function ProgressPanel({ status }: ProgressPanelProps) {
  const { t } = useLocale();
  
  // Consume computed progress value from centralized service
  const progressPercent = CaseService.calculateProgress(status);

  // Determine progress color style
  const getProgressColor = (percent: number) => {
    if (percent >= 100) return "bg-emerald-500";
    if (percent >= 80) return "bg-primary";
    return "bg-amber-500";
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex justify-between items-center font-bold text-secondary-foreground uppercase tracking-wider text-[10px]">
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          {t("wsCaseProgress")}
        </span>
        <span className="font-mono">{progressPercent}%</span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden border border-border/30">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(progressPercent)}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
