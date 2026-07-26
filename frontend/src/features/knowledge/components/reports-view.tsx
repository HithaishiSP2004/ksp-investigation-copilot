"use client";

import React, { useState, useEffect } from "react";
import { CaseDetailsUI } from "@/features/cases/types";
import { CaseService } from "@/features/cases/services/case-service";
import { ReportService } from "../services/report-service";
import { ReportData } from "../types";
import { InvestigationReport } from "./investigation-report";
import { useLocale } from "@/lib/locales-provider";
import { FolderOpen } from "lucide-react";

interface ReportsViewProps {
  initialCaseId: number | null;
  onCaseChange: (id: number | null) => void;
}

export function ReportsView({ initialCaseId, onCaseChange }: ReportsViewProps) {
  const { t } = useLocale();
  const [cases, setCases] = useState<CaseDetailsUI[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    CaseService.getCases().then((list) => {
      setCases(list);
      if (!initialCaseId && list.length > 0) {
        onCaseChange(list[0].id);
      }
    });
  }, [initialCaseId, onCaseChange]);

  useEffect(() => {
    let active = true;
    if (!initialCaseId) {
      queueMicrotask(() => {
        if (active) setReport(null);
      });
      return;
    }

    queueMicrotask(() => {
      if (active) setIsLoading(true);
    });

    ReportService.generateReport(initialCaseId)
      .then((res) => {
        if (active) setReport(res);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialCaseId]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Shared Case Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-card border border-border rounded-xl shadow-sm shrink-0 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <FolderOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">{t("selectCasePrompt")}</h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              {t("reportSubtitle")}
            </p>
          </div>
        </div>

        <select
          value={initialCaseId || ""}
          onChange={(e) => onCaseChange(e.target.value ? Number(e.target.value) : null)}
          className="h-9 w-full sm:w-72 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold focus:outline-none text-foreground shrink-0 cursor-pointer"
        >
          <option value="">{t("chooseCaseFile")}</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.crimeNo} ({c.briefFacts.substring(0, 28)}...)
            </option>
          ))}
        </select>
      </div>

      {initialCaseId ? (
        isLoading ? (
          <div className="h-[40vh] flex items-center justify-center bg-card border border-border rounded-xl print:hidden shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs text-muted-foreground font-semibold">{t("loadingReport")}</span>
            </div>
          </div>
        ) : report ? (
          <InvestigationReport reportData={report} />
        ) : (
          <div className="h-[40vh] flex items-center justify-center bg-card border border-border rounded-xl print:hidden shadow-sm">
            <p className="text-xs text-muted-foreground font-semibold">
              {t("reportCompileError")}
            </p>
          </div>
        )
      ) : (
        <div className="h-[40vh] flex items-center justify-center bg-card border border-border rounded-xl print:hidden shadow-sm">
          <p className="text-xs text-muted-foreground font-semibold">
            {t("selectCaseReportPrompt")}
          </p>
        </div>
      )}
    </div>
  );
}
