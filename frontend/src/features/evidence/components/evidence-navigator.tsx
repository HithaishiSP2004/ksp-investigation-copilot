"use client";

import React from "react";
import { EvidenceMaster, EvidenceType, EvidenceStatus } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { Search, Plus, FileText, Image as ImageIcon, Video, Music, HardDrive, FileQuestion } from "lucide-react";

interface EvidenceNavigatorProps {
  evidenceList: EvidenceMaster[];
  selectedId: number | null;
  onSelect: (record: EvidenceMaster) => void;
  onOpenCreate: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: EvidenceType | "";
  setTypeFilter: (type: EvidenceType | "") => void;
  statusFilter: EvidenceStatus | "";
  setStatusFilter: (status: EvidenceStatus | "") => void;
  isLoading: boolean;
}

export function EvidenceNavigator({
  evidenceList,
  selectedId,
  onSelect,
  onOpenCreate,
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  isLoading
}: EvidenceNavigatorProps) {
  const { t } = useLocale();

  const getAssetIcon = (type: EvidenceType) => {
    switch (type) {
      case "IMAGE":
        return <ImageIcon className="h-4 w-4 text-emerald-500" />;
      case "VIDEO":
        return <Video className="h-4 w-4 text-sky-500" />;
      case "AUDIO":
        return <Music className="h-4 w-4 text-violet-500" />;
      case "DOCUMENT":
        return <FileText className="h-4 w-4 text-amber-500" />;
      case "PHYSICAL":
      case "DEVICE":
        return <HardDrive className="h-4 w-4 text-rose-500" />;
      default:
        return <FileQuestion className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full md:w-80 flex flex-col bg-card border border-border rounded-xl overflow-hidden shrink-0 h-full">
      {/* Head Filter Bar */}
      <div className="p-4 border-b border-border space-y-3 bg-muted/20">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">{t("evVaultTitle")}</h3>
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenCreate}
            className="h-8 w-8 text-primary border-primary/20"
            title={t("evActionUpload")}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={t("evSearchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring transition-all-custom"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as EvidenceType | "")}
            className="h-8 rounded-md border border-border bg-background px-2 text-[10px] font-semibold text-secondary-foreground focus:outline-none"
          >
            <option value="">{t("evSelectType")}</option>
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
            <option value="AUDIO">Audio</option>
            <option value="DOCUMENT">Document</option>
            <option value="PHYSICAL">Physical</option>
            <option value="DEVICE">Device</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EvidenceStatus | "")}
            className="h-8 rounded-md border border-border bg-background px-2 text-[10px] font-semibold text-secondary-foreground focus:outline-none"
          >
            <option value="">{t("evSelectStatus")}</option>
            <option value="SECURED">Secured</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="RELEASED">Released</option>
            <option value="SUBMITTED_TO_COURT">Court Submitted</option>
          </select>
        </div>
      </div>

      {/* Vault List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/60">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-muted-foreground font-semibold animate-pulse">
            {t("evLoading")}
          </div>
        ) : evidenceList.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground font-semibold">
            {t("evNoAssets")}
          </div>
        ) : (
          evidenceList.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelect(ev)}
              className={`p-4 cursor-pointer transition-all-custom text-left border-l-4 ${
                selectedId === ev.id ? "bg-primary/5 border-primary" : "border-transparent hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-foreground font-mono truncate">
                  {ev.evidenceNo}
                </span>
                <span className="shrink-0">{getAssetIcon(ev.evidenceType)}</span>
              </div>
              <p className="text-[11px] font-bold text-secondary-foreground mt-1 truncate">
                {ev.title}
              </p>
              <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5 font-medium">
                {ev.description}
              </p>
              <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold mt-2.5">
                <span className="truncate max-w-[100px]">FIR: {ev.crimeNo}</span>
                <span>{new Date(ev.collectionDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
