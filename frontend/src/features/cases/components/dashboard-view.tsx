"use client";

import React from "react";
import { useCases } from "../hooks/use-cases";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { 
  FolderOpen, 
  PlusCircle, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Play
} from "lucide-react";

interface DashboardViewProps {
  onNavigateToCases: (caseId?: number) => void;
  onOpenCreateModal: () => void;
}

export function DashboardView({ onNavigateToCases, onOpenCreateModal }: DashboardViewProps) {
  const { t } = useLocale();
  const { myCases, highPriorityAlerts, activities, isLoading } = useCases();

  // Find the most recently updated case assigned to the officer to "Continue Investigation"
  const continueCase = myCases.length > 0 
    ? [...myCases].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0] 
    : null;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* 1. Continue Investigation (Primary Call to Action) */}
      {continueCase && (
        <div className="bg-card border-2 border-primary/20 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              <Play className="h-3 w-3 fill-current" />
              {t("dashContinueInvestigating")}
            </span>
            <h2 className="text-lg font-bold text-foreground">
              FIR No: {continueCase.crimeNo}
            </h2>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {continueCase.briefFacts}
            </p>
            <div className="flex gap-4 text-xs font-semibold text-secondary-foreground pt-1">
              <span>{t("wsTableStation")}: {continueCase.stationName}</span>
              <span>•</span>
              <span>Updated: {new Date(continueCase.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Button 
            onClick={() => onNavigateToCases(continueCase.id)} 
            className="shrink-0 flex items-center gap-2 font-bold px-6 h-11"
          >
            <span>Resume Work</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: My Active Investigations & Quick Actions */}
        <div className="md:col-span-2 space-y-6">
          {/* My Active Investigations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  {t("dashMyInvestigations")}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("dashMyActiveSubtitle")}
                </p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {myCases.length} Total
              </span>
            </div>

            {isLoading ? (
              <div className="h-32 flex items-center justify-center border border-border border-dashed rounded-lg bg-card/50">
                <span className="text-xs text-muted-foreground animate-pulse font-semibold">Loading investigations...</span>
              </div>
            ) : myCases.length === 0 ? (
              <div className="border border-border border-dashed rounded-xl p-8 text-center bg-card">
                <FolderOpen className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                <p className="text-xs text-muted-foreground font-semibold">
                  {t("dashNoActiveCases")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myCases.map((c) => (
                  <div 
                    key={c.id}
                    onClick={() => onNavigateToCases(c.id)}
                    className="p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all-custom cursor-pointer relative group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                            {c.crimeNo}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                            ({c.categoryName})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 leading-snug">
                          {c.briefFacts}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {c.priority === "HIGH" && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-[9px] font-bold uppercase">
                            <ShieldAlert className="h-3 w-3" />
                            High
                          </span>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
              {t("dashQuickActions")}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onOpenCreateModal}
                className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-muted/10 transition-all-custom cursor-pointer text-center group"
              >
                <PlusCircle className="h-6 w-6 text-primary group-hover:scale-105 transition-transform mb-2" />
                <span className="text-xs font-bold text-foreground">
                  {t("dashActionNewCase")}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  File new FIR documentation
                </span>
              </button>
              
              <button
                onClick={() => onNavigateToCases()}
                className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-muted/10 transition-all-custom cursor-pointer text-center group"
              >
                <FolderOpen className="h-6 w-6 text-primary group-hover:scale-105 transition-transform mb-2" />
                <span className="text-xs font-bold text-foreground">
                  View Case Files
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Inspect all active cases
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Pending High-Priority Actions & Activity Log */}
        <div className="space-y-8">
          {/* Pending Alerts */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              {t("dashPendingActions")}
            </h3>

            {highPriorityAlerts.length === 0 ? (
              <div className="p-4 border border-border border-dashed rounded-xl bg-card text-center text-xs text-muted-foreground font-semibold">
                {t("dashNoPending")}
              </div>
            ) : (
              <div className="space-y-3">
                {highPriorityAlerts.map((c) => (
                  <div 
                    key={c.id}
                    onClick={() => onNavigateToCases(c.id)}
                    className="p-3 bg-destructive/5 dark:bg-destructive/10 border border-destructive/20 rounded-xl hover:border-destructive/40 transition-all-custom cursor-pointer flex gap-3"
                  >
                    <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {c.crimeNo}
                      </p>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">
                        {c.briefFacts}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Log */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {t("dashRecentActivity")}
            </h3>

            {activities.length === 0 ? (
              <div className="p-4 border border-border border-dashed rounded-xl bg-card text-center text-xs text-muted-foreground font-semibold">
                {t("dashNoActivity")}
              </div>
            ) : (
              <div className="space-y-4 relative pl-3 border-l border-border/80 ml-2 pt-1">
                {activities.map((act) => (
                  <div key={act.id} className="relative text-xs space-y-1">
                    {/* Activity Dot Indicator */}
                    <span className="absolute -left-[16.5px] top-1.5 flex h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
                    
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-bold text-foreground">{act.officerName}</span>
                      <span className="text-[9px] text-muted-foreground font-medium">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-tight">
                      {act.action === "CREATED" && `Created case ${act.caseNo}`}
                      {act.action === "STATUS_CHANGED" && `Changed status of ${act.caseNo}`}
                      {act.action === "UPDATED" && `Updated case details of ${act.caseNo}`}
                      {act.action === "ARCHIVED" && `Archived case file ${act.caseNo}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
