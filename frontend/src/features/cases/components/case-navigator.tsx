"use client";

import React, { useState, useEffect } from "react";
import { CaseDetailsUI, CaseStatus, CasePriority } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { RecentCasesService } from "@/lib/services/recent-cases-service";
import { Search, Plus, History } from "lucide-react";

interface CaseNavigatorProps {
  cases: CaseDetailsUI[];
  selectedCaseId: number | null;
  onSelectCase: (record: CaseDetailsUI) => void;
  onOpenCreate: () => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: CaseStatus | "";
  setStatusFilter: (status: CaseStatus | "") => void;
  priorityFilter: CasePriority | "";
  setPriorityFilter: (priority: CasePriority | "") => void;
}

export function CaseNavigator({
  cases,
  selectedCaseId,
  onSelectCase,
  onOpenCreate,
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: CaseNavigatorProps) {
  const { t } = useLocale();
  const [recentCases, setRecentCases] = useState<CaseDetailsUI[]>([]);

  // Reload recently accessed cases whenever selectedCaseId changes
  useEffect(() => {
    let active = true;
    const ids = RecentCasesService.getRecentCaseIds();
    // Maintain local state map of matching full cases
    const list = cases.filter((c) => ids.includes(c.id));
    // Sort recently accessed to match the order in ids array
    const sorted = [...list].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    queueMicrotask(() => {
      if (active) setRecentCases(sorted);
    });
    return () => {
      active = false;
    };
  }, [cases, selectedCaseId]);

  return (
    <div className="w-full md:w-80 flex flex-col bg-card border border-border rounded-xl overflow-hidden shrink-0 h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-border space-y-3 bg-muted/20">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">{t("wsCaseList")}</h3>
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenCreate}
            className="h-8 w-8 text-primary border-primary/20"
            title={t("dashActionNewCase")}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={t("wsSearchCases")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring transition-all-custom"
          />
        </div>

        {/* Inline Filters */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CaseStatus | "")}
            className="h-8 rounded-md border border-border bg-background px-2 text-[10px] font-semibold text-secondary-foreground focus:outline-none"
          >
            <option value="">{t("wsFilterStatus")}</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="CHARGE_SHEETED">Charge Sheeted</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as CasePriority | "")}
            className="h-8 rounded-md border border-border bg-background px-2 text-[10px] font-semibold text-secondary-foreground focus:outline-none"
          >
            <option value="">{t("wsFilterPriority")}</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Navigator Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/60">
        {/* Recently Accessed section */}
        {recentCases.length > 0 && !searchQuery && !statusFilter && !priorityFilter && (
          <div className="bg-muted/10 pb-2">
            <div className="px-4 pt-3 pb-1 flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <History className="h-3.5 w-3.5" />
              <span>{t("wsRecentCases")}</span>
            </div>
            <div className="space-y-1 px-2">
              {recentCases.map((c) => (
                <div
                  key={`recent-${c.id}`}
                  onClick={() => onSelectCase(c)}
                  className={`p-2.5 rounded-lg cursor-pointer transition-all-custom text-left border ${
                    selectedCaseId === c.id
                      ? "bg-primary/10 border-primary/20 font-bold"
                      : "border-transparent hover:bg-muted/40"
                  }`}
                >
                  <p className="text-[11px] text-foreground font-semibold truncate">
                    {c.crimeNo}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate leading-none mt-1">
                    {c.briefFacts}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Case Cards list */}
        <div className="pt-2">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground font-semibold animate-pulse">
              {t("wsLoadingCases")}
            </div>
          ) : cases.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground font-semibold">
              {t("wsNoCasesMatched")}
            </div>
          ) : (
            cases.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCase(c)}
                className={`p-4 cursor-pointer transition-all-custom text-left border-l-4 ${
                  selectedCaseId === c.id
                    ? "bg-primary/5 border-primary"
                    : "border-transparent hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-foreground truncate">
                    {c.crimeNo}
                  </span>
                  {c.priority === "HIGH" && (
                    <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-[8px] font-bold uppercase">
                      High
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-snug">
                  {c.briefFacts}
                </p>
                <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold mt-2.5">
                  <span className="capitalize">{(c.caseStatus || "UNDER_INVESTIGATION").toLowerCase().replace(/_/g, " ")}</span>
                  <span>{new Date(c.crimeRegisteredDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
