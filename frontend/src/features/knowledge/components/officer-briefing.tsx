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
      UNDER_INVESTIGATION: "bg-blue-50 text-blue-700 border-blue-200",
      CHARGE_SHEETED: "bg-amber-50 text-amber-700 border-amber-200",
      CLOSED: "bg-green-50 text-green-700 border-green-200",
    };
    return mapping[status] || "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-sm text-foreground">{t("officerBadge")} Briefing</h3>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusBadgeColor(data.status)}`}>
          {data.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Progress & Key Highlights */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>{t("dashContinueInvestigating")}</span>
            <span className="text-foreground">{data.progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${data.progress}%` }}></div>
          </div>
        </div>

        <div className="space-y-1 bg-muted/30 p-3 rounded-lg border border-border/40 text-xs">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{t("evAssetDescription")}</span>
          <p className="font-medium text-foreground leading-relaxed">{data.keyFindings}</p>
        </div>
      </div>

      {/* Dashboard Mini-Grid */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="border border-border/60 bg-muted/10 rounded-lg p-3">
          <FileText className="h-4 w-4 text-primary mx-auto mb-1" />
          <span className="block text-[10px] text-muted-foreground font-semibold uppercase">{t("navEvidence")}</span>
          <span className="text-lg font-bold text-foreground">{data.evidenceCount}</span>
        </div>
        <div className="border border-border/60 bg-muted/10 rounded-lg p-3">
          <Clock className="h-4 w-4 text-amber-500 mx-auto mb-1" />
          <span className="block text-[10px] text-muted-foreground font-semibold uppercase">Pending AI Review</span>
          <span className="text-lg font-bold text-foreground">{data.pendingReviewCount}</span>
        </div>
      </div>

      {/* Outstanding Tasks */}
      <div className="space-y-2 border-t border-border/60 pt-3">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase">Outstanding Tasks</span>
        <div className="space-y-1.5">
          {data.outstandingTasks.map((task, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-secondary-foreground font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <span>{task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
