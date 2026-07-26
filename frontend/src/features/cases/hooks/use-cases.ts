"use client";

import { useState, useEffect, useCallback } from "react";
import { CaseDetailsUI, CaseStatus, CasePriority, CaseMaster, InvestigationNote } from "../types";
import { CaseService, DashboardMetrics, ActivityLog } from "../services/case-service";
import { useAuth } from "@/features/auth/auth-context";
import { 
  CaseRepository, 
  LookupsPayload,
  MOCK_CATEGORIES,
  MOCK_GRAVITY,
  MOCK_CRIME_HEADS,
  MOCK_CRIME_SUB_HEADS,
  MOCK_UNITS,
  MOCK_EMPLOYEES 
} from "../repositories/case-repository";

export function useCases() {
  const { user } = useAuth();
  const [cases, setCases] = useState<CaseDetailsUI[]>([]);
  const [myCases, setMyCases] = useState<CaseDetailsUI[]>([]);
  const [highPriorityAlerts, setHighPriorityAlerts] = useState<CaseDetailsUI[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    myActiveCount: 0,
    totalActiveCount: 0,
    pendingReviewCount: 0,
    closedCount: 0
  });
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  
  // Stateful lookups initialized with static fallbacks
  const [lookupData, setLookupData] = useState<LookupsPayload>({
    categories: MOCK_CATEGORIES,
    gravities: MOCK_GRAVITY,
    crimeHeads: MOCK_CRIME_HEADS,
    crimeSubHeads: MOCK_CRIME_SUB_HEADS,
    units: MOCK_UNITS,
    employees: MOCK_EMPLOYEES
  });

  // Case-specific timeline & notes states
  const [activeNotes, setActiveNotes] = useState<InvestigationNote[]>([]);
  const [activeActivity, setActiveActivity] = useState<ActivityLog[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load lookups from live database on mount
  useEffect(() => {
    let active = true;
    CaseRepository.getLookups()
      .then((data) => {
        if (active && data) {
          setLookupData(data);
        }
      })
      .catch((err) => {
        console.warn("Failed to load live database lookups, falling back to static:", err.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const fetchCasesData = useCallback(async (query: string = "", filters?: {
    status?: CaseStatus;
    priority?: CasePriority;
    officerId?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await CaseService.searchCases(query, filters);
      setCases(results);
      
      if (user) {
        const stats = await CaseService.getDashboardMetrics(user.kgid);
        setMetrics(stats);
        
        const myActive = await CaseService.getMyActiveCases(user.kgid);
        setMyCases(myActive);
      }
      
      const highAlerts = await CaseService.getHighPriorityAlerts();
      setHighPriorityAlerts(highAlerts);
      
      const logs = await CaseService.getRecentActivity();
      setActivities(logs);
    } catch (err: any) {
      console.error("fetchCasesData error:", err);
      setError("Failed to fetch cases data.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load initial cases on mount
  useEffect(() => {
    queueMicrotask(() => {
      fetchCasesData();
    });
  }, [fetchCasesData]);

  // Fetch case-specific details (Notes & Activity Feed timeline)
  const fetchNotesAndActivity = useCallback(async (caseId: number) => {
    setError(null);
    try {
      const notes = await CaseService.getNotesForCase(caseId);
      setActiveNotes(notes);

      const timeline = await CaseService.getCaseActivity(caseId);
      setActiveActivity(timeline);
    } catch {
      setError("Failed to fetch note audits or activities.");
    }
  }, []);

  const createCase = async (
    data: Omit<CaseMaster, "id" | "createdAt" | "updatedAt" | "caseNo" | "crimeNo">
  ): Promise<CaseDetailsUI | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);
    try {
      const created = await CaseService.createCase(data, user.kgid);
      await fetchCasesData();
      return created;
    } catch {
      setError("Failed to create case.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCase = async (
    id: number,
    data: Partial<Omit<CaseMaster, "id" | "createdAt" | "updatedAt">>
  ): Promise<CaseDetailsUI | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);
    try {
      const updated = await CaseService.updateCase(id, data, user.kgid);
      await fetchCasesData();
      await fetchNotesAndActivity(id); // Reload timeline
      return updated;
    } catch {
      setError("Failed to update case.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const softDeleteCase = async (id: number): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    setError(null);
    try {
      const success = await CaseService.softDeleteCase(id, user.kgid);
      if (success) {
        await fetchCasesData();
      }
      return success;
    } catch {
      setError("Failed to soft-delete case.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Notes CRUD triggers ---
  const addNote = async (caseId: number, content: string): Promise<InvestigationNote | null> => {
    if (!user) return null;
    setError(null);
    try {
      const note = await CaseService.addNote(caseId, content, user.kgid);
      if (note) {
        await fetchNotesAndActivity(caseId);
      }
      return note;
    } catch {
      setError("Failed to add investigation note.");
      return null;
    }
  };

  const updateNote = async (noteId: number, content: string, caseId: number): Promise<InvestigationNote | null> => {
    if (!user) return null;
    setError(null);
    try {
      const note = await CaseService.updateNote(noteId, content, user.kgid);
      if (note) {
        await fetchNotesAndActivity(caseId);
      }
      return note;
    } catch {
      setError("Failed to modify note.");
      return null;
    }
  };

  const deleteNote = async (noteId: number, caseId: number): Promise<boolean> => {
    if (!user) return false;
    setError(null);
    try {
      const success = await CaseService.deleteNote(noteId, user.kgid);
      if (success) {
        await fetchNotesAndActivity(caseId);
      }
      return success;
    } catch {
      setError("Failed to delete note.");
      return false;
    }
  };

  return {
    cases,
    myCases,
    highPriorityAlerts,
    metrics,
    activities,
    activeNotes,
    activeActivity,
    isLoading,
    error,
    refresh: fetchCasesData,
    fetchNotesAndActivity,
    createCase,
    updateCase,
    softDeleteCase,
    addNote,
    updateNote,
    deleteNote,
    lookupData
  };
}
