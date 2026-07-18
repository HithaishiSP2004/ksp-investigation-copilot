"use client";

import React from "react";
import { CaseDetailsUI } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { Calendar, MapPin } from "lucide-react";

interface InvestigationOverviewProps {
  caseRecord: CaseDetailsUI;
}

export function InvestigationOverview({ caseRecord }: InvestigationOverviewProps) {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      {/* Header Case Details */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {caseRecord.categoryName} File
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-xs font-semibold text-muted-foreground">
            Case No: {caseRecord.caseNo}
          </span>
        </div>
        <h2 className="text-lg font-bold text-foreground">
          FIR No: {caseRecord.crimeNo}
        </h2>
      </div>

      <hr className="border-border/60" />

      {/* mod/facts details */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
          {t("wsBriefFacts")}
        </h3>
        <div className="p-4 bg-muted/30 border border-border rounded-xl text-xs text-foreground leading-relaxed whitespace-pre-line font-medium">
          {caseRecord.briefFacts}
        </div>
      </div>

      {/* Timeline Dates & Coordinates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border border-border rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{t("wsIncidentDates")}</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground font-semibold">Start:</span>
              <span className="font-medium text-foreground">
                {new Date(caseRecord.incidentFromDate).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground font-semibold">End:</span>
              <span className="font-medium text-foreground">
                {new Date(caseRecord.incidentToDate).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-border rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{t("wsGeographicCoords")}</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground font-semibold">Latitude:</span>
              <span className="font-mono text-foreground">{caseRecord.latitude}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground font-semibold">Longitude:</span>
              <span className="font-mono text-foreground">{caseRecord.longitude}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
