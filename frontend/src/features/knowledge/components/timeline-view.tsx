"use client";

import React, { useState, useEffect } from "react";
import { CaseDetailsUI } from "@/features/cases/types";
import { CaseService } from "@/features/cases/services/case-service";
import { KnowledgeService } from "../services/knowledge-service";
import { MergedTimelineEvent } from "../types";
import { CaseTimeline } from "./case-timeline";
import { useLocale } from "@/lib/locales-provider";
import { FolderOpen } from "lucide-react";

interface TimelineViewProps {
  initialCaseId: number | null;
  onCaseChange: (id: number | null) => void;
}

export function TimelineView({ initialCaseId, onCaseChange }: TimelineViewProps) {
  const { t } = useLocale();
  const [cases, setCases] = useState<CaseDetailsUI[]>([]);
  const [timeline, setTimeline] = useState<MergedTimelineEvent[]>([]);
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
        if (active) setTimeline([]);
      });
      return;
    }

    queueMicrotask(() => {
      if (active) setIsLoading(true);
    });

    KnowledgeService.getMergedTimeline(initialCaseId)
      .then((res) => {
        if (active) setTimeline(res);
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
      {/* Shared Case Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-card border border-border rounded-xl shadow-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <FolderOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">{t("selectCasePrompt")}</h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              {t("timelineSubtitle")}
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
          <div className="h-[40vh] flex items-center justify-center bg-card border border-border rounded-xl shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs text-muted-foreground font-semibold">{t("loadingTimeline")}</span>
            </div>
          </div>
        ) : (
          <CaseTimeline timelineEvents={timeline} />
        )
      ) : (
        <div className="h-[40vh] flex items-center justify-center bg-card border border-border rounded-xl shadow-sm">
          <p className="text-xs text-muted-foreground font-semibold">
            {t("selectCaseTimelinePrompt")}
          </p>
        </div>
      )}
    </div>
  );
}
