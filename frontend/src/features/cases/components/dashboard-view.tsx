"use client";

import React, { useState, useEffect } from "react";
import { useCases } from "../hooks/use-cases";
import { useAuth } from "@/features/auth/auth-context";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { SpatialMapWidget } from "./spatial-map-widget";
import { KnowledgeGraphWidget } from "./knowledge-graph-widget";
import { EvidencePipelineWidget } from "./evidence-pipeline-widget";
import {
  FolderOpen,
  PlusCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Play,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Cpu,
  Database,
  Activity,
  Shield,
} from "lucide-react";

interface DashboardViewProps {
  onNavigateToCases: (caseId?: number) => void;
  onOpenCreateModal: () => void;
}

export function DashboardView({ onNavigateToCases, onOpenCreateModal }: DashboardViewProps) {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const { myCases, highPriorityAlerts, activities, isLoading } = useCases();

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString(locale === "kn" ? "kn-IN" : "en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [locale]);

  const continueCase =
    myCases.length > 0
      ? [...myCases].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
      : null;

  const aiInsights = [
    {
      id: "AI-1",
      title: locale === "kn"
        ? "ಹಂಚಿಕೆ IMEI ಸಿಗ್ನಲ್ ಮತ್ತು ಟವರ್ ಅತಿಕ್ರಮಣ ಪತ್ತೆ"
        : "Shared IMEI Signal & Tower Overlap Detected",
      confidence: 96,
      category: locale === "kn" ? "ಸೈಬರ್ ಇಂಟೆಲಿಜೆನ್ಸ್" : "CYBER_INTELLIGENCE",
      reasoning: locale === "kn"
        ? "CCTV ಟವರ್ ಡಂಪ್ ವಿಶ್ಲೇಷಣೆ ಸಮಯದಲ್ಲಿ FIR-2026-001 ಮತ್ತು FIR-2026-014 ನಡುವೆ ಒಂದೇ SIM ನೋಂದಣಿ (IMEI 86349204...) ಹೊಂದಾಣಿಕೆಯಾಗಿದೆ."
        : "Same SIM registration (IMEI 86349204...) matched between FIR-2026-001 and FIR-2026-014 during CCTV tower dump analysis.",
      suggestedAction: locale === "kn"
        ? "FIR-2026-014 ಕಾಲ್ ಡೀಟೇಲ್ ರೆಕಾರ್ಡ್ಸ್ ಪರಿಶೀಲಿಸಿ"
        : "Review FIR-2026-014 Call Detail Records",
      caseId: 1,
    },
    {
      id: "AI-2",
      title: locale === "kn"
        ? "ಮೋಡಸ್ ಆಪರೆಂಡಿ ಮತ್ತು ವಾಹನ ನೋಂದಣಿ ಹೊಂದಾಣಿಕೆ"
        : "Modus Operandi & Vehicle Registration Match",
      confidence: 88,
      category: locale === "kn" ? "ಮಾದರಿ ಹೊಂದಾಣಿಕೆ" : "PATTERN_MATCHING",
      reasoning: locale === "kn"
        ? "ವೈಟ್‌ಫೀಲ್ಡ್ ವ್ಯಾಪ್ತಿಯ 3 ATM ಮೋಸ ಸ್ಥಳಗಳ ಬಳಿ 48 ಗಂಟೆಗಳ ಒಳಗೆ SUV ನೋಂದಣಿ (KA-01-MJ-8891) ಕಾಣಲಾಗಿದೆ."
        : "SUV registration (KA-01-MJ-8891) sighted near 3 ATM Fraud locations in Whitefield jurisdiction within 48 hours.",
      suggestedAction: locale === "kn"
        ? "ಗಸ್ತು ಘಟಕ 04 ಗೆ ವಾಹನ ತಡೆ ಎಚ್ಚರಿಕೆ ನೀಡಿ"
        : "Issue Vehicle Intercept Alert to Patrol Unit 04",
      caseId: 2,
    },
  ];

  const getActivityMessage = (action: string, caseNo: string) => {
    switch (action) {
      case "CREATED":
        return `${t("cmdActivityCreated")} ${caseNo}`;
      case "STATUS_CHANGED":
        return `${t("cmdActivityStatusChanged")} ${caseNo}`;
      case "UPDATED":
        return `${t("cmdActivityUpdated")} ${caseNo}`;
      case "ARCHIVED":
        return `${t("cmdActivityArchived")} ${caseNo}`;
      default:
        return `${action} ${caseNo}`;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ─────────────────────────────────────────────────────────────── */}
      {/* ZONE 1: MISSION STATUS HEADER                                   */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider">
              {t("cmdTitle")}
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              {t("cmdShift")}: {t("cmdDayShift")}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {user?.firstName} {user?.lastName}
            <span className="text-xs font-semibold text-muted-foreground font-normal">
              ({t(user?.role === "investigator" ? "roleInvestigator" : "roleSuperintendent")})
            </span>
          </h1>

          <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
            <span>{user?.stationName} • {user?.districtName}</span>
            <span>•</span>
            <span className="text-foreground font-semibold">{currentTime}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{t("cmdOnline")}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>SECURE SESSION // KGID-{user?.kgid}</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* ZONE 8: CONTINUE INVESTIGATION LAUNCHER                          */}
      {/* ─────────────────────────────────────────────────────────────── */}
      {continueCase && (
        <div className="bg-card border-2 border-primary/30 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden bg-gradient-to-r from-primary/5 via-card to-card">
          <div className="space-y-1.5 z-10 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                <Play className="h-3 w-3 fill-current" />
                {t("dashContinueInvestigating")}
              </span>
              <span className="text-xs font-bold text-muted-foreground uppercase">
                {t("cmdFirNo")}: {continueCase.crimeNo}
              </span>
            </div>

            <h2 className="text-base font-bold text-foreground">
              {continueCase.briefFacts}
            </h2>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground pt-0.5">
              <span>{t("wsTableStation")}: <strong className="text-foreground">{continueCase.stationName}</strong></span>
              <span>•</span>
              <span>{t("wsTableCategory")}: <strong className="text-foreground">{continueCase.categoryName}</strong></span>
              <span>•</span>
              <span>{t("wsAuditUpdated")}: {new Date(continueCase.updatedAt).toLocaleDateString(locale === "kn" ? "kn-IN" : "en-IN")}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => onNavigateToCases(continueCase.id)}
              className="flex items-center gap-2 font-bold px-6 h-10 cursor-pointer shadow-md"
            >
              <span>{t("cmdOpenCase")}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* ZONE 2: CRITICAL OPERATIONS & HIGH PRIORITY ALERTS               */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span>{t("cmdZoneCritical")}</span>
          </h3>
          <span className="text-[11px] text-muted-foreground font-semibold">
            {highPriorityAlerts.length} {t("cmdCriticalItemsCount")}
          </span>
        </div>

        {highPriorityAlerts.length === 0 ? (
          <div className="p-3 border border-border rounded-xl bg-card/60 flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{t("cmdAllClear")}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              {t("cmdStatusNormal")}
            </span>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highPriorityAlerts.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigateToCases(c.id)}
                className="p-4 bg-destructive/5 dark:bg-destructive/10 border border-destructive/20 rounded-xl hover:border-destructive/40 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive uppercase tracking-wider bg-destructive/10 px-2 py-0.5 rounded">
                      <ShieldAlert className="h-3 w-3" />
                      {t("alertHigh")}
                    </span>
                    <span className="text-[11px] font-bold text-foreground">
                      {c.crimeNo}
                    </span>
                  </div>

                  <p className="text-xs text-foreground font-semibold line-clamp-2 pt-1">
                    {c.briefFacts}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground border-t border-destructive/10 pt-2">
                  <span>{t("wsTableStation")}: {c.stationName}</span>
                  <span className="text-destructive group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    {t("cmdInspectButton")} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* CORE TWO-COLUMN COMMAND MATRIX                                    */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: ACTIVE CASE QUEUE & AI DISCOVERY FEED */}
        <div className="lg:col-span-6 space-y-6">
          {/* ZONE 3: ACTIVE INVESTIGATION QUEUE TABLE */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  <span>{t("cmdZoneTable")}</span>
                </h3>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {t("cmdOfficerDocket")} • {myCases.length} {t("cmdActiveFiles")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={onOpenCreateModal}
                  size="sm"
                  className="flex items-center gap-1.5 font-bold text-xs h-8 cursor-pointer"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>{t("dashActionNewCase")}</span>
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="h-40 flex items-center justify-center border border-border border-dashed rounded-lg">
                <span className="text-xs font-semibold text-muted-foreground animate-pulse">
                  {t("cmdLoadingQueue")}
                </span>
              </div>
            ) : myCases.length === 0 ? (
              <div className="border border-border rounded-xl p-6 text-center bg-card/60 space-y-2">
                <FolderOpen className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground font-semibold">
                  {t("dashNoActiveCases")}
                </p>
                <button
                  onClick={onOpenCreateModal}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>{t("cmdRegisterFirstFir")}</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/30">
                      <th className="py-2.5 px-3">{t("cmdPriorityLabel")}</th>
                      <th className="py-2.5 px-3">{t("cmdFirNo")}</th>
                      <th className="py-2.5 px-3">{t("cmdCategory")}</th>
                      <th className="py-2.5 px-3">{t("cmdAiConfidence")}</th>
                      <th className="py-2.5 px-3 text-right">{t("cmdActions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {myCases.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => onNavigateToCases(c.id)}
                        className="hover:bg-muted/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-3">
                          {c.priority === "HIGH" ? (
                            <span className="px-2 py-0.5 rounded bg-destructive/10 text-destructive text-[10px] font-bold uppercase">
                              {t("cmdPriorityHigh")}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-bold uppercase">
                              {t("cmdPriorityNormal")}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 font-bold text-foreground group-hover:text-primary transition-colors">
                          {c.crimeNo}
                        </td>

                        <td className="py-3 px-3 text-muted-foreground font-medium truncate max-w-[120px]">
                          {c.categoryName}
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-10 bg-muted rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: c.priority === "HIGH" ? "92%" : "78%" }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-foreground">
                              {c.priority === "HIGH" ? "92%" : "78%"}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToCases(c.id);
                            }}
                            className="p-1 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ZONE 5: AI INTELLIGENCE FEED */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    {t("cmdZoneAiFeed")}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {t("cmdAiReasoningSubtitle")}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20 shrink-0">
                {aiInsights.length} {t("cmdInsightsFlagged")}
              </span>
            </div>

            <div className="space-y-3">
              {aiInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {insight.category}
                      </span>
                      <h4 className="text-xs font-bold text-foreground">
                        {insight.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                      <Zap className="h-3 w-3 fill-current" />
                      <span>{insight.confidence}% Conf.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      {t("cmdAiReason")}:
                    </p>
                    <p className="text-foreground text-xs leading-relaxed font-medium">
                      {insight.reasoning}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-primary truncate max-w-[280px]">
                      {t("cmdActionLabel")}: {insight.suggestedAction}
                    </span>

                    <button
                      onClick={() => onNavigateToCases(insight.caseId)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>{t("cmdInspectButton")}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SPATIAL MAP RADAR & KNOWLEDGE GRAPH */}
        <div className="lg:col-span-6 space-y-6">
          <SpatialMapWidget onSelectCoordinates={() => onNavigateToCases()} />
          <KnowledgeGraphWidget onExpandGraph={() => onNavigateToCases()} />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* ZONE 7: EVIDENCE CHAIN OF CUSTODY PIPELINE                       */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <EvidencePipelineWidget />

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* ZONE 9 & 10: AUDIT TIMELINE & SYSTEM INTELLIGENCE STATUS BAR    */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* ZONE 9: OPERATIONAL TIMELINE */}
        <div className="lg:col-span-8 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{t("cmdZoneAudit")}</span>
            </h3>
            <span className="text-[11px] text-muted-foreground font-semibold">
              {t("cmdAuditableLog")}
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="p-4 border border-border rounded-xl bg-card/60 text-center text-xs text-muted-foreground font-semibold">
              {t("dashNoActivity")}
            </div>
          ) : (
            <div className="space-y-3 relative pl-4 border-l border-border ml-2">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="relative text-xs space-y-1">
                  <span className="absolute -left-[20.5px] top-1.5 flex h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{act.officerName}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {new Date(act.timestamp).toLocaleTimeString(locale === "kn" ? "kn-IN" : "en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-xs leading-snug">
                    {getActivityMessage(act.action, act.caseNo)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ZONE 10: SYSTEM INTELLIGENCE STATUS */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
            <Cpu className="h-4 w-4 text-primary" />
            <span>{t("cmdZoneEngine")}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-500" />
                <span className="font-bold text-foreground">{t("cmdEngineCatalyst")}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {t("cmdEngineActive")}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="font-bold text-foreground">{t("cmdEngineOcr")}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {t("cmdEngineReady")}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="font-bold text-foreground">{t("cmdEngineGnn")}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                {t("cmdEngineOptimized")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
