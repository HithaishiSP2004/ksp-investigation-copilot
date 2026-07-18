"use client";

import React, { useState, useEffect } from "react";
import { useCases } from "../hooks/use-cases";
import { CaseDetailsUI, CaseStatus, CasePriority } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { RecentCasesService } from "@/lib/services/recent-cases-service";

// Import modular panels
import { CaseNavigator } from "./case-navigator";
import { InvestigationOverview } from "./investigation-overview";
import { VictimPanel } from "./victim-panel";
import { SuspectPanel } from "./suspect-panel";
import { NotesPanel } from "./notes-panel";
import { ActivityPanel } from "./activity-panel";
import { MetadataPanel } from "./metadata-panel";
import { CaseForm } from "./case-form";
import { X } from "lucide-react";

interface CaseWorkspaceProps {
  initialSelectedCaseId?: number | null;
  onClearNavigation: () => void;
  onSelectCase?: (caseId: number | null) => void;
}

export function CaseWorkspace({ initialSelectedCaseId, onClearNavigation, onSelectCase }: CaseWorkspaceProps) {
  const { t } = useLocale();
  const { 
    cases, 
    activeNotes,
    activeActivity,
    isLoading, 
    updateCase, 
    softDeleteCase, 
    refresh,
    fetchNotesAndActivity,
    addNote,
    updateNote,
    deleteNote
  } = useCases();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<CasePriority | "">("");
  
  // Selected Case State
  const [selectedCase, setSelectedCase] = useState<CaseDetailsUI | null>(null);
  
  // Modal / Action States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Load selected case based on initial parameters or defaults
  useEffect(() => {
    let active = true;
    if (cases.length > 0) {
      if (initialSelectedCaseId) {
        const found = cases.find(c => c.id === initialSelectedCaseId);
        if (found) {
          queueMicrotask(() => {
            if (active) {
              setSelectedCase(found);
              RecentCasesService.addRecentCaseId(found.id);
            }
          });
          return;
        }
      }
      // Default to first case if none selected
      if (!selectedCase || !cases.find(c => c.id === selectedCase.id)) {
        const defaultCase = cases[0];
        queueMicrotask(() => {
          if (active) {
            setSelectedCase(defaultCase);
            RecentCasesService.addRecentCaseId(defaultCase.id);
          }
        });
      }
    } else {
      queueMicrotask(() => {
        if (active) setSelectedCase(null);
      });
    }
    return () => {
      active = false;
    };
  }, [cases, initialSelectedCaseId, selectedCase]);

  // Synchronize filters and searches with the hooks data service layer
  useEffect(() => {
    const handler = setTimeout(() => {
      refresh(searchQuery, {
        status: statusFilter || undefined,
        priority: priorityFilter || undefined
      });
    }, 150); // Debounce for search execution fluidity

    return () => clearTimeout(handler);
  }, [searchQuery, statusFilter, priorityFilter, refresh]);

  // Sync Notes & Timeline Activities when selected case changes
  useEffect(() => {
    if (selectedCase) {
      fetchNotesAndActivity(selectedCase.id);
    }
  }, [selectedCase, fetchNotesAndActivity]);

  // Propagate case selection up to parent Home layout
  useEffect(() => {
    if (onSelectCase) {
      onSelectCase(selectedCase?.id || null);
    }
  }, [selectedCase, onSelectCase]);

  const handleSelectCase = (record: CaseDetailsUI) => {
    setSelectedCase(record);
    RecentCasesService.addRecentCaseId(record.id);
    onClearNavigation(); // Clear search query navigation state from dashboard
  };

  const handleStatusChange = async (newStatus: CaseStatus) => {
    if (!selectedCase) return;
    const updated = await updateCase(selectedCase.id, { caseStatus: newStatus });
    if (updated) {
      setSelectedCase(updated);
    }
  };

  const handleArchiveCase = async () => {
    if (!selectedCase) return;
    const confirmed = window.confirm(t("archiveConfirm"));
    if (confirmed) {
      const success = await softDeleteCase(selectedCase.id);
      if (success) {
        alert(t("archiveSuccess"));
        setSelectedCase(null);
        refresh();
      }
    }
  };

  const handleFormSuccess = (updatedRecord: CaseDetailsUI) => {
    setSelectedCase(updatedRecord);
    RecentCasesService.addRecentCaseId(updatedRecord.id);
    setIsEditOpen(false);
    setIsCreateOpen(false);
    refresh();
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row gap-6 relative">
      
      {/* 1. LEFT PANEL: Case Navigator */}
      <CaseNavigator
        cases={cases}
        selectedCaseId={selectedCase?.id || null}
        onSelectCase={handleSelectCase}
        onOpenCreate={() => setIsCreateOpen(true)}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* 2. CENTER & RIGHT WORKSPACE (Case Visual Console) */}
      {selectedCase ? (
        <div className="flex-1 flex flex-col md:flex-row gap-6 bg-card border border-border rounded-xl overflow-hidden shadow-sm h-full">
          
          {/* CENTER PANEL: Case Details & Sub-panels */}
          <div className="flex-1 flex flex-col p-6 min-w-0 border-b md:border-b-0 md:border-r border-border overflow-y-auto h-full space-y-6">
            
            {/* Overview Detail Information */}
            <InvestigationOverview caseRecord={selectedCase} />
            
            {/* Collapsible Victims Panel */}
            <VictimPanel victims={selectedCase.victims} />
            
            {/* Collapsible Suspects Panel */}
            <SuspectPanel suspects={selectedCase.suspects} />
            
            {/* Notes System Journal Console */}
            <NotesPanel
              notes={activeNotes}
              onAddNote={(content) => addNote(selectedCase.id, content)}
              onUpdateNote={(noteId, content) => updateNote(noteId, content, selectedCase.id)}
              onDeleteNote={(noteId) => deleteNote(noteId, selectedCase.id)}
            />
            
            {/* Immutable Timeline activities feed */}
            <ActivityPanel activities={activeActivity} />
          </div>

          {/* RIGHT PANEL: Metadata parameters & Audit history */}
          <MetadataPanel
            caseRecord={selectedCase}
            onStatusChange={handleStatusChange}
            onOpenEdit={() => setIsEditOpen(true)}
            onArchive={handleArchiveCase}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-card border border-border rounded-xl">
          <p className="text-sm text-muted-foreground font-semibold">
            Select an active case file from the sidebar to inspect.
          </p>
        </div>
      )}

      {/* Case Creation Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto relative animate-scale-up">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <CaseForm onClose={() => setIsCreateOpen(false)} onSuccess={handleFormSuccess} />
          </div>
        </div>
      )}

      {/* Case Editing Modal */}
      {isEditOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto relative animate-scale-up">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <CaseForm 
              caseRecord={selectedCase} 
              onClose={() => setIsEditOpen(false)} 
              onSuccess={handleFormSuccess} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
