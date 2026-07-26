"use client";

import React from "react";
import { BriefingData } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { FileText, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

interface OfficerBriefingProps {
  data: BriefingData;
}

export function OfficerBriefing({ data }: OfficerBriefingProps) {
  const { t } = useLocale();

  const getStatusBadgeColor = (status: string) => {
    const mapping: Record<string, string> = {
      UNDER_INVESTIGATION: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      CHARGE_SHEETED: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      CLOSED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    };
    return mapping[status] || "bg-muted text-muted-foreground border-border";
  };

  const getStatusLabel = (status: string) => {
    const mapping: Record<string, string> = {
      UNDER_INVESTIGATION: t("metaStatusUnderInvestigation"),
      CHARGE_SHEETED: t("metaStatusChargeSheeted"),
      CLOSED: t("metaStatusClosed"),
    };
    return mapping[status] || status.replace(/_/g, " ");
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-sm text-foreground">{t("briefingTitle")}</h3>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusBadgeColor(data.status)}`}>
          {getStatusLabel(data.status)}
        </span>
      </div>

      {/* Progress & Key Highlights */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>{t("dashContinueInvestigating")}</span>
            <span className="text-foreground font-mono">{data.progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${data.progress}%` }}></div>
          </div>
        </div>

        <div className="space-y-1 bg-muted/30 p-3.5 rounded-xl border border-border/60 text-xs">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t("evAssetDescription")}</span>
          <p className="font-medium text-foreground leading-relaxed text-[11px] line-clamp-4">
            {data.keyFindings}
          </p>
        </div>
      </div>

      {/* Dashboard Mini-Grid */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="border border-border/60 bg-muted/10 rounded-xl p-3">
          <FileText className="h-4 w-4 text-primary mx-auto mb-1" />
          <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t("navEvidence")}</span>
          <span className="text-lg font-bold text-foreground font-mono">{data.evidenceCount}</span>
        </div>
        <div className="border border-border/60 bg-muted/10 rounded-xl p-3">
          <Clock className="h-4 w-4 text-amber-500 mx-auto mb-1" />
          <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t("briefingPendingAiReview")}</span>
          <span className="text-lg font-bold text-foreground font-mono">{data.pendingReviewCount}</span>
        </div>
      </div>

      {/* Outstanding Tasks */}
      <div className="space-y-2 border-t border-border/60 pt-3">
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t("briefingOutstandingTasks")}</span>
        <div className="space-y-1.5">
          {data.outstandingTasks.map((task, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-secondary-foreground font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <span className="leading-snug">{task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
