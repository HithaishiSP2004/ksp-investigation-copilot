"use client";

import React, { useState } from "react";
import { EvidenceMaster, CustodyEvent, EvidenceStatus } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { 
  User, 
  MapPin, 
  Hash, 
  Clock, 
  Tag, 
  History, 
  Plus,
  Brain
} from "lucide-react";

interface EvidenceMetadataProps {
  evidence: EvidenceMaster;
  custodyHistory: CustodyEvent[];
  onStatusChange: (status: EvidenceStatus, remarks: string) => Promise<unknown>;
  onAddTags: (tags: string[]) => Promise<unknown>;
  onOpenIntelligence: () => void;
  isIntelligenceOpen: boolean;
}

export function EvidenceMetadata({
  evidence,
  custodyHistory,
  onStatusChange,
  onAddTags,
  onOpenIntelligence,
  isIntelligenceOpen
}: EvidenceMetadataProps) {
  const { t } = useLocale();

  // Status Handover Form States
  const [newStatus, setNewStatus] = useState<EvidenceStatus>(evidence.status);
  const [remarks, setRemarks] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Tags Form States
  const [newTagInput, setNewTagInput] = useState("");

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus === evidence.status || !remarks.trim() || isUpdating) return;

    setIsUpdating(true);
    const success = await onStatusChange(newStatus, remarks.trim());
    setIsUpdating(false);
    if (success) {
      setRemarks("");
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim().toLowerCase();
    if (!tag || evidence.tags.includes(tag)) return;

    const updatedTags = [...evidence.tags, tag];
    const success = await onAddTags(updatedTags);
    if (success) {
      setNewTagInput("");
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = evidence.tags.filter((t) => t !== tagToRemove);
    await onAddTags(updatedTags);
  };

  const getStatusStyle = (status: EvidenceStatus) => {
    const styles: Record<EvidenceStatus, string> = {
      SECURED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      IN_TRANSIT: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      RELEASED: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
      SUBMITTED_TO_COURT: "bg-primary/10 text-primary border-primary/20",
      ARCHIVED: "bg-destructive/10 text-destructive border-destructive/20"
    };
    return styles[status] || "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="w-full md:w-80 p-6 flex flex-col bg-muted/10 shrink-0 space-y-6 overflow-y-auto border-t md:border-t-0 md:border-l border-border h-full">
      {/* 0. AI Analysis trigger */}
      <Button
        size="sm"
        variant={isIntelligenceOpen ? "default" : "outline"}
        className="w-full h-8 text-xs font-bold gap-1.5"
        onClick={onOpenIntelligence}
      >
        <Brain className="h-3.5 w-3.5" />
        {t("intelAnalyzeBtn")}
      </Button>

      {/* 1. Evidence Overview Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
            {t("evTitleDetails")}
          </h3>
          <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${getStatusStyle(evidence.status)}`}>
            {evidence.status.replace("_", " ")}
          </span>
        </div>


        <div className="space-y-3 text-xs bg-card border border-border rounded-xl p-4 shadow-sm">
          {/* Case Ref */}
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase">{t("evRelatedFir")}</span>
            <p className="font-bold text-foreground truncate">{evidence.crimeNo}</p>
          </div>

          <hr className="border-border/60" />

          {/* Size & MIME */}
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase">{t("evLabelSize")}</span>
            <p className="font-bold text-foreground leading-none">
              {evidence.fileSize > 0 ? `${(evidence.fileSize / 1024).toFixed(1)} KB` : "N/A"}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">{evidence.mimeType}</p>
          </div>

          <hr className="border-border/60" />

          {/* Checksum Hash */}
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {t("evLabelHash")}
            </span>
            <p className="text-[10px] font-mono text-foreground break-all bg-muted/50 p-2 border border-border/40 rounded">
              {evidence.fileHash}
            </p>
          </div>

          <hr className="border-border/60" />

          {/* Seizure details */}
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase flex items-center gap-1">
              <User className="h-3 w-3" />
              {t("evLabelCollector")}
            </span>
            <p className="font-bold text-foreground">{evidence.collectorName}</p>
            <p className="text-[10px] text-muted-foreground font-medium">KGID: {evidence.collectorKgid}</p>
          </div>

          <hr className="border-border/60" />

          {/* Coordinates */}
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {t("evLabelCoordinates")}
            </span>
            <p className="text-[10px] font-mono text-foreground">
              {evidence.latitude.toFixed(4)}, {evidence.longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Metadata Tags Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Tag className="h-3.5 w-3.5" />
          Tags
        </h3>

        <div className="space-y-3 bg-card border border-border rounded-xl p-4 shadow-sm text-xs">
          {/* Render tags */}
          <div className="flex flex-wrap gap-1">
            {evidence.tags.length === 0 ? (
              <span className="text-muted-foreground italic font-semibold">{t("evTagsNone")}</span>
            ) : (
              evidence.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-muted text-secondary-foreground border border-border text-[9px] font-bold flex items-center gap-1"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer text-[10px] font-bold"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Tag Form */}
          <form onSubmit={handleAddTag} className="flex gap-1.5 pt-2 border-t border-border/40">
            <input
              type="text"
              placeholder={t("evTagsPlaceholder")}
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="h-8 flex-1 rounded border border-border bg-background px-2 text-xs focus:outline-none"
            />
            <Button type="submit" size="sm" className="h-8 px-2.5">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* 3. Custody status quick transfer */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
          {t("evStatusTitle")}
        </h3>

        <form onSubmit={handleStatusSubmit} className="space-y-3 bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase">{t("evCustodyState")}</span>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as EvidenceStatus)}
              className="flex h-9 w-full rounded border border-border bg-card px-2.5 py-1 text-xs font-semibold focus:outline-none"
            >
              <option value="SECURED">Secured in Locker</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="RELEASED">Released</option>
              <option value="SUBMITTED_TO_COURT">Submitted to Court</option>
              <option value="ARCHIVED">Archived (Soft Delete)</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase">{t("evCustodyRemarks")}</span>
            <textarea
              rows={2}
              value={remarks}
              disabled={isUpdating}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={t("evRemarksPlaceholder")}
              className="w-full text-xs p-2 rounded border border-border bg-background focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={isUpdating || newStatus === evidence.status || !remarks.trim()}
            className="w-full text-xs h-8 font-bold"
          >
            {isUpdating ? t("evUpdating") : t("evCommitTransfer")}
          </Button>
        </form>
      </div>

      {/* 4. Custody timeline history */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <History className="h-3.5 w-3.5" />
          {t("panelCustody")}
        </h3>

        <div className="space-y-4 relative pl-3 border-l border-border/80 ml-2 pt-1">
          {custodyHistory.map((c) => (
            <div key={c.id} className="relative text-xs space-y-1">
              <span className="absolute -left-[16.5px] top-1.5 flex h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-bold text-foreground">{c.officerName}</span>
                <span className="text-[9px] text-muted-foreground font-mono font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(c.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-primary text-[10px] font-bold tracking-wide">
                {c.action.replace("_", " ")}: {c.previousState} ➔ {c.currentState}
              </p>
              {c.remarks && (
                <p className="text-muted-foreground text-[10px] italic leading-tight">
                  &quot;{c.remarks}&quot;
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
