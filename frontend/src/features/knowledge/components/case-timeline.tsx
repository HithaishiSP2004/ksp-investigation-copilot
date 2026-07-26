"use client";

import React, { useState } from "react";
import { MergedTimelineEvent, TimelineEventType } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { Calendar, User, Clock, FilePlus2, Sparkles, Filter } from "lucide-react";

interface CaseTimelineProps {
  timelineEvents: MergedTimelineEvent[];
}

export function CaseTimeline({ timelineEvents }: CaseTimelineProps) {
  const { t, locale } = useLocale();
  const [filterType, setFilterType] = useState<TimelineEventType | "ALL">("ALL");

  const formatDate = (dateVal: string | Date | undefined | null) => {
    if (!dateVal) return "N/A";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString(locale === "kn" ? "kn-IN" : "en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredEvents = timelineEvents.filter((ev) => {
    if (filterType === "ALL") return true;
    return ev.eventType === filterType;
  });

  const getEventIcon = (type: TimelineEventType) => {
    switch (type) {
      case "CASE_EVENT":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "NOTE_EVENT":
        return <User className="h-4 w-4 text-amber-500" />;
      case "EVIDENCE_EVENT":
        return <FilePlus2 className="h-4 w-4 text-emerald-500" />;
      case "REVIEW_EVENT":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
    }
  };

  const getEventBadge = (type: TimelineEventType) => {
    switch (type) {
      case "CASE_EVENT":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "NOTE_EVENT":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "EVIDENCE_EVENT":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "REVIEW_EVENT":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    }
  };

  const getEventTypeLabel = (type: TimelineEventType) => {
    const labels: Record<TimelineEventType, string> = {
      CASE_EVENT: t("caseStatusHandovers"),
      NOTE_EVENT: t("officerNotes"),
      EVIDENCE_EVENT: t("forensicAssetCustody"),
      REVIEW_EVENT: t("aiSuggestionAudits"),
    };
    return labels[type] || type.replace("_", " ");
  };

  return (
    <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm h-full max-h-[650px]">
      {/* Filters Bar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold text-foreground">{t("timelineFilterLabel")}</span>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as TimelineEventType | "ALL")}
          className="h-8 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold focus:outline-none text-foreground cursor-pointer"
        >
          <option value="ALL">{t("allEventTypes")}</option>
          <option value="CASE_EVENT">{t("caseStatusHandovers")}</option>
          <option value="NOTE_EVENT">{t("officerNotes")}</option>
          <option value="EVIDENCE_EVENT">{t("forensicAssetCustody")}</option>
          <option value="REVIEW_EVENT">{t("aiSuggestionAudits")}</option>
        </select>
      </div>

      {/* Events Timeline */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-xs text-muted-foreground font-semibold space-y-2">
            <Clock className="h-8 w-8 text-muted-foreground/60 stroke-[1.5px]" />
            <span>{t("timelineNoActivity")}</span>
          </div>
        ) : (
          <div className="relative pl-6 border-l border-border/80 ml-3 space-y-6">
            {filteredEvents.map((ev, idx) => (
              <div
                key={`${ev.id}-${idx}`}
                tabIndex={0}
                className="relative text-xs space-y-2 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl p-4 bg-muted/20 border border-border/80 shadow-xs"
              >
                {/* Visual bullet marker icon */}
                <span className="absolute -left-[37px] top-4 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border shadow-sm">
                  {getEventIcon(ev.eventType)}
                </span>

                {/* Event header */}
                <div className="flex justify-between items-center gap-2 flex-wrap border-b border-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-xs">{ev.title}</span>
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${getEventBadge(ev.eventType)}`}>
                      {getEventTypeLabel(ev.eventType)}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono font-medium flex items-center gap-1 bg-background px-2 py-0.5 rounded border border-border/40">
                    <Clock className="h-3 w-3 text-primary" />
                    {formatDate(ev.timestamp)}
                  </span>
                </div>

                {/* Event Description */}
                <p className="text-secondary-foreground font-medium leading-relaxed text-[11px]">
                  {ev.description}
                </p>

                {/* Event Officer Metadata */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold pt-1 border-t border-border/30">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3 w-3 text-primary" />
                    <span>{t("timelineOfficerLabel")}: <strong className="text-foreground">{ev.officerName}</strong></span>
                  </div>

                  {ev.sourceRef && (
                    <span className="text-primary font-mono text-[10px] bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {t("timelineRefLabel")}: {ev.sourceRef}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
