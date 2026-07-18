"use client";

import React, { useState } from "react";
import { MergedTimelineEvent, TimelineEventType } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { Calendar, User, Clock, FilePlus2, Sparkles, Filter } from "lucide-react";

interface CaseTimelineProps {
  timelineEvents: MergedTimelineEvent[];
}

export function CaseTimeline({ timelineEvents }: CaseTimelineProps) {
  const { t } = useLocale();
  const [filterType, setFilterType] = useState<TimelineEventType | "ALL">("ALL");

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

  const getEventColor = (type: TimelineEventType) => {
    switch (type) {
      case "CASE_EVENT":
        return "border-blue-200 bg-blue-50/40 text-blue-700";
      case "NOTE_EVENT":
        return "border-amber-200 bg-amber-50/40 text-amber-700";
      case "EVIDENCE_EVENT":
        return "border-emerald-200 bg-emerald-50/40 text-emerald-700";
      case "REVIEW_EVENT":
        return "border-purple-200 bg-purple-50/40 text-purple-700";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm h-full max-h-[650px]">
      {/* Filters Bar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">{t("timelineFilterLabel")}</span>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as TimelineEventType | "ALL")}
          className="h-8 rounded border border-border bg-card px-2.5 py-1 text-xs font-semibold focus:outline-none text-foreground"
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
          <div className="flex flex-col items-center justify-center py-16 text-center text-xs text-muted-foreground font-semibold">
            <Clock className="h-8 w-8 mb-2 stroke-[1.5px]" />
            <span>{t("intelRelationsNone")}</span>
          </div>
        ) : (
          <div className="relative pl-6 border-l border-border/80 ml-2 space-y-6">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                tabIndex={0}
                className="relative text-xs space-y-1.5 focus:outline-none focus:ring-1 focus:ring-primary rounded p-2 focus:bg-muted/10"
              >
                {/* Visual bullet marker icon */}
                <span className="absolute -left-[30.5px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border/80 shadow-sm">
                  {getEventIcon(ev.eventType)}
                </span>

                {/* Event header */}
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{ev.title}</span>
                    <span className={`px-1.5 py-0.2 rounded border text-[8px] font-bold uppercase tracking-wider ${getEventColor(ev.eventType)}`}>
                      {ev.eventType.replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ev.timestamp}
                  </span>
                </div>

                {/* Event Description */}
                <p className="text-secondary-foreground font-medium bg-card border border-border/40 p-2.5 rounded-lg leading-relaxed text-[11px] shadow-sm">
                  {ev.description}
                </p>

                {/* Event Officer Metadata */}
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-semibold">
                  <User className="h-3 w-3" />
                  <span>Officer: {ev.officerName}</span>
                  {ev.sourceRef && (
                    <>
                      <span>·</span>
                      <span className="text-primary font-mono">{ev.sourceRef}</span>
                    </>
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
