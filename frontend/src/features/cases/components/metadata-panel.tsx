"use client";

import React from "react";
import { CaseDetailsUI, CaseStatus } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { ProgressPanel } from "./progress-panel";
import { Button } from "@/components/ui/button";
import { User, Edit3, Archive, Calendar } from "lucide-react";

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
  const { t } = useLocale();

  return (
    <div className="w-full md:w-80 p-6 flex flex-col bg-muted/10 shrink-0 space-y-6 overflow-y-auto border-t md:border-t-0 md:border-l border-border h-full">
      {/* 1. Progress Indicator */}
      <ProgressPanel status={caseRecord.caseStatus} />

      <hr className="border-border/60" />

      {/* 2. Case Relational Parameters */}
      <div className="space-y-4">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
          {t("wsDetailsTableTitle")}
        </h3>

        <div className="space-y-3 text-xs bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              {t("wsTableStation")}
            </span>
            <p className="font-bold text-foreground leading-none">
              {caseRecord.stationName}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              {caseRecord.districtName}
            </p>
          </div>
          
          <hr className="border-border/60" />
          
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              {t("wsTableOfficer")}
            </span>
            <p className="font-bold text-foreground leading-none flex items-center gap-1">
              <User className="h-3 w-3 text-primary shrink-0" />
              {caseRecord.officerName}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              {caseRecord.officerRank}
            </p>
          </div>
          
          <hr className="border-border/60" />
          
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Classification
            </span>
            <p className="font-bold text-foreground leading-none">
              {caseRecord.majorHeadName}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium truncate">
              {caseRecord.minorHeadName}
            </p>
          </div>
          
          <hr className="border-border/60" />
          
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              {t("wsTableGravity")}
            </span>
            <p className="font-bold text-foreground leading-none flex items-center gap-1.5">
              {caseRecord.gravityName === "Heinous" && (
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
              {caseRecord.gravityName}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Dates & Audit Info */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          Audit Tracking
        </h3>
        
        <div className="space-y-2 text-[11px] bg-card border border-border rounded-xl p-4 shadow-sm text-muted-foreground font-semibold">
          <div className="flex justify-between">
            <span>{t("wsAuditCreated")}:</span>
            <span className="text-foreground font-mono">
              {new Date(caseRecord.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("wsAuditUpdated")}:</span>
            <span className="text-foreground font-mono">
              {new Date(caseRecord.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-border/60" />

      {/* 4. Action Console Panel */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
          Console Actions
        </h3>

        <div className="space-y-2">
          {/* Status Select update */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Quick Status Update
            </span>
            <select
              value={caseRecord.caseStatus}
              onChange={(e) => onStatusChange(e.target.value as CaseStatus)}
              className="flex h-9 w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="CHARGE_SHEETED">Charge Sheeted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenEdit}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold h-9"
            >
              <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
              {t("actionEdit")}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onArchive}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold h-9 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
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
