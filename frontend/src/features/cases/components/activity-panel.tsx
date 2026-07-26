"use client";

import React from "react";
import { ActivityLog } from "../services/case-service";
import { useLocale } from "@/lib/locales-provider";
import { History, Clock } from "lucide-react";

interface ActivityPanelProps {
  activities: ActivityLog[];
}

export function ActivityPanel({ activities }: ActivityPanelProps) {
  const { t } = useLocale();

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shrink-0">
      {/* Header bar */}
      <div className="p-4 bg-muted/10 border-b border-border flex items-center gap-2">
        <History className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
          {t("panelActivity")} ({activities.length})
        </h3>
      </div>

      {/* Activity Timeline List */}
      <div className="p-5">
        {activities.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">
            No audit logs captured for this case workspace.
          </p>
        ) : (
          <div className="space-y-4 relative pl-3 border-l border-border/80 ml-2 pt-1">
            {activities.map((act) => (
              <div key={act.id} className="relative text-xs space-y-1">
                {/* Timeline Dot Indicator */}
                <span className="absolute -left-[16.5px] top-1.5 flex h-2 w-2 rounded-full bg-primary ring-4 ring-background" />

                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-foreground">{act.officerName}</span>
                  <span className="text-[9px] text-muted-foreground font-mono font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-[11px] leading-tight font-medium">
                  {act.action === "CREATED" && "Initiated new FIR case record file"}
                  {act.action === "UPDATED" && "Updated case file information parameter"}
                  {act.action === "STATUS_CHANGED" && "Updated investigation folder status"}
                  {act.action === "ARCHIVED" && "Archived investigation file from active workspace"}
                  {act.action === "NOTE_ADDED" && "Logged new investigation journal note"}
                  {act.action === "NOTE_EDITED" && "Modified previous journal note entry"}
                  {act.action === "NOTE_DELETED" && "Soft-deleted previous journal note entry"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
