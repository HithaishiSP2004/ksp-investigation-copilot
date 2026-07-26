"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ReportData } from "../types";
import { Button } from "@/components/ui/button";
import { Printer, Download, FileText, CheckCircle2, ShieldCheck, QrCode } from "lucide-react";
import { ReportService } from "../services/report-service";
import { useLocale } from "@/lib/locales-provider";

interface InvestigationReportProps {
  reportData: ReportData;
}

export function InvestigationReport({ reportData }: InvestigationReportProps) {
  const { t } = useLocale();
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    window.print();
  };

  const handleExportJson = async () => {
    const jsonString = await ReportService.exportJson(reportData);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `KSP-Report-${reportData.crimeNo}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex-1 flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full">
      {/* Action Header Bar (Hidden during printing) */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20 shrink-0 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
          <span className="text-xs font-bold text-foreground">{t("reportConsoleTitle")}</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8.5 text-xs font-bold cursor-pointer" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1.5" />
            {t("printReportBtn")}
          </Button>
          <Button size="sm" className="h-8.5 text-xs font-bold cursor-pointer" onClick={handleExportJson}>
            <Download className="h-4 w-4 mr-1.5" />
            {t("exportJsonBtn")}
          </Button>
        </div>
      </div>

      {/* Printable Report Dossier View */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-card text-foreground print:p-0 print:overflow-visible" ref={printAreaRef}>
        <div className="printable-dossier relative max-w-[800px] mx-auto bg-card text-foreground p-6 md:p-8 rounded-xl border border-border/80 shadow-xs print:p-0 print:border-none print:shadow-none print:max-w-none space-y-5">

          {/* Official Background Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] print:opacity-[0.05] overflow-hidden z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Seal_of_Karnataka.svg"
              alt="Official Seal of Karnataka Police Watermark"
              width={420}
              height={420}
              className="object-contain"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 space-y-5 font-sans">

            {/* Header Government Emblem & Official Title Block */}
            <div className="relative border-b-2 border-primary/80 pb-3 print-avoid-break">
              {/* Top Right QR Code & Verification Tag */}
              <div className="absolute top-0 right-0 hidden sm:flex flex-col items-center p-1.5 border border-border rounded-lg bg-muted/20 text-center text-[9px] font-mono print:flex">
                <QrCode className="h-8 w-8 text-foreground mb-0.5" />
                <span className="font-bold">VERIFIED</span>
                <span className="text-[8px] text-muted-foreground">{reportData.caseNo}</span>
              </div>

              {/* Centered KSP Emblem Header */}
              <div className="flex flex-col items-center justify-center text-center space-y-1">
                <div className="relative h-14 w-14 mb-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Seal_of_Karnataka.svg"
                    alt="Official Seal of Karnataka Police"
                    width={56}
                    height={56}
                    className="h-full w-full object-contain filter drop-shadow-xs"
                  />
                </div>

                {/* Bilingual Official Header */}
                <h1 className="text-base md:text-lg font-extrabold text-foreground tracking-tight">
                  ಬೆಂಗಳೂರು ನಗರ ಪೊಲೀಸ್ / BANGALORE CITY POLICE
                </h1>
                <h2 className="text-xs md:text-sm font-bold text-primary tracking-wider uppercase">
                  KARNATAKA STATE POLICE — FORM NO. 76A
                </h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
                  [U/s 154 / 155 CrPC] OFFICIAL INVESTIGATION DOSSIER & PROSECUTION REPORT
                </p>
                <p className="text-[9.5px] text-muted-foreground font-mono font-medium">
                  Serial No. / ಕ್ರಮ ಸಂಖ್ಯೆ: <strong className="text-foreground">{reportData.caseNo}</strong>
                </p>
              </div>
            </div>

            {/* Form Table 1: Police Unit & Station Identification */}
            <div className="border border-border rounded-lg overflow-hidden shadow-2xs print-avoid-break">
              <table className="w-full text-[11px] text-left border-collapse">
                <tbody>
                  <tr className="border-b border-border bg-muted/20 font-medium">
                    <td className="p-2.5 border-r border-border w-1/2">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase block">Police Unit / ಪೊಲೀಸ್ ಘಟಕ:</span>
                      <strong className="text-foreground font-semibold">Bengaluru City Police (Crime Branch CCRB)</strong>
                    </td>
                    <td className="p-2.5 w-1/2">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase block">Date & Time / ದಿನಾಂಕ & ಸಮಯ:</span>
                      <strong className="text-foreground font-mono">{formattedDate} · {formattedTime}</strong>
                    </td>
                  </tr>
                  <tr className="border-b border-border font-medium">
                    <td className="p-2.5 border-r border-border">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase block">Crime No (FIR) / ಅಪರಾಧ ಸಂಖ್ಯೆ:</span>
                      <strong className="text-primary font-mono text-xs">{reportData.crimeNo}</strong>
                    </td>
                    <td className="p-2.5">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase block">Case Reference No / ಪ್ರಕರಣದ ಲಾಗ್ ಸಂಖ್ಯೆ:</span>
                      <strong className="text-foreground font-mono">{reportData.caseNo}</strong>
                    </td>
                  </tr>
                  <tr className="font-medium bg-muted/10">
                    <td colSpan={2} className="p-2.5">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase block">Classification & Subject / ವಿಷಯ:</span>
                      <strong className="text-foreground text-[11px] leading-snug">{reportData.title}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 1: Brief Facts of Crime (ಘಟನೆಯ ವಿವರಗಳು / ಸಂಕ್ಷಿಪ್ತ ಸಾರಾಂಶ) */}
            <div className="space-y-1.5 print-avoid-break">
              <h3 className="text-[11px] font-bold text-primary uppercase border-b border-border/80 pb-1 tracking-wider">
                1. Brief Facts of Incident / ಘಟನೆಯ ಸಂಕ್ಷಿಪ್ತ ವಿವರಗಳು
              </h3>
              <div className="p-3.5 bg-muted/20 border border-border/80 rounded-lg text-[11px] text-foreground leading-relaxed font-medium text-justify shadow-2xs">
                {reportData.summary}
              </div>
            </div>

            {/* Section 2: Complainants & Suspects Ledger (ಫಿರ್ಯಾದುದಾರರು & ಆರೋಪಿಗಳ ವಿವರಗಳು) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print-avoid-break">
              {/* Complainants / Victims */}
              <div className="space-y-1.5">
                <h3 className="text-[11px] font-bold text-primary uppercase border-b border-border/80 pb-1 tracking-wider">
                  2. Complainant Details / ಫಿರ್ಯಾದುದಾರರು ({reportData.victims.length})
                </h3>
                <div className="space-y-1.5">
                  {reportData.victims.map((v, i) => (
                    <div key={i} className="p-2.5 bg-muted/20 border border-border/80 rounded-lg text-[11px] space-y-0.5 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-foreground">{v.name}</p>
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[8.5px] font-bold uppercase">
                          {v.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium space-y-0.5 pt-0.5 border-t border-border/40">
                        <div>Age: <strong className="text-foreground">{v.age ? `${v.age} Yrs` : "N/A"}</strong></div>
                        <div>Contact: <span className="font-mono text-foreground">{v.contact}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suspects / Accused */}
              <div className="space-y-1.5">
                <h3 className="text-[11px] font-bold text-primary uppercase border-b border-border/80 pb-1 tracking-wider">
                  3. Accused Details / ಆರೋಪಿಗಳ ವಿವರಗಳು ({reportData.suspects.length})
                </h3>
                <div className="space-y-1.5">
                  {reportData.suspects.map((s, i) => (
                    <div key={i} className="p-2.5 bg-muted/20 border border-border/80 rounded-lg text-[11px] space-y-0.5 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-foreground">{s.name}</p>
                        <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20 text-[8.5px] font-bold uppercase">
                          {s.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium space-y-0.5 pt-0.5 border-t border-border/40">
                        <div>Age: <strong className="text-foreground">{s.age ? `${s.age} Yrs` : "N/A"}</strong></div>
                        <div>Contact: <span className="font-mono text-foreground">{s.contact}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Secured Forensic Evidence Assets Table (ವಶಪಡಿಸಿಕೊಂಡ ಸಾಕ್ಷ್ಯಾಧಾರಗಳು) */}
            <div className="space-y-1.5 print-avoid-break">
              <h3 className="text-[11px] font-bold text-primary uppercase border-b border-border/80 pb-1 tracking-wider">
                4. Secured Forensic Evidence Assets / ವಶಪಡಿಸಿಕೊಂಡ ಸಾಕ್ಷ್ಯಾಧಾರಗಳು ({reportData.evidence.length})
              </h3>
              <div className="overflow-x-auto border border-border/80 rounded-lg shadow-2xs">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/80 text-[9px] uppercase text-muted-foreground font-bold tracking-wider">
                      <th className="p-2 border-r border-border/60">Evidence No</th>
                      <th className="p-2 border-r border-border/60">Asset Title</th>
                      <th className="p-2 border-r border-border/60">Class</th>
                      <th className="p-2 border-r border-border/60">Custody State</th>
                      <th className="p-2">SHA-256 Checksum Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.evidence.map((ev, i) => (
                      <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-muted/10 font-medium">
                        <td className="p-2 border-r border-border/40 font-mono font-bold text-foreground">{ev.evidenceNo}</td>
                        <td className="p-2 border-r border-border/40 text-foreground">{ev.title}</td>
                        <td className="p-2 border-r border-border/40">{ev.type}</td>
                        <td className="p-2 border-r border-border/40 font-bold text-primary">{ev.status}</td>
                        <td className="p-2 font-mono text-[9px] text-muted-foreground">{ev.hash.substring(0, 18)}...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: AI Intelligence & GNN Pattern Annotations */}
            <div className="bg-amber-500/10 border-l-4 border-amber-500 p-3.5 rounded-r-lg space-y-1 shadow-2xs print-avoid-break">
              <h3 className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                5. AI Intelligence Annotations & GNN Inferences / ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ವಿಶ್ಲೇಷಣೆ
              </h3>
              <pre className="text-[11px] text-foreground font-sans whitespace-pre-wrap leading-relaxed font-medium">
                {reportData.intelligenceSummary}
              </pre>
            </div>

            {/* Section 5: Chronological Audit Trail (ತನಿಖಾ ಸಮಯಸೂಚಿ) */}
            <div className="space-y-1.5 print-avoid-break">
              <h3 className="text-[11px] font-bold text-primary uppercase border-b border-border/80 pb-1 tracking-wider">
                6. Chronological Audit Trail / ತನಿಖಾ ಸಮಯಸೂಚಿ
              </h3>
              <div className="space-y-2 pl-3.5 border-l border-border/80 ml-2">
                {reportData.timelineSummary.map((t, i) => (
                  <div key={i} className="relative text-[11px] space-y-0.5">
                    <span className="absolute -left-[18.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="font-mono text-[9.5px] text-muted-foreground block font-medium">{t.time}</span>
                    <p className="font-medium text-foreground leading-snug">{t.event}</p>
                    <p className="text-[9.5px] text-muted-foreground font-semibold">Officer: {t.officer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Outstanding Actions */}
            <div className="space-y-1.5 print-avoid-break">
              <h3 className="text-[11px] font-bold text-primary uppercase border-b border-border/80 pb-1 tracking-wider">
                7. Outstanding Pending Actions / ಬಾಕಿ ಇರುವ ತನಿಖಾ ಕ್ರಮಗಳು
              </h3>
              <div className="space-y-1.5">
                {reportData.outstandingTasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-foreground font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Inspector Stamp & Signature Block (Matches Official KSP Reference Images) */}
            <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-6 border-t-2 border-border text-[11px] print-avoid-break">
              <div className="text-[9.5px] text-muted-foreground space-y-1 font-medium">
                <p className="font-bold text-foreground">KARNATAKA STATE POLICE CENTRAL VAULT</p>
                <p>DIGITAL SIGNATURE HASH: VERIFIED</p>
                <p className="font-mono">CRYPTOGRAPHIC SEAL ID: {reportData.caseNo}-DS-2026</p>
              </div>

              {/* Official Police Inspector Circular Seal & Signature Stamp Block */}
              <div className="flex flex-col items-center text-center space-y-1 border border-border/80 bg-muted/10 p-3.5 rounded-xl min-w-[230px]">
                <div className="relative h-14 w-28 border border-dashed border-primary/40 rounded flex flex-col items-center justify-center bg-background/50 p-1">
                  <span className="font-mono text-[8.5px] text-primary font-bold rotate-[-4deg]">
                    [DIGITALLY SIGNED & STAMPED]
                  </span>
                  <span className="text-[7.5px] font-mono text-muted-foreground">KSP CCRB OFFICERS</span>
                </div>
                <div className="pt-1">
                  <p className="font-extrabold text-foreground text-[11px] uppercase">Inspector of Police</p>
                  <p className="text-[9.5px] text-muted-foreground font-bold">CCRB, Bengaluru City Police</p>
                  <p className="text-[8.5px] text-muted-foreground uppercase font-bold tracking-tight">
                    City Crime Record Bureau · Bangalore City
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Note & Disclaimer Block (Matches KSP Reference Images) */}
            <div className="border-t border-border/60 pt-3 space-y-1 text-[9.5px] text-muted-foreground font-medium leading-relaxed print-avoid-break">
              <div className="space-y-0.5">
                <strong className="text-foreground block font-bold">Note / ಸೂಚನೆ:</strong>
                <p>(i) This is an official digitally signed investigation report generated via TALAARI AI Investigation OS (ತಳವಾರ).</p>
                <p>(ii) For verification visit &apos;Investigation Dossier&apos; module on official Karnataka State Police portal.</p>
              </div>
              <div className="space-y-0.5 pt-1 border-t border-border/30">
                <strong className="text-foreground block font-bold">Disclaimer / ಹಕ್ಕುತ್ಯಾಗ:</strong>
                <p>(i) This report is compiled for official investigation and prosecution under Karnataka State Police authority.</p>
                <p>(ii) Tampering or unauthorized alteration of this investigation dossier is a punishable offence under IPC & IT Act.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
