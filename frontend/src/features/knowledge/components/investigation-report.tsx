"use client";

import React, { useRef } from "react";
import { ReportData } from "../types";
import { Button } from "@/components/ui/button";
import { Printer, Download, FileText, CheckCircle2 } from "lucide-react";
import { ReportService } from "../services/report-service";
import { useLocale } from "@/lib/locales-provider";

interface InvestigationReportProps {
  reportData: ReportData;
}

export function InvestigationReport({ reportData }: InvestigationReportProps) {
  const { t } = useLocale();
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    // Standard clean browser print mechanism using CSS print style overrides
    window.print();
  };

  const handleExportJson = async () => {
    const jsonString = await ReportService.exportJson(reportData);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `Report-${reportData.crimeNo}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full">
      {/* Action Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20 shrink-0 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">{t("reportConsoleTitle")}</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs font-bold" onClick={handlePrint}>
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            {t("printReportBtn")}
          </Button>
          <Button size="sm" className="h-8 text-xs font-bold" onClick={handleExportJson}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            {t("exportJsonBtn")}
          </Button>
        </div>
      </div>

      {/* Printable Report View (incorporates custom print-ready media queries) */}
      <div className="flex-1 overflow-y-auto p-8 bg-card text-foreground" ref={printAreaRef}>
        <div className="max-w-[750px] mx-auto space-y-6 print:text-black">
          {/* Header Banner */}
          <div className="text-center border-b-2 border-primary pb-4 mb-6">
            <h1 className="text-xl font-bold tracking-tight text-primary">KARNATAKA STATE POLICE</h1>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              {t("officerBadge")} Briefing Summaries
            </h2>
            <p className="text-[9px] text-muted-foreground mt-2">Generated on: {new Date().toLocaleString()}</p>
          </div>

          {/* Section: Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-muted/30 border border-border rounded-lg p-4">
            <div className="space-y-1">
              <span className="text-[9px] text-muted-foreground font-semibold uppercase">Crime No (FIR):</span>
              <p className="font-bold text-foreground truncate">{reportData.crimeNo}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-muted-foreground font-semibold uppercase">Case No:</span>
              <p className="font-bold text-foreground truncate">{reportData.caseNo}</p>
            </div>
            <div className="col-span-2 space-y-1 border-t border-border/40 pt-2">
              <span className="text-[9px] text-muted-foreground font-semibold uppercase">Subject File:</span>
              <p className="font-bold text-foreground leading-none">{reportData.title}</p>
            </div>
          </div>

          {/* Section: Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border/80 pb-1">
              {t("briefFactsTitle")}
            </h3>
            <p className="text-xs text-foreground leading-relaxed text-justify">{reportData.summary}</p>
          </div>

          {/* Section: Actors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-primary uppercase border-b border-border/80 pb-1">
                {t("victimsComplainants")}
              </h3>
              <ul className="text-xs space-y-2 list-disc pl-5">
                {reportData.victims.map((v, i) => (
                  <li key={i} className="text-secondary-foreground font-medium">
                    <strong>{v.name}</strong> (Age: {v.age || "N/A"}) · {v.contact}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-primary uppercase border-b border-border/80 pb-1">
                {t("suspectsAccused")}
              </h3>
              <ul className="text-xs space-y-2 list-disc pl-5">
                {reportData.suspects.map((s, i) => (
                  <li key={i} className="text-secondary-foreground font-medium">
                    <strong>{s.name}</strong> · Status: <span className="font-bold text-primary">{s.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Evidence Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border/80 pb-1">
              {t("securedEvidence")}
            </h3>
            <div className="overflow-x-auto border border-border/60 rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/60">
                    <th className="p-2 font-bold">Evidence No</th>
                    <th className="p-2 font-bold">Asset Title</th>
                    <th className="p-2 font-bold">Type</th>
                    <th className="p-2 font-bold">Custody State</th>
                    <th className="p-2 font-bold">SHA-256 Checksum</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.evidence.map((ev, i) => (
                    <tr key={i} className="border-b border-border/20 last:border-0 hover:bg-muted/10">
                      <td className="p-2 font-mono font-semibold">{ev.evidenceNo}</td>
                      <td className="p-2 font-medium">{ev.title}</td>
                      <td className="p-2">{ev.type}</td>
                      <td className="p-2 font-semibold text-primary">{ev.status}</td>
                      <td className="p-2 font-mono text-[10px] text-muted-foreground">{ev.hash.substring(0, 16)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: AI summary */}
          <div className="bg-amber-50/40 border-l-4 border-amber-500 p-4 rounded-r-lg space-y-2">
            <h3 className="text-xs font-bold text-amber-800 uppercase">{t("aiAnnotations")}</h3>
            <pre className="text-xs text-secondary-foreground font-sans whitespace-pre-wrap leading-relaxed">
              {reportData.intelligenceSummary}
            </pre>
          </div>

          {/* Section: Chronology */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border/80 pb-1">
              {t("timelineSummaryTitle")}
            </h3>
            <ul className="text-xs space-y-2 pl-4 border-l border-border/60 ml-2">
              {reportData.timelineSummary.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[20.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-mono text-[10px] text-muted-foreground block">{t.time}</span>
                  <span className="font-medium text-foreground">{t.event}</span> ·{" "}
                  <span className="text-[10px] text-muted-foreground">Officer: {t.officer}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Outstanding Tasks */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border/80 pb-1">
              {t("outstandingTasks")}
            </h3>
            <div className="space-y-2">
              {reportData.outstandingTasks.map((task, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-secondary-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Officer signature block */}
          <div className="flex justify-end pt-12">
            <div className="text-center w-48 border-t border-foreground pt-1.5 text-xs font-bold mt-12">
              Investigating Officer
              <span className="block text-[9px] text-muted-foreground font-medium mt-0.5">Signature and Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
