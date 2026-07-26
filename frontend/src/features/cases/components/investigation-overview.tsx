"use client";

import React from "react";
import { CaseDetailsUI } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { Calendar, MapPin, Shield } from "lucide-react";

interface InvestigationOverviewProps {
  caseRecord: CaseDetailsUI;
}

export function InvestigationOverview({ caseRecord }: InvestigationOverviewProps) {
  const { t, locale } = useLocale();

  const formatDate = (dateVal: string | Date | undefined | null) => {
    if (!dateVal) return "N/A";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString(locale === "kn" ? "kn-IN" : "en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 shrink-0">
      {/* Header Case Details Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider">
              {caseRecord.categoryName || "CYBER_CRIME"}
            </span>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-xs font-semibold text-muted-foreground">
              {t("overviewCaseNo")}: <strong className="text-foreground font-mono">{caseRecord.caseNo}</strong>
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {t("overviewFirNo")}: {caseRecord.crimeNo}
          </h2>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border text-xs font-bold">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>{t("overviewStation")}: {caseRecord.stationName || "Cyber Crime PS Bengaluru City"}</span>
        </div>
      </div>

      {/* Brief Facts of Crime */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
          {t("wsBriefFacts")}
        </h3>
        <div className="p-4 bg-muted/30 border border-border/80 rounded-xl text-xs text-foreground leading-relaxed font-medium shadow-xs">
          {caseRecord.briefFacts || t("overviewNoBriefFacts")}
        </div>
      </div>

      {/* Incident Duration & Coordinates Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-card border border-border/80 rounded-xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border/60 pb-2">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span>{t("wsIncidentDates")}</span>
          </div>
          <div className="space-y-2 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("overviewIncidentStart")}:</span>
              <span className="font-mono text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                {formatDate(caseRecord.incidentFromDate || (caseRecord as any).incidentDateFrom)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("overviewIncidentEnd")}:</span>
              <span className="font-mono text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                {formatDate(caseRecord.incidentToDate || (caseRecord as any).incidentDateTo)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-card border border-border/80 rounded-xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border/60 pb-2">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>{t("wsGeographicCoords")}</span>
          </div>
          <div className="space-y-2 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("overviewLatitude")}:</span>
              <span className="font-mono text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                {caseRecord.latitude ?? "12.9716"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("overviewLongitude")}:</span>
              <span className="font-mono text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                {caseRecord.longitude ?? "77.5946"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
