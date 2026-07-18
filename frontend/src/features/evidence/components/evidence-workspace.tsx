"use client";

import React, { useState, useEffect } from "react";
import { useEvidence } from "../hooks/use-evidence";
import { EvidenceMaster, EvidenceStatus, EvidenceType } from "../types";
import { CaseDetailsUI } from "@/features/cases/types";
import { CaseService } from "@/features/cases/services/case-service";
import { useLocale } from "@/lib/locales-provider";
import { useAuth } from "@/features/auth/auth-context";

// Import modular panels
import { EvidenceNavigator } from "./evidence-navigator";
import { EvidencePreview } from "./evidence-preview";
import { EvidenceMetadata } from "./evidence-metadata";
import { EvidenceForm } from "./evidence-form";
import { IntelligencePanel } from "@/features/intelligence/components/intelligence-panel";
import { X } from "lucide-react";

export function EvidenceWorkspace() {
  const { t } = useLocale();
  const { user } = useAuth();
  const {
    evidenceList,
    activeCustody,
    isLoading,
    refresh,
    fetchCustodyTimeline,
    registerEvidence,
    updateStatus,
    updateTags
  } = useEvidence();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<EvidenceType | "">("");
  const [statusFilter, setStatusFilter] = useState<EvidenceStatus | "">("");

  // Case details lookup list
  const [cases, setCases] = useState<CaseDetailsUI[]>([]);

  // Selected item states
  const [selectedAsset, setSelectedAsset] = useState<EvidenceMaster | null>(null);

  // Form Modal Toggles
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Intelligence Panel Toggle
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);

  // Fetch related cases once on mount
  useEffect(() => {
    CaseService.getCases().then(setCases);
  }, []);

  // Sync Search and Filters with the hook service layer
  useEffect(() => {
    const handler = setTimeout(() => {
      refresh(searchQuery, {
        evidenceType: typeFilter || undefined,
        status: statusFilter || undefined
      });
    }, 150); // Debounce delay matching system requirements

    return () => clearTimeout(handler);
  }, [searchQuery, typeFilter, statusFilter, refresh]);

  // Load select default asset once list is loaded
  useEffect(() => {
    let active = true;
    if (evidenceList.length > 0) {
      if (!selectedAsset || !evidenceList.find(e => e.id === selectedAsset.id)) {
        queueMicrotask(() => {
          if (active) setSelectedAsset(evidenceList[0]);
        });
      }
    } else {
      queueMicrotask(() => {
        if (active) setSelectedAsset(null);
      });
    }
    return () => {
      active = false;
    };
  }, [evidenceList, selectedAsset]);

  // Sync custody events timeline when active selected evidence item changes
  useEffect(() => {
    if (selectedAsset) {
      fetchCustodyTimeline(selectedAsset.id);
    }
  }, [selectedAsset, fetchCustodyTimeline]);

  const handleSelectAsset = (record: EvidenceMaster) => {
    setSelectedAsset(record);
  };

  const handleStatusChange = async (newStatus: EvidenceStatus, remarks: string) => {
    if (!selectedAsset) return null;
    const updated = await updateStatus(selectedAsset.id, newStatus, remarks);
    if (updated) {
      setSelectedAsset(updated);
    }
    return updated;
  };

  const handleAddTags = async (tags: string[]) => {
    if (!selectedAsset) return null;
    const updated = await updateTags(selectedAsset.id, tags);
    if (updated) {
      setSelectedAsset(updated);
    }
    return updated;
  };

  const handleFormSuccess = (newRecord: EvidenceMaster) => {
    setSelectedAsset(newRecord);
    setIsRegisterOpen(false);
    refresh();
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row gap-6 relative">
      
      {/* 1. LEFT PANEL: Evidence Navigator */}
      <EvidenceNavigator
        evidenceList={evidenceList}
        selectedId={selectedAsset?.id || null}
        onSelect={handleSelectAsset}
        onOpenCreate={() => setIsRegisterOpen(true)}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* 2. CENTER & RIGHT WORKSPACE PANELS + INTELLIGENCE PANEL */}
      {selectedAsset ? (
        <div className="flex-1 flex flex-col md:flex-row gap-6 min-w-0 h-full overflow-hidden">
          {/* Main workspace card */}
          <div className={`flex-1 flex flex-col md:flex-row bg-card border border-border rounded-xl overflow-hidden shadow-sm h-full ${isIntelligenceOpen ? "min-w-0" : ""}`}>
            {/* CENTER PANEL: Media preview player */}
            <div className="flex-1 flex flex-col p-6 min-w-0 border-b md:border-b-0 md:border-r border-border overflow-y-auto h-full">
              <EvidencePreview evidence={selectedAsset} />
            </div>

            {/* RIGHT PANEL: Metadata parameters and Custody events log */}
            <EvidenceMetadata
              evidence={selectedAsset}
              custodyHistory={activeCustody}
              onStatusChange={handleStatusChange}
              onAddTags={handleAddTags}
              onOpenIntelligence={() => setIsIntelligenceOpen(true)}
              isIntelligenceOpen={isIntelligenceOpen}
            />
          </div>

          {/* INTELLIGENCE PANEL: Collapsible analysis drawer */}
          {isIntelligenceOpen && user && (
            <div className="w-full md:w-80 shrink-0 bg-card border border-border rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-border bg-muted/20 shrink-0">
                <span className="text-xs font-bold text-foreground">{t("intelPanelTitle")}</span>
                <button
                  onClick={() => setIsIntelligenceOpen(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <IntelligencePanel
                  evidence={selectedAsset}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-card border border-border rounded-xl">
          <p className="text-sm text-muted-foreground font-semibold">
            {t("evSelectPrompt")}
          </p>
        </div>
      )}

      {/* Register Evidence Modal popup */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto relative animate-scale-up">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <EvidenceForm
              cases={cases}
              onClose={() => setIsRegisterOpen(false)}
              onSuccess={handleFormSuccess}
              onRegisterSubmit={registerEvidence}
            />
          </div>
        </div>
      )}
    </div>
  );
}
