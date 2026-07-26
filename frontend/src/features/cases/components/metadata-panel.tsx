"use client";

import React from "react";
import { CaseDetailsUI, CaseStatus } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { ProgressPanel } from "./progress-panel";
import { Button } from "@/components/ui/button";
import { User, Edit3, Archive, Calendar, ShieldCheck, MapPin } from "lucide-react";

interface MetadataPanelProps {
  caseRecord: CaseDetailsUI;
  onStatusChange: (status: CaseStatus) => void;
  onOpenEdit: () => void;
  onArchive: () => void;
}

export function MetadataPanel({
  caseRecord,
  onStatusChange,
  onOpenEdit,
  onArchive,
}: MetadataPanelProps) {
  const { t, locale } = useLocale();

  const formatDate = (dateVal: string | Date | undefined | null) => {
    if (!dateVal) return "N/A";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString(locale === "kn" ? "kn-IN" : "en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full md:w-80 p-6 flex flex-col bg-muted/10 shrink-0 space-y-6 overflow-y-auto border-t md:border-t-0 md:border-l border-border h-full">
      {/* 1. Progress Indicator */}
      <ProgressPanel status={caseRecord.caseStatus || "UNDER_INVESTIGATION"} />

      <hr className="border-border/60" />

      {/* 2. Case Relational Parameters */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
          {t("wsDetailsTableTitle")}
        </h3>

        <div className="space-y-3 text-xs bg-card border border-border rounded-xl p-4 shadow-sm">
          {/* Station & District */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary" />
              {t("wsTableStation")}
            </span>
            <p className="font-bold text-foreground leading-snug">
              {caseRecord.stationName || "Cyber Crime PS Bengaluru City"}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              {caseRecord.districtName || "Bengaluru City"}
            </p>
          </div>

          <hr className="border-border/60" />

          {/* Assigned Officer */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase flex items-center gap-1">
              <User className="h-3 w-3 text-primary" />
              {t("wsTableOfficer")}
            </span>
            <p className="font-bold text-foreground leading-snug flex items-center gap-1">
              {caseRecord.officerName || "Rajesh Kumar"}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              {caseRecord.officerRank || "Inspector of Police"}
            </p>
          </div>

          <hr className="border-border/60" />

          {/* Crime Classification */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              {t("metaClassification")}
            </span>
            <p className="font-bold text-foreground leading-snug">
              {caseRecord.majorHeadName || "Financial Fraud"}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium truncate">
              {caseRecord.minorHeadName || "Phishing & Banking Fraud"}
            </p>
          </div>

          <hr className="border-border/60" />

          {/* Gravity of Offence */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              {t("wsTableGravity")}
            </span>
            <p className="font-bold text-foreground leading-snug flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span>{caseRecord.gravityName || "HEINOUS"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Dates & Audit Info */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {t("metaAuditTracking")}
        </h3>

        <div className="space-y-2 text-[11px] bg-card border border-border rounded-xl p-4 shadow-sm text-muted-foreground font-semibold">
          <div className="flex justify-between">
            <span>{t("wsAuditCreated")}:</span>
            <span className="text-foreground font-mono">
              {formatDate(caseRecord.createdAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("wsAuditUpdated")}:</span>
            <span className="text-foreground font-mono">
              {formatDate(caseRecord.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-border/60" />

      {/* 4. Action Console Panel */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t("metaConsoleActions")}
        </h3>

        <div className="space-y-2">
          {/* Status Select update */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              {t("metaQuickStatusUpdate")}
            </span>
            <select
              value={caseRecord.caseStatus || "UNDER_INVESTIGATION"}
              onChange={(e) => onStatusChange(e.target.value as CaseStatus)}
              className="flex h-9 w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="UNDER_INVESTIGATION">{t("metaStatusUnderInvestigation")}</option>
              <option value="CHARGE_SHEETED">{t("metaStatusChargeSheeted")}</option>
              <option value="CLOSED">{t("metaStatusClosed")}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenEdit}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold h-9 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
              {t("actionEdit")}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onArchive}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold h-9 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 cursor-pointer"
            >
              <Archive className="h-3.5 w-3.5 text-muted-foreground" />
              {t("actionArchive")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
